
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import WorkoutExercise from "@/components/workout/WorkoutExercise";
import WorkoutHeader from "@/components/workout/WorkoutHeader";
import WorkoutProgress from "@/components/workout/WorkoutProgress";
import WorkoutComplete from "@/components/workout/WorkoutComplete";
import { useWorkoutTimer } from "@/hooks/useWorkoutTimer";
import { useWorkoutState } from "@/hooks/useWorkoutState";
import { useWorkoutData } from "@/hooks/useWorkoutData";

const ExecuteWorkout = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { workout, exercises, isLoading, setExercises } = useWorkoutData(id, user?.id);

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
            <Button onClick={() => window.location.href = "/"} className="mt-4">
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
        <WorkoutHeader
          title={workout.title}
          elapsedTime={elapsedTime}
          isRunning={isRunning}
          onToggle={toggleTimer}
          restTimeRemaining={restTimeRemaining}
          onSkipRest={skipRestTimer}
        />

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
