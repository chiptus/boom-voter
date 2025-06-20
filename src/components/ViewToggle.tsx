
import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-lg p-1">
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className={view === 'grid' ? 'bg-purple-600 hover:bg-purple-700' : 'text-purple-200 hover:text-white hover:bg-white/10'}
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className={view === 'list' ? 'bg-purple-600 hover:bg-purple-700' : 'text-purple-200 hover:text-white hover:bg-white/10'}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};
