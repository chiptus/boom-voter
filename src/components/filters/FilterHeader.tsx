import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

interface FilterHeaderProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  title?: string;
}

export function FilterHeader({
  hasActiveFilters,
  onClearFilters,
  title = "Filters",
}: FilterHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-purple-300" />
        <span className="text-purple-100 font-medium">{title}</span>
      </div>
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
