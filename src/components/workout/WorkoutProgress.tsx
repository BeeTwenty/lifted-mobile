
import React from "react";

interface WorkoutProgressProps {
  completedCount: number;
  totalCount: number;
}

const WorkoutProgress: React.FC<WorkoutProgressProps> = ({ 
  completedCount, 
  totalCount 
}) => {
  const percentage = Math.round((completedCount / totalCount) * 100);
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">
          Progress: {completedCount} / {totalCount} exercises
        </p>
        <p className="text-sm font-medium text-foreground">
          {percentage}%
        </p>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default WorkoutProgress;
