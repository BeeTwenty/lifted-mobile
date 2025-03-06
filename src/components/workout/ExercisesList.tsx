import { useEffect } from "react";
import { Dumbbell } from "lucide-react";
import ExerciseItem from "./ExerciseItem";
import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";

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
    const requestPermission = async () => {
      if (!Capacitor.isNativePlatform()) return; // Only request on Android/iOS
      const permStatus = await PushNotifications.requestPermissions();
      if (permStatus.receive === "granted") {
        console.log("Notification permission granted");
      } else {
        console.warn("Notification permission denied");
      }
    };

    requestPermission();
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
