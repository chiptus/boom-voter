import { useMemo } from 'react';
import { useScheduleData, type ScheduleArtist } from './useScheduleData';

export interface StreamingTimelineItem {
  type: 'day-divider' | 'artist';
  id: string;
  date?: string;
  displayDate?: string;
  artist?: ScheduleArtist;
  position: number;
}

export const useStreamingTimeline = () => {
  const { scheduleDays, loading, error } = useScheduleData();

  const streamingItems = useMemo(() => {
    console.log('useStreamingTimeline - Processing schedule days:', scheduleDays?.length || 0);
    if (!scheduleDays || scheduleDays.length === 0) {
      console.log('useStreamingTimeline - No schedule days available');
      return [];
    }

    const items: StreamingTimelineItem[] = [];
    let position = 0;

    scheduleDays.forEach((day) => {
      // Add day divider
      items.push({
        type: 'day-divider',
        id: `day-${day.date}`,
        date: day.date,
        displayDate: day.displayDate,
        position: position++,
      });

      // Flatten all artists from all stages for this day and sort by time
      const dayArtists = day.stages
        .flatMap(stage => stage.artists)
        .sort((a, b) => {
          if (!a.startTime || !b.startTime) return 0;
          return a.startTime.getTime() - b.startTime.getTime();
        });

      // Add artists
      dayArtists.forEach((artist) => {
        items.push({
          type: 'artist',
          id: `artist-${artist.id}`,
          artist,
          position: position++,
        });
      });
    });

    return items;
  }, [scheduleDays]);

  const totalArtists = useMemo(() => {
    return streamingItems.filter(item => item.type === 'artist').length;
  }, [streamingItems]);

  const totalDays = useMemo(() => {
    return streamingItems.filter(item => item.type === 'day-divider').length;
  }, [streamingItems]);

  return {
    streamingItems,
    totalArtists,
    totalDays,
    loading,
    error,
  };
};