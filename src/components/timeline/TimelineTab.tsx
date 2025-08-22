import { ScheduleHorizontalTimelineView } from "@/components/schedule/ScheduleHorizontalTimelineView";
import { MobileFirstVerticalTimeline } from "@/components/schedule/vertical/MobileFirstVerticalTimeline";
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
        <ScheduleHorizontalTimelineView userVotes={userVotes} onVote={onVote} />
      ) : (
        <MobileFirstVerticalTimeline userVotes={userVotes} onVote={onVote} />
      )}
    </div>
  );
}
