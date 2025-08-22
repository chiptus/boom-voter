import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { FilterSortState } from "@/hooks/useUrlState";
import { useStagesByEditionQuery } from "@/hooks/queries/stages/useStagesByEdition";

interface DesktopFiltersProps {
  state: FilterSortState;
  genres: Array<{ id: string; name: string }>;
  onStateChange: (updates: Partial<FilterSortState>) => void;
  onClear: () => void;
  editionId: string;
}

export function DesktopFilters({
  state,
  genres,
  onStateChange,
  onClear,
  editionId,
}: DesktopFiltersProps) {
  const { data: stages = [], isLoading: stagesLoading } =
    useStagesByEditionQuery(editionId);

  function handleStageToggle(stageId: string) {
    const newStages = state.stages.includes(stageId)
      ? state.stages.filter((s) => s !== stageId)
      : [...state.stages, stageId];
    onStateChange({ stages: newStages });
  }

  function handleGenreToggle(genreId: string) {
    const newGenres = state.genres.includes(genreId)
      ? state.genres.filter((g) => g !== genreId)
      : [...state.genres, genreId];
    onStateChange({ genres: newGenres });
  }

  const hasActiveFilters =
    state.stages.length > 0 || state.genres.length > 0 || state.minRating > 0;

  return (
    <div className="space-y-4">
      {/* Stage Filter */}
      <div>
        <h4 className="text-sm font-medium text-purple-200 mb-2">Stages</h4>
        <div className="flex flex-wrap gap-2">
          {stagesLoading ? (
            <div className="text-sm text-purple-300">Loading stages...</div>
          ) : (
            stages.map((stage) => (
              <Button
                key={stage.id}
                variant={
                  state.stages.includes(stage.id) ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleStageToggle(stage.id)}
                className={
                  state.stages.includes(stage.id)
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                }
              >
                {stage.name}
              </Button>
            ))
          )}
        </div>
      </div>

      {/* Genre Filter */}
      <div>
        <h4 className="text-sm font-medium text-purple-200 mb-2">Genres</h4>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {genres.map((genre) => (
            <Button
              key={genre.id}
              variant={state.genres.includes(genre.id) ? "default" : "outline"}
              size="sm"
              onClick={() => handleGenreToggle(genre.id)}
              className={
                state.genres.includes(genre.id)
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
        <h4 className="text-sm font-medium text-purple-200 mb-2">
          Minimum Rating
        </h4>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((rating) => (
            <Button
              key={rating}
              variant={state.minRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => onStateChange({ minRating: rating })}
              className={
                state.minRating === rating
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              }
            >
              {rating === 0 ? "Any" : `${rating}+`}
            </Button>
          ))}
        </div>
      </div>

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
}
