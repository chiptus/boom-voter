import { useMemo } from "react";
import { useScheduleData } from "@/hooks/useScheduleData";
import { calculateVerticalTimelineData } from "@/lib/timelineCalculator";
import { VerticalStageLabels } from "./VerticalStageLabels";
import { VerticalTimelineContainer } from "./VerticalTimelineContainer";
import { useFestivalEdition } from "@/contexts/FestivalEditionContext";
import { useSetsByEditionQuery as useEditionSetsQuery } from "@/hooks/queries/sets/useSetsByEdition";

interface ScheduleVerticalTimelineViewProps {
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

export function ScheduleVerticalTimelineView({
  userVotes,
  onVote,
}: ScheduleVerticalTimelineViewProps) {
  const { edition } = useFestivalEdition();
  const { data: editionSets = [], isLoading: setsLoading } =
    useEditionSetsQuery(edition?.id);
  const { scheduleDays, loading, error } = useScheduleData(editionSets);

  const timelineData = useMemo(() => {
    if (!edition || !edition.start_date || !edition.end_date) {
      return null;
    }
    return calculateVerticalTimelineData(
      new Date(edition.start_date),
      new Date(edition.end_date),
      scheduleDays,
    );
  }, [edition, scheduleDays]);

  if (loading || setsLoading) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>Loading vertical timeline...</p>
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
        <p>Festival dates not available yet.</p>
      </div>
    );
  }

  if (!edition?.published) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>Schedule not yet published.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative bg-white/5 rounded-lg p-4">
        <VerticalStageLabels stages={timelineData.stages} />
        
        <VerticalTimelineContainer
          timelineData={timelineData}
          userVotes={userVotes}
          onVote={onVote}
        />
      </div>
    </div>
  );
}