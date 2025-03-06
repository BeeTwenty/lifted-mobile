
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, CheckCircle, Edit, Dumbbell } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
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
  const [editingWeight, setEditingWeight] = useState(false);
  const [weightValue, setWeightValue] = useState(exercise.weight || 0);

  const completeSet = () => {
    // Notify parent about set completion (for rest timer)
    if (onCompleteSet) {
      onCompleteSet(exercise.id, currentSet, exercise.sets);
    }
    
    setCompletedSets(prev => [...prev, currentSet]);
    
    if (currentSet < exercise.sets) {
      setCurrentSet(prev => prev + 1);
    } else {
      // All sets completed
      onComplete(exercise.id);
      setCurrentSet(1);
      setCompletedSets([]);
    }
  };

  const handleWeightChange = () => {
    onUpdateWeight(exercise.id, weightValue);
    setEditingWeight(false);
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-medium text-lg">{exercise.name}</h2>
        {isComplete ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Dumbbell className="h-5 w-5 text-gray-500" />
        )}
      </div>
      
      {/* Exercise details */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 p-2 rounded text-center">
          <p className="text-xs text-gray-500">Sets</p>
          <p className="font-medium">{exercise.sets}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded text-center">
          <p className="text-xs text-gray-500">Reps</p>
          <p className="font-medium">{exercise.reps}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded text-center relative">
          <div className="flex items-center justify-center">
            <p className="text-xs text-gray-500">Weight</p>
            {!editingWeight && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1"
                onClick={() => setEditingWeight(true)}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          {editingWeight ? (
            <div className="flex items-center mt-1">
              <Input
                type="number"
                value={weightValue}
                onChange={(e) => setWeightValue(Number(e.target.value))}
                className="h-6 text-sm p-1 w-12 text-center"
                min="0"
                step="2.5"
              />
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 p-0 ml-1" 
                onClick={handleWeightChange}
              >
                ✓
              </Button>
            </div>
          ) : (
            <p className="font-medium">{exercise.weight || 0} kg</p>
          )}
        </div>
      </div>

      {!isComplete && (
        <>
          {/* Current set tracker */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm">Current Set</p>
              <p className="text-sm font-medium">{currentSet} of {exercise.sets}</p>
            </div>
            <div className="flex space-x-1">
              {Array.from({ length: exercise.sets }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    completedSets.includes(i + 1)
                      ? 'bg-green-500'
                      : i + 1 === currentSet
                      ? 'bg-primary'
                      : 'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <Button 
            className="w-full mb-3" 
            onClick={completeSet}
            disabled={isRestTimerActive}
          >
            {isRestTimerActive 
              ? "Resting..." 
              : currentSet === exercise.sets && completedSets.length === exercise.sets - 1
              ? 'Complete Exercise'
              : `Complete Set ${currentSet}`}
          </Button>
        </>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={isFirst || isRestTimerActive}
          className={isFirst ? 'invisible' : ''}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={isLast || isRestTimerActive}
          className={isLast ? 'invisible' : ''}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default WorkoutExercise;
