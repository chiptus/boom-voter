import { Heart, Music } from "lucide-react";
import { ScheduleViewToggle } from "./ScheduleViewToggle";
import type { ScheduleViewOption } from "@/hooks/useUrlState";

interface ScheduleHeaderProps {
  view: ScheduleViewOption;
  onViewChange: (view: ScheduleViewOption) => void;
  totalPerformances: number;
}

export const ScheduleHeader = ({ view, onViewChange, totalPerformances }: ScheduleHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Music className="h-8 w-8 text-purple-400" />
        <h1 className="text-4xl font-bold text-white">Festival Schedule</h1>
        <Heart className="h-8 w-8 text-pink-400" />
      </div>
      <p className="text-xl text-purple-200 mb-4">Plan your festival experience</p>
      <p className="text-sm text-purple-300 mb-6">
        {totalPerformances} performances scheduled
      </p>
      
      <div className="flex justify-center">
        <ScheduleViewToggle view={view} onViewChange={onViewChange} />
      </div>
    </div>
  );
};