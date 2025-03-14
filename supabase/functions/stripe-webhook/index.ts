
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    httpClient: Stripe.createFetchHttpClient(),
  });

  const signature = req.headers.get('stripe-signature');
  
  if (!signature) {
    console.error('No Stripe signature found');
    return new Response(JSON.stringify({ error: 'No signature provided' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
    const body = await req.text();
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle the event
    console.log(`Processing event: ${event.type}`);
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Extract the user ID from the client_reference_id
      const userId = session.client_reference_id;
      
      if (!userId) {
        console.error('No user ID found in the session');
        return new Response(JSON.stringify({ error: 'No user ID found' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      console.log(`Updating subscription status for user: ${userId}`);

      // Update the user's subscription status to "pro"
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          status: 'pro',
          updated_at: new Date().toISOString(),
        });
      
      if (error) {
        console.error('Error updating user subscription status:', error);
        return new Response(JSON.stringify({ error: 'Failed to update user subscription' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      console.log(`Successfully updated subscription for user: ${userId}`);
    }
    
    // Return a response to acknowledge receipt of the event
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
