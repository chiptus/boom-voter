import { useState } from "react";
import type { Artist } from "@/hooks/queries/artists/useArtists";

export type ArtistChange<T extends keyof Artist = keyof Artist> = {
  id: string;
  field: T;
  oldValue: Artist[T];
  newValue: Artist[T];
};

export function useArtistChangeTracking() {
  const [changes, setChanges] = useState<Map<string, ArtistChange[]>>(
    new Map(),
  );

  function addChange<T extends keyof Artist>(
    artistId: string,
    change: ArtistChange<T>,
  ) {
    const artistChanges = changes.get(artistId) || [];
    const existingIndex = artistChanges.findIndex(
      (c) => c.field === change.field,
    );

    let updatedChanges;
    if (existingIndex >= 0) {
      updatedChanges = [...artistChanges];
      updatedChanges[existingIndex] = change;
    } else {
      updatedChanges = [...artistChanges, change];
    }

    const newChanges = new Map(changes);
    newChanges.set(artistId, updatedChanges);
    setChanges(newChanges);
  }

  function removeChange(artistId: string, field: keyof Artist) {
    const artistChanges = changes.get(artistId) || [];
    const updatedChanges = artistChanges.filter((c) => c.field !== field);

    if (updatedChanges.length === 0) {
      const newChanges = new Map(changes);
      newChanges.delete(artistId);
      setChanges(newChanges);
    } else {
      const newChanges = new Map(changes);
      newChanges.set(artistId, updatedChanges);
      setChanges(newChanges);
    }
  }

  function resetChanges() {
    setChanges(new Map());
  }

  const totalChanges = Array.from(changes.values()).reduce(
    (sum, artistChanges) => sum + artistChanges.length,
    0,
  );

  return {
    changes,
    addChange,
    removeChange,
    resetChanges,
    totalChanges,
  };
}
