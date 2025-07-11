
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
import { VotePerspectiveSelector } from "./VotePerspectiveSelector";
import { FestivalModeToggle } from "./FestivalModeToggle";

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

  const hasActiveFilters = state.stages.length > 0 || state.genres.length > 0 || state.minRating > 0;
  const hasVotePerspective = state.votePerspective;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-purple-400/30 rounded-lg p-4 space-y-4">
      {/* Festival Mode and Main Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <FestivalModeToggle 
            onModeChange={(isFestivalMode) => {
              // Auto-suggest timeline during festival mode
              if (isFestivalMode && state.mainView === 'list') {
                onStateChange({ mainView: 'timeline' });
              }
            }}
          />
          <MainViewToggle
            mainView={state.mainView}
            onMainViewChange={(mainView) => onStateChange({ mainView })}
          />
        </div>
        
        <div className="flex items-center gap-4">
          <TimeFormatToggle
            use24Hour={state.use24Hour}
            onChange={(use24Hour) => onStateChange({ use24Hour })}
          />
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
        </div>
      </div>

      {/* Sort Controls - Only show for Artists List */}
      {state.mainView === 'list' && (
        <div className="border-t border-purple-400/20 pt-4">
          <SortControls 
            sort={state.sort}
            onSortChange={handleSortChange}
          />
        </div>
      )}

      {/* Vote Perspective */}
      <div className="border-t border-purple-400/20 pt-4">
        <VotePerspectiveSelector
          selectedGroupId={state.votePerspective}
          groups={groups}
          onGroupChange={(votePerspective) => onStateChange({ votePerspective })}
          isMobile={isMobile}
        />
      </div>

      {/* Filters Toggle */}
      <div className="flex items-center justify-between border-t border-purple-400/20 pt-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-purple-200">Artist Filters</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="bg-purple-800/50 text-purple-100">
              {state.stages.length + state.genres.length + (state.minRating > 0 ? 1 : 0)}
            </Badge>
          )}
        </div>
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
          {isExpanded ? 'Hide' : 'Show'} Filters
        </Button>
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
