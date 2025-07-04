import { ScrollArea } from "@/components/ui/scroll-area";
import { ArtistScheduleBlock } from "./ArtistScheduleBlock";
import type { ScheduleDay } from "@/hooks/useScheduleData";

interface ScheduleGridViewProps {
  day: ScheduleDay;
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

export const ScheduleGridView = ({ day, userVotes, onVote }: ScheduleGridViewProps) => {
  if (!day || day.stages.length === 0) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>No performances scheduled for this day.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {day.stages.map((stage) => (
        <div key={stage.name} className="space-y-4">
          <h3 className="text-2xl font-bold text-white border-b border-purple-400/30 pb-2">
            {stage.name}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stage.artists.map((artist) => (
              <ArtistScheduleBlock
                key={artist.id}
                artist={artist}
                userVote={userVotes[artist.id]}
                onVote={onVote}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};