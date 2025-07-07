import { useMemo } from "react";
import { format, differenceInMinutes, startOfDay } from "date-fns";
import { ArtistScheduleBlock } from "./ArtistScheduleBlock";
import { DaySelector } from "./DaySelector";
import { useScheduleData } from "@/hooks/useScheduleData";
import type { ScheduleDay, ScheduleArtist } from "@/hooks/useScheduleData";

interface HorizontalTimelineArtist extends ScheduleArtist {
  horizontalPosition?: {
    left: number;
    width: number;
  };
}

interface ScheduleHorizontalTimelineViewProps {
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

export const ScheduleHorizontalTimelineView = ({ userVotes, onVote }: ScheduleHorizontalTimelineViewProps) => {
  const { scheduleDays, loading, error } = useScheduleData();

  // Calculate time grid and positions
  const timelineData = useMemo(() => {
    if (!scheduleDays || scheduleDays.length === 0) return null;

    // Find the earliest and latest times across all days
    let earliestTime = new Date('2099-01-01');
    let latestTime = new Date('1900-01-01');

    scheduleDays.forEach(day => {
      day.stages.forEach(stage => {
        stage.artists.forEach(artist => {
          if (artist.startTime && artist.startTime < earliestTime) {
            earliestTime = artist.startTime;
          }
          if (artist.endTime && artist.endTime > latestTime) {
            latestTime = artist.endTime;
          }
        });
      });
    });

    // Create time grid (hourly intervals)
    const timeSlots = [];
    const startHour = earliestTime.getHours();
    const endHour = latestTime.getHours() + 1;
    
    for (let hour = startHour; hour <= endHour; hour++) {
      const timeSlot = new Date(earliestTime);
      timeSlot.setHours(hour, 0, 0, 0);
      timeSlots.push(timeSlot);
    }

    // Calculate positions for each artist
    const enhancedDays = scheduleDays.map(day => {
      const dayStart = startOfDay(new Date(day.date));
      dayStart.setHours(startHour, 0, 0, 0);

      const enhancedStages = day.stages.map(stage => ({
        ...stage,
        artists: stage.artists.map((artist): HorizontalTimelineArtist => {
          if (!artist.startTime || !artist.endTime) return artist;

          const startMinutes = differenceInMinutes(artist.startTime, dayStart);
          const duration = differenceInMinutes(artist.endTime, artist.startTime);
          
          // Calculate positions (1 minute = 2px)
          const left = (startMinutes * 2);
          const width = Math.max(duration * 2, 100); // Minimum width of 100px

          return {
            ...artist,
            horizontalPosition: {
              left,
              width
            }
          };
        })
      }));

      return {
        ...day,
        stages: enhancedStages
      };
    });

    return {
      timeSlots,
      days: enhancedDays,
      totalWidth: (endHour - startHour) * 120 // 120px per hour
    };
  }, [scheduleDays]);

  if (loading) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>Loading horizontal timeline...</p>
      </div>
    );
  }

  if (error || !timelineData) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>No performances scheduled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {timelineData.days.map((day) => (
        <div key={day.date} className="space-y-4">
          {/* Day Header */}
          <div className="flex items-center gap-4 border-b border-purple-400/30 pb-4">
            <h2 className="text-2xl font-bold text-white">{day.displayDate}</h2>
          </div>

          {/* Timeline Container */}
          <div className="relative bg-white/5 rounded-lg p-4 overflow-x-auto">
            {/* Time Scale */}
            <div className="flex items-center mb-6 relative" style={{ minWidth: timelineData.totalWidth }}>
              <div className="w-32 flex-shrink-0"></div> {/* Space for stage labels */}
              <div className="flex-1 relative">
                {timelineData.timeSlots.map((timeSlot, index) => (
                  <div
                    key={index}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${index * 120}px` }}
                  >
                    <div className="text-sm font-medium text-purple-300 mb-2">
                      {format(timeSlot, 'HH:mm')}
                    </div>
                    <div className="w-px h-4 bg-purple-400/30"></div>
                  </div>
                ))}
                {/* Horizontal grid line */}
                <div className="absolute top-8 left-0 right-0 h-px bg-purple-400/20"></div>
              </div>
            </div>

            {/* Stage Rows */}
            <div className="space-y-6">
              {day.stages.map((stage, stageIndex) => (
                <div key={stage.name} className="flex items-start gap-4">
                  {/* Stage Label */}
                  <div className="w-28 flex-shrink-0 text-right">
                    <div className="text-lg font-semibold text-white sticky left-0 bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-2 rounded-lg">
                      {stage.name}
                    </div>
                  </div>

                  {/* Timeline Track */}
                  <div 
                    className="flex-1 relative h-20 bg-white/5 rounded-lg border border-purple-400/20"
                    style={{ minWidth: timelineData.totalWidth }}
                  >
                    {stage.artists.map((artist) => {
                      if (!artist.horizontalPosition) return null;
                      
                      return (
                        <div
                          key={artist.id}
                          className="absolute top-2 h-16"
                          style={{
                            left: `${artist.horizontalPosition.left}px`,
                            width: `${artist.horizontalPosition.width}px`
                          }}
                        >
                          <div className="h-full">
                            <ArtistScheduleBlock
                              artist={artist}
                              userVote={userVotes[artist.id]}
                              onVote={onVote}
                              compact={true}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};