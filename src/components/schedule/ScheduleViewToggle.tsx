import { Button } from "@/components/ui/button";
import { Calendar, Clock, List, BarChart3 } from "lucide-react";
import type { ScheduleViewOption } from "@/hooks/useUrlState";

interface ScheduleViewToggleProps {
  view: ScheduleViewOption;
  onViewChange: (view: ScheduleViewOption) => void;
}

export const ScheduleViewToggle = ({ view, onViewChange }: ScheduleViewToggleProps) => {
  return (
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-lg p-1">
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className={view === 'grid' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'text-purple-200 hover:text-white hover:bg-white/10'}
      >
        <Calendar className="h-4 w-4" />
        <span className="hidden sm:inline ml-2">Grid</span>
      </Button>
      <Button
        variant={view === 'timeline' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('timeline')}
        className={view === 'timeline' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'text-purple-200 hover:text-white hover:bg-white/10'}
      >
        <Clock className="h-4 w-4" />
        <span className="hidden sm:inline ml-2">Timeline</span>
      </Button>
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className={view === 'list' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'text-purple-200 hover:text-white hover:bg-white/10'}
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline ml-2">List</span>
      </Button>
      <Button
        variant={view === 'horizontal' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('horizontal')}
        className={view === 'horizontal' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'text-purple-200 hover:text-white hover:bg-white/10'}
      >
        <BarChart3 className="h-4 w-4" />
        <span className="hidden sm:inline ml-2">Timeline</span>
      </Button>
    </div>
  );
};