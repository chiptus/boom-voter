import { ScrollArea } from "@/components/ui/scroll-area";
import { ArtistScheduleBlock } from "./ArtistScheduleBlock";
import type { ScheduleDay } from "@/hooks/useScheduleData";

interface ScheduleListViewProps {
  day: ScheduleDay;
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

export const ScheduleListView = ({ day, userVotes, onVote }: ScheduleListViewProps) => {
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
    <div className="space-y-4">
      {allArtists.map((artist) => (
        <ArtistScheduleBlock
          key={artist.id}
          artist={artist}
          userVote={userVotes[artist.id]}
          onVote={onVote}
          compact={true}
        />
      ))}
    </div>
  );
};