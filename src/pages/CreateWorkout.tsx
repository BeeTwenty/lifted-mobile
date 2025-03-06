
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const CreateWorkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [restTime, setRestTime] = useState<number>(60); // Default 60 seconds rest
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

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
    
    if (!user) {
      toast.error("You must be logged in to create a workout");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create the workout
      const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          title,
          duration: Number(duration),
          notes: notes || null,
          user_id: user.id,
          default_rest_time: restTime // Store the rest time in the database
        })
        .select()
        .single();
      
      if (workoutError) throw workoutError;
      
      // Add exercises if there are any
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
      
      toast.success("Workout created successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("Error creating workout:", error);
      toast.error(error.message || "Failed to create workout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
          <h1 className="text-xl font-semibold">Create Workout Routine</h1>
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
            <h2 className="text-lg font-medium">Exercises</h2>
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
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Workout Routine'}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default CreateWorkout;
