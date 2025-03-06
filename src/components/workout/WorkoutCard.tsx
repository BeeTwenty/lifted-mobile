
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Edit, Trash2, PlayCircle } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface WorkoutRoutine {
  id: string;
  title: string;
  created_at: string;
  duration: number;
  notes: string | null;
  default_rest_time: number | null;
}

interface WorkoutCardProps {
  routine: WorkoutRoutine;
  onDelete: (id: string) => void;
}

const WorkoutCard = ({ routine, onDelete }: WorkoutCardProps) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStartWorkout = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/execute-workout/${routine.id}`);
  };

  const handleEditWorkout = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-workout/${routine.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Delete exercises associated with this workout
      const { error: exercisesError } = await supabase
        .from('exercises')
        .delete()
        .eq('workout_id', routine.id);
      
      if (exercisesError) throw exercisesError;
      
      // Delete the workout itself
      const { error: workoutError } = await supabase
        .from('workouts')
        .delete()
        .eq('id', routine.id);
      
      if (workoutError) throw workoutError;
      
      // Notify parent component to update the UI
      onDelete(routine.id);
      toast.success("Workout deleted successfully");
    } catch (error: any) {
      console.error("Error deleting workout:", error);
      toast.error("Failed to delete workout");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{routine.title}</h3>
              <p className="text-sm text-gray-500">
                {routine.duration} min • {new Date(routine.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-primary" 
                onClick={handleStartWorkout}
              >
                <PlayCircle className="h-5 w-5" />
                <span className="sr-only">Start Workout</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-primary" 
                onClick={handleEditWorkout}
              >
                <Edit className="h-5 w-5" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-destructive" 
                onClick={handleDelete}
              >
                <Trash2 className="h-5 w-5" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete workout routine?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the "{routine.title}" workout
              and all its associated exercises.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              disabled={isDeleting} 
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WorkoutCard;
