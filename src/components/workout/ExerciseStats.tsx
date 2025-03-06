
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";

interface ExerciseStatsProps {
  sets: number;
  reps: number;
  weight: number | undefined;
  onUpdateWeight: (weight: number) => void;
}

const ExerciseStats = ({ 
  sets, 
  reps, 
  weight, 
  onUpdateWeight 
}: ExerciseStatsProps) => {
  const [editingWeight, setEditingWeight] = useState(false);
  const [weightValue, setWeightValue] = useState(weight || 0);

  const handleWeightChange = () => {
    onUpdateWeight(weightValue);
    setEditingWeight(false);
  };

  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <div className="bg-secondary p-2 rounded text-center">
        <p className="text-xs text-muted-foreground">Sets</p>
        <p className="font-medium text-foreground">{sets}</p>
      </div>
      <div className="bg-secondary p-2 rounded text-center">
        <p className="text-xs text-muted-foreground">Reps</p>
        <p className="font-medium text-foreground">{reps}</p>
      </div>
      <div className="bg-secondary p-2 rounded text-center relative">
        <div className="flex items-center justify-center">
          <p className="text-xs text-muted-foreground">Weight</p>
          {!editingWeight && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 ml-1"
              onClick={() => setEditingWeight(true)}
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {editingWeight ? (
          <div className="flex items-center mt-1">
            <Input
              type="number"
              value={weightValue}
              onChange={(e) => setWeightValue(Number(e.target.value))}
              className="h-6 text-sm p-1 w-12 text-center"
              min="0"
              step="2.5"
            />
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 p-0 ml-1" 
              onClick={handleWeightChange}
            >
              ✓
            </Button>
          </div>
        ) : (
          <p className="font-medium text-foreground">{weight || 0} kg</p>
        )}
      </div>
    </div>
  );
};

export default ExerciseStats;
