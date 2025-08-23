import { LucideIcon } from "lucide-react";
import type { TimelineView } from "@/hooks/useUrlState";

interface ViewToggleOptionProps {
  currentView: TimelineView;
  onClick: () => void;
  viewId: TimelineView;
  title: string;
  icon: LucideIcon;
  label: string;
}

export function ViewToggleOption({
  currentView,
  onClick,
  viewId,
  title,
  icon: Icon,
  label,
}: ViewToggleOptionProps) {
  const isActive = currentView === viewId;

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center  py-2 md:py-3 rounded-lg
        w-1/2 md:min-w-[100px] transition-all duration-200 active:scale-95
        ${
          isActive
            ? "bg-purple-600 text-white shadow-lg"
            : "text-purple-200 hover:text-white hover:bg-white/10"
        }
      `}
      title={title}
    >
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      <span className="ml-2 text-sm font-medium">{label}</span>
    </button>
  );
}
