import { BarChart3, List } from "lucide-react";
import type { TimelineView } from "@/hooks/useUrlState";

interface ViewToggleProps {
  currentView: TimelineView;
  onViewChange: (view: TimelineView) => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-1">
      <div className="flex gap-1">
        <button
          onClick={() => onViewChange("horizontal")}
          className={`
            flex items-center justify-center px-3 md:px-4 py-2 md:py-3 rounded-lg
            min-w-[80px] md:min-w-[100px] transition-all duration-200 active:scale-95
            ${
              currentView === "horizontal"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-purple-200 hover:text-white hover:bg-white/10"
            }
          `}
        >
          <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="ml-2 text-sm font-medium">Timeline</span>
        </button>
        <button
          onClick={() => onViewChange("list")}
          className={`
            flex items-center justify-center px-3 md:px-4 py-2 md:py-3 rounded-lg
            min-w-[80px] md:min-w-[100px] transition-all duration-200 active:scale-95
            ${
              currentView === "list"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-purple-200 hover:text-white hover:bg-white/10"
            }
          `}
        >
          <List className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="ml-2 text-sm font-medium">List</span>
        </button>
      </div>
    </div>
  );
}
