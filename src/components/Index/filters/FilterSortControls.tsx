import { useState, useEffect } from "react";
import type { SortOption, FilterSortState } from "@/hooks/useUrlState";
import { useGenres } from "@/hooks/queries/genres/useGenres";
import { useGroups } from "@/hooks/useGroups";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Filter,
  RefreshCw,
  Users,
  Calendar,
  List,
  ChevronDown,
} from "lucide-react";
import { SortControls } from "./SortControls";
import { MobileFilters } from "./MobileFilters";
import { DesktopFilters } from "./DesktopFilters";

interface FilterSortControlsProps {
  state: FilterSortState;
  onStateChange: (updates: Partial<FilterSortState>) => void;
  onClear: () => void;
}

export function FilterSortControls({
  state,
  onStateChange,
  onClear,
}: FilterSortControlsProps) {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { genres } = useGenres();
  const { groups } = useGroups();

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  function handleSortChange(sort: SortOption) {
    onStateChange({ sort, sortLocked: false });
  }

  function handleRefreshRankings() {
    onStateChange({ sortLocked: false });
  }

  const hasActiveFilters =
    state.stages.length > 0 || state.genres.length > 0 || state.minRating > 0;
  const hasActiveGroupFilter = state.groupId;

  // Get the current group name for display
  const currentGroup = groups.find((g) => g.id === state.groupId);
  const groupDisplayText = currentGroup ? currentGroup.name : "All Votes";

  return (
    <div className="space-y-4">
      {/* Primary Controls Row */}
      <div className="bg-white/10 backdrop-blur-md border border-purple-400/30 rounded-lg p-4">
        <div className="flex items-center justify-between gap-2">
          {/* View Toggle - Always prominent */}
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-lg p-1">
            <Button
              variant={state.mainView === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onStateChange({ mainView: "list" })}
              className={
                state.mainView === "list"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "text-purple-200 hover:text-white hover:bg-white/10"
              }
            >
              <List className="h-4 w-4" />
              <span className="hidden md:inline ml-2">Artists</span>
            </Button>
            <Button
              variant={state.mainView === "timeline" ? "default" : "ghost"}
              size="sm"
              onClick={() => onStateChange({ mainView: "timeline" })}
              className={
                state.mainView === "timeline"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "text-purple-200 hover:text-white hover:bg-white/10"
              }
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline ml-2">Timeline</span>
            </Button>
          </div>

          {/* Context-Aware Controls */}
          <div className="flex items-center gap-2">
            {/* Sort Controls - Only show in list view */}
            {state.mainView === "list" && (
              <SortControls sort={state.sort} onSortChange={handleSortChange} />
            )}

            {/* Refresh Rankings - Only show when locked */}
            {state.sortLocked && state.mainView === "list" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshRankings}
                className="text-orange-300 border-orange-400/50 hover:bg-orange-400/20 hover:text-orange-200 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden md:inline">Refresh</span>
              </Button>
            )}

            {/* Group Filter Dropdown - Always visible */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-2 ${
                    hasActiveGroupFilter
                      ? "bg-purple-600/20 border-purple-400 text-purple-200 hover:bg-purple-600/30"
                      : "border-purple-400/30 text-purple-300 hover:bg-white/10 hover:text-purple-200"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden md:inline">{groupDisplayText}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-purple-400/30">
                <DropdownMenuItem
                  onClick={() => onStateChange({ groupId: undefined })}
                  className={`text-purple-100 hover:bg-purple-600/30 ${!state.groupId ? "bg-purple-600/20" : ""}`}
                >
                  All Votes
                </DropdownMenuItem>
                {groups.map((group) => (
                  <DropdownMenuItem
                    key={group.id}
                    onClick={() => onStateChange({ groupId: group.id })}
                    className={`text-purple-100 hover:bg-purple-600/30 ${state.groupId === group.id ? "bg-purple-600/20" : ""}`}
                  >
                    {group.name}
                    {group.member_count && (
                      <span className="text-purple-400 ml-2">
                        ({group.member_count})
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filters Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className={`flex items-center gap-2 ${
                isFiltersExpanded
                  ? "bg-purple-600/50 text-purple-100 hover:bg-purple-600/60"
                  : "text-purple-300 hover:text-purple-100"
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden md:inline">Filters</span>
              {hasActiveFilters && (
                <Badge
                  variant="secondary"
                  className="bg-purple-800/50 text-purple-100 ml-1"
                >
                  {state.stages.length +
                    state.genres.length +
                    (state.minRating > 0 ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Other Filters */}
      {isFiltersExpanded && (
        <div className="bg-white/10 backdrop-blur-md border border-purple-400/30 rounded-lg p-4">
          {isMobile ? (
            <MobileFilters
              state={state}
              genres={genres}
              groups={groups}
              onStateChange={onStateChange}
              onClear={onClear}
            />
          ) : (
            <DesktopFilters
              state={state}
              genres={genres}
              groups={groups}
              onStateChange={onStateChange}
              onClear={onClear}
            />
          )}
        </div>
      )}
    </div>
  );
}
