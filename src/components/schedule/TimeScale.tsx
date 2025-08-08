import { format } from "date-fns";

interface TimeScaleProps {
  timeSlots: Date[];
  totalWidth: number;
}

export function TimeScale({ timeSlots, totalWidth }: TimeScaleProps) {
  // Find where dates change to position floating date labels
  const dateChanges = timeSlots.reduce(
    (changes, timeSlot, index) => {
      if (index === 0) {
        changes.push({ date: timeSlot, position: 0 });
      } else {
        const prevDate = format(timeSlots[index - 1], "yyyy-MM-dd");
        const currentDate = format(timeSlot, "yyyy-MM-dd");
        if (prevDate !== currentDate) {
          changes.push({ date: timeSlot, position: index * 120 });
        }
      }
      return changes;
    },
    [] as Array<{ date: Date; position: number }>,
  );

  return (
    <div
      className="flex items-center mb-[72px] relative"
      style={{ minWidth: totalWidth }}
    >
      <div className="flex-1 relative">
        {/* Floating date labels at top */}
        {dateChanges.map((dateChange, index) => (
          <div
            key={`date-${index}`}
            className="absolute top-0 text-sm font-medium text-purple-200 bg-purple-900/80 px-2 py-1 rounded"
            style={{ left: `${dateChange.position}px` }}
          >
            {format(dateChange.date, "MMM d")}
          </div>
        ))}

        {/* Hour markers */}
        {timeSlots.map((timeSlot, index) => (
          <div
            key={index}
            className="absolute flex flex-col items-center"
            style={{ left: `${index * 120}px` }}
          >
            <div className="text-sm font-medium text-purple-300 mb-2 mt-10">
              {format(timeSlot, "HH:mm")}
            </div>
            <div className="w-px h-4 bg-purple-400/30"></div>
          </div>
        ))}

        {/* Horizontal grid line */}
        <div className="absolute top-16 left-0 right-0 h-px bg-purple-400/20"></div>
      </div>
    </div>
  );
}
