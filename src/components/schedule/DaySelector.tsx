import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ScheduleDay } from "@/hooks/useScheduleData";

interface DaySelectorProps {
  days: ScheduleDay[];
  selectedDay: string;
  onDayChange: (day: string) => void;
}

export const DaySelector = ({ days, selectedDay, onDayChange }: DaySelectorProps) => {
  if (days.length <= 1) return null;

  return (
    <div className="mb-6">
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {days.map((day) => (
            <Button
              key={day.date}
              variant={selectedDay === day.date ? 'default' : 'outline'}
              onClick={() => onDayChange(day.date)}
              className={`whitespace-nowrap ${
                selectedDay === day.date
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white'
              }`}
            >
              {day.displayDate}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};