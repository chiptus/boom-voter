import { useOfflineSetsQuery } from "./queries/useOfflineSetsQuery";

export function useOfflineSetsData() {
  // Use the new React Query-based offline sets hook
  const { sets, dataSource, loading, error, fetchSets, refetch } =
    useOfflineSetsQuery();

  return {
    sets,
    loading,
    error,
    dataSource,
    fetchArtists: fetchSets, // Keep original API name for compatibility
    refetch,
  };
}
