import { useState, useMemo } from "react";
import type { Artist } from "@/hooks/queries/artists/useArtists";

export type SortConfig = {
  key: keyof Artist | "genres";
  direction: "asc" | "desc";
} | null;

export function useArtistSorting() {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  function handleSort(key: keyof Artist | "genres") {
    setSortConfig((current) => {
      if (current?.key === key) {
        return current.direction === "asc" ? { key, direction: "desc" } : null;
      }
      return { key, direction: "asc" };
    });
  }

  const sortArtists = useMemo(() => {
    return (artists: Artist[]) => {
      if (!sortConfig) return artists;

      return [...artists].sort((a, b) => {
        let aValue:
          | string
          | number
          | boolean
          | { music_genre_id: string }[]
          | null;
        let bValue:
          | string
          | number
          | boolean
          | { music_genre_id: string }[]
          | null;

        if (sortConfig.key === "genres") {
          aValue = a.artist_music_genres?.length || 0;
          bValue = b.artist_music_genres?.length || 0;
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === "asc" ? 1 : -1;
        if (bValue == null) return sortConfig.direction === "asc" ? -1 : 1;

        if (typeof aValue !== typeof bValue) return 0;

        // String comparison
        if (typeof aValue === "string" && typeof bValue === "string") {
          const comparison = aValue.localeCompare(bValue);
          return sortConfig.direction === "asc" ? comparison : -comparison;
        }

        // Numeric comparison
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    };
  }, [sortConfig]);

  return {
    sortConfig,
    handleSort,
    sortArtists,
  };
}
