import { Button } from "@/components/ui/button";
import { Calendar, Clock, ChevronUp } from "lucide-react";
import { useScheduleData } from "@/hooks/useScheduleData";
import { useCallback } from "react";

interface DateNavigationProps {
  onScrollToDate: (dateIndex: number) => void;
  onScrollToNow: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function DateNavigation({
  onScrollToDate,
  onScrollToNow,
  containerRef,
}: DateNavigationProps) {
  const { scheduleDays } = useScheduleData();

  const scrollToTop = useCallback(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [containerRef]);

  if (scheduleDays.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      {/* Date selection buttons */}
      <div className="flex flex-wrap gap-2">
        {scheduleDays.map((day, index) => (
          <Button
            key={day.date}
            onClick={() => onScrollToDate(index)}
            variant="outline"
            size="sm"
            className="border-purple-400/50 text-purple-300 hover:bg-purple-600/50 hover:text-white"
          >
            <Calendar className="h-3 w-3 mr-1" />
            {day.displayDate.split(",")[1]?.trim() || day.displayDate}
          </Button>
        ))}
      </div>

      {/* Control buttons */}
      <div className="flex gap-2">
        <Button
          onClick={onScrollToNow}
          className="bg-purple-600 hover:bg-purple-700 shadow-lg border border-purple-400/50"
          aria-label="Scroll to current time"
        >
          <Clock className="h-4 w-4 mr-2" />
          Now
        </Button>

        <Button
          onClick={scrollToTop}
          variant="outline"
          className="border-purple-400/50 text-purple-300 hover:bg-purple-600/50 hover:text-white"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-4 w-4 mr-2" />
          Top
        </Button>
      </div>
    </div>
  );
}
