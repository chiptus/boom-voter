
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import type { FilterSortState } from "@/components/Index/useUrlState";
import { STAGES } from "./constants";

interface MobileFiltersProps {
  state: FilterSortState;
  genres: Array<{ id: string; name: string }>;
  groups: Array<{ id: string; name: string; member_count?: number }>;
  onStateChange: (updates: Partial<FilterSortState>) => void;
  onClear: () => void;
}

export const MobileFilters = ({ state, genres, groups, onStateChange, onClear }: MobileFiltersProps) => {
  const handleStageSelect = (value: string) => {
    if (value === 'all') {
      onStateChange({ stages: [] });
    } else {
      onStateChange({ stages: [value] });
    }
  };

  const handleGenreSelect = (value: string) => {
    if (value === 'all') {
      onStateChange({ genres: [] });
    } else {
      onStateChange({ genres: [value] });
    }
  };

  const hasActiveFilters = state.stages.length > 0 || state.genres.length > 0 || state.minRating > 0 || state.groupId;

  return (
    <div className="space-y-4">
      {/* Group Filter Select */}
      <div>
        <h4 className="text-sm font-medium text-purple-200 mb-2">Group</h4>
        <Select value={state.groupId || "all"} onValueChange={(value) => onStateChange({ groupId: value === "all" ? undefined : value })}>
          <SelectTrigger className="w-full bg-white/10 border-purple-400/30 text-purple-100">
            <SelectValue placeholder="All Groups" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-purple-400/30">
            <SelectItem value="all" className="text-purple-100">All Groups</SelectItem>
            {groups.map(group => (
              <SelectItem key={group.id} value={group.id} className="text-purple-100">
                {group.name} {group.member_count ? `(${group.member_count})` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stage Filter Select */}
      <div>
        <h4 className="text-sm font-medium text-purple-200 mb-2">Stage</h4>
        <Select value={state.stages.length === 1 ? state.stages[0] : 'all'} onValueChange={handleStageSelect}>
          <SelectTrigger className="w-full bg-white/10 border-purple-400/30 text-purple-100">
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-purple-400/30">
            <SelectItem value="all" className="text-purple-100">All Stages</SelectItem>
            {STAGES.map(stage => (
              <SelectItem key={stage} value={stage} className="text-purple-100">
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Genre Filter Select */}
      <div>
        <h4 className="text-sm font-medium text-purple-200 mb-2">Genre</h4>
        <Select value={state.genres.length === 1 ? state.genres[0] : 'all'} onValueChange={handleGenreSelect}>
          <SelectTrigger className="w-full bg-white/10 border-purple-400/30 text-purple-100">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-purple-400/30">
            <SelectItem value="all" className="text-purple-100">All Genres</SelectItem>
            {genres.map(genre => (
              <SelectItem key={genre.id} value={genre.id} className="text-purple-100">
                {genre.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
  );
};
