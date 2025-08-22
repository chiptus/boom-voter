import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

interface FilterToggleProps {
  isExpanded: boolean;
  onToggle: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

export function FilterToggle({
  isExpanded,
  onToggle,
  hasActiveFilters,
  activeFilterCount,
}: FilterToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className={`flex items-center gap-2 ${
        isExpanded
          ? "bg-purple-600/50 text-purple-100 hover:bg-purple-600/60"
          : "text-purple-300 hover:text-purple-100"
      }`}
    >
      <Filter className="h-4 w-4" />
      <span className="hidden md:inline">Filters</span>
      {hasActiveFilters && (
        <Badge
          variant="secondary"
          className="bg-purple-800/50 text-purple-100 ml-1"
        >
          {activeFilterCount}
        </Badge>
      )}
    </Button>
  );
}
