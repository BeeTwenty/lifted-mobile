
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dumbbell, ArrowLeft, Plus, GripVertical, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ExerciseSearch from "@/components/ExerciseSearch";

const CreateWorkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Array<{
    id: string;
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    notes?: string;
  }>>([]);

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
          user_id: user.id
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Routine Title</Label>
              <Input
                id="title"
                placeholder="e.g., Full Body Workout"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="5"
                step="5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                placeholder="Any additional notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Exercises</h2>
            <ExerciseSearch 
              onSelectExercise={addExercise} 
              selectedExercises={selectedExercises}
            />
            
            {selectedExercises.length > 0 ? (
              <div className="space-y-3 mt-4">
                {selectedExercises.map((exercise, index) => (
                  <Card key={exercise.id} className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex flex-col">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-6 w-6 p-0" 
                            onClick={() => moveExercise(exercise.id, 'up')}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                            <span className="sr-only">Move up</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-6 w-6 p-0" 
                            onClick={() => moveExercise(exercise.id, 'down')}
                            disabled={index === selectedExercises.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                            <span className="sr-only">Move down</span>
                          </Button>
                        </div>
                        <h3 className="font-medium">{exercise.name}</h3>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive/90" 
                        onClick={() => removeExercise(exercise.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor={`sets-${exercise.id}`}>Sets</Label>
                        <Input
                          id={`sets-${exercise.id}`}
                          type="number"
                          min="1"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(exercise.id, 'sets', Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`reps-${exercise.id}`}>Reps</Label>
                        <Input
                          id={`reps-${exercise.id}`}
                          type="number"
                          min="1"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(exercise.id, 'reps', Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`weight-${exercise.id}`}>Weight (optional)</Label>
                        <Input
                          id={`weight-${exercise.id}`}
                          type="number"
                          min="0"
                          step="0.5"
                          value={exercise.weight || ''}
                          onChange={(e) => updateExercise(exercise.id, 'weight', e.target.value ? Number(e.target.value) : undefined)}
                          className="mt-1"
                          placeholder="kg"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`notes-${exercise.id}`}>Notes</Label>
                        <Input
                          id={`notes-${exercise.id}`}
                          value={exercise.notes || ''}
                          onChange={(e) => updateExercise(exercise.id, 'notes', e.target.value)}
                          className="mt-1"
                          placeholder="Notes"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center bg-gray-50 py-6 rounded-md border border-dashed border-gray-300">
                <Dumbbell className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No exercises added yet</p>
                <p className="text-gray-400 text-sm">Search and add exercises from above</p>
              </div>
            )}
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
