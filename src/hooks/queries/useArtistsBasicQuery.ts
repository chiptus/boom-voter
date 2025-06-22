import { useQuery } from "@tanstack/react-query";
import { artistQueries, queryFunctions } from "@/services/queries";

export const useArtistsBasicQuery = () => {
  return useQuery({
    queryKey: [...artistQueries.lists(), 'basic'],
    queryFn: queryFunctions.fetchArtistsBasic,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in memory for 10 minutes
    refetchOnWindowFocus: false, // Prevent refetch on navigation back
  });
};