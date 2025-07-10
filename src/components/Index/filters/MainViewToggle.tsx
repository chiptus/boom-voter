import { Button } from "@/components/ui/button";
import { List, Calendar } from "lucide-react";
import type { MainViewOption } from "@/hooks/useUrlState";

interface MainViewToggleProps {
  mainView: MainViewOption;
  onMainViewChange: (view: MainViewOption) => void;
}

export const MainViewToggle = ({ mainView, onMainViewChange }: MainViewToggleProps) => {
  return (
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-lg p-1">
      <Button
        variant={mainView === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onMainViewChange('list')}
        className={mainView === 'list' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'text-purple-200 hover:text-white hover:bg-white/10'}
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline ml-2">Artists</span>
      </Button>
      <Button
        variant={mainView === 'timeline' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onMainViewChange('timeline')}
        className={mainView === 'timeline' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'text-purple-200 hover:text-white hover:bg-white/10'}
      >
        <Calendar className="h-4 w-4" />
        <span className="hidden sm:inline ml-2">Timeline</span>
      </Button>
    </div>
  );
};