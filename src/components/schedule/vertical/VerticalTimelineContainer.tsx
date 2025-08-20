import { useRef } from "react";
import { VerticalTimeScale } from "./VerticalTimeScale";
import { VerticalStageColumn } from "./VerticalStageColumn";
import type { VerticalTimelineData } from "@/lib/timelineCalculator";

interface VerticalTimelineContainerProps {
  timelineData: VerticalTimelineData;
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

export function VerticalTimelineContainer({
  timelineData,
  userVotes,
  onVote,
}: VerticalTimelineContainerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex">
      {/* Time Scale */}
      <VerticalTimeScale
        timeSlots={timelineData.timeSlots}
        totalHeight={timelineData.totalHeight}
      />

      {/* Stage Columns */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-8 overflow-x-auto overflow-y-hidden pl-4"
      >
        {timelineData.stages.map((stage) => (
          <VerticalStageColumn
            key={stage.name}
            stage={stage}
            totalHeight={timelineData.totalHeight}
            userVotes={userVotes}
            onVote={onVote}
          />
        ))}
      </div>
    </div>
  );
}