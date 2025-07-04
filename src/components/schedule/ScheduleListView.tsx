import { ArtistScheduleBlock } from "./ArtistScheduleBlock";
import { DayDivider } from "./DayDivider";
import { useStreamingTimeline } from "@/hooks/useStreamingTimeline";

interface ScheduleListViewProps {
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

export const ScheduleListView = ({ userVotes, onVote }: ScheduleListViewProps) => {
  const { streamingItems, loading, error } = useStreamingTimeline();

  if (loading) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>Loading schedule...</p>
      </div>
    );
  }

  if (error || streamingItems.length === 0) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>No performances scheduled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {streamingItems.map((item, index) => {
        if (item.type === 'day-divider') {
          return (
            <DayDivider
              key={item.id}
              displayDate={item.displayDate!}
              isFirst={index === 0}
            />
          );
        }

        return (
          <ArtistScheduleBlock
            key={item.id}
            artist={item.artist!}
            userVote={userVotes[item.artist!.id]}
            onVote={onVote}
            compact={true}
          />
        );
      })}
    </div>
  );
};