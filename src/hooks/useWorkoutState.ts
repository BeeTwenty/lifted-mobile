
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Workout {
  id: string;
  title: string;
  duration: number;
  notes: string | null;
  default_rest_time: number | null;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
  order?: number;
  workout_id: string;
  rest_time: number | null;
}

export const useWorkoutState = (workout: Workout | null, exercises: Exercise[], userId: string | undefined) => {
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  
  const completeSet = (exerciseId: string, setNumber: number, totalSets: number, startRestTimer: (duration: number) => void) => {
    if (setNumber < totalSets && workout?.default_rest_time) {
      startRestTimer(workout.default_rest_time);
    }
  };

  const markExerciseComplete = (exerciseId: string) => {
    setCompletedExercises(prev => [...prev, exerciseId]);
    
    if (activeExerciseIndex === exercises.length - 1) {
      setIsWorkoutComplete(true);
      return true; // Return true to indicate workout is complete
    } else {
      setActiveExerciseIndex(prev => prev + 1);
      return false; // Return false to indicate workout is not yet complete
    }
  };

  const goToPreviousExercise = () => {
    if (activeExerciseIndex > 0) {
      setActiveExerciseIndex(prev => prev - 1);
      
      const prevExerciseId = exercises[activeExerciseIndex - 1]?.id;
      if (prevExerciseId) {
        setCompletedExercises(prev => 
          prev.filter(id => id !== prevExerciseId)
        );
      }
    }
  };

  const goToNextExercise = () => {
    if (activeExerciseIndex < exercises.length - 1) {
      setActiveExerciseIndex(prev => prev + 1);
    }
  };

  const updateExerciseWeight = (exerciseId: string, newWeight: number, exercisesData: Exercise[], setExercisesData: React.Dispatch<React.SetStateAction<Exercise[]>>) => {
    setExercisesData(exercisesData.map(exercise => 
      exercise.id === exerciseId 
        ? { ...exercise, weight: newWeight } 
        : exercise
    ));
  };

  const completeWorkout = async (elapsedTime: number) => {
    try {
      if (!userId || !workout) return false;
      
      const { error } = await supabase
        .from('completed_workouts')
        .insert({
          user_id: userId,
          workout_id: workout.id,
          duration: Math.floor(elapsedTime / 60),
          notes: `Completed ${completedExercises.length} of ${exercises.length} exercises`
        });
      
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error('Error recording workout:', error);
      return false;
    }
  };
  
  return {
    activeExerciseIndex,
    completedExercises,
    isWorkoutComplete,
    completeSet,
    markExerciseComplete,
    goToPreviousExercise,
    goToNextExercise,
    updateExerciseWeight,
    completeWorkout
  };
};
