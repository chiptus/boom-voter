import { ScheduleHorizontalTimelineView } from "@/components/schedule/ScheduleHorizontalTimelineView";
import { MobileFirstVerticalTimeline } from "@/components/schedule/vertical/MobileFirstVerticalTimeline";
import { TimelineFilters } from "./TimelineFilters";
import { useUrlState } from "@/hooks/useUrlState";

interface TimelineTabProps {
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

export function TimelineTab({ userVotes, onVote }: TimelineTabProps) {
  const { state: urlState, updateUrlState } = useUrlState();
  const timelineView = urlState.timelineView;

  return (
    <div className="space-y-3 md:space-y-6">
      {/* Timeline Controls & Filters */}
      <TimelineFilters
        currentView={timelineView}
        onViewChange={(view) => updateUrlState({ timelineView: view })}
      />

      {/* Timeline Content */}
      {timelineView === "horizontal" ? (
        <ScheduleHorizontalTimelineView userVotes={userVotes} onVote={onVote} />
      ) : (
        <MobileFirstVerticalTimeline userVotes={userVotes} onVote={onVote} />
      )}
    </div>
  );
}
