import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { StageBadge } from "@/components/StageBadge";
import { useStageQuery } from "@/hooks/queries/stages/useStageQuery";

interface SetCardHeaderProps {
  stageId?: string;
  timeStart: string | null;
}

export function SetCardHeader({ stageId, timeStart }: SetCardHeaderProps) {
  const stageQuery = useStageQuery(stageId);

  function formatTime(dateString: string | null) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Badge
          variant="secondary"
          className="bg-purple-600/80 text-white border-0"
        >
          {formatDate(timeStart)}
        </Badge>
        {timeStart && (
          <div className="flex items-center text-sm text-gray-300">
            <Clock className="h-4 w-4 mr-1" />
            {formatTime(timeStart)}
          </div>
        )}
      </div>

      {stageQuery.data && (
        <StageBadge
          stageName={stageQuery.data.name}
          stageColor={stageQuery.data.color || undefined}
          size="sm"
        />
      )}
    </div>
  );
}
