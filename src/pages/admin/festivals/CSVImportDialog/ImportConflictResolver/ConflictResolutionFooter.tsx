import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

interface ConflictResolutionFooterProps {
  unresolvedCount: number;
  isProcessing: boolean;
  onCancel: () => void;
  onResolve: () => void;
}

export function ConflictResolutionFooter({
  unresolvedCount,
  isProcessing,
  onCancel,
  onResolve,
}: ConflictResolutionFooterProps) {
  return (
    <div className="flex justify-between items-center flex-shrink-0 pt-4">
      <div className="text-sm text-muted-foreground">
        {unresolvedCount > 0 && (
          <span className="text-yellow-700">
            {unresolvedCount} conflict{unresolvedCount !== 1 ? "s" : ""} need
            {unresolvedCount === 1 ? "s" : ""} resolution
          </span>
        )}
        {unresolvedCount === 0 && (
          <span className="text-green-700 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            All conflicts resolved
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          onClick={onResolve}
          disabled={unresolvedCount > 0 || isProcessing}
        >
          {isProcessing ? "Processing..." : `Process Import`}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
