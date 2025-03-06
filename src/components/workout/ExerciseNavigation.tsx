
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ExerciseNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  isRestTimerActive: boolean;
}

const ExerciseNavigation = ({
  onPrevious,
  onNext,
  isFirst,
  isLast,
  isRestTimerActive
}: ExerciseNavigationProps) => {
  return (
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
  );
};

export default ExerciseNavigation;
