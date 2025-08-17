import { ArtistScheduleBlock } from "./ArtistScheduleBlock";
import type { HorizontalTimelineSet } from "@/lib/timelineCalculator";

interface StageRowProps {
  stage: {
    name: string;
    sets: HorizontalTimelineSet[];
  };
  totalWidth: number;
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

export function StageRow({
  stage,
  totalWidth,
  userVotes,
  onVote,
}: StageRowProps) {
  return (
    <div key={stage.name} className="flex items-start">
      {/* Timeline Track */}
      <div
        className="relative h-24 bg-white/5 rounded-lg border border-purple-400/20"
        style={{ minWidth: totalWidth }}
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
                <ArtistScheduleBlock
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
