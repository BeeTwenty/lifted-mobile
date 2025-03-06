
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, Dumbbell } from "lucide-react";
import WorkoutExerciseMedia from "./WorkoutExerciseMedia";
import ExerciseStats from "./ExerciseStats";
import ExerciseSetProgress from "./ExerciseSetProgress";
import ExerciseNavigation from "./ExerciseNavigation";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
  media_url?: string;
}

interface WorkoutExerciseProps {
  exercise: Exercise;
  isComplete: boolean;
  onComplete: (id: string) => void;
  onUpdateWeight: (id: string, weight: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  onCompleteSet?: (id: string, setNumber: number, totalSets: number) => void;
  isRestTimerActive?: boolean;
}

const WorkoutExercise = ({
  exercise,
  isComplete,
  onComplete,
  onUpdateWeight,
  onPrevious,
  onNext,
  isFirst,
  isLast,
  onCompleteSet,
  isRestTimerActive = false,
}: WorkoutExerciseProps) => {
  const [currentSet, setCurrentSet] = useState(1);
  const [completedSets, setCompletedSets] = useState<number[]>([]);

  const completeSet = () => {
    if (onCompleteSet) {
      onCompleteSet(exercise.id, currentSet, exercise.sets);
    }
    
    setCompletedSets(prev => [...prev, currentSet]);
    
    if (currentSet < exercise.sets) {
      setCurrentSet(prev => prev + 1);
    } else {
      onComplete(exercise.id);
      setCurrentSet(1);
      setCompletedSets([]);
    }
  };

  const handleUpdateWeight = (weight: number) => {
    onUpdateWeight(exercise.id, weight);
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <h2 className="font-medium text-lg text-foreground">{exercise.name}</h2>
          
          {exercise.media_url && (
            <WorkoutExerciseMedia 
              mediaUrl={exercise.media_url}
              exerciseName={exercise.name}
            />
          )}
        </div>
        
        {isComplete ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Dumbbell className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      
      <ExerciseStats
        sets={exercise.sets}
        reps={exercise.reps}
        weight={exercise.weight}
        onUpdateWeight={handleUpdateWeight}
      />

      {!isComplete && (
        <ExerciseSetProgress
          currentSet={currentSet}
          totalSets={exercise.sets}
          completedSets={completedSets}
          onCompleteSet={completeSet}
          isRestTimerActive={isRestTimerActive}
          isLastSet={currentSet === exercise.sets && completedSets.length === exercise.sets - 1}
        />
      )}

      <ExerciseNavigation
        onPrevious={onPrevious}
        onNext={onNext}
        isFirst={isFirst}
        isLast={isLast}
        isRestTimerActive={isRestTimerActive}
      />
    </Card>
  );
};

export default WorkoutExercise;
