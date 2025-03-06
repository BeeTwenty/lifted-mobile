
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

interface ExerciseItemProps {
  exercise: Exercise;
  index: number;
  totalExercises: number;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onUpdate: (id: string, field: string, value: any) => void;
}

const ExerciseItem = ({
  exercise,
  index,
  totalExercises,
  onRemove,
  onMove,
  onUpdate
}: ExerciseItemProps) => {
  return (
    <Card className="p-3">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <div className="flex flex-col">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-6 w-6 p-0" 
              onClick={() => onMove(exercise.id, 'up')}
              disabled={index === 0}
            >
              <ChevronUp className="h-4 w-4" />
              <span className="sr-only">Move up</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-6 w-6 p-0" 
              onClick={() => onMove(exercise.id, 'down')}
              disabled={index === totalExercises - 1}
            >
              <ChevronDown className="h-4 w-4" />
              <span className="sr-only">Move down</span>
            </Button>
          </div>
          <h3 className="font-medium">{exercise.name}</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive/90" 
          onClick={() => onRemove(exercise.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor={`sets-${exercise.id}`}>Sets</Label>
          <Input
            id={`sets-${exercise.id}`}
            type="number"
            min="1"
            value={exercise.sets}
            onChange={(e) => onUpdate(exercise.id, 'sets', Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`reps-${exercise.id}`}>Reps</Label>
          <Input
            id={`reps-${exercise.id}`}
            type="number"
            min="1"
            value={exercise.reps}
            onChange={(e) => onUpdate(exercise.id, 'reps', Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`weight-${exercise.id}`}>Weight (optional)</Label>
          <Input
            id={`weight-${exercise.id}`}
            type="number"
            min="0"
            step="0.5"
            value={exercise.weight || ''}
            onChange={(e) => onUpdate(exercise.id, 'weight', e.target.value ? Number(e.target.value) : undefined)}
            className="mt-1"
            placeholder="kg"
          />
        </div>
        <div>
          <Label htmlFor={`notes-${exercise.id}`}>Notes</Label>
          <Input
            id={`notes-${exercise.id}`}
            value={exercise.notes || ''}
            onChange={(e) => onUpdate(exercise.id, 'notes', e.target.value)}
            className="mt-1"
            placeholder="Notes"
          />
        </div>
      </div>
    </Card>
  );
};

export default ExerciseItem;
