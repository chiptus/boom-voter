import { Progress } from "@/components/ui/progress";

interface TimelineProgressProps {
  currentPosition: number;
  totalItems: number;
  visible?: boolean;
}

export const TimelineProgress = ({
  currentPosition,
  totalItems,
  visible = true,
}: TimelineProgressProps) => {
  if (!visible || totalItems === 0) return null;

  const progress = Math.min((currentPosition / totalItems) * 100, 100);

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 px-4">
      <div className="bg-purple-900/90 backdrop-blur-md rounded-lg p-3 shadow-lg border border-purple-400/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-purple-200">Festival Progress</span>
          <span className="text-xs text-purple-200">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2 bg-purple-800/50" />
      </div>
    </div>
  );
};
