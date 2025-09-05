interface BulkEditorFooterProps {
  filteredCount: number;
  totalCount: number;
  selectedCount: number;
}

export function BulkEditorFooter({
  filteredCount,
  totalCount,
  selectedCount,
}: BulkEditorFooterProps) {
  if (filteredCount === 0) return null;

  return (
    <div className="text-sm text-muted-foreground text-center">
      Showing {filteredCount} of {totalCount} artists
      {selectedCount > 0 && (
        <span className="ml-2">• {selectedCount} selected</span>
      )}
    </div>
  );
}
