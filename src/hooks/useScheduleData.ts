import { useMemo } from 'react';
import { useOfflineArtistData, type Artist } from './useOfflineArtistData';
import { formatDateTime } from '@/lib/timeUtils';
import { parse, isValid, format, startOfDay, isSameDay } from 'date-fns';

export interface ScheduleDay {
  date: string;
  displayDate: string;
  stages: ScheduleStage[];
}

export interface ScheduleStage {
  name: string;
  artists: ScheduleArtist[];
}

export interface ScheduleArtist extends Artist {
  startTime?: Date;
  endTime?: Date;
  formattedTimeRange?: string;
  conflictsWith?: string[];
  position?: {
    top: number;
    height: number;
  };
}

export const useScheduleData = (use24Hour: boolean = false) => {
  const { artists, loading, error } = useOfflineArtistData();

  const scheduleDays = useMemo(() => {
    
    
    // Enhanced defensive checks
    if (!artists) {
      
      return [];
    }
    
    if (!Array.isArray(artists) || artists.length === 0) {
      return [];
    }

    // Filter artists with performance times
    const performingArtists = artists.filter(artist => artist.time_start);

    // Parse and enhance artist data
    const enhancedArtists: ScheduleArtist[] = performingArtists.map(artist => {
      const startTime = artist.time_start ? new Date(artist.time_start) : undefined;
      const endTime = artist.time_end ? new Date(artist.time_end) : undefined;

      return {
        ...artist,
        startTime,
        endTime,
        formattedTimeRange: formatDateTime(artist.time_start, use24Hour),
      };
    });

    // Group artists by day
    const dayGroups = enhancedArtists.reduce((acc, artist) => {
      if (!artist.startTime) return acc;
      
      const dayKey = format(startOfDay(artist.startTime), 'yyyy-MM-dd');
      if (!acc[dayKey]) {
        acc[dayKey] = [];
      }
      acc[dayKey].push(artist);
      return acc;
    }, {} as Record<string, ScheduleArtist[]>);

    // Convert to ScheduleDay format
    const scheduleDays: ScheduleDay[] = Object.entries(dayGroups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateKey, dayArtists]) => {
        const date = new Date(dateKey);
        
        // Group by stage
        const stageGroups = dayArtists.reduce((acc, artist) => {
          const stageName = artist.stage || 'Main Stage';
          if (!acc[stageName]) {
            acc[stageName] = [];
          }
          acc[stageName].push(artist);
          return acc;
        }, {} as Record<string, ScheduleArtist[]>);

        // Sort artists within each stage by time
        const stages: ScheduleStage[] = Object.entries(stageGroups).map(([stageName, stageArtists]) => ({
          name: stageName,
          artists: stageArtists.sort((a, b) => {
            if (!a.startTime || !b.startTime) return 0;
            return a.startTime.getTime() - b.startTime.getTime();
          }),
        }));

        return {
          date: dateKey,
          displayDate: format(date, 'EEEE, MMM d'),
          stages: stages.sort((a, b) => a.name.localeCompare(b.name)),
        };
      });

    return scheduleDays;
  }, [artists, use24Hour]);

  const allStages = useMemo(() => {
    const stageSet = new Set<string>();
    scheduleDays.forEach(day => {
      day.stages.forEach(stage => {
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