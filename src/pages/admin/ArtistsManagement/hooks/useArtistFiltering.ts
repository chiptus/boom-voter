import { useState, useMemo } from "react";
import type { Artist } from "@/hooks/queries/artists/useArtists";

export function useArtistFiltering() {
  const [searchTerm, setSearchTerm] = useState("");

  const filterArtists = useMemo(() => {
    return (artists: Artist[]) => {
      if (!searchTerm.trim()) return artists;

      const lowerSearchTerm = searchTerm.toLowerCase();
      return artists.filter(
        (artist) =>
          artist.name.toLowerCase().includes(lowerSearchTerm) ||
          artist.description?.toLowerCase().includes(lowerSearchTerm),
      );
    };
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filterArtists,
  };
}
