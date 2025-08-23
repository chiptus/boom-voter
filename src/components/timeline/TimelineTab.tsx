import { Timeline } from "@/components/timeline/horizontal/Timeline";
import { ListSchedule } from "@/components/timeline/list/ListSchedule";
import { TimelineFilters } from "./TimelineFilters";
import { useTimelineUrlState } from "@/hooks/useTimelineUrlState";

interface TimelineTabProps {
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

export function TimelineTab({ userVotes, onVote }: TimelineTabProps) {
  const { state } = useTimelineUrlState();
  const { timelineView } = state;

  return (
    <div className="space-y-3 md:space-y-6">
      <TimelineFilters />

      {timelineView === "horizontal" ? (
        <Timeline userVotes={userVotes} onVote={onVote} />
      ) : (
        <ListSchedule userVotes={userVotes} onVote={onVote} />
      )}
    </div>
  );
}
