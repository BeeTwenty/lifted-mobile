
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ExerciseSearch from "@/components/ExerciseSearch";
import WorkoutFormDetails from "@/components/workout/WorkoutFormDetails";
import ExercisesList from "@/components/workout/ExercisesList";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

interface Workout {
  id: string;
  title: string;
  duration: number;
  notes: string | null;
  default_rest_time: number | null;
}

const EditWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [restTime, setRestTime] = useState<number>(60);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      if (!id || !user) return;

      try {
        setIsLoading(true);
        
        // Fetch workout details
        const { data: workoutData, error: workoutError } = await supabase
          .from('workouts')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (workoutError) throw workoutError;
        if (!workoutData) {
          toast.error("Workout not found");
          navigate("/");
          return;
        }
        
        // Fetch exercises associated with this workout
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('*')
          .eq('workout_id', id);
        
        if (exercisesError) throw exercisesError;
        
        // Set the state with fetched data
        setWorkout(workoutData);
        setTitle(workoutData.title);
        setDuration(workoutData.duration);
        setRestTime(workoutData.default_rest_time || 60);
        setNotes(workoutData.notes || "");
        setSelectedExercises(exercisesData || []);
      } catch (error: any) {
        console.error("Error fetching workout data:", error);
        toast.error("Failed to load workout data");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkoutData();
  }, [id, user, navigate]);

  const addExercise = (exercise: { id: string; name: string }) => {
    setSelectedExercises([
      ...selectedExercises,
      { ...exercise, sets: 3, reps: 10 }
    ]);
  };

  const removeExercise = (id: string) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.id !== id));
  };

  const updateExercise = (id: string, field: string, value: any) => {
    setSelectedExercises(
      selectedExercises.map(ex => 
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    );
  };

  const moveExercise = (id: string, direction: 'up' | 'down') => {
    const index = selectedExercises.findIndex(ex => ex.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === selectedExercises.length - 1)
    ) {
      return;
    }

    const newExercises = [...selectedExercises];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const exerciseToMove = newExercises[index];
    
    // Remove the exercise from its current position
    newExercises.splice(index, 1);
    // Insert it at the new position
    newExercises.splice(newIndex, 0, exerciseToMove);
    
    setSelectedExercises(newExercises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a workout title");
      return;
    }
    
    if (!user || !workout) {
      toast.error("You must be logged in to update a workout");
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Update the workout details
      const { error: workoutError } = await supabase
        .from('workouts')
        .update({
          title,
          duration: Number(duration),
          notes: notes || null,
          default_rest_time: restTime
        })
        .eq('id', workout.id);
      
      if (workoutError) throw workoutError;
      
      // Delete all existing exercises for this workout
      const { error: deleteExercisesError } = await supabase
        .from('exercises')
        .delete()
        .eq('workout_id', workout.id);
      
      if (deleteExercisesError) throw deleteExercisesError;
      
      // Add the updated exercises
      if (selectedExercises.length > 0) {
        const exercisesToInsert = selectedExercises.map(ex => ({
          workout_id: workout.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight || null,
          notes: ex.notes || null
        }));
        
        const { error: exercisesError } = await supabase
          .from('exercises')
          .insert(exercisesToInsert);
        
        if (exercisesError) throw exercisesError;
      }
      
      toast.success("Workout updated successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("Error updating workout:", error);
      toast.error(error.message || "Failed to update workout");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="mr-2 p-0 h-9 w-9" 
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Edit Workout Routine</h1>
          </div>
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-2 p-0 h-9 w-9" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Edit Workout Routine</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <WorkoutFormDetails
            title={title}
            setTitle={setTitle}
            duration={duration}
            setDuration={setDuration}
            notes={notes}
            setNotes={setNotes}
            restTime={restTime}
            setRestTime={setRestTime}
          />
          
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-foreground">Exercises</h2>
            <ExerciseSearch 
              onSelectExercise={addExercise} 
              selectedExercises={selectedExercises}
            />
            
            <ExercisesList
              exercises={selectedExercises}
              onRemove={removeExercise}
              onMove={moveExercise}
              onUpdate={updateExercise}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default EditWorkout;
