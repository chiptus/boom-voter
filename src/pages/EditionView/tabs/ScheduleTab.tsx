import { ScheduleNavigation } from "./ScheduleTab/ScheduleNavigation";
import { Outlet } from "react-router-dom";
import { useFestivalEdition } from "@/contexts/FestivalEditionContext";
import { PageTitle } from "@/components/PageTitle/PageTitle";

export function ScheduleTab() {
  const { festival } = useFestivalEdition();

  return (
    <>
      <PageTitle title="Schedule" prefix={festival?.name} />
      <div className="space-y-3 md:space-y-6">
        <ScheduleNavigation />

        <Outlet />
      </div>
    </>
  );
}
