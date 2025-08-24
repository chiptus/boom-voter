import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { VoteButtons } from "../VoteButtons";
import { useMemo } from "react";
import { VerticalTimelineSet } from "@/lib/timelineCalculator";

interface VerticalArtistScheduleBlockProps {
  set: VerticalTimelineSet;
  userVote?: number;
  onVote?: (setId: string, voteType: number) => void;
}

export function VerticalArtistScheduleBlock({
  set,
  userVote,
  onVote,
}: VerticalArtistScheduleBlockProps) {
  const height = set.verticalPosition?.height || 60;
  const isCompact = height < 80;
  const isVeryCompact = height < 60;

  const timeString = useMemo(() => {
    if (!set.startTime || !set.endTime) return "";

    if (isVeryCompact) {
      return format(set.startTime, "H:mm");
    }

    const start = format(set.startTime, "H");
    const end = format(set.endTime, "H");
    const startMinutes = set.startTime.getMinutes();
    const endMinutes = set.endTime.getMinutes();
    const startStr = startMinutes === 0 ? start : format(set.startTime, "H:mm");
    const endStr = endMinutes === 0 ? end : format(set.endTime, "H:mm");

    return `${startStr}-${endStr}`;
  }, [set.startTime, set.endTime, isVeryCompact]);

  return (
    <Card className="h-full bg-white/10 backdrop-blur-md border-purple-400/30 hover:border-purple-400/50 transition-colors">
      <CardContent
        className={`h-full flex flex-col ${isCompact ? "p-1" : "p-2"}`}
      >
        <div className="mb-1">
          <Link
            to={`./sets/${set.slug}`}
            className={`text-white font-semibold hover:text-purple-300 transition-colors block whitespace-nowrap overflow-hidden text-ellipsis ${
              isVeryCompact ? "text-xs" : isCompact ? "text-xs" : "text-sm"
            }`}
            title={set.name}
          >
            {set.name}
          </Link>
        </div>

        {!isVeryCompact && timeString && (
          <div className="flex items-center gap-1 mb-2">
            <Clock className="h-2.5 w-2.5 flex-shrink-0 text-purple-200" />
            <span className="text-xs text-purple-200 whitespace-nowrap">
              {timeString}
            </span>
          </div>
        )}

        <div className={`mt-auto ${isCompact ? "" : "mt-2"}`}>
          <VoteButtons set={set} userVote={userVote} onVote={onVote} />
        </div>
      </CardContent>
    </Card>
  );
}
