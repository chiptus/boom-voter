import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";

export function ViewToggle({
  view,
  onViewChange,
}: {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-lg p-1">
      <ViewToggleItem
        isSelected={view === "grid"}
        onClick={() => onViewChange("grid")}
        icon={Grid3X3}
      />
      <ViewToggleItem
        isSelected={view === "list"}
        onClick={() => onViewChange("list")}
        icon={List}
      />
    </div>
  );
}

function ViewToggleItem({
  isSelected,
  onClick,
  icon: Icon,
}: {
  isSelected: boolean;
  onClick(): void;
  icon: typeof Grid3X3;
}) {
  return (
    <Button
      variant={isSelected ? "default" : "ghost"}
      size="sm"
      onClick={() => onClick()}
      className={
        isSelected
          ? "bg-purple-600 hover:bg-purple-700"
          : "text-purple-200 hover:text-white hover:bg-white/10"
      }
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
