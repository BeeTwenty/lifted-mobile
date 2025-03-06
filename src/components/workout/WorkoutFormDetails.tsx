
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WorkoutFormDetailsProps {
  title: string;
  setTitle: (value: string) => void;
  duration: number;
  setDuration: (value: number) => void;
  notes: string;
  setNotes: (value: string) => void;
}

const WorkoutFormDetails = ({
  title,
  setTitle,
  duration,
  setDuration,
  notes,
  setNotes
}: WorkoutFormDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Routine Title</Label>
        <Input
          id="title"
          placeholder="e.g., Full Body Workout"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          id="duration"
          type="number"
          min="5"
          step="5"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input
          id="notes"
          placeholder="Any additional notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </div>
  );
};

export default WorkoutFormDetails;
