import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { BulkActionsToolbar } from "../BulkEditor/BulkActionsToolbar";

interface BulkEditorSearchAndActionsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export function BulkEditorSearchAndActions({
  searchTerm,
  onSearchChange,
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
}: BulkEditorSearchAndActionsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search artists..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <BulkActionsToolbar
        selectedCount={selectedCount}
        totalCount={totalCount}
        onSelectAll={onSelectAll}
        onClearSelection={onClearSelection}
      />
    </div>
  );
}
