import { format, differenceInMinutes } from "date-fns";
import { useRef } from "react";

interface VerticalTimeScaleProps {
  timeSlots: Date[];
  totalHeight: number;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
}

const dateFormat = "MMMM d";

export function VerticalTimeScale({
  timeSlots,
  totalHeight,
}: VerticalTimeScaleProps) {
  const timeScaleRef = useRef<HTMLDivElement>(null);

  const dateChanges = timeSlots.reduce(
    (changes, timeSlot, index) => {
      if (index === 0) {
        changes.push({ date: timeSlot, position: 20 });
      } else {
        const prevDate = format(timeSlots[index - 1], "yyyy-MM-dd");
        const currentDate = format(timeSlot, "yyyy-MM-dd");
        if (prevDate !== currentDate) {
          const midnightOfNewDate = new Date(timeSlot);
          midnightOfNewDate.setHours(0, 0, 0, 0);

          const festivalStart = timeSlots[0];
          const minutesFromStart = differenceInMinutes(
            midnightOfNewDate,
            festivalStart,
          );
          const position = minutesFromStart * 2 + 20; // 2px per minute

          changes.push({ date: midnightOfNewDate, position });
        }
      }
      return changes;
    },
    [] as Array<{ date: Date; position: number }>,
  );

  return (
    <div
      ref={timeScaleRef}
      className="flex-shrink-0 w-20 relative"
      style={{ height: totalHeight }}
    >
      {/* Date change indicators */}
      {dateChanges.map((dateChange, index) => {
        const nextDateChange = dateChanges[index + 1];
        const fullHeight = nextDateChange
          ? nextDateChange.position - dateChange.position
          : totalHeight - dateChange.position;

        const space = 5;
        const height = fullHeight - space;
        const top = dateChange.position;

        return (
          <div
            key={`date-${index}`}
            className="absolute left-0 text-xs font-medium text-purple-200 bg-purple-900/60 px-1 py-0.5 border border-purple-400/30 flex items-center justify-center rounded-sm"
            style={{
              top: `${top}px`,
              height: `${Math.max(height, 30)}px`,
              minHeight: "30px",
              writingMode: "vertical-rl",
              textOrientation: "mixed",
            }}
          >
            {format(dateChange.date, dateFormat)}
          </div>
        );
      })}

      {/* Time slots */}
      {timeSlots.map((timeSlot, index) => (
        <div
          key={index}
          className="absolute flex flex-row items-center text-right"
          style={{ top: `${index * 120 + 20}px` }}
        >
          <div className="text-xs font-medium text-purple-300 mr-2 min-w-[50px]">
            {format(timeSlot, "HH:mm")}
          </div>
          <div className="h-px w-2 bg-purple-400/30"></div>
        </div>
      ))}

      <div className="absolute top-0 right-0 bottom-0 w-px bg-purple-400/20"></div>
    </div>
  );
}
