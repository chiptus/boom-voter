import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  AlertTriangle,
  Zap,
  Clock,
  Star,
  Hash,
} from "lucide-react";
import type { DuplicateGroup } from "@/hooks/queries/artists/useDuplicateArtists";
import { useBulkMergeArtistsMutation } from "@/hooks/queries/artists/useBulkMergeArtists";

interface BulkMergeDialogProps {
  selectedGroups: DuplicateGroup[];
  onClose: () => void;
}

type MergeStrategy = "smart" | "first" | "newest" | "oldest";

interface MergeProgress {
  total: number;
  completed: number;
  current?: string;
  errors: Array<{ group: string; error: string }>;
}

export function BulkMergeDialog({
  selectedGroups,
  onClose,
}: BulkMergeDialogProps) {
  const [strategy, setStrategy] = useState<MergeStrategy>("smart");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<MergeProgress | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const bulkMergeMutation = useBulkMergeArtistsMutation();

  const totalArtists = selectedGroups.reduce(
    (sum, group) => sum + group.count,
    0,
  );
  const duplicatesToDelete = selectedGroups.reduce(
    (sum, group) => sum + (group.count - 1),
    0,
  );

  function handleStartMerge() {
    setIsProcessing(true);
    setProgress({ total: selectedGroups.length, completed: 0, errors: [] });

    bulkMergeMutation.mutate({
      params: {
        groups: selectedGroups,
        strategy,
      },
      onProgress: (newProgress) => {
        setProgress(newProgress);
        if (newProgress.completed === newProgress.total) {
          setIsProcessing(false);
          setIsComplete(true);
        }
      },
    });
  }

  function getStrategyIcon(strategyType: MergeStrategy) {
    switch (strategyType) {
      case "smart":
        return <Star className="h-4 w-4" />;
      case "newest":
        return <Clock className="h-4 w-4" />;
      case "oldest":
        return <Hash className="h-4 w-4" />;
      case "first":
        return <Zap className="h-4 w-4" />;
    }
  }

  function getStrategyDescription(strategyType: MergeStrategy) {
    switch (strategyType) {
      case "smart":
        return "Chooses the artist with the most complete data as primary, then merges missing data (description, links) from other duplicates into it";
      case "newest":
        return "Uses the most recently created artist as primary, then fills in any missing data from older duplicates";
      case "oldest":
        return "Uses the oldest created artist as primary, then fills in any missing data from newer duplicates";
      case "first":
        return "Uses the first artist in each group as primary, then fills in any missing data from other duplicates";
    }
  }

  if (isComplete) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              Bulk Merge Complete
            </DialogTitle>
            <DialogDescription className="text-sm">
              Successfully processed {selectedGroups.length} duplicate groups.
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

  if (isProcessing) {
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
              Merging {selectedGroups.length} duplicate groups. Please wait.
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Bulk Merge Duplicate Artists</DialogTitle>
          <DialogDescription>
            Merge {selectedGroups.length} duplicate groups containing{" "}
            {totalArtists} total artists. This will delete {duplicatesToDelete}{" "}
            duplicate entries.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This action cannot be undone. All votes, sets, and notes will be
              transferred to the primary artist in each group.
            </AlertDescription>
          </Alert>

          <div>
            <Label className="text-base font-medium mb-3 block">
              Choose Merge Strategy
            </Label>
            <RadioGroup
              value={strategy}
              onValueChange={(value) => setStrategy(value as MergeStrategy)}
              className="space-y-2"
            >
              {(["smart", "newest", "oldest", "first"] as MergeStrategy[]).map(
                (strategyType) => (
                  <div
                    key={strategyType}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <RadioGroupItem
                      value={strategyType}
                      id={strategyType}
                      className="mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Label
                        htmlFor={strategyType}
                        className="flex items-center gap-2 font-medium cursor-pointer text-sm"
                      >
                        {getStrategyIcon(strategyType)}
                        {strategyType.charAt(0).toUpperCase() +
                          strategyType.slice(1)}{" "}
                        Strategy
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {getStrategyDescription(strategyType)}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </RadioGroup>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium mb-2 text-sm">
              Selected Groups Preview
            </h4>
            <div className="text-xs space-y-1 max-h-24 overflow-y-auto">
              {selectedGroups.map((group) => (
                <p key={group.name}>
                  <strong>{group.name}</strong> ({group.count} duplicates)
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3 border-t flex-shrink-0">
          <Button variant="outline" onClick={onClose} className="sm:order-1">
            Cancel
          </Button>
          <Button
            onClick={handleStartMerge}
            className="bg-red-600 hover:bg-red-700 sm:order-2"
          >
            <span className="hidden sm:inline">
              Start Bulk Merge ({duplicatesToDelete} deletions)
            </span>
            <span className="sm:hidden">
              Merge {duplicatesToDelete} duplicates
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
