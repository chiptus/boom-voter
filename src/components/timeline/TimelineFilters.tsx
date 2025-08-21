import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, MapPin, Filter, X } from "lucide-react";
import { useStagesByEditionQuery } from "@/hooks/queries/stages/useStagesByEdition";
import { useFestivalEdition } from "@/contexts/FestivalEditionContext";

type DayFilter = "all" | "friday" | "saturday" | "sunday";
type TimeFilter = "all" | "morning" | "afternoon" | "evening";

export function TimelineFilters() {
  const [selectedDay, setSelectedDay] = useState<DayFilter>("all");
  const [selectedTime, setSelectedTime] = useState<TimeFilter>("all");
  const [selectedStages, setSelectedStages] = useState<string[]>([]);

  const { edition } = useFestivalEdition();
  const { data: stages = [] } = useStagesByEditionQuery(edition?.id);

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

  return (
    <div className="bg-white/5 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-purple-300" />
          <span className="text-purple-100 font-medium">Timeline Filters</span>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Day Filter */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-purple-300" />
            <label className="text-sm font-medium text-purple-200">Day</label>
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
            <label className="text-sm font-medium text-purple-200">Time</label>
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
  );
}
