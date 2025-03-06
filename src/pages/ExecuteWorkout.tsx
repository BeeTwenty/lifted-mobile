import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, CheckCircle, Timer, Edit } from "lucide-react";
import WorkoutExercise from "@/components/workout/WorkoutExercise";
import WorkoutTimer from "@/components/workout/WorkoutTimer";

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
}

const ExecuteWorkout = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<number | null>(null);
  
  const [restTimeRemaining, setRestTimeRemaining] = useState<number | null>(null);
  const restTimerRef = useRef<number | null>(null);

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
          .order('id', { ascending: true });
        
        if (exercisesError) throw exercisesError;
        setExercises(exercisesData || []);
        
        setIsRunning(true);
      } catch (error: any) {
        console.error('Error fetching workout data:', error);
        toast.error('Failed to load workout');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkoutData();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
    };
  }, [id, user, navigate]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (restTimeRemaining !== null && restTimeRemaining > 0) {
      restTimerRef.current = window.setInterval(() => {
        setRestTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            if (restTimerRef.current) {
              clearInterval(restTimerRef.current);
            }
            const audio = new Audio('/notification.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
    }

    return () => {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
    };
  }, [restTimeRemaining]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const startRestTimer = () => {
    const restDuration = workout?.default_rest_time || 60;
    setRestTimeRemaining(restDuration);
  };

  const skipRestTimer = () => {
    setRestTimeRemaining(null);
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const completeSet = (exerciseId: string, setNumber: number, totalSets: number) => {
    if (setNumber < totalSets) {
      startRestTimer();
    }
  };

  const markExerciseComplete = (exerciseId: string) => {
    setCompletedExercises(prev => [...prev, exerciseId]);
    
    if (activeExerciseIndex === exercises.length - 1) {
      setIsWorkoutComplete(true);
      setIsRunning(false);
      toast.success('Workout completed!');
    } else {
      setActiveExerciseIndex(prev => prev + 1);
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

  const completeWorkout = async () => {
    try {
      if (!user || !workout) return;
      
      const { error } = await supabase
        .from('completed_workouts')
        .insert({
          user_id: user.id,
          workout_id: workout.id,
          duration: Math.floor(elapsedTime / 60),
          notes: `Completed ${completedExercises.length} of ${exercises.length} exercises`
        });
      
      if (error) throw error;
      
      toast.success('Workout recorded successfully!');
      navigate('/');
    } catch (error: any) {
      console.error('Error recording workout:', error);
      toast.error('Failed to record workout');
    }
  };

  const updateExerciseWeight = (exerciseId: string, newWeight: number) => {
    setExercises(exercises.map(exercise => 
      exercise.id === exerciseId 
        ? { ...exercise, weight: newWeight } 
        : exercise
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="max-w-md mx-auto px-4 py-6">
          <div className="text-center py-10">
            <p className="text-gray-500">Workout not found</p>
            <Button onClick={() => navigate("/")} className="mt-4">
              Return to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-xl font-semibold">{workout.title}</h1>
          </div>
          
          <WorkoutTimer 
            elapsedTime={elapsedTime} 
            isRunning={isRunning} 
            onToggle={toggleTimer}
            restTimeRemaining={restTimeRemaining}
            onSkipRest={skipRestTimer}
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">
              Progress: {completedExercises.length} / {exercises.length} exercises
            </p>
            <p className="text-sm font-medium">
              {Math.round((completedExercises.length / exercises.length) * 100)}%
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${(completedExercises.length / exercises.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {exercises.length > 0 && (
          <WorkoutExercise
            exercise={exercises[activeExerciseIndex]}
            isComplete={completedExercises.includes(exercises[activeExerciseIndex].id)}
            onComplete={markExerciseComplete}
            onUpdateWeight={updateExerciseWeight}
            onPrevious={goToPreviousExercise}
            onNext={goToNextExercise}
            isFirst={activeExerciseIndex === 0}
            isLast={activeExerciseIndex === exercises.length - 1}
            onCompleteSet={completeSet}
            isRestTimerActive={restTimeRemaining !== null && restTimeRemaining > 0}
          />
        )}

        {isWorkoutComplete && (
          <Card className="mt-6 p-4 bg-green-50 border-green-200">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <h2 className="text-lg font-medium mb-1">Workout Complete!</h2>
              <p className="text-gray-600 mb-4">
                Total time: {Math.floor(elapsedTime / 60)}m {elapsedTime % 60}s
              </p>
              <Button onClick={completeWorkout} className="w-full">
                Save Workout Results
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ExecuteWorkout;
