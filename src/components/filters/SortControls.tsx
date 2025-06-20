
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortAsc } from "lucide-react";
import type { SortOption } from "@/hooks/useUrlState";
import { SORT_OPTIONS } from "./constants";

interface SortControlsProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortControls = ({ sort, onSortChange }: SortControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <SortAsc className="h-4 w-4 text-purple-300" />
      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="w-48 bg-white/10 border-purple-400/30 text-purple-100">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-purple-400/30">
          {SORT_OPTIONS.map(option => (
            <SelectItem key={option.value} value={option.value} className="text-purple-100">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
