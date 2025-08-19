import { Clock } from "lucide-react";
import { format } from "date-fns";
import { formatTimeOnly } from "@/lib/timeUtils";
import { useMemo } from "react";

interface TimeDisplayProps {
  startTime: Date;
  endTime: Date;
}

function formatCompactTime(startTime: Date, endTime: Date): string {
  const start = format(startTime, "H");
  const end = format(endTime, "H");

  const startMinutes = startTime.getMinutes();
  const endMinutes = endTime.getMinutes();

  const startStr = startMinutes === 0 ? start : format(startTime, "H:mm");
  const endStr = endMinutes === 0 ? end : format(endTime, "H:mm");

  return `${startStr}-${endStr}`;
}

export function TimeDisplay({ startTime, endTime }: TimeDisplayProps) {
  const useCompact = useMemo(() => {
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    return duration <= 60;
  }, [startTime, endTime]);

  return (
    <div className="flex items-center gap-1">
      <Clock className="h-3 w-3 flex-shrink-0" />
      <span className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
        {useCompact
          ? formatCompactTime(startTime, endTime)
          : formatTimeOnly(
              startTime.toISOString(),
              endTime.toISOString(),
              true,
            )}
      </span>
    </div>
  );
}
