import { ScrollArea } from "@/components/ui/scroll-area";
import { ArtistScheduleBlock } from "./ArtistScheduleBlock";
import { format } from "date-fns";
import type { ScheduleDay } from "@/hooks/useScheduleData";

interface ScheduleTimelineViewProps {
  day: ScheduleDay;
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

export const ScheduleTimelineView = ({ day, userVotes, onVote }: ScheduleTimelineViewProps) => {
  if (!day || day.stages.length === 0) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>No performances scheduled for this day.</p>
      </div>
    );
  }

  // Flatten all artists from all stages and sort by time
  const allArtists = day.stages
    .flatMap(stage => stage.artists)
    .sort((a, b) => {
      if (!a.startTime || !b.startTime) return 0;
      return a.startTime.getTime() - b.startTime.getTime();
    });

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4 pr-4">
        {allArtists.map((artist) => (
          <div key={artist.id} className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-20 text-right">
              <div className="text-sm font-medium text-purple-300">
                {artist.startTime ? format(artist.startTime, 'HH:mm') : '--:--'}
              </div>
              {artist.endTime && (
                <div className="text-xs text-purple-400">
                  {format(artist.endTime, 'HH:mm')}
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0 w-2 flex justify-center">
              <div className="w-3 h-3 bg-purple-400 rounded-full mt-2"></div>
            </div>
            
            <div className="flex-1 pb-4">
              <ArtistScheduleBlock
                artist={artist}
                userVote={userVotes[artist.id]}
                onVote={onVote}
              />
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};