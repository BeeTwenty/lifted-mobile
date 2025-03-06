
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WorkoutTimer from "./WorkoutTimer";

interface WorkoutHeaderProps {
  title: string;
  elapsedTime: number;
  isRunning: boolean;
  onToggle: () => void;
  restTimeRemaining: number | null;
  onSkipRest: () => void;
}

const WorkoutHeader = ({
  title,
  elapsedTime,
  isRunning,
  onToggle,
  restTimeRemaining,
  onSkipRest
}: WorkoutHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          className="mr-2 p-0 h-9 w-9" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>
      
      <WorkoutTimer 
        elapsedTime={elapsedTime} 
        isRunning={isRunning} 
        onToggle={onToggle}
        restTimeRemaining={restTimeRemaining}
        onSkipRest={onSkipRest}
      />
    </div>
  );
};

export default WorkoutHeader;
