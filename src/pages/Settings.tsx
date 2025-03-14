
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { LogOut, Moon, Sun, Crown } from "lucide-react";
import ProfileForm from "@/components/settings/ProfileForm";
import ApiKeysManager from "@/components/settings/ApiKeysManager";
import SubscriptionSettings from "@/components/settings/SubscriptionSettings";
import NavBar from "@/components/NavBar";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const location = useLocation();
  
  // Set the active tab based on URL path
  useEffect(() => {
    if (location.pathname.includes("/settings/subscription")) {
      setActiveTab("subscription");
    }
  }, [location.pathname]);
  
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4 mr-2" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Dark Mode
              </>
            )}
          </Button>
        </div>
        
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
            <TabsTrigger value="subscription" className="flex-1">
              <Crown className="h-4 w-4 mr-2" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6 mt-6">
            <ProfileForm user={user} />
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-6 mt-6">
            <SubscriptionSettings />
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground">Account</CardTitle>
                <CardDescription className="text-muted-foreground">Manage your account settings</CardDescription>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
