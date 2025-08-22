import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ViewToggle } from "./ViewToggle";
import { DayFilterSelect } from "./DayFilterSelect";
import { TimeFilterSelect } from "./TimeFilterSelect";
import { StageFilterButtons } from "./StageFilterButtons";
import { useTimelineUrlState } from "@/hooks/useTimelineUrlState";

export function TimelineFilters() {
  const [isExpanded, setIsExpanded] = useState(false);

  const isMobile = useIsMobile();
  const { state, updateState, clearFilters } = useTimelineUrlState();
  const { timelineView, selectedDay, selectedTime, selectedStages } = state;

  function handleStageToggle(stageId: string) {
    const newStages = selectedStages.includes(stageId)
      ? selectedStages.filter((id) => id !== stageId)
      : [...selectedStages, stageId];
    updateState({ selectedStages: newStages });
  }

  const hasActiveFilters =
    selectedDay !== "all" ||
    selectedTime !== "all" ||
    selectedStages.length > 0;
  const activeFilterCount =
    (selectedDay !== "all" ? 1 : 0) +
    (selectedTime !== "all" ? 1 : 0) +
    selectedStages.length;

  // Auto-expand on desktop, collapsible on mobile
  const shouldShowFilters = !isMobile || isExpanded;

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Primary Controls Row */}
      <div className="bg-white/10 backdrop-blur-md border border-purple-400/30 rounded-lg p-4">
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <ViewToggle
            currentView={timelineView}
            onViewChange={(view) => updateState({ timelineView: view })}
          />

          {/* Spacer to push filters to right */}
          <div className="ml-auto" />

          {/* Filters Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 ${
              isExpanded
                ? "bg-purple-600/50 text-purple-100 hover:bg-purple-600/60"
                : "text-purple-300 hover:text-purple-100"
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden md:inline">Filters</span>
            {isMobile &&
              (isExpanded ? (
                <ChevronUp className="h-4 w-4 text-purple-300" />
              ) : (
                <ChevronDown className="h-4 w-4 text-purple-300" />
              ))}
            {hasActiveFilters && (
              <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full ml-1">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Expandable Filters */}
      {shouldShowFilters && (
        <div className="bg-white/10 backdrop-blur-md border border-purple-400/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-purple-300" />
              <span className="text-purple-100 font-medium">
                Timeline Filters
              </span>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <DayFilterSelect
              selectedDay={selectedDay}
              onDayChange={(day) => updateState({ selectedDay: day })}
            />
            <TimeFilterSelect
              selectedTime={selectedTime}
              onTimeChange={(time) => updateState({ selectedTime: time })}
            />
            <StageFilterButtons
              selectedStages={selectedStages}
              onStageToggle={handleStageToggle}
            />
          </div>
        </div>
      )}
    </div>
  );
}
