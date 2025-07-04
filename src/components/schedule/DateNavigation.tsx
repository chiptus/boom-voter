import { Button } from "@/components/ui/button";
import { Calendar, Clock, ChevronUp } from "lucide-react";
import { useScheduleData } from "@/hooks/useScheduleData";
import { useCallback } from "react";

interface DateNavigationProps {
  onScrollToDate: (dateIndex: number) => void;
  onScrollToNow: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const DateNavigation = ({ onScrollToDate, onScrollToNow, containerRef }: DateNavigationProps) => {
  const { scheduleDays } = useScheduleData();

  const scrollToTop = useCallback(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [containerRef]);

  if (scheduleDays.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {/* Date selection buttons */}
      <div className="flex flex-col gap-1 bg-purple-900/90 backdrop-blur-md rounded-lg p-2 border border-purple-400/30">
        {scheduleDays.map((day, index) => (
          <Button
            key={day.date}
            onClick={() => onScrollToDate(index)}
            variant="ghost"
            size="sm"
            className="text-xs text-purple-200 hover:text-white hover:bg-purple-600/50 justify-start w-24"
          >
            <Calendar className="h-3 w-3 mr-1" />
            {day.displayDate.split(',')[1]?.trim() || day.displayDate}
          </Button>
        ))}
      </div>

      {/* Control buttons */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={onScrollToNow}
          className="rounded-full h-12 w-12 p-0 bg-purple-600 hover:bg-purple-700 shadow-lg border border-purple-400/50"
          aria-label="Scroll to current time"
        >
          <Clock className="h-5 w-5" />
        </Button>
        
        <Button
          onClick={scrollToTop}
          variant="outline"
          className="rounded-full h-10 w-10 p-0 border-purple-400/50 text-purple-300 hover:bg-purple-600/50 hover:text-white"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};