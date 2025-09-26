import { Progress } from "@/components/ui/progress";

interface ImportProgressProps {
  progress: {
    current: number;
    total: number;
    label: string;
  };
  isImporting: boolean;
}

export function ImportProgress({ progress, isImporting }: ImportProgressProps) {
  if (!isImporting || progress.total === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{progress.label}</span>
        <span>{Math.round((progress.current / progress.total) * 100)}%</span>
      </div>
      <Progress value={(progress.current / progress.total) * 100} />
    </div>
  );
}
