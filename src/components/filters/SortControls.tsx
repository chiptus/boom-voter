
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SortAsc, HelpCircle } from "lucide-react";
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
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1 hover:bg-white/10 rounded transition-colors">
                <HelpCircle className="h-4 w-4 text-purple-300 hover:text-purple-200" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="bg-gray-800 border-purple-400/30 text-purple-100 w-80">
              <div className="space-y-3">
                <h3 className="font-semibold text-purple-200 mb-2">Sort Options Explained</h3>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <strong className="text-purple-300">Name (A-Z):</strong>
                    <p className="text-purple-100/80">Sort artists alphabetically from A to Z</p>
                  </div>
                  
                  <div>
                    <strong className="text-purple-300">Name (Z-A):</strong>
                    <p className="text-purple-100/80">Sort artists alphabetically from Z to A</p>
                  </div>
                  
                  <div>
                    <strong className="text-purple-300">Highest Rated:</strong>
                    <p className="text-purple-100/80">Sort by weighted average rating based on votes (Must go = 2 points, Interested = 1 point, Won't go = -1 point)</p>
                  </div>
                  
                  <div>
                    <strong className="text-purple-300">Most Popular:</strong>
                    <p className="text-purple-100/80">Sort by weighted popularity score (Must go = 2 points, Interested = 1 point)</p>
                  </div>
                  
                  <div>
                    <strong className="text-purple-300">By Date:</strong>
                    <p className="text-purple-100/80">Sort by estimated performance date (earliest performances first)</p>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-800 border-purple-400/30 text-purple-100">
          <p>Click for sorting help</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
