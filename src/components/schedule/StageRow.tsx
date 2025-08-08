import { ArtistScheduleBlock } from "./ArtistScheduleBlock";
import type { HorizontalTimelineSet } from "@/lib/timelineCalculator";

interface StageRowProps {
  stage: {
    name: string;
    artists: HorizontalTimelineSet[];
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
        className="relative h-20 bg-white/5 rounded-lg border border-purple-400/20"
        style={{ minWidth: totalWidth }}
      >
        {stage.artists.map((set) => {
          if (!set.horizontalPosition) return null;

          return (
            <div
              key={set.id}
              className="absolute h-16"
              style={{
                left: `${set.horizontalPosition.left}px`,
                width: `${set.horizontalPosition.width}px`,
              }}
            >
              <div className="h-full">
                <ArtistScheduleBlock
                  artist={set}
                  userVote={userVotes[set.id]}
                  onVote={onVote}
                  compact={true}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
