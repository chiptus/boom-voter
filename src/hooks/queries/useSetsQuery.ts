import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  setQueries,
  queryFunctions,
  mutationFunctions,
} from "@/services/queries";

export const useSetsQuery = () => {
  return useQuery({
    queryKey: setQueries.lists(),
    queryFn: queryFunctions.fetchSets,
  });
};

export const useSetQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: setQueries.detail(id || ""),
    queryFn: () => queryFunctions.fetchSet(id!),
    enabled: !!id,
  });
};

export const useSetsByEditionQuery = (editionId: string | undefined) => {
  return useQuery({
    queryKey: setQueries.byEdition(editionId || ""),
    queryFn: () => queryFunctions.fetchSetsByEdition(editionId!),
    enabled: !!editionId,
  });
};

export const useVoteMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mutationFunctions.vote,
    onSuccess: () => {
      // Invalidate both sets and votes queries
      queryClient.invalidateQueries({ queryKey: setQueries.lists() });
      queryClient.invalidateQueries({ queryKey: ["votes"] });
    },
    onError: (error) => {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "Failed to save vote",
        variant: "destructive",
      });
    },
  });
};
