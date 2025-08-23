import { BarChart3, List } from "lucide-react";
import type { TimelineView } from "@/hooks/useUrlState";
import { ViewToggleOption } from "./ViewToggleOption";

interface ViewToggleProps {
  currentView: TimelineView;
  onViewChange: (view: TimelineView) => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-1">
      <div className="flex gap-1">
        <ViewToggleOption
          currentView={currentView}
          onClick={() => onViewChange("horizontal")}
          viewId="horizontal"
          title="Horizontal Timeline View"
          icon={BarChart3}
          label="Timeline"
        />
        <ViewToggleOption
          currentView={currentView}
          onClick={() => onViewChange("list")}
          viewId="list"
          title="List View"
          icon={List}
          label="List"
        />
      </div>
    </div>
  );
}
