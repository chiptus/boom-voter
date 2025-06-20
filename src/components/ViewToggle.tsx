
import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center gap-1 boom-card-gradient backdrop-blur-md rounded-lg p-1 border border-orange-500/20">
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className={view === 'grid' ? 'bg-orange-500 hover:bg-orange-600 text-black' : 'text-orange-300 hover:text-orange-100 hover:bg-orange-500/20'}
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className={view === 'list' ? 'bg-orange-500 hover:bg-orange-600 text-black' : 'text-orange-300 hover:text-orange-100 hover:bg-orange-500/20'}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};
