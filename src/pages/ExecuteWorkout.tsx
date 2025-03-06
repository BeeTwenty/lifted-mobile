import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import WorkoutExercise from "@/components/workout/WorkoutExercise";
import WorkoutTimer from "@/components/workout/WorkoutTimer";
import WorkoutProgress from "@/components/workout/WorkoutProgress";
import WorkoutComplete from "@/components/workout/WorkoutComplete";
import { useWorkoutTimer } from "@/hooks/useWorkoutTimer";
import { useWorkoutState } from "@/hooks/useWorkoutState";

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

const ExecuteWorkout = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    isRunning,
    elapsedTime,
    restTimeRemaining,
    toggleTimer,
    startRestTimer,
    skipRestTimer,
    setElapsedTime
  } = useWorkoutTimer(true);

  const {
    activeExerciseIndex,
    completedExercises,
    isWorkoutComplete,
    completeSet,
    markExerciseComplete,
    goToPreviousExercise,
    goToNextExercise,
    updateExerciseWeight,
    completeWorkout
  } = useWorkoutState(workout, exercises, user?.id);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        setIsLoading(true);
        
        if (!id || !user) return;

        const { data: workoutData, error: workoutError } = await supabase
          .from('workouts')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
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
          .eq('workout_id', id)
          .order('order', { ascending: true });
        
        if (exercisesError) throw exercisesError;
        
        const sortedExercises = exercisesData ? [...exercisesData].sort((a, b) => {
          // Handle undefined order values by treating them as largest (they go to the end)
          const orderA = a.order !== undefined && a.order !== null ? a.order : Number.MAX_SAFE_INTEGER;
          const orderB = b.order !== undefined && b.order !== null ? b.order : Number.MAX_SAFE_INTEGER;
          return orderA - orderB;
        }) : [];
        
        setExercises(sortedExercises);
      } catch (error: any) {
        console.error('Error fetching workout data:', error);
        toast.error('Failed to load workout');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkoutData();
  }, [id, user, navigate]);

  const handleCompleteSet = (exerciseId: string, setNumber: number, totalSets: number) => {
    if (workout?.default_rest_time) {
      completeSet(exerciseId, setNumber, totalSets, startRestTimer);
    }
  };

  const handleExerciseComplete = (exerciseId: string) => {
    const isComplete = markExerciseComplete(exerciseId);
    if (isComplete) {
      toggleTimer();
    }
  };

  const handleUpdateExerciseWeight = (exerciseId: string, newWeight: number) => {
    updateExerciseWeight(exerciseId, newWeight, exercises, setExercises);
  };

  const handleCompleteWorkout = async () => {
    const success = await completeWorkout(elapsedTime);
    if (success) {
      toast.success('Workout recorded successfully!');
      navigate('/');
    } else {
      toast.error('Failed to record workout');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="max-w-md mx-auto px-4 py-6">
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="max-w-md mx-auto px-4 py-6">
          <div className="text-center py-10">
            <p className="text-muted-foreground">Workout not found</p>
            <Button onClick={() => navigate("/")} className="mt-4">
              Return to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-2 p-0 h-9 w-9" 
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">{workout.title}</h1>
          </div>
          
          <WorkoutTimer 
            elapsedTime={elapsedTime} 
            isRunning={isRunning} 
            onToggle={toggleTimer}
            restTimeRemaining={restTimeRemaining}
            onSkipRest={skipRestTimer}
          />
        </div>

        <WorkoutProgress 
          completedCount={completedExercises.length} 
          totalCount={exercises.length} 
        />

        {exercises.length > 0 && (
          <WorkoutExercise
            exercise={exercises[activeExerciseIndex]}
            isComplete={completedExercises.includes(exercises[activeExerciseIndex].id)}
            onComplete={handleExerciseComplete}
            onUpdateWeight={handleUpdateExerciseWeight}
            onPrevious={goToPreviousExercise}
            onNext={goToNextExercise}
            isFirst={activeExerciseIndex === 0}
            isLast={activeExerciseIndex === exercises.length - 1}
            onCompleteSet={handleCompleteSet}
            isRestTimerActive={restTimeRemaining !== null && restTimeRemaining > 0}
          />
        )}

        {isWorkoutComplete && (
          <WorkoutComplete 
            totalTime={elapsedTime} 
            onSave={handleCompleteWorkout} 
          />
        )}
      </main>
    </div>
  );
};

export default ExecuteWorkout;
