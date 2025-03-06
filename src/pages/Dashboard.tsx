
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Plus, Dumbbell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Define the workout routine type based on what we're getting from the database
interface WorkoutRoutine {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
  duration: number;
  notes: string | null;
  default_rest_time: number | null;
}

const Dashboard = () => {
  const [workoutRoutines, setWorkoutRoutines] = useState<WorkoutRoutine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch workout routines from Supabase when the component mounts
    const fetchWorkoutRoutines = async () => {
      try {
        setIsLoading(true);
        
        if (!user) return;
        
        const { data, error } = await supabase
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setWorkoutRoutines(data || []);
      } catch (error: any) {
        console.error('Error fetching workout routines:', error);
        toast.error('Failed to load your workout routines');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkoutRoutines();
  }, [user]);

  // Count the number of exercises for each workout routine
  const fetchExerciseCount = async (workoutId: string) => {
    try {
      const { count, error } = await supabase
        .from('exercises')
        .select('*', { count: 'exact', head: true })
        .eq('workout_id', workoutId);
      
      if (error) throw error;
      
      return count || 0;
    } catch (error) {
      console.error('Error counting exercises:', error);
      return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-md mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">My Workout Routines</h1>
          <Button 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => navigate("/create-workout")}
          >
            <Plus size={18} />
            New
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : workoutRoutines.length === 0 ? (
          <div className="text-center py-10">
            <Dumbbell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No workout routines yet</p>
            <p className="text-gray-400 text-sm mb-4">Create your first routine to get started</p>
            <Button onClick={() => navigate("/create-workout")}>
              <Plus className="mr-2" size={16} />
              Create Routine
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {workoutRoutines.map((routine) => (
              <Card key={routine.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{routine.title}</h3>
                      <p className="text-sm text-gray-500">
                        {routine.duration} min • {new Date(routine.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
