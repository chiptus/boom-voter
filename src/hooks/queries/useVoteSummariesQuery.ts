import { useQuery } from "@tanstack/react-query";
import { voteSummaryQueries, queryFunctions } from "@/services/queries";

export const useVoteSummariesQuery = () => {
  return useQuery({
    queryKey: voteSummaryQueries.byArtist(),
    queryFn: queryFunctions.fetchVoteSummaries,
    staleTime: 1000 * 60 * 2, // Cache for 2 minutes
  });
};