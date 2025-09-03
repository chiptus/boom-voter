import { useRef } from "react";
import { TimeScale } from "./TimeScale";
import { StageRow } from "./StageRow";
import type { TimelineData } from "@/lib/timelineCalculator";

interface TimelineContainerProps {
  timelineData: TimelineData;
}

export function TimelineContainer({ timelineData }: TimelineContainerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-x-auto overflow-y-hidden pb-20"
    >
      {/* Time Scale */}
      <TimeScale
        timeSlots={timelineData.timeSlots}
        totalWidth={timelineData.totalWidth}
        scrollContainerRef={scrollContainerRef}
      />

      {/* Stage Rows */}
      <div className="space-y-12 mt-28">
        {timelineData.stages.map((stage) => (
          <StageRow
            key={stage.name}
            stage={stage}
            totalWidth={timelineData.totalWidth}
          />
        ))}
      </div>
    </div>
  );
}
