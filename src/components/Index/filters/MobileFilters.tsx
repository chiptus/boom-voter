import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterSortState } from "@/hooks/useUrlState";
import { useStagesByEditionQuery } from "@/hooks/queries/stages/useStagesByEdition";

interface MobileFiltersProps {
  state: FilterSortState;
  genres: Array<{ id: string; name: string }>;
  onStateChange: (updates: Partial<FilterSortState>) => void;
  editionId: string;
}

export function MobileFilters({
  state,
  genres,
  onStateChange,
  editionId,
}: MobileFiltersProps) {
  const { data: stages = [], isLoading: stagesLoading } =
    useStagesByEditionQuery(editionId);

  function handleStageSelect(value: string) {
    if (value === "all") {
      onStateChange({ stages: [] });
    } else {
      onStateChange({ stages: [value] });
    }
  }

  function handleGenreSelect(value: string) {
    if (value === "all") {
      onStateChange({ genres: [] });
    } else {
      onStateChange({ genres: [value] });
    }
  }

  return (
    <div className="space-y-4">
      {/* Stage Filter Select */}
      <div>
        <h4 className="text-sm font-medium text-purple-200 mb-2">Stage</h4>
        <Select
          value={state.stages.length === 1 ? state.stages[0] : "all"}
          onValueChange={handleStageSelect}
        >
          <SelectTrigger className="w-full bg-white/10 border-purple-400/30 text-purple-100">
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-purple-400/30">
            <SelectItem value="all" className="text-purple-100">
              All Stages
            </SelectItem>
            {stagesLoading ? (
              <SelectItem value="loading" disabled className="text-purple-300">
                Loading stages...
              </SelectItem>
            ) : (
              stages.map((stage) => (
                <SelectItem
                  key={stage.id}
                  value={stage.id}
                  className="text-purple-100"
                >
                  {stage.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Genre Filter Select */}
      <div>
        <h4 className="text-sm font-medium text-purple-200 mb-2">Genre</h4>
        <Select
          value={state.genres.length === 1 ? state.genres[0] : "all"}
          onValueChange={handleGenreSelect}
        >
          <SelectTrigger className="w-full bg-white/10 border-purple-400/30 text-purple-100">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-purple-400/30">
            <SelectItem value="all" className="text-purple-100">
              All Genres
            </SelectItem>
            {genres.map((genre) => (
              <SelectItem
                key={genre.id}
                value={genre.id}
                className="text-purple-100"
              >
                {genre.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="text-sm font-medium text-purple-200 mb-2">
          Minimum Rating
        </h4>
        <Select
          value={state.minRating.toString()}
          onValueChange={(value) =>
            onStateChange({ minRating: parseInt(value) })
          }
        >
          <SelectTrigger className="w-full bg-white/10 border-purple-400/30 text-purple-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-purple-400/30">
            <SelectItem value="0" className="text-purple-100">
              Any Rating
            </SelectItem>
            <SelectItem value="1" className="text-purple-100">
              1+ Rating
            </SelectItem>
            <SelectItem value="2" className="text-purple-100">
              2+ Rating
            </SelectItem>
            <SelectItem value="3" className="text-purple-100">
              3+ Rating
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
