
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { LogOut, Moon, Sun } from "lucide-react";
import ProfileForm from "@/components/settings/ProfileForm";
import ApiKeysManager from "@/components/settings/ApiKeysManager";
import NavBar from "@/components/NavBar";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
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
        
        <ProfileForm user={user} />
        
        <Card>
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
