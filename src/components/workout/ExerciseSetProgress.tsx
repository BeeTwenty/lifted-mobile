
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ExerciseSetProgressProps {
  currentSet: number;
  totalSets: number;
  completedSets: number[];
  onCompleteSet: () => void;
  isRestTimerActive: boolean;
  isLastSet: boolean;
}

const ExerciseSetProgress = ({
  currentSet,
  totalSets,
  completedSets,
  onCompleteSet,
  isRestTimerActive,
  isLastSet
}: ExerciseSetProgressProps) => {
  return (
    <>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-foreground">Current Set</p>
          <p className="text-sm font-medium text-foreground">{currentSet} of {totalSets}</p>
        </div>
        <div className="flex space-x-1">
          {Array.from({ length: totalSets }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                completedSets.includes(i + 1)
                  ? 'bg-green-500'
                  : i + 1 === currentSet
                  ? 'bg-primary'
                  : 'bg-muted'
              }`}
            ></div>
          ))}
        </div>
      </div>

      <Button 
        className="w-full mb-3" 
        onClick={onCompleteSet}
        disabled={isRestTimerActive}
      >
        {isRestTimerActive 
          ? "Resting..." 
          : isLastSet
          ? 'Complete Exercise'
          : `Complete Set ${currentSet}`}
      </Button>
    </>
  );
};

export default ExerciseSetProgress;
