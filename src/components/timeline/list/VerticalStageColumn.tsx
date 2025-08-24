import { VerticalArtistScheduleBlock } from "./VerticalArtistScheduleBlock";
import type { VerticalTimelineSet } from "@/lib/timelineCalculator";

interface VerticalStageColumnProps {
  stage: {
    name: string;
    sets: VerticalTimelineSet[];
  };
  totalHeight: number;
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

export function VerticalStageColumn({
  stage,
  totalHeight,
  userVotes,
  onVote,
}: VerticalStageColumnProps) {
  return (
    <div className="flex-shrink-0 flex flex-col">
      <div
        className="relative w-32 bg-white/5 rounded-lg border border-purple-400/20 min-w-32"
        style={{ height: totalHeight }}
      >
        {stage.sets.map((set) => {
          if (!set.verticalPosition) return null;

          return (
            <div
              key={set.id}
              className="absolute w-28 px-1"
              style={{
                top: `${set.verticalPosition.top + 20}px`,
                height: `${set.verticalPosition.height - 4}px`,
              }}
            >
              <div className="h-full">
                <VerticalArtistScheduleBlock
                  set={set}
                  userVote={userVotes[set.id]}
                  onVote={onVote}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
