import { useMemo } from "react";
import { useScheduleData } from "@/hooks/useScheduleData";
import { calculateTimelineData } from "@/lib/timelineCalculator";
import { StageLabels } from "./StageLabels";
import { TimelineContainer } from "./TimelineContainer";
import { useFestivalEdition } from "@/contexts/FestivalEditionContext";
import { useSetsByEditionQuery as useEditionSetsQuery } from "@/hooks/queries/sets/useSetsByEdition";
import { useTimelineUrlState } from "@/hooks/useTimelineUrlState";
import { format } from "date-fns";
import { useStagesByEditionQuery } from "@/hooks/queries/stages/useStagesByEdition";

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
  const stagesQuery = useStagesByEditionQuery(edition?.id);

  const { scheduleDays, loading, error } = useScheduleData(
    editionSets,
    stagesQuery.data,
  );
  const { state: filters } = useTimelineUrlState();
  const { selectedDay, selectedTime, selectedStages } = filters;

  const timelineData = useMemo(() => {
    if (!edition || !edition.start_date || !edition.end_date) {
      return null;
    }

    // Apply filters to scheduleDays
    const filteredScheduleDays = scheduleDays.map((day) => {
      // Filter by day
      if (selectedDay !== "all") {
        const dayDate = format(day.date, "yyyy-MM-dd");
        if (dayDate !== selectedDay) {
          return { ...day, stages: [] }; // Empty day if not selected
        }
      }

      // Filter stages and sets
      const filteredStages = day.stages
        .filter((stage) => {
          // Filter by stage
          if (selectedStages.length > 0 && !selectedStages.includes(stage.id)) {
            return false;
          }
          return true;
        })
        .map((stage) => ({
          ...stage,
          sets: stage.sets.filter((set) => {
            // Filter by time
            if (selectedTime !== "all" && set.startTime) {
              const hour = set.startTime.getHours();
              switch (selectedTime) {
                case "morning":
                  return hour >= 6 && hour < 12;
                case "afternoon":
                  return hour >= 12 && hour < 18;
                case "evening":
                  return hour >= 18 && hour < 24;
                default:
                  return true;
              }
            }
            return true;
          }),
        }));

      return { ...day, stages: filteredStages };
    });

    return calculateTimelineData(
      new Date(edition.start_date),
      new Date(edition.end_date),
      filteredScheduleDays,
    );
  }, [edition, scheduleDays, selectedDay, selectedTime, selectedStages]);

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
        <p>Festival dates not available yet.</p>
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
