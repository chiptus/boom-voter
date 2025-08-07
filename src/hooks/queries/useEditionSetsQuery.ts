import { useQuery } from "@tanstack/react-query";
import { queryFunctions, setQueries } from "@/services/queries";

export const useEditionSetsQuery = (editionId: string | undefined) => {
  return useQuery({
    queryKey: setQueries.byEdition(editionId || ""),
    queryFn: () => queryFunctions.fetchSetsByEdition(editionId!),
    enabled: !!editionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
