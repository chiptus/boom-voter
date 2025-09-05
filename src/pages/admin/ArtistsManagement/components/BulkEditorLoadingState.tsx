export function BulkEditorLoadingState() {
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading artists...</p>
      </div>
    </div>
  );
}
