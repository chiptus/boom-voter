import type { Artist } from "@/hooks/queries/artists/useArtists";
import {
  useArtistChangeTracking,
  type ArtistChange,
} from "./useArtistChangeTracking";

export function useArtistMutations(artists: Artist[]) {
  const { changes, addChange, removeChange, resetChanges, totalChanges } =
    useArtistChangeTracking();

  function handleFieldChange<T extends keyof Artist>(
    artistId: string,
    field: T,
    newValue: Artist[T],
  ) {
    const artist = artists.find((a) => a.id === artistId);
    if (!artist) return;

    const oldValue = artist[field];

    // If value is unchanged, remove any existing change
    if (oldValue === newValue) {
      removeChange(artistId, field);
      return;
    }

    // Add or update change
    const change: ArtistChange<T> = {
      id: artistId,
      field,
      oldValue,
      newValue,
    };

    addChange(artistId, change);
  }

  function getArtistWithChanges(artist: Artist): Artist {
    const artistChanges = changes.get(artist.id);
    if (!artistChanges || artistChanges.length === 0) {
      return artist;
    }

    const modifiedArtist: Record<string, unknown> = { ...artist };
    artistChanges.forEach((change) => {
      modifiedArtist[change.field as string] = change.newValue;
    });

    return modifiedArtist as Artist;
  }

  return {
    changes,
    handleFieldChange,
    getArtistWithChanges,
    resetChanges,
    totalChanges,
  };
}
