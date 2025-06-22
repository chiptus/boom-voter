import { useQuery } from "@tanstack/react-query";
import { artistQueries, queryFunctions } from "@/services/queries";

export const useArtistsBasicQuery = () => {
  return useQuery({
    queryKey: [...artistQueries.lists(), 'basic'],
    queryFn: queryFunctions.fetchArtistsBasic,
  });
};