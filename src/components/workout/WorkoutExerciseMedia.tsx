
import { 
  Video,
  Image as ImageIcon,
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
import { Button } from "@/components/ui/button";

interface WorkoutExerciseMediaProps {
  mediaUrl: string | undefined;
  exerciseName: string;
}

export const getMediaType = (url: string): 'youtube' | 'vimeo' | 'video' | 'image' => {
  if (!url) return 'image';
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  
  if (url.includes('vimeo.com')) {
    return 'vimeo';
  }
  
  const videoExtensions = ['.mp4', '.mov', '.webm', '.ogg', '.avi'];
  if (videoExtensions.some(ext => url.toLowerCase().endsWith(ext))) {
    return 'video';
  }
  
  return 'image';
};

export const getYouTubeEmbedUrl = (url: string) => {
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
};

export const getVimeoEmbedUrl = (url: string) => {
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1].split('?')[0].split('/')[0];
    return `https://player.vimeo.com/video/${videoId}`;
  }
  return url;
};

const ExerciseMediaContent = ({ mediaUrl, exerciseName }: { mediaUrl: string, exerciseName: string }) => {
  const mediaType = getMediaType(mediaUrl);
  
  switch (mediaType) {
    case 'youtube':
      const youtubeEmbedUrl = getYouTubeEmbedUrl(mediaUrl);
      return (
        <div className="w-full aspect-video">
          <iframe 
            src={youtubeEmbedUrl} 
            className="w-full h-full"
            title={`How to do ${exerciseName}`}
            allowFullScreen
          ></iframe>
        </div>
      );
      
    case 'vimeo':
      const vimeoEmbedUrl = getVimeoEmbedUrl(mediaUrl);
      return (
        <div className="w-full aspect-video">
          <iframe 
            src={vimeoEmbedUrl} 
            className="w-full h-full"
            title={`How to do ${exerciseName}`}
            allowFullScreen
          ></iframe>
        </div>
      );
      
    case 'video':
      return (
        <video 
          src={mediaUrl} 
          controls 
          className="w-full h-auto"
          controlsList="nodownload" 
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      );
      
    case 'image':
    default:
      return (
        <div className="flex justify-center">
          <img 
            src={mediaUrl} 
            alt={`How to do ${exerciseName}`} 
            className="max-w-full max-h-[70vh] object-contain"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>
      );
  }
};

const WorkoutExerciseMedia = ({ mediaUrl, exerciseName }: WorkoutExerciseMediaProps) => {
  if (!mediaUrl) return null;
  
  const mediaType = getMediaType(mediaUrl);
  const MediaIcon = mediaType === 'image' ? ImageIcon : Video;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-2 p-1 h-6 w-6">
                <MediaIcon className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{exerciseName}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <ExerciseMediaContent mediaUrl={mediaUrl} exerciseName={exerciseName} />
              </div>
              <a 
                href={mediaUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-sm text-blue-500 mt-2"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open in new tab
              </a>
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>
          <p>View exercise demonstration</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WorkoutExerciseMedia;
