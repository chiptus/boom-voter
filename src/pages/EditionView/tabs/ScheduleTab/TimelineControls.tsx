import { useState } from "react";
import { TimelineNavigation } from "./TimelineNavigation";
import { useTimelineUrlState } from "@/hooks/useTimelineUrlState";
import { FilterToggle } from "@/components/filters/FilterToggle";
import { FilterContainer } from "@/components/filters/FilterContainer";

export function TimelineControls() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { state, updateState, clearFilters } = useTimelineUrlState();
  const { selectedStages } = state;

  function handleStageToggle(stageId: string) {
    const newStages = selectedStages.includes(stageId)
      ? selectedStages.filter((id) => id !== stageId)
      : [...selectedStages, stageId];
    updateState({ selectedStages: newStages });
  }

  const activeFilterCount = selectedStages.length;
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <FilterContainer>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="ml-auto" />

        <FilterToggle
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          label="Navigation"
          onClearFilters={hasActiveFilters ? clearFilters : undefined}
        />
      </div>

      {isExpanded && (
        <div className="mt-4">
          <TimelineNavigation
            selectedStages={selectedStages}
            onStageToggle={handleStageToggle}
            onJumpToToday={() => {
              // TODO: Implement jump to today functionality
              console.log("Jump to today");
            }}
            onJumpToTime={(timeOfDay) => {
              // TODO: Implement jump to time functionality
              console.log("Jump to", timeOfDay);
            }}
          />
        </div>
      )}
    </FilterContainer>
  );
}
