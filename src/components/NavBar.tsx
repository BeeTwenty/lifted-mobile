import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Scale, LogOut } from "lucide-react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="font-semibold text-lg">Workoutorium</Link>
          
          <nav className="flex items-center gap-1">
            <Link 
              to="/weight-tracker" 
              className="p-2 text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-100"
            >
              <Scale className="h-5 w-5" />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url as string} alt={user?.user_metadata?.full_name as string} />
                    <AvatarFallback>{user?.user_metadata?.full_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.user_metadata?.full_name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/")}>Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/create-workout")}>New Workout</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  Logout
                  <LogOut className="ml-auto h-4 w-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
