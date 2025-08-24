import { ScheduleNavigation } from "@/components/timeline/ScheduleNavigation";
import { Outlet } from "react-router-dom";

export function ScheduleTab() {
  return (
    <div className="space-y-3 md:space-y-6">
      <ScheduleNavigation />

      <Outlet />
    </div>
  );
}
