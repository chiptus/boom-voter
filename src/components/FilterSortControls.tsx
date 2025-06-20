
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Filter, SortAsc, Check } from "lucide-react";
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
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGenres();
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
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

  const getGenreDisplayText = () => {
    if (state.genres.length === 0) {
      return "All Genres";
    } else if (state.genres.length === 1) {
      const selectedGenre = genres.find(g => g.id === state.genres[0]);
      return selectedGenre?.name || "1 genre selected";
    } else {
      return `${state.genres.length} genres selected`;
    }
  };

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
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-300 hover:text-purple-100"
          >
            {isExpanded ? 'Hide' : 'Show'} Filters
          </Button>
        )}
      </div>

      {/* Sort dropdown - always visible */}
      <div className="flex items-center gap-2">
        <SortAsc className="h-4 w-4 text-purple-300" />
        <Select value={state.sort} onValueChange={(value: SortOption) => onStateChange({ sort: value })}>
          <SelectTrigger className="w-48 bg-white/10 border-purple-400/30 text-purple-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-purple-400/30">
            {SORT_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value} className="text-purple-100">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile filters - multi-select dropdowns */}
      {isMobile ? (
        <div className="space-y-4">
          {/* Stage Filter Multi-Select */}
          <div>
            <h4 className="text-sm font-medium text-purple-200 mb-2">Stages</h4>
            <div className="relative">
              <Select>
                <SelectTrigger className="w-full bg-white/10 border-purple-400/30 text-purple-100">
                  <SelectValue>
                    {state.stages.length === 0 ? (
                      "All Stages"
                    ) : state.stages.length === 1 ? (
                      state.stages[0]
                    ) : (
                      `${state.stages.length} stages selected`
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-400/30">
                  {STAGES.map(stage => (
                    <SelectItem 
                      key={stage} 
                      value={stage} 
                      className="text-purple-100 cursor-pointer"
                      onSelect={(e) => {
                        e.preventDefault();
                        handleStageToggle(stage);
                      }}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className="w-4 h-4 flex items-center justify-center">
                          {state.stages.includes(stage) && <Check className="h-3 w-3" />}
                        </div>
                        <span>{stage}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Genre Filter Multi-Select */}
          <div>
            <h4 className="text-sm font-medium text-purple-200 mb-2">Genres</h4>
            <div className="relative">
              <Select>
                <SelectTrigger className="w-full bg-white/10 border-purple-400/30 text-purple-100">
                  <SelectValue>
                    {getGenreDisplayText()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-400/30">
                  {genres.map(genre => (
                    <SelectItem 
                      key={genre.id} 
                      value={genre.id} 
                      className="text-purple-100 cursor-pointer"
                      onSelect={(e) => {
                        e.preventDefault();
                        handleGenreToggle(genre.id);
                      }}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className="w-4 h-4 flex items-center justify-center">
                          {state.genres.includes(genre.id) && <Check className="h-3 w-3" />}
                        </div>
                        <span>{genre.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h4 className="text-sm font-medium text-purple-200 mb-2">Minimum Rating</h4>
            <Select value={state.minRating.toString()} onValueChange={(value) => onStateChange({ minRating: parseInt(value) })}>
              <SelectTrigger className="w-full bg-white/10 border-purple-400/30 text-purple-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-purple-400/30">
                <SelectItem value="0" className="text-purple-100">Any Rating</SelectItem>
                <SelectItem value="1" className="text-purple-100">1+ Rating</SelectItem>
                <SelectItem value="2" className="text-purple-100">2+ Rating</SelectItem>
                <SelectItem value="3" className="text-purple-100">3+ Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              className="w-full border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All Filters
            </Button>
          )}
        </div>
      ) : (
        /* Desktop filters - expandable buttons */
        isExpanded && (
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
        )
      )}
    </div>
  );
};
