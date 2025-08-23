import { useState } from "react";
import { ViewToggle } from "./ViewToggle";
import { DayFilterSelect } from "./DayFilterSelect";
import { TimeFilterSelect } from "./TimeFilterSelect";
import { StageFilterButtons } from "./StageFilterButtons";
import { useTimelineUrlState } from "@/hooks/useTimelineUrlState";
import { FilterToggle } from "@/components/common/filters/FilterToggle";
import { FilterContainer } from "@/components/common/filters/FilterContainer";

export function TimelineFilters() {
  const [isExpanded, setIsExpanded] = useState(false);

  const { state, updateState, clearFilters } = useTimelineUrlState();
  const { timelineView, selectedDay, selectedTime, selectedStages } = state;

  function handleStageToggle(stageId: string) {
    const newStages = selectedStages.includes(stageId)
      ? selectedStages.filter((id) => id !== stageId)
      : [...selectedStages, stageId];
    updateState({ selectedStages: newStages });
  }

  const activeFilterCount =
    (selectedDay !== "all" ? 1 : 0) +
    (selectedTime !== "all" ? 1 : 0) +
    selectedStages.length;
  const hasActiveFilters = activeFilterCount > 0;

  const shouldShowFilters = isExpanded;

  return (
    <div className="space-y-3 md:space-y-4">
      <FilterContainer>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-full sm:w-auto">
            <ViewToggle
              currentView={timelineView}
              onViewChange={(view) => updateState({ timelineView: view })}
            />
          </div>

          <div className="ml-auto" />

          <FilterToggle
            isExpanded={isExpanded}
            onToggle={() => setIsExpanded(!isExpanded)}
            hasActiveFilters={hasActiveFilters}
            activeFilterCount={activeFilterCount}
            onClearFilters={hasActiveFilters ? clearFilters : undefined}
          />
        </div>
      </FilterContainer>

      {shouldShowFilters && (
        <FilterContainer>
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
        </FilterContainer>
      )}
    </div>
  );
}
