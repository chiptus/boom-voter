import { useOfflineArtistsQuery } from "./queries/useOfflineArtistsQuery";
import { useArchiveArtistMutation } from "./queries/artists/useArchiveArtist";

export function useOfflineArtistData() {
  // Use the new React Query-based offline artists hook
  const { artists, dataSource, loading, error, fetchArtists, refetch } =
    useOfflineArtistsQuery();

  // Keep the archive mutation separate
  const archiveArtistMutation = useArchiveArtistMutation();

  return {
    artists,
    loading,
    error,
    dataSource,
    fetchArtists,
    archiveArtist: archiveArtistMutation.mutate,
    archivingArtist: archiveArtistMutation.isPending,
    refetch,
  };
}
