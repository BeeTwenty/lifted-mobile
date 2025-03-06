
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WorkoutTimer from "./WorkoutTimer";
import { checkNotificationsSupport } from "@/services/NotificationService";
import { toast } from "sonner";

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
  const [notificationsSupported, setNotificationsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const checkNotifications = async () => {
      const isSupported = await checkNotificationsSupport();
      setNotificationsSupported(isSupported);
      
      if (!isSupported) {
        toast.info(
          "Enable notifications to get alerts when rest timers complete",
          {
            duration: 5000,
          }
        );
      }
    };
    
    checkNotifications();
  }, []);

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
