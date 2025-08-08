import { useMemo } from "react";
import { formatDateTime } from "@/lib/timeUtils";
import { format, startOfDay } from "date-fns";
import { useOfflineSetsData } from "./useOfflineSetsData";

export interface ScheduleDay {
  date: string;
  displayDate: string;
  stages: ScheduleStage[];
}

export interface ScheduleStage {
  name: string;
  artists: ScheduleSet[]; // Now represents sets, not individual artists
}

export interface ScheduleArtist {
  id: string;
  name: string;
  slug?: string;
  stage?: string;
  startTime?: Date;
  endTime?: Date;
  votes?: { vote_type: number; user_id: string }[];
  formattedTimeRange?: string | null;
  conflictsWith?: string[];
  position?: {
    top: number;
    height: number;
  };
}

// Schedule Set type for the new system
export interface ScheduleSet extends ScheduleArtist {
  artists: ScheduleArtist[];
}

export const useScheduleData = (use24Hour: boolean = false) => {
  const { sets, loading, error } = useOfflineSetsData();

  const scheduleDays = useMemo(() => {
    // Enhanced defensive checks
    if (!sets) {
      return [];
    }

    if (!Array.isArray(sets) || sets.length === 0) {
      return [];
    }

    // Filter sets with performance times and stages
    const performingSets = sets.filter(
      (set) => set.time_start && set.stages?.name,
    );

    // Parse and enhance set data
    const enhancedSets: ScheduleSet[] = performingSets.map((set) => {
      const startTime = set.time_start ? new Date(set.time_start) : undefined;
      const endTime = set.time_end ? new Date(set.time_end) : undefined;

      return {
        id: set.id,
        name: set.name,
        slug: set.slug,
        stage: set.stages?.name || "",
        startTime,
        endTime,
        votes: set.votes || [],
        formattedTimeRange: formatDateTime(set.time_start, use24Hour),
        artists: (set.artists || []).map((artist) => ({
          id: artist.id,
          name: artist.name,
          votes: artist.votes || [],
        })),
      };
    });

    // Group sets by day
    const dayGroups = enhancedSets.reduce(
      (acc, set) => {
        if (!set.startTime) return acc;

        const dayKey = format(startOfDay(set.startTime), "yyyy-MM-dd");
        if (!acc[dayKey]) {
          acc[dayKey] = [];
        }
        acc[dayKey].push(set);
        return acc;
      },
      {} as Record<string, ScheduleSet[]>,
    );

    // Convert to ScheduleDay format
    const scheduleDays: ScheduleDay[] = Object.entries(dayGroups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateKey, daySets]) => {
        const date = new Date(dateKey);

        // Group by stage
        const stageGroups = daySets.reduce(
          (acc, set) => {
            const stageName = set.stage || "Main Stage";
            if (!acc[stageName]) {
              acc[stageName] = [];
            }
            acc[stageName].push(set);
            return acc;
          },
          {} as Record<string, ScheduleSet[]>,
        );

        // Sort sets within each stage by time
        const stages: ScheduleStage[] = Object.entries(stageGroups).map(
          ([stageName, stageSets]) => ({
            name: stageName,
            artists: stageSets.sort((a, b) => {
              if (!a.startTime || !b.startTime) return 0;
              return a.startTime.getTime() - b.startTime.getTime();
            }),
          }),
        );

        return {
          date: dateKey,
          displayDate: format(date, "EEEE, MMM d"),
          stages: stages.sort((a, b) => a.name.localeCompare(b.name)),
        };
      });

    return scheduleDays;
  }, [sets, use24Hour]);

  const allStages = useMemo(() => {
    const stageSet = new Set<string>();
    scheduleDays.forEach((day) => {
      day.stages.forEach((stage) => {
        stageSet.add(stage.name);
      });
    });
    return Array.from(stageSet).sort();
  }, [scheduleDays]);

  return {
    scheduleDays,
    allStages,
    loading,
    error,
  };
};
