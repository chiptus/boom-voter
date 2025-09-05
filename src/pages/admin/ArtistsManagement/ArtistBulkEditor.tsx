import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Artist, useArtistsQuery } from "@/hooks/queries/artists/useArtists";
import { ChangePreviewDialog } from "./BulkEditor/ChangePreviewDialog";
import { AddArtistDialog } from "./AddArtistDialog";
import { BulkEditorHeader } from "./components/BulkEditorHeader";
import { BulkEditorSearchAndActions } from "./components/BulkEditorSearchAndActions";
import { BulkEditorTable } from "./components/BulkEditorTable";
import { BulkEditorFooter } from "./components/BulkEditorFooter";
import { BulkEditorLoadingState } from "./components/BulkEditorLoadingState";
import { useArtistSorting } from "./hooks/useArtistSorting";
import { useArtistFiltering } from "./hooks/useArtistFiltering";
import { useArtistSelection } from "./hooks/useArtistSelection";
import { useArtistMutations } from "./hooks/useArtistMutations";

// Re-export types from hooks for external use
export type { ArtistChange } from "./hooks/useArtistChangeTracking";
export type { SortConfig } from "./hooks/useArtistSorting";

export function ArtistBulkEditor() {
  const [showChangePreview, setShowChangePreview] = useState(false);
  const [addArtistOpen, setAddArtistOpen] = useState(false);

  const artistsQuery = useArtistsQuery();
  const artists = useMemo(() => artistsQuery.data || [], [artistsQuery.data]);

  // Custom hooks for managing state and logic
  const { sortConfig, handleSort, sortArtists } = useArtistSorting();
  const { searchTerm, setSearchTerm, filterArtists } = useArtistFiltering();
  const { selectedIds, handleSelectAll, handleSelectArtist, clearSelection } =
    useArtistSelection();
  const {
    changes,
    handleFieldChange,
    getArtistWithChanges,
    resetChanges,
    totalChanges,
  } = useArtistMutations(artists);

  // Apply filtering and sorting
  const filteredAndSortedArtists = useMemo(() => {
    const filtered = filterArtists(artists);
    return sortArtists(filtered);
  }, [artists, filterArtists, sortArtists]);

  // Wrapper functions to match component interfaces
  function handleSelectAllWrapper() {
    handleSelectAll(filteredAndSortedArtists.map((a) => a.id));
  }

  function handleCellChangeWrapper<T extends keyof Artist>(
    artistId: string,
    field: T,
    newValue: Artist[T],
  ) {
    handleFieldChange(artistId, field, newValue);
  }

  if (artistsQuery.isLoading) {
    return <BulkEditorLoadingState />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <BulkEditorHeader
          totalChanges={totalChanges}
          onAddArtist={() => setAddArtistOpen(true)}
          onResetChanges={resetChanges}
          onSaveChanges={() => setShowChangePreview(true)}
        />

        <CardContent className="space-y-4">
          <BulkEditorSearchAndActions
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCount={selectedIds.size}
            totalCount={filteredAndSortedArtists.length}
            onSelectAll={handleSelectAllWrapper}
            onClearSelection={clearSelection}
          />

          <BulkEditorTable
            artists={filteredAndSortedArtists}
            changes={changes}
            selectedIds={selectedIds}
            sortConfig={sortConfig}
            searchTerm={searchTerm}
            onSort={handleSort}
            onSelectAll={handleSelectAllWrapper}
            onSelectArtist={handleSelectArtist}
            onCellChange={handleCellChangeWrapper}
            getArtistWithChanges={getArtistWithChanges}
          />

          <BulkEditorFooter
            filteredCount={filteredAndSortedArtists.length}
            totalCount={artists.length}
            selectedCount={selectedIds.size}
          />
        </CardContent>
      </Card>

      {showChangePreview && (
        <ChangePreviewDialog
          changes={changes}
          artists={artists}
          onClose={() => setShowChangePreview(false)}
          onConfirm={() => {
            // TODO: Implement bulk save
            console.log("Saving changes:", changes);
            resetChanges();
            setShowChangePreview(false);
          }}
        />
      )}

      <AddArtistDialog
        open={addArtistOpen}
        onOpenChange={setAddArtistOpen}
        onSuccess={() => {
          // Artist list will refresh automatically via React Query
        }}
      />
    </div>
  );
}
