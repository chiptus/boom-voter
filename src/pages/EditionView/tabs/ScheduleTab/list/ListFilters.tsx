import { useState } from "react";
import { DayFilterSelect } from "../DayFilterSelect";
import { TimeFilterSelect } from "../TimeFilterSelect";
import { StageFilterButtons } from "../StageFilterButtons";
import { useTimelineUrlState } from "@/hooks/useTimelineUrlState";
import { FilterToggle } from "@/components/filters/FilterToggle";
import { FilterContainer } from "@/components/filters/FilterContainer";

export function ListFilters() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { state, updateState, clearFilters } = useTimelineUrlState();
  const { selectedDay, selectedTime, selectedStages } = state;

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
    <FilterContainer>
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="text-purple-100 font-medium">Filters</h3>
        <div className="ml-auto" />

        <FilterToggle
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          label="Filters"
          onClearFilters={hasActiveFilters ? clearFilters : undefined}
        />
      </div>

      {shouldShowFilters && (
        <div className="mt-4">
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
    </FilterContainer>
  );
}
