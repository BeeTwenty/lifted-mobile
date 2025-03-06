
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
        <p className="text-gray-500">No weight records yet</p>
        <p className="text-gray-400 text-sm">Add your first weight record above</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <h2 className="text-lg font-medium p-4 border-b">Weight History</h2>
      <div className="divide-y">
        {weightRecords.map((record) => (
          <div key={record.id} className="flex justify-between items-center p-4">
            <div>
              <p className="font-medium">{format(parseISO(record.date), "MMM d, yyyy")}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-medium">{record.weight} kg</p>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-500 hover:text-red-500" 
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
