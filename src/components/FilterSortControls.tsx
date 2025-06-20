import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Filter, SortAsc } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { SortOption, FilterSortState } from "@/hooks/useUrlState";

interface FilterSortControlsProps {
  state: FilterSortState;
  onStateChange: (updates: Partial<FilterSortState>) => void;
  onClear: () => void;
}

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'popularity-desc', label: 'Most Popular' },
  { value: 'date-asc', label: 'By Date' },
] as const;

const STAGES = ['Alchemy Circle', 'Dance Temple', 'Sacred Fire', 'TBD', 'The Gardens'];

export const FilterSortControls = ({ state, onStateChange, onClear }: FilterSortControlsProps) => {
  const [genres, setGenres] = useState<Array<{ id: string; name: string }>>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    const { data, error } = await supabase
      .from('music_genres')
      .select('id, name')
      .order('name');
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load genres",
        variant: "destructive",
      });
    } else {
      setGenres(data || []);
    }
  };

  const handleStageToggle = (stage: string) => {
    const newStages = state.stages.includes(stage)
      ? state.stages.filter(s => s !== stage)
      : [...state.stages, stage];
    onStateChange({ stages: newStages });
  };

  const handleGenreToggle = (genreId: string) => {
    const newGenres = state.genres.includes(genreId)
      ? state.genres.filter(g => g !== genreId)
      : [...state.genres, genreId];
    onStateChange({ genres: newGenres });
  };

  const hasActiveFilters = state.stages.length > 0 || state.genres.length > 0 || state.minRating > 0;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-purple-400/30 rounded-lg p-4 space-y-4">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-purple-300" />
          <span className="text-purple-100 font-medium">Filters & Sort</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="bg-purple-600/50 text-purple-100">
              {state.stages.length + state.genres.length + (state.minRating > 0 ? 1 : 0)}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-purple-300 hover:text-purple-100"
        >
          {isExpanded ? 'Hide' : 'Show'} Filters
        </Button>
      </div>

      {/* Always visible sort dropdown */}
      <div className="flex items-center gap-2">
        <SortAsc className="h-4 w-4 text-purple-300" />
        <Select value={state.sort} onValueChange={(value: SortOption) => onStateChange({ sort: value })}>
          <SelectTrigger className="w-48 bg-white/10 border-purple-400/30 text-purple-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Expandable filters */}
      {isExpanded && (
        <div className="space-y-4 pt-2 border-t border-purple-400/20">
          {/* Stage Filter */}
          <div>
            <h4 className="text-sm font-medium text-purple-200 mb-2">Stages</h4>
            <div className="flex flex-wrap gap-2">
              {STAGES.map(stage => (
                <Button
                  key={stage}
                  variant={state.stages.includes(stage) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStageToggle(stage)}
                  className={state.stages.includes(stage) 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : "border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                  }
                >
                  {stage}
                </Button>
              ))}
            </div>
          </div>

          {/* Genre Filter */}
          <div>
            <h4 className="text-sm font-medium text-purple-200 mb-2">Genres</h4>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {genres.map(genre => (
                <Button
                  key={genre.id}
                  variant={state.genres.includes(genre.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleGenreToggle(genre.id)}
                  className={state.genres.includes(genre.id)
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                  }
                >
                  {genre.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h4 className="text-sm font-medium text-purple-200 mb-2">Minimum Rating</h4>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map(rating => (
                <Button
                  key={rating}
                  variant={state.minRating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => onStateChange({ minRating: rating })}
                  className={state.minRating === rating
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                  }
                >
                  {rating === 0 ? 'Any' : `${rating}+`}
                </Button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};