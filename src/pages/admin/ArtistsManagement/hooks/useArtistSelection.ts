import { useState } from "react";

export function useArtistSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  function handleSelectAll(allArtistIds: string[]) {
    if (selectedIds.size === allArtistIds.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allArtistIds));
    }
  }

  function handleSelectArtist(artistId: string, isSelected: boolean) {
    const newSelected = new Set(selectedIds);
    if (isSelected) {
      newSelected.add(artistId);
    } else {
      newSelected.delete(artistId);
    }
    setSelectedIds(newSelected);
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  return {
    selectedIds,
    handleSelectAll,
    handleSelectArtist,
    clearSelection,
  };
}
