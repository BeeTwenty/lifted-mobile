
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

type SubscriptionStatus = "basic" | "pro" | "loading";

interface SubscriptionContextType {
  status: SubscriptionStatus;
  isProUser: boolean;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>("loading");
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscriptionStatus = async () => {
    if (!user) {
      setStatus("basic");
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Fetch the user's profile which includes subscription status
      // Using maybeSingle instead of single to avoid errors when no profile exists
      const { data, error } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      // If no profile exists, create one with basic status
      if (!data) {
        console.log("No profile found, creating one with basic status");
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ 
            id: user.id, 
            status: 'basic',
            full_name: user.user_metadata?.full_name || '',
            avatar_url: user.user_metadata?.avatar_url || ''
          });
          
        if (insertError) {
          console.error("Error creating profile:", insertError);
          throw insertError;
        }
        
        setStatus("basic");
      } else {
        console.log("Profile found with status:", data.status);
        setStatus(data.status as SubscriptionStatus || "basic");
      }
    } catch (error: any) {
      console.error("Error fetching subscription status:", error);
      setStatus("basic"); // Default to basic on error
      toast.error("Failed to fetch subscription status");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch subscription status when the user changes
  useEffect(() => {
    fetchSubscriptionStatus();
  }, [user]);

  const refreshSubscription = async () => {
    console.log("Refreshing subscription status...");
    await fetchSubscriptionStatus();
  };

  return (
    <SubscriptionContext.Provider
      value={{
        status,
        isProUser: status === "pro",
        isLoading,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
