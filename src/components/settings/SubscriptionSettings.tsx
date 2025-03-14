
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const SubscriptionSettings = () => {
  const { user } = useAuth();
  const { status, isProUser, refreshSubscription } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("You must be logged in to upgrade");
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, you would redirect to Stripe or handle payment
      // For now, we'll simulate by directly updating the status in the database
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'pro' })
        .eq('id', user.id);
        
      if (error) throw error;
      
      await refreshSubscription();
      toast.success("Successfully upgraded to Lifted Pro!");
    } catch (error: any) {
      console.error("Error upgrading subscription:", error);
      toast.error(error.message || "Failed to upgrade subscription");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDowngrade = async () => {
    if (!user) {
      toast.error("You must be logged in to manage your subscription");
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, you would cancel the subscription in Stripe
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'basic' })
        .eq('id', user.id);
        
      if (error) throw error;
      
      await refreshSubscription();
      toast.success("Subscription downgraded to Basic");
    } catch (error: any) {
      console.error("Error downgrading subscription:", error);
      toast.error(error.message || "Failed to downgrade subscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Subscription</CardTitle>
          <Badge variant={isProUser ? "default" : "outline"} className={isProUser ? "bg-amber-600" : ""}>
            {isProUser ? "PRO" : "BASIC"}
          </Badge>
        </div>
        <CardDescription>Manage your subscription plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className={`border ${!isProUser ? 'border-2 border-primary' : ''}`}>
            <CardHeader>
              <CardTitle>Basic Plan</CardTitle>
              <CardDescription>Free</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Basic workout tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Limited workout templates</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">No weight tracking</span>
              </div>
            </CardContent>
            <CardFooter>
              {isProUser && (
                <Button variant="outline" onClick={handleDowngrade} disabled={isLoading || status === 'loading'}>
                  Downgrade
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card className={`border ${isProUser ? 'border-2 border-amber-400' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="mr-2 h-5 w-5 text-amber-500" /> 
                Pro Plan
              </CardTitle>
              <CardDescription>$9.99/month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>All Basic features</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Weight tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Unlimited workouts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Advanced analytics</span>
              </div>
            </CardContent>
            <CardFooter>
              {!isProUser && (
                <Button onClick={handleUpgrade} disabled={isLoading || status === 'loading'}>
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Pro
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionSettings;
