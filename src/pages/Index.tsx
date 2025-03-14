
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Dumbbell } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  // Redirect to Dashboard if this page is accessed directly
  useEffect(() => {
    // Short timeout to allow for smooth transition
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex flex-col items-center justify-center py-10">
          <Dumbbell className="h-16 w-16 text-primary mb-6" />
          <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Lifted</h1>
          <p className="text-xl text-muted-foreground text-center mb-8">
            Track your workouts and achieve your fitness goals
          </p>
          <div className="text-center">
            <p className="text-muted-foreground">Redirecting to dashboard...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
