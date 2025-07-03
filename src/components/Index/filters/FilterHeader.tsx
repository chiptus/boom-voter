
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import type { FilterSortState } from "@/components/Index/useUrlState";

interface FilterHeaderProps {
  state: FilterSortState;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  isMobile: boolean;
}

export const FilterHeader = ({ state, isExpanded, onToggleExpanded, isMobile }: FilterHeaderProps) => {
  const hasActiveFilters = state.stages.length > 0 || state.genres.length > 0 || state.minRating > 0;

  return (
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
          onClick={onToggleExpanded}
          className="text-purple-300 hover:text-purple-100"
        >
          {isExpanded ? 'Hide' : 'Show'} Filters
        </Button>
      )}
    </div>
  );
};
