import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { formatTimeOnly } from "@/lib/timeUtils";
import { format } from "date-fns";
import type { ScheduleSet } from "@/hooks/useScheduleData";
import { useMemo } from "react";
import { VOTE_CONFIG, getVoteConfig } from "@/lib/voteConfig";
import { cn } from "@/lib/utils";

interface ArtistScheduleBlockProps {
  set: ScheduleSet;
  userVote?: number;
  onVote?: (setId: string, voteType: number) => void;
}

export function ArtistScheduleBlock({
  set,
  userVote,
  onVote,
}: ArtistScheduleBlockProps) {
  function getVoteCount(voteType: number) {
    return (set.votes || []).filter((vote) => vote.vote_type === voteType)
      .length;
  }

  function handleVote(voteType: number) {
    if (onVote) {
      onVote(set.id, voteType);
    }
  }

  // Format time in compact format (e.g., "22-23" instead of "22:00 - 23:00")
  function formatCompactTime(startTime: Date, endTime: Date): string {
    const start = format(startTime, "H");
    const end = format(endTime, "H");

    // If minutes are not :00, include them
    const startMinutes = startTime.getMinutes();
    const endMinutes = endTime.getMinutes();

    const startStr = startMinutes === 0 ? start : format(startTime, "H:mm");
    const endStr = endMinutes === 0 ? end : format(endTime, "H:mm");

    return `${startStr}-${endStr}`;
  }

  const useCompact = useMemo(() => {
    let duration = 60;
    if (set.endTime && set.startTime) {
      // Calculate duration in minutes
      duration =
        (set.endTime.getTime() - set.startTime.getTime()) / (1000 * 60);
    }
    // Use compact format for sets shorter than 1 hour (60 minutes)
    return duration <= 60;
  }, [set.startTime, set.endTime]);

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 hover:border-purple-400/50 transition-colors">
      <CardContent className="p-3">
        <div className="mb-2">
          <Link
            to={`./sets/${set.slug}`}
            className="text-white font-semibold hover:text-purple-300 transition-colors block text-sm whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {set.name}
          </Link>

          {/* Show artists in this set */}
          {/* {artist.artists && artist.artists.length > 0 && (
            <div className="text-purple-300 text-sm mt-1">
              {artist.artists.map((a) => a.name).join(", ")}
            </div>
          )} */}
        </div>
        <div className="space-y-1 text-sm text-purple-200">
          {set.startTime && set.endTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                {useCompact
                  ? formatCompactTime(set.startTime, set.endTime)
                  : formatTimeOnly(
                      set.startTime.toISOString(),
                      set.endTime.toISOString(),
                      true,
                    )}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-2">
          {[2, 1, -1].map((voteValue) => {
            const voteType = getVoteConfig(voteValue);
            if (!voteType) return null;

            const config = VOTE_CONFIG[voteType];
            const IconComponent = config.icon;
            const isSelected = userVote === voteValue;

            return (
              <button
                key={voteValue}
                className={cn(
                  `flex items-center gap-1 cursor-pointer hover:text-purple-300`,
                  isSelected
                    ? `${config.iconColor} hover:text-purple-300`
                    : `${config.descColor} `,
                )}
                onClick={() => handleVote(voteValue)}
                type="button"
              >
                <IconComponent className="h-3 w-3" />
                <span className="text-xs">{getVoteCount(voteValue)}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
