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

  // Calculate unified timeline data
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

    // Create unified time grid from festival start to end
    const timeSlots = [];
    const totalMinutes = differenceInMinutes(latestTime, earliestTime);
    const totalHours = Math.ceil(totalMinutes / 60);
    
    for (let i = 0; i <= totalHours; i++) {
      const timeSlot = new Date(earliestTime.getTime() + (i * 60 * 60 * 1000));
      timeSlots.push(timeSlot);
    }

    // Collect all artists from all days/stages into unified stage groups
    const allStageGroups: Record<string, HorizontalTimelineArtist[]> = {};
    
    scheduleDays.forEach(day => {
      day.stages.forEach(stage => {
        if (!allStageGroups[stage.name]) {
          allStageGroups[stage.name] = [];
        }
        
        // Calculate positions for artists relative to festival start
        const enhancedArtists = stage.artists.map((artist): HorizontalTimelineArtist => {
          if (!artist.startTime || !artist.endTime) return artist;

          const startMinutes = differenceInMinutes(artist.startTime, earliestTime);
          const duration = differenceInMinutes(artist.endTime, artist.startTime);
          
          // Calculate positions (1 minute = 2px)
          const left = startMinutes * 2;
          const width = Math.max(duration * 2, 100); // Minimum width of 100px

          return {
            ...artist,
            horizontalPosition: {
              left,
              width
            }
          };
        });
        
        allStageGroups[stage.name].push(...enhancedArtists);
      });
    });

    // Create unified stages array
    const unifiedStages = Object.entries(allStageGroups).map(([stageName, artists]) => ({
      name: stageName,
      artists: artists.sort((a, b) => {
        if (!a.startTime || !b.startTime) return 0;
        return a.startTime.getTime() - b.startTime.getTime();
      })
    }));

    return {
      timeSlots,
      stages: unifiedStages.sort((a, b) => a.name.localeCompare(b.name)),
      totalWidth: totalHours * 120, // 120px per hour
      festivalStart: earliestTime,
      festivalEnd: latestTime
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
      {/* Festival Timeline Header */}
      <div className="flex items-center gap-4 border-b border-purple-400/30 pb-4">
        <h2 className="text-2xl font-bold text-white">Festival Timeline</h2>
        <div className="text-purple-300">
          {format(timelineData.festivalStart, 'MMM d')} - {format(timelineData.festivalEnd, 'MMM d')}
        </div>
      </div>

      {/* Unified Timeline Container */}
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
                <div className="text-xs text-purple-400 mb-2">
                  {format(timeSlot, 'MMM d')}
                </div>
                <div className="w-px h-4 bg-purple-400/30"></div>
              </div>
            ))}
            {/* Horizontal grid line */}
            <div className="absolute top-12 left-0 right-0 h-px bg-purple-400/20"></div>
          </div>
        </div>

        {/* Stage Rows */}
        <div className="space-y-6">
          {timelineData.stages.map((stage) => (
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
  );
};