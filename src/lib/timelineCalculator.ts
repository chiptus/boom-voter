import { differenceInMinutes } from "date-fns";
import type { ScheduleSet, ScheduleDay } from "@/hooks/useScheduleData";

export interface HorizontalTimelineSet extends ScheduleSet {
  horizontalPosition?: {
    left: number;
    width: number;
  };
}

export interface TimelineData {
  timeSlots: Date[];
  stages: Array<{
    name: string;
    artists: HorizontalTimelineSet[];
  }>;
  totalWidth: number;
  festivalStart: Date;
  festivalEnd: Date;
}

export function calculateTimelineData(
  festivalStartDate: Date,
  festivalEndDate: Date,
  scheduleDays: ScheduleDay[],
): TimelineData | null {
  if (!scheduleDays || scheduleDays.length === 0) return null;

  // Require festival dates to be provided
  if (!festivalStartDate || !festivalEndDate) {
    return null;
  }

  const earliestTime = new Date(festivalStartDate);
  const latestTime = new Date(festivalEndDate);

  // Create unified time grid from festival start to end
  const timeSlots = [];
  const totalMinutes = differenceInMinutes(latestTime, earliestTime);
  const totalHours = Math.ceil(totalMinutes / 60);

  for (let i = 0; i <= totalHours; i++) {
    const timeSlot = new Date(earliestTime.getTime() + i * 60 * 60 * 1000);
    timeSlots.push(timeSlot);
  }

  // Collect all sets from all days/stages into unified stage groups
  const allStageGroups: Record<string, HorizontalTimelineSet[]> = {};

  scheduleDays.forEach((day) => {
    day.stages.forEach((stage) => {
      if (!allStageGroups[stage.name]) {
        allStageGroups[stage.name] = [];
      }

      // Calculate positions for sets relative to festival start
      const enhancedSets = stage.artists.map((set): HorizontalTimelineSet => {
        if (!set.startTime || !set.endTime) return set;

        const startMinutes = differenceInMinutes(set.startTime, earliestTime);
        const duration = differenceInMinutes(set.endTime, set.startTime);

        // Calculate positions (1 minute = 2px)
        const left = startMinutes * 2;
        const width = Math.max(duration * 2, 100); // Minimum width of 100px

        return {
          ...set,
          horizontalPosition: {
            left,
            width,
          },
        };
      });

      allStageGroups[stage.name].push(...enhancedSets);
    });
  });

  // Create unified stages array - stages will be sorted alphabetically by default
  const unifiedStages = Object.entries(allStageGroups)
    .map(([stageName, sets]) => ({
      name: stageName,
      artists: sets.sort((a, b) => {
        if (!a.startTime || !b.startTime) return 0;
        return a.startTime.getTime() - b.startTime.getTime();
      }),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    timeSlots,
    stages: unifiedStages,
    totalWidth: totalHours * 120, // 120px per hour
    festivalStart: earliestTime,
    festivalEnd: latestTime,
  };
}
