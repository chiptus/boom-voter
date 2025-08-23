import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Clock, MapPin } from "lucide-react";
import { format, differenceInMinutes } from "date-fns";
import { VoteButtons } from "../VoteButtons";
import type { ScheduleSet } from "@/hooks/useScheduleData";

interface MobileSetCardProps {
  set: ScheduleSet & { stageName: string };
  userVote?: number;
  onVote?: (setId: string, voteType: number) => void;
}

export function MobileSetCard({ set, userVote, onVote }: MobileSetCardProps) {
  const duration =
    set.startTime && set.endTime
      ? differenceInMinutes(set.endTime, set.startTime)
      : null;

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 hover:border-purple-400/50 transition-colors">
      <CardContent className="p-4">
        {/* Artist name */}
        <div className="mb-3">
          <Link
            to={`./sets/${set.slug}`}
            className="text-white font-semibold hover:text-purple-300 transition-colors block text-lg"
          >
            {set.name}
          </Link>
        </div>

        {/* Stage and duration info */}
        <div className="flex items-center gap-4 mb-3 text-sm text-purple-200">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{set.stageName}</span>
          </div>

          {duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{duration}min</span>
            </div>
          )}

          {set.startTime && set.endTime && (
            <div className="flex items-center gap-1">
              <span>
                {format(set.startTime, "HH:mm")} -{" "}
                {format(set.endTime, "HH:mm")}
              </span>
            </div>
          )}
        </div>

        {/* Vote buttons */}
        <VoteButtons set={set} userVote={userVote} onVote={onVote} />
      </CardContent>
    </Card>
  );
}
