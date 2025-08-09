import { useMemo } from "react";
import { useScheduleData } from "@/hooks/useScheduleData";
import { calculateTimelineData } from "@/lib/timelineCalculator";
import { StageLabels } from "./StageLabels";
import { TimelineContainer } from "./TimelineContainer";
import { useFestivalEdition } from "@/contexts/FestivalEditionContext";
import { useEditionSetsQuery } from "@/hooks/queries/useEditionSetsQuery";

interface ScheduleHorizontalTimelineViewProps {
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

export function ScheduleHorizontalTimelineView({
  userVotes,
  onVote,
}: ScheduleHorizontalTimelineViewProps) {
  const { edition } = useFestivalEdition();
  const { data: editionSets = [], isLoading: setsLoading } =
    useEditionSetsQuery(edition?.id);
  const { scheduleDays, loading, error } = useScheduleData(editionSets);

  const timelineData = useMemo(
    () => calculateTimelineData(scheduleDays),
    [scheduleDays],
  );

  if (loading || setsLoading) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>Loading horizontal timeline...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>Error loading schedule.</p>
      </div>
    );
  }

  if (!timelineData) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>Schedule is not published yet.</p>
      </div>
    );
  }

  // Check if schedule is published
  if (!edition?.published) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>Schedule not yet published.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Unified Timeline Container */}
      <div className="relative bg-white/5 rounded-lg p-4">
        {/* Fixed Stage Labels Column */}
        <StageLabels stages={timelineData.stages} />

        {/* Scrollable Timeline Content */}
        <TimelineContainer
          timelineData={timelineData}
          userVotes={userVotes}
          onVote={onVote}
        />
      </div>
    </div>
  );
}
