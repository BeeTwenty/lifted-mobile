
import { format, parseISO } from "date-fns";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WeightRecord } from "@/pages/WeightTracker";

interface WeightHistoryProps {
  weightRecords: WeightRecord[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

const WeightHistory = ({ weightRecords, isLoading, onDelete }: WeightHistoryProps) => {
  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (weightRecords.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No weight records yet</p>
        <p className="text-muted-foreground/80 text-sm">Add your first weight record above</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
      <h2 className="text-lg font-medium p-4 border-b text-card-foreground">Weight History</h2>
      <div className="divide-y divide-border">
        {weightRecords.map((record) => (
          <div key={record.id} className="flex justify-between items-center p-4">
            <div>
              <p className="font-medium text-card-foreground">{format(parseISO(record.date), "MMM d, yyyy")}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-medium text-card-foreground">{record.weight} kg</p>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-muted-foreground hover:text-destructive" 
                onClick={() => onDelete(record.id)}
              >
                <Trash size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeightHistory;
