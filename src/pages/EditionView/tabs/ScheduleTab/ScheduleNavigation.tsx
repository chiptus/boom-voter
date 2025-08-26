import { Calendar, List } from "lucide-react";
import { ScheduleNavigationItem } from "./ScheduleNavigationItem";

export function ScheduleNavigation() {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-1">
      <div className="flex items-center justify-center gap-1">
        <ScheduleNavigationItem
          view="timeline"
          label="Timeline View"
          icon={Calendar}
        />
        <ScheduleNavigationItem view="list" label="List View" icon={List} />
      </div>
    </div>
  );
}
