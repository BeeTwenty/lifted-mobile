
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Timer, SkipForward } from "lucide-react";

interface WorkoutTimerProps {
  elapsedTime: number;
  isRunning: boolean;
  onToggle: () => void;
  restTimeRemaining?: number | null;
  onSkipRest?: () => void;
}

const WorkoutTimer = ({ 
  elapsedTime, 
  isRunning, 
  onToggle, 
  restTimeRemaining,
  onSkipRest
}: WorkoutTimerProps) => {
  // Format time as MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="flex items-center px-3 py-1.5 bg-gray-50">
      <Timer className="h-4 w-4 mr-2 text-gray-500" />
      {restTimeRemaining ? (
        <div className="flex items-center flex-1">
          <div className="font-mono font-medium mr-2 text-amber-600">
            Rest: {formatTime(restTimeRemaining)}
          </div>
          {onSkipRest && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 ml-auto" 
              onClick={onSkipRest}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <span className="font-mono font-medium mr-2">{formatTime(elapsedTime)}</span>
      )}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0" 
        onClick={onToggle}
        disabled={restTimeRemaining !== null && restTimeRemaining > 0}
      >
        {isRunning ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
    </Card>
  );
};

export default WorkoutTimer;
