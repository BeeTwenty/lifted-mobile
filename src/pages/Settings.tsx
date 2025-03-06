
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { LogOut, KeyRound } from "lucide-react";
import ProfileForm from "@/components/settings/ProfileForm";
import ApiKeysManager from "@/components/settings/ApiKeysManager";
import NavBar from "@/components/NavBar";

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        <ProfileForm user={user} />
        
        <Card className="border-t shadow-sm">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardFooter className="border-t pt-6">
            <Button 
              variant="destructive" 
              onClick={signOut}
              className="w-full sm:w-auto" 
              size="sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </CardFooter>
        </Card>
        
        <ApiKeysManager user={user} />
      </div>
    </div>
  );
};

export default Settings;
