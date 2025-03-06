
import { useEffect } from "react";
import { Dumbbell } from "lucide-react";
import ExerciseItem from "./ExerciseItem";
import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { toast } from "sonner";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

interface ExercisesListProps {
  exercises: Exercise[];
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onUpdate: (id: string, field: string, value: any) => void;
}

const ExercisesList = ({ exercises, onRemove, onMove, onUpdate }: ExercisesListProps) => {
  useEffect(() => {
    const setupNotifications = async () => {
      if (!Capacitor.isNativePlatform()) return; // Only request on Android/iOS
      
      // First check local notifications (more important for timer)
      try {
        console.log("Checking local notification permissions...");
        const localPermStatus = await LocalNotifications.checkPermissions();
        
        if (localPermStatus.display !== 'granted') {
          console.log("Requesting local notification permissions...");
          const result = await LocalNotifications.requestPermissions();
          
          if (result.display === 'granted') {
            console.log("Local notification permission granted");
          } else {
            console.warn("Local notification permission denied");
            toast.error("Notifications permission denied", {
              description: "Workout timer notifications won't work properly",
              duration: 5000
            });
          }
        } else {
          console.log("Local notification permission already granted");
        }
      } catch (error) {
        console.error("Error setting up local notifications:", error);
      }
      
      // Then check push notifications
      try {
        console.log("Checking push notification permissions...");
        const pushPermStatus = await PushNotifications.checkPermissions();
        
        if (pushPermStatus.receive !== 'granted') {
          console.log("Requesting push notification permissions...");
          const pushResult = await PushNotifications.requestPermissions();
          
          if (pushResult.receive === 'granted') {
            console.log("Push notification permission granted");
            // Register with FCM
            await PushNotifications.register();
          } else {
            console.warn("Push notification permission denied");
          }
        } else {
          console.log("Push notification permission already granted");
          // Ensure registered with FCM
          await PushNotifications.register();
        }
      } catch (pushError) {
        console.error("Error setting up push notifications:", pushError);
      }
    };

    setupNotifications();
  }, []); // Runs once when component mounts

  if (exercises.length === 0) {
    return (
      <div className="text-center bg-gray-50 py-6 rounded-md border border-dashed border-gray-300">
        <Dumbbell className="h-10 w-10 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500">No exercises added yet</p>
        <p className="text-gray-400 text-sm">Search and add exercises from above</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {exercises.map((exercise, index) => (
        <ExerciseItem
          key={exercise.id}
          exercise={exercise}
          index={index}
          totalExercises={exercises.length}
          onRemove={onRemove}
          onMove={onMove}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default ExercisesList;
