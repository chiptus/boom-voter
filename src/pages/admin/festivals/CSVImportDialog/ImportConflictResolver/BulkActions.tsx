import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { X } from "lucide-react";
import { BulkMergeStrategySelector } from "@/pages/admin/ArtistsManagement/components/BulkMergeStrategySelector";

type MergeStrategy = "smart" | "first" | "newest" | "oldest";

interface BulkActionsProps {
  unresolvedCount: number;
  onBulkSkip: () => void;
  onBulkImportNew: () => void;
  onBulkMerge: (strategy: MergeStrategy) => void;
}

export function BulkActions({
  unresolvedCount,
  onBulkSkip,
  onBulkImportNew,
  onBulkMerge,
}: BulkActionsProps) {
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkStrategy, setBulkStrategy] = useState<MergeStrategy>("smart");

  function handleBulkMerge() {
    onBulkMerge(bulkStrategy);
  }

  if (!showBulkActions) {
    return (
      <Button
        variant="outline"
        onClick={() => setShowBulkActions(true)}
        disabled={unresolvedCount === 0}
      >
        Bulk Actions ({unresolvedCount} unresolved)
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Bulk Actions</CardTitle>
        <CardDescription>
          Apply the same resolution to all unresolved conflicts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={onBulkSkip}
            disabled={unresolvedCount === 0}
          >
            Skip All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onBulkImportNew}
            disabled={unresolvedCount === 0}
          >
            Import All as New
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleBulkMerge}
            disabled={unresolvedCount === 0}
          >
            Merge All (Smart)
          </Button>
        </div>

        <div className="pt-2">
          <BulkMergeStrategySelector
            strategy={bulkStrategy}
            onStrategyChange={setBulkStrategy}
          />
        </div>

        <div className="flex justify-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowBulkActions(false)}
          >
            <X className="h-3 w-3 mr-1" />
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
