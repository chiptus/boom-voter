import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface MergeProgress {
  total: number;
  completed: number;
  current?: string;
  errors: Array<{ group: string; error: string }>;
}

interface BulkMergeCompleteDialogProps {
  progress: MergeProgress | null;
  selectedGroupsLength: number;
  duplicatesToDelete: number;
  onClose: () => void;
}

export function BulkMergeCompleteDialog({
  progress,
  selectedGroupsLength,
  duplicatesToDelete,
  onClose,
}: BulkMergeCompleteDialogProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            Bulk Merge Complete
          </DialogTitle>
          <DialogDescription className="text-sm">
            Successfully processed {selectedGroupsLength} duplicate groups.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm space-y-1">
              <p>
                <strong>Merged:</strong> {progress?.completed || 0} groups
              </p>
              <p>
                <strong>Artists Deleted:</strong> {duplicatesToDelete}
              </p>
              <p>
                <strong>Data Preserved:</strong> All votes, sets, and notes
                transferred
              </p>
            </div>
          </div>

          {progress?.errors && progress.errors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg max-h-32 overflow-y-auto">
              <h4 className="font-medium text-red-800 mb-2 text-sm">
                Errors ({progress.errors.length})
              </h4>
              <div className="text-xs text-red-700 space-y-1">
                {progress.errors.map((error, index) => (
                  <p key={index} className="break-words">
                    <strong className="break-all">{error.group}:</strong>{" "}
                    {error.error}
                  </p>
                ))}
              </div>
            </div>
          )}

          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
