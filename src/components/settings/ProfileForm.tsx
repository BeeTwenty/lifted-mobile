
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
  user: User;
}

interface Profile {
  username: string | null;
  bio: string | null;
  height: number | null;
  age: number | null;
}

const ProfileForm = ({ user }: ProfileFormProps) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    username: "",
    bio: "",
    height: null,
    age: null
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, bio, height, age')
          .eq('id', user.id)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setProfile({
            username: data.username,
            bio: data.bio,
            height: data.height,
            age: data.age
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          bio: profile.bio,
          height: profile.height ? Number(profile.height) : null,
          age: profile.age ? Number(profile.age) : null,
          updated_at: new Date().toISOString() // Convert Date to ISO string
        })
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-t shadow-sm">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your public profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            placeholder="Username"
            value={profile.username || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-muted-foreground">This is your public display name</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={user.email || ""}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">Your email address is managed through your authentication provider</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            placeholder="Tell us about yourself"
            value={profile.bio || ""}
            onChange={handleChange}
            rows={4}
          />
          <p className="text-xs text-muted-foreground">Brief description for your profile. Max 160 characters.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              name="height"
              type="number"
              placeholder="Height in cm"
              value={profile.height || ""}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              placeholder="Your age"
              value={profile.age || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="ml-auto"
        >
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileForm;
