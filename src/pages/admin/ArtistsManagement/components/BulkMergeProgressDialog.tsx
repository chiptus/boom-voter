import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface MergeProgress {
  total: number;
  completed: number;
  current?: string;
  errors: Array<{ group: string; error: string }>;
}

interface BulkMergeProgressDialogProps {
  progress: MergeProgress | null;
  selectedGroupsLength: number;
}

export function BulkMergeProgressDialog({
  progress,
  selectedGroupsLength,
}: BulkMergeProgressDialogProps) {
  const progressPercent = progress
    ? (progress.completed / progress.total) * 100
    : 0;

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">
            Processing Bulk Merge...
          </DialogTitle>
          <DialogDescription className="text-sm">
            Merging {selectedGroupsLength} duplicate groups. Please wait.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>
                {progress?.completed || 0} of {progress?.total || 0}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {progress?.current && (
            <p className="text-sm text-muted-foreground break-words">
              Currently processing:{" "}
              <strong className="break-all">{progress.current}</strong>
            </p>
          )}

          {progress?.errors && progress.errors.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {progress.errors.length} error(s) occurred. Processing
                continues...
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
