
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { FilterSortState } from "@/hooks/useUrlState";
import { STAGES } from "./constants";

interface DesktopFiltersProps {
  state: FilterSortState;
  genres: Array<{ id: string; name: string }>;
  groups: Array<{ id: string; name: string; member_count?: number }>;
  onStateChange: (updates: Partial<FilterSortState>) => void;
  onClear: () => void;
}

export const DesktopFilters = ({ state, genres, groups, onStateChange, onClear }: DesktopFiltersProps) => {
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

  const hasActiveFilters = state.stages.length > 0 || state.genres.length > 0 || state.minRating > 0 || state.groupId;

  return (
    <div className="space-y-4 pt-2 border-t border-purple-400/20">
      {/* Group Filter */}
      <div>
        <h4 className="text-sm font-medium text-purple-200 mb-2">Group</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!state.groupId ? "default" : "outline"}
            size="sm"
            onClick={() => onStateChange({ groupId: undefined })}
            className={!state.groupId
              ? "bg-purple-600 hover:bg-purple-700"
              : "border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
            }
          >
            All Groups
          </Button>
          {groups.map(group => (
            <Button
              key={group.id}
              variant={state.groupId === group.id ? "default" : "outline"}
              size="sm"
              onClick={() => onStateChange({ groupId: group.id })}
              className={state.groupId === group.id
                ? "bg-purple-600 hover:bg-purple-700"
                : "border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              }
            >
              {group.name} {group.member_count ? `(${group.member_count})` : ''}
            </Button>
          ))}
        </div>
      </div>

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
  );
};
