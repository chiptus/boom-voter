import { differenceInMinutes } from "date-fns";
import type { ScheduleSet, ScheduleDay } from "@/hooks/useScheduleData";
import type { Stage } from "@/hooks/queries/stages/types";
import { sortStagesByOrder } from "@/lib/stageUtils";

export interface HorizontalTimelineSet extends ScheduleSet {
  horizontalPosition?: {
    left: number;
    width: number;
  };
}

export interface VerticalTimelineSet extends ScheduleSet {
  verticalPosition?: {
    top: number;
    height: number;
  };
}

export interface TimelineData {
  timeSlots: Date[];
  stages: Array<{
    name: string;
    color?: string;
    sets: HorizontalTimelineSet[];
  }>;
  totalWidth: number;
  festivalStart: Date;
  festivalEnd: Date;
}

export interface VerticalTimelineData {
  timeSlots: Date[];
  stages: Array<{
    name: string;
    color?: string;
    sets: VerticalTimelineSet[];
  }>;
  totalHeight: number;
  festivalStart: Date;
  festivalEnd: Date;
}

export function calculateTimelineData(
  festivalStartDate: Date,
  festivalEndDate: Date,
  scheduleDays: ScheduleDay[],
  stages: Stage[],
): TimelineData | null {
  if (!scheduleDays || scheduleDays.length === 0) return null;

  // Require festival dates to be provided
  if (!festivalStartDate || !festivalEndDate) {
    return null;
  }

  // Find the earliest set time from all scheduled sets
  const earliestSetTime = calculateEarliestSetTime(scheduleDays);
  const earliestTime = earliestSetTime || new Date(festivalStartDate);

  const latestSetTime = calculateLatestSetTime(scheduleDays);
  const latestTime = latestSetTime || new Date(festivalEndDate);

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
      const enhancedSets = stage.sets.map((set): HorizontalTimelineSet => {
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

  // Create unified stages array - stages will be sorted by stage_order then by name
  const unifiedStagesUnsorted = Object.entries(allStageGroups).map(
    ([stageName, sets]) => {
      const stage = stages.find((s) => s.name === stageName);
      return {
        name: stageName,
        color: stage?.color || undefined,
        stage_order: stage?.stage_order || 0,
        sets: sets.sort((a, b) => {
          if (!a.startTime || !b.startTime) return 0;
          return a.startTime.getTime() - b.startTime.getTime();
        }),
      };
    },
  );

  const unifiedStages = sortStagesByOrder(unifiedStagesUnsorted);

  return {
    timeSlots,
    stages: unifiedStages,
    totalWidth: totalHours * 120, // 120px per hour
    festivalStart: earliestTime,
    festivalEnd: latestTime,
  };
}
function calculateEarliestSetTime(scheduleDays: ScheduleDay[]) {
  let earliestSetTime: Date | null = null;

  scheduleDays.forEach((day) => {
    day.stages.forEach((stage) => {
      stage.sets.forEach((artist) => {
        if (artist.startTime) {
          if (!earliestSetTime || artist.startTime < earliestSetTime) {
            earliestSetTime = artist.startTime;
          }
        }
      });
    });
  });
  if (!earliestSetTime) {
    return null;
  }

  const earliestTime = new Date(earliestSetTime);
  earliestTime.setMinutes(0, 0, 0);

  return earliestTime;
}

function calculateLatestSetTime(scheduleDays: ScheduleDay[]) {
  let latestSetTime: Date | null = null;

  scheduleDays.forEach((day) => {
    day.stages.forEach((stage) => {
      stage.sets.forEach((artist) => {
        if (artist.endTime) {
          if (!latestSetTime || artist.endTime > latestSetTime) {
            latestSetTime = artist.endTime;
          }
        }
      });
    });
  });
  if (!latestSetTime) {
    return null;
  }

  const latestTime = new Date(latestSetTime);
  latestTime.setMinutes(59, 59, 999);

  return latestTime;
}

export function calculateVerticalTimelineData(
  festivalStartDate: Date,
  festivalEndDate: Date,
  scheduleDays: ScheduleDay[],
  stages: Stage[],
): VerticalTimelineData | null {
  if (!scheduleDays || scheduleDays.length === 0) return null;

  if (!festivalStartDate || !festivalEndDate) {
    return null;
  }

  const earliestSetTime = calculateEarliestSetTime(scheduleDays);
  const earliestTime = earliestSetTime || new Date(festivalStartDate);

  const latestSetTime = calculateLatestSetTime(scheduleDays);
  const latestTime = latestSetTime || new Date(festivalEndDate);

  const timeSlots = [];
  const totalMinutes = differenceInMinutes(latestTime, earliestTime);
  const totalHours = Math.ceil(totalMinutes / 60);

  for (let i = 0; i <= totalHours; i++) {
    const timeSlot = new Date(earliestTime.getTime() + i * 60 * 60 * 1000);
    timeSlots.push(timeSlot);
  }

  const allStageGroups: Record<string, VerticalTimelineSet[]> = {};

  scheduleDays.forEach((day) => {
    day.stages.forEach((stage) => {
      if (!allStageGroups[stage.name]) {
        allStageGroups[stage.name] = [];
      }

      const enhancedSets = stage.sets.map((set): VerticalTimelineSet => {
        if (!set.startTime || !set.endTime) return set;

        const startMinutes = differenceInMinutes(set.startTime, earliestTime);
        const duration = differenceInMinutes(set.endTime, set.startTime);

        // Calculate vertical positions (1 minute = 2px)
        const top = startMinutes * 2;
        const height = Math.max(duration * 2, 60); // Minimum height of 60px

        return {
          ...set,
          verticalPosition: {
            top,
            height,
          },
        };
      });

      allStageGroups[stage.name].push(...enhancedSets);
    });
  });

  const unifiedStagesUnsorted = Object.entries(allStageGroups).map(
    ([stageName, sets]) => {
      const stage = stages.find((s) => s.name === stageName);
      return {
        name: stageName,
        color: stage?.color || undefined,
        stage_order: stage?.stage_order || 0,
        sets: sets.sort((a, b) => {
          if (!a.startTime || !b.startTime) return 0;
          return a.startTime.getTime() - b.startTime.getTime();
        }),
      };
    },
  );

  const unifiedStages = sortStagesByOrder(unifiedStagesUnsorted);

  return {
    timeSlots,
    stages: unifiedStages,
    totalHeight: totalHours * 120, // 120px per hour
    festivalStart: earliestTime,
    festivalEnd: latestTime,
  };
}
