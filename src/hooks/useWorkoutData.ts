
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  media_url?: string;
}

export const useWorkoutData = (workoutId: string | undefined, userId: string | undefined) => {
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        setIsLoading(true);
        
        if (!workoutId || !userId) return;

        const { data: workoutData, error: workoutError } = await supabase
          .from('workouts')
          .select('*')
          .eq('id', workoutId)
          .eq('user_id', userId)
          .single();
        
        if (workoutError) throw workoutError;
        if (!workoutData) {
          toast.error('Workout not found');
          navigate('/');
          return;
        }
        
        setWorkout(workoutData);
        
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('*')
          .eq('workout_id', workoutId)
          .order('order', { ascending: true });
        
        if (exercisesError) throw exercisesError;
        
        if (exercisesData && exercisesData.length > 0) {
          const exerciseNames = [...new Set(exercisesData.map(exercise => exercise.name))];
          
          const { data: templateData, error: templateError } = await supabase
            .from('exercise_templates')
            .select('name, media_url')
            .in('name', exerciseNames);
          
          if (templateError) throw templateError;
          
          const mediaUrlMap = templateData ? 
            templateData.reduce((map, template) => {
              map[template.name] = template.media_url;
              return map;
            }, {} as Record<string, string | null>) : {};
          
          const exercisesWithMedia = exercisesData.map(exercise => ({
            ...exercise,
            media_url: mediaUrlMap[exercise.name] || undefined
          }));
          
          const sortedExercises = [...exercisesWithMedia].sort((a, b) => {
            const orderA = a.order !== undefined && a.order !== null ? a.order : Number.MAX_SAFE_INTEGER;
            const orderB = b.order !== undefined && b.order !== null ? b.order : Number.MAX_SAFE_INTEGER;
            return orderA - orderB;
          });
          
          setExercises(sortedExercises);
        } else {
          setExercises([]);
        }
      } catch (error: any) {
        console.error('Error fetching workout data:', error);
        toast.error('Failed to load workout');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkoutData();
  }, [workoutId, userId, navigate]);

  return { workout, exercises, isLoading, setExercises };
};
