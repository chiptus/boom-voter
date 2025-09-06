import { SetBlock } from "./SetBlock";
import type { HorizontalTimelineSet } from "@/lib/timelineCalculator";

interface StageRowProps {
  stage: {
    name: string;
    color?: string;
    sets: HorizontalTimelineSet[];
  };
  totalWidth: number;
}

export function StageRow({ stage, totalWidth }: StageRowProps) {
  return (
    <div key={stage.name} className="flex items-start">
      {/* Timeline Track */}
      <div
        className="relative h-24 bg-white/5 rounded-lg border-2"
        style={{
          minWidth: totalWidth,
          borderColor: stage.color ? `${stage.color}40` : "#7c3aed33",
        }}
      >
        {stage.sets.map((set) => {
          if (!set.horizontalPosition) return null;

          return (
            <div
              key={set.id}
              className="absolute h-16"
              style={{
                left: `${set.horizontalPosition.left + 20}px`,
                width: `${set.horizontalPosition.width - 4}px`, // Reduce width by 4px for spacing
              }}
            >
              <div className="h-full pr-1">
                <SetBlock set={set} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
