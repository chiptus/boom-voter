import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Square } from "lucide-react";
import { ArchiveButton } from "../components/ArchiveButton";

interface BulkActionsToolbarProps {
  selectedCount: number;
  totalCount: number;
  selectedIds: Set<string>;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export function BulkActionsToolbar({
  selectedCount,
  totalCount,
  selectedIds,
  onSelectAll,
  onClearSelection,
}: BulkActionsToolbarProps) {
  const allSelected = selectedCount === totalCount && totalCount > 0;
  const someSelected = selectedCount > 0;

  return (
    <div className="flex items-center gap-2">
      {someSelected && (
        <>
          <Badge variant="secondary">{selectedCount} selected</Badge>

          <ArchiveButton
            selectedIds={selectedIds}
            selectedCount={selectedCount}
            onSuccess={onClearSelection}
          />

          <Button variant="outline" size="sm" onClick={onClearSelection}>
            Clear
          </Button>
        </>
      )}

      <Button variant="outline" size="sm" onClick={onSelectAll}>
        {allSelected ? (
          <>
            <Square className="h-3 w-3 mr-1" />
            Deselect All
          </>
        ) : (
          <>
            <CheckSquare className="h-3 w-3 mr-1" />
            Select All
          </>
        )}
      </Button>
    </div>
  );
}
