import { useRef } from "react";
import { TimeScale } from "./TimeScale";
import { StageRow } from "./StageRow";
import type { TimelineData } from "@/lib/timelineCalculator";

interface TimelineContainerProps {
  timelineData: TimelineData;
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

export function TimelineContainer({
  timelineData,
  userVotes,
  onVote,
}: TimelineContainerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-x-auto overflow-y-hidden pb-20"
      style={{ paddingLeft: "144px" }}
    >
      {/* Time Scale */}
      <TimeScale
        timeSlots={timelineData.timeSlots}
        totalWidth={timelineData.totalWidth}
        scrollContainerRef={scrollContainerRef}
      />

      {/* Stage Rows */}
      <div className="space-y-6">
        {timelineData.stages.map((stage) => (
          <StageRow
            key={stage.name}
            stage={stage}
            totalWidth={timelineData.totalWidth}
            userVotes={userVotes}
            onVote={onVote}
          />
        ))}
      </div>
    </div>
  );
}
