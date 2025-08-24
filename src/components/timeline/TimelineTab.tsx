import { Timeline } from "@/components/timeline/horizontal/Timeline";
import { ListSchedule } from "@/components/timeline/list/ListSchedule";
import { ListFilters } from "./ListFilters";
import { useTimelineUrlState } from "@/hooks/useTimelineUrlState";
import { ViewToggle } from "./ViewToggle";

interface TimelineTabProps {
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

export function TimelineTab({ userVotes, onVote }: TimelineTabProps) {
  const { state, updateState } = useTimelineUrlState();
  const { timelineView } = state;

  return (
    <div className="space-y-3 md:space-y-6">
      <ViewToggle
        currentView={timelineView}
        onViewChange={(timelineView) => updateState({ timelineView })}
      />

      {timelineView === "horizontal" ? (
        <Timeline userVotes={userVotes} onVote={onVote} />
      ) : (
        <>
          <ListFilters />
          <ListSchedule userVotes={userVotes} onVote={onVote} />
        </>
      )}
    </div>
  );
}
