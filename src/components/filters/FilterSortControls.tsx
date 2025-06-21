
import { useState, useEffect } from "react";
import type { SortOption, FilterSortState } from "@/hooks/useUrlState";
import { useGenres } from "@/hooks/useGenres";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { SortControls } from "./SortControls";
import { MobileFilters } from "./MobileFilters";
import { DesktopFilters } from "./DesktopFilters";

interface FilterSortControlsProps {
  state: FilterSortState;
  onStateChange: (updates: Partial<FilterSortState>) => void;
  onClear: () => void;
}

export const FilterSortControls = ({ state, onStateChange, onClear }: FilterSortControlsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { genres } = useGenres();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSortChange = (sort: SortOption) => {
    onStateChange({ sort });
  };

  const hasActiveFilters = state.stages.length > 0 || state.genres.length > 0 || state.minRating > 0;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-purple-400/30 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <SortControls 
          sort={state.sort}
          onSortChange={handleSortChange}
        />
        {isMobile ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 ${
              isExpanded 
                ? 'bg-purple-600/50 text-purple-100 hover:bg-purple-600/60' 
                : 'text-purple-300 hover:text-purple-100'
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="bg-purple-800/50 text-purple-100 ml-1">
                {state.stages.length + state.genres.length + (state.minRating > 0 ? 1 : 0)}
              </Badge>
            )}
          </Button>
        ) : (
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

      {isMobile && isExpanded && (
        <MobileFilters 
          state={state}
          genres={genres}
          onStateChange={onStateChange}
          onClear={onClear}
        />
      )}

      {!isMobile && isExpanded && (
        <DesktopFilters 
          state={state}
          genres={genres}
          onStateChange={onStateChange}
          onClear={onClear}
        />
      )}
    </div>
  );
};
