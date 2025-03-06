
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Edit, 
  Dumbbell, 
  Video,
  ExternalLink
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
  media_url?: string;
}

interface WorkoutExerciseProps {
  exercise: Exercise;
  isComplete: boolean;
  onComplete: (id: string) => void;
  onUpdateWeight: (id: string, weight: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  onCompleteSet?: (id: string, setNumber: number, totalSets: number) => void;
  isRestTimerActive?: boolean;
}

const WorkoutExercise = ({
  exercise,
  isComplete,
  onComplete,
  onUpdateWeight,
  onPrevious,
  onNext,
  isFirst,
  isLast,
  onCompleteSet,
  isRestTimerActive = false,
}: WorkoutExerciseProps) => {
  const [currentSet, setCurrentSet] = useState(1);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [editingWeight, setEditingWeight] = useState(false);
  const [weightValue, setWeightValue] = useState(exercise.weight || 0);

  const completeSet = () => {
    // Notify parent about set completion (for rest timer)
    if (onCompleteSet) {
      onCompleteSet(exercise.id, currentSet, exercise.sets);
    }
    
    setCompletedSets(prev => [...prev, currentSet]);
    
    if (currentSet < exercise.sets) {
      setCurrentSet(prev => prev + 1);
    } else {
      // All sets completed
      onComplete(exercise.id);
      setCurrentSet(1);
      setCompletedSets([]);
    }
  };

  const handleWeightChange = () => {
    onUpdateWeight(exercise.id, weightValue);
    setEditingWeight(false);
  };

  const renderMediaContent = () => {
    if (!exercise.media_url) return null;
    
    // Check if it's a video URL (simple check)
    const isVideo = exercise.media_url.match(/\.(mp4|webm|ogg)$/) !== null || 
                    exercise.media_url.includes('youtube.com') ||
                    exercise.media_url.includes('youtu.be') ||
                    exercise.media_url.includes('vimeo.com');
                    
    // Handle YouTube embed URLs
    const getYouTubeEmbedUrl = (url: string) => {
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url;
    };
    
    if (isVideo) {
      if (exercise.media_url.includes('youtube.com') || exercise.media_url.includes('youtu.be')) {
        const embedUrl = getYouTubeEmbedUrl(exercise.media_url);
        return (
          <div className="w-full aspect-video">
            <iframe 
              src={embedUrl} 
              className="w-full h-full"
              title={`How to do ${exercise.name}`}
              allowFullScreen
            ></iframe>
          </div>
        );
      } else {
        return (
          <video 
            src={exercise.media_url} 
            controls 
            className="w-full h-auto"
          >
            Your browser does not support the video tag.
          </video>
        );
      }
    } else {
      // Assumed to be an image
      return (
        <img 
          src={exercise.media_url} 
          alt={`How to do ${exercise.name}`} 
          className="w-full h-auto"
        />
      );
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <h2 className="font-medium text-lg text-foreground">{exercise.name}</h2>
          
          {/* Media viewer button */}
          {exercise.media_url && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="ml-2 p-1 h-6 w-6">
                        <Video className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>{exercise.name}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        {renderMediaContent()}
                      </div>
                      {exercise.media_url && (
                        <a 
                          href={exercise.media_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-blue-500 mt-2"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open in new tab
                        </a>
                      )}
                    </DialogContent>
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View exercise demonstration</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {isComplete ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Dumbbell className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      
      {/* Exercise details */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-secondary p-2 rounded text-center">
          <p className="text-xs text-muted-foreground">Sets</p>
          <p className="font-medium text-foreground">{exercise.sets}</p>
        </div>
        <div className="bg-secondary p-2 rounded text-center">
          <p className="text-xs text-muted-foreground">Reps</p>
          <p className="font-medium text-foreground">{exercise.reps}</p>
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
            <p className="font-medium text-foreground">{exercise.weight || 0} kg</p>
          )}
        </div>
      </div>

      {!isComplete && (
        <>
          {/* Current set tracker */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-foreground">Current Set</p>
              <p className="text-sm font-medium text-foreground">{currentSet} of {exercise.sets}</p>
            </div>
            <div className="flex space-x-1">
              {Array.from({ length: exercise.sets }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    completedSets.includes(i + 1)
                      ? 'bg-green-500'
                      : i + 1 === currentSet
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <Button 
            className="w-full mb-3" 
            onClick={completeSet}
            disabled={isRestTimerActive}
          >
            {isRestTimerActive 
              ? "Resting..." 
              : currentSet === exercise.sets && completedSets.length === exercise.sets - 1
              ? 'Complete Exercise'
              : `Complete Set ${currentSet}`}
          </Button>
        </>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={isFirst || isRestTimerActive}
          className={isFirst ? 'invisible' : ''}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={isLast || isRestTimerActive}
          className={isLast ? 'invisible' : ''}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default WorkoutExercise;
