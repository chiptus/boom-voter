import { useQuery } from "@tanstack/react-query";
import { stageQueries, queryFunctions } from "@/services/queries";

export const useStagesQuery = () => {
  return useQuery({
    queryKey: stageQueries.all(),
    queryFn: queryFunctions.fetchStages,
  });
};

export const useStagesByEditionQuery = (editionId: string | undefined) => {
  return useQuery({
    queryKey: stageQueries.byEdition(editionId || ''),
    queryFn: () => queryFunctions.fetchStagesByEdition(editionId!),
    enabled: !!editionId,
  });
};