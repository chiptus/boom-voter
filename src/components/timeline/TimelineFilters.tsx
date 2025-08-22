import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  MapPin,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useStagesByEditionQuery } from "@/hooks/queries/stages/useStagesByEdition";
import { useFestivalEdition } from "@/contexts/FestivalEditionContext";
import { ViewToggle } from "./ViewToggle";
import type { TimelineView } from "@/hooks/useUrlState";

type DayFilter = "all" | "friday" | "saturday" | "sunday";
type TimeFilter = "all" | "morning" | "afternoon" | "evening";

interface TimelineFiltersProps {
  currentView: TimelineView;
  onViewChange: (view: TimelineView) => void;
}

export function TimelineFilters({
  currentView,
  onViewChange,
}: TimelineFiltersProps) {
  const [selectedDay, setSelectedDay] = useState<DayFilter>("all");
  const [selectedTime, setSelectedTime] = useState<TimeFilter>("all");
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const { edition } = useFestivalEdition();
  const { data: stages = [] } = useStagesByEditionQuery(edition?.id);
  const isMobile = useIsMobile();

  const handleStageToggle = (stageId: string) => {
    setSelectedStages((prev) =>
      prev.includes(stageId)
        ? prev.filter((id) => id !== stageId)
        : [...prev, stageId],
    );
  };

  const clearAllFilters = () => {
    setSelectedDay("all");
    setSelectedTime("all");
    setSelectedStages([]);
  };

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
          <ViewToggle currentView={currentView} onViewChange={onViewChange} />

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
                onClick={clearAllFilters}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {/* Day Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-purple-300" />
                <label className="text-sm font-medium text-purple-200">
                  Day
                </label>
              </div>
              <Select
                value={selectedDay}
                onValueChange={(value: DayFilter) => setSelectedDay(value)}
              >
                <SelectTrigger className="bg-white/10 border-purple-400/30 text-purple-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-400/30">
                  <SelectItem value="all" className="text-purple-100">
                    All Days
                  </SelectItem>
                  <SelectItem value="friday" className="text-purple-100">
                    Friday
                  </SelectItem>
                  <SelectItem value="saturday" className="text-purple-100">
                    Saturday
                  </SelectItem>
                  <SelectItem value="sunday" className="text-purple-100">
                    Sunday
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-purple-300" />
                <label className="text-sm font-medium text-purple-200">
                  Time
                </label>
              </div>
              <Select
                value={selectedTime}
                onValueChange={(value: TimeFilter) => setSelectedTime(value)}
              >
                <SelectTrigger className="bg-white/10 border-purple-400/30 text-purple-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-400/30">
                  <SelectItem value="all" className="text-purple-100">
                    All Day
                  </SelectItem>
                  <SelectItem value="morning" className="text-purple-100">
                    Morning (6-12)
                  </SelectItem>
                  <SelectItem value="afternoon" className="text-purple-100">
                    Afternoon (12-18)
                  </SelectItem>
                  <SelectItem value="evening" className="text-purple-100">
                    Evening (18-24)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stages Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-purple-300" />
                <label className="text-sm font-medium text-purple-200">
                  Stages
                </label>
              </div>
              <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                {stages.map((stage) => (
                  <Button
                    key={stage.id}
                    variant={
                      selectedStages.includes(stage.id) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleStageToggle(stage.id)}
                    className={
                      selectedStages.includes(stage.id)
                        ? "bg-purple-600 hover:bg-purple-700 text-xs"
                        : "border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white text-xs"
                    }
                  >
                    {stage.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
