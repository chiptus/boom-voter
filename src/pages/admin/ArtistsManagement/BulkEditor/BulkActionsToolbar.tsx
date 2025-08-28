import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Square, Archive, Download } from "lucide-react";

interface BulkActionsToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export function BulkActionsToolbar({
  selectedCount,
  totalCount,
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

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: Implement bulk archive
              console.log("Bulk archive:", selectedCount);
            }}
          >
            <Archive className="h-3 w-3 mr-1" />
            Archive
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: Implement bulk export
              console.log("Bulk export:", selectedCount);
            }}
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>

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
