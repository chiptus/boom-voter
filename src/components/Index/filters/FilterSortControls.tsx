
import { useState, useEffect } from "react";
import type { SortOption, FilterSortState } from "@/hooks/useUrlState";
import { useGenres } from "@/hooks/queries/useGenresQuery";
import { useGroups } from "@/hooks/useGroups";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, RefreshCw } from "lucide-react";
import { SortControls } from "./SortControls";
import { MobileFilters } from "./MobileFilters";
import { DesktopFilters } from "./DesktopFilters";
import { MainViewToggle } from "./MainViewToggle";
import { TimeFormatToggle } from "./TimeFormatToggle";

interface FilterSortControlsProps {
  state: FilterSortState;
  onStateChange: (updates: Partial<FilterSortState>) => void;
  onClear: () => void;
}

export const FilterSortControls = ({ state, onStateChange, onClear }: FilterSortControlsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { genres } = useGenres();
  const { groups } = useGroups();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSortChange = (sort: SortOption) => {
    onStateChange({ sort, sortLocked: false });
  };

  const handleRefreshRankings = () => {
    onStateChange({ sortLocked: false });
  };

  const hasActiveFilters = state.stages.length > 0 || state.genres.length > 0 || state.minRating > 0 || state.groupId;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-purple-400/30 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <SortControls 
          sort={state.sort}
          onSortChange={handleSortChange}
        />
        <div className="flex items-center gap-4">
          {state.sortLocked && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshRankings}
              className="text-orange-300 border-orange-400/50 hover:bg-orange-400/20 hover:text-orange-200 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Rankings
            </Button>
          )}
          <TimeFormatToggle
            use24Hour={state.use24Hour}
            onChange={(use24Hour) => onStateChange({ use24Hour })}
          />
          <MainViewToggle
            mainView={state.mainView}
            onMainViewChange={(mainView) => onStateChange({ mainView })}
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
                {state.stages.length + state.genres.length + (state.minRating > 0 ? 1 : 0) + (state.groupId ? 1 : 0)}
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
      </div>

      {isMobile && isExpanded && (
        <MobileFilters 
          state={state}
          genres={genres}
          groups={groups}
          onStateChange={onStateChange}
          onClear={onClear}
        />
      )}

      {!isMobile && isExpanded && (
        <DesktopFilters 
          state={state}
          genres={genres}
          groups={groups}
          onStateChange={onStateChange}
          onClear={onClear}
        />
      )}
    </div>
  );
};
