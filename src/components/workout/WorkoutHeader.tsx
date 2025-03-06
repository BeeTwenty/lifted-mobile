
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WorkoutTimer from "./WorkoutTimer";
import { checkNotificationsSupport, sendTestNotification } from "@/services/notifications";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";

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
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    const checkNotifications = async () => {
      const isSupported = await checkNotificationsSupport();
      setNotificationsSupported(isSupported);
      
      if (!isSupported && isNative) {
        toast.info(
          "Enable notifications to get alerts when rest timers complete",
          {
            duration: 5000,
          }
        );
      }
    };
    
    checkNotifications();
  }, [isNative]);

  const handleTestNotification = async () => {
    try {
      setIsSendingNotification(true);
      
      if (!isNative) {
        toast.info(
          "Notifications are only available when running as a native app",
          { 
            description: "Try installing on a physical device or emulator",
            duration: 5000,
          }
        );
        setIsSendingNotification(false);
        return;
      }
      
      console.log("Testing notification delivery...");
      toast.loading("Sending notification...", { id: "notification-test" });
      
      // Send multiple test notifications in case one approach works better
      const sent = await sendTestNotification();
      
      if (sent) {
        toast.success("Test notification sent!", {
          id: "notification-test",
          description: "Please check your notification panel in a moment",
          duration: 3000,
        });
        console.log("Test notification scheduled successfully");
      } else {
        console.error("Failed to send notification");
        toast.error("Failed to send notification", {
          id: "notification-test",
          description: "Please check app permissions in device settings",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error sending test notification:", error);
      toast.error("Error sending notification", {
        id: "notification-test",
        description: "An unexpected error occurred",
        duration: 3000,
      });
    } finally {
      setTimeout(() => {
        setIsSendingNotification(false);
      }, 3000); // Keep loading state for at least 3 seconds
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex items-center justify-between">
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
      
      <Button 
        variant="outline" 
        size="sm" 
        className="self-end flex items-center gap-2" 
        onClick={handleTestNotification}
        disabled={isSendingNotification}
      >
        {isSendingNotification ? (
          <span className="animate-spin">⟳</span>
        ) : (
          <Bell className="h-4 w-4" />
        )}
        {isSendingNotification ? "Sending..." : "Test Notification"}
      </Button>
    </div>
  );
};

export default WorkoutHeader;
