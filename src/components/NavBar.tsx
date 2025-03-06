
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";

const NavBar = () => {
  const { signOut, user } = useAuth();

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Dumbbell className="h-6 w-6 text-primary" />
              <span className="ml-2 text-lg font-bold">StrengthScribe</span>
            </div>
          </div>
          {user && (
            <div className="flex items-center">
              <span className="mr-4 text-sm text-gray-500">{user.email}</span>
              <Button variant="outline" onClick={signOut}>Sign out</Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
