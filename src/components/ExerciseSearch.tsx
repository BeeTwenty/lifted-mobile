
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dumbbell, Plus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ExerciseTemplate {
  id: string;
  name: string;
  description: string;
  target_muscle: string | null;
}

interface ExerciseSearchProps {
  onSelectExercise: (exercise: { id: string; name: string }) => void;
  selectedExercises?: { id: string; name: string }[];
}

const ExerciseSearch = ({ onSelectExercise, selectedExercises = [] }: ExerciseSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ExerciseTemplate[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    try {
      setIsSearching(true);
      setHasSearched(true);
      
      const { data, error } = await supabase
        .from('exercise_templates')
        .select('id, name, description, target_muscle')
        .ilike('name', `%${searchQuery}%`)
        .order('name', { ascending: true })
        .limit(10);
      
      if (error) throw error;
      
      setSearchResults(data || []);
    } catch (error: any) {
      console.error('Error searching exercises:', error);
      toast.error('Failed to search exercises');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const isExerciseSelected = (id: string) => {
    return selectedExercises.some(ex => ex.id === id);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button 
          type="button"
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
        >
          {isSearching ? (
            <div className="animate-spin h-5 w-5 border-2 border-b-transparent rounded-full" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {hasSearched && (
        <div className="rounded-md border bg-background">
          {isSearching ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="divide-y">
              {searchResults.map((exercise) => (
                <div 
                  key={exercise.id} 
                  className="p-3 flex justify-between items-center hover:bg-gray-50"
                >
                  <div>
                    <h4 className="font-medium">{exercise.name}</h4>
                    <p className="text-xs text-gray-500">
                      {exercise.target_muscle && (
                        <span className="font-medium">{exercise.target_muscle}</span>
                      )}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={isExerciseSelected(exercise.id) ? "secondary" : "ghost"}
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => onSelectExercise({ id: exercise.id, name: exercise.name })}
                    disabled={isExerciseSelected(exercise.id)}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Dumbbell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No exercises found</p>
              <p className="text-gray-400 text-sm">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseSearch;
