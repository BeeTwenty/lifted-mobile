
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, AlertTriangle } from "lucide-react";
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
  const [notificationAttempts, setNotificationAttempts] = useState(0);

  useEffect(() => {
    const checkNotifications = async () => {
      try {
        console.log("Checking notification permissions in WorkoutHeader");
        const isSupported = await checkNotificationsSupport();
        setNotificationsSupported(isSupported);
        
        if (!isSupported && isNative) {
          console.log("Notifications not supported but on native platform");
          toast.info(
            "Notifications not working. Please check app permissions",
            {
              duration: 5000,
              action: {
                label: "Open Settings",
                onClick: () => {
                  console.log("User clicked to open settings");
                  // This would ideally open device settings, but we'll just log it
                }
              }
            }
          );
        } else if (isSupported) {
          console.log("Notifications are supported and permissions granted");
        }
      } catch (error) {
        console.error("Error checking notification support:", error);
      }
    };
    
    checkNotifications();
  }, [isNative]);

  const handleTestNotification = async () => {
    try {
      setIsSendingNotification(true);
      setNotificationAttempts(prev => prev + 1);
      
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
        
        // Different messages based on attempts
        if (notificationAttempts > 1) {
          toast.error("Still having issues with notifications", {
            id: "notification-test",
            description: "Try restarting the app or reinstalling",
            duration: 5000,
          });
        } else {
          toast.error("Failed to send notification", {
            id: "notification-test",
            description: "Please check app permissions in device settings",
            duration: 5000,
          });
        }
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
        className={`self-end flex items-center gap-2 ${notificationsSupported === false ? 'border-yellow-500' : ''}`}
        onClick={handleTestNotification}
        disabled={isSendingNotification}
      >
        {isSendingNotification ? (
          <span className="animate-spin">⟳</span>
        ) : notificationsSupported === false ? (
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        ) : (
          <Bell className="h-4 w-4" />
        )}
        {isSendingNotification ? "Sending..." : notificationsSupported === false ? "Fix Notifications" : "Test Notification"}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className={`self-end flex items-center gap-2 ${notificationsSupported === false ? 'border-yellow-500' : ''}`}
        onClick={handleTestNotification}
        disabled={isSendingNotification}
      >
        {isSendingNotification ? (
          <span className="animate-spin">⟳</span>
        ) : notificationsSupported === false ? (
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        ) : (
          <Bell className="h-4 w-4" />
        )}
        {isSendingNotification ? "Sending..." : notificationsSupported === false ? "Fix Notifications" : "Test Notification"}
      </Button>
    </div>
  );
};

export default WorkoutHeader;
