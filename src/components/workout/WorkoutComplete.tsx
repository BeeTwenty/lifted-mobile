
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface WorkoutCompleteProps {
  totalTime: number;
  onSave: () => void;
}

const WorkoutComplete: React.FC<WorkoutCompleteProps> = ({ 
  totalTime, 
  onSave 
}) => {
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  
  return (
    <Card className="mt-6 p-4 bg-green-50 border-green-200">
      <div className="text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
        <h2 className="text-lg font-medium mb-1">Workout Complete!</h2>
        <p className="text-gray-600 mb-4">
          Total time: {minutes}m {seconds}s
        </p>
        <Button onClick={onSave} className="w-full">
          Save Workout Results
        </Button>
      </div>
    </Card>
  );
};

export default WorkoutComplete;
