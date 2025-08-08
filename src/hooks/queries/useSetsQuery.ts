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

export const useSetBySlugQuery = (slug: string | undefined) => {
  return useQuery({
    queryKey: setQueries.bySlug(slug || ""),
    queryFn: () => queryFunctions.fetchSetBySlug(slug!),
    enabled: !!slug,
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

export const useCreateSetMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: queryFunctions.createSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: setQueries.lists() });
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      toast({
        title: "Success",
        description: "Set created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating set:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create set",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSetMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      queryFunctions.updateSet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: setQueries.lists() });
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      toast({
        title: "Success",
        description: "Set updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating set:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update set",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSetMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: queryFunctions.deleteSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: setQueries.lists() });
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      toast({
        title: "Success",
        description: "Set deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting set:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete set",
        variant: "destructive",
      });
    },
  });
};

export const useAddArtistToSetMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ setId, artistId }: { setId: string; artistId: string }) =>
      queryFunctions.addArtistToSet(setId, artistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: setQueries.lists() });
      queryClient.invalidateQueries({ queryKey: ["artists"] });
    },
    onError: (error) => {
      console.error("Error adding artist to set:", error);
      toast({
        title: "Error",
        description: "Failed to add artist to set",
        variant: "destructive",
      });
    },
  });
};

export const useRemoveArtistFromSetMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ setId, artistId }: { setId: string; artistId: string }) =>
      queryFunctions.removeArtistFromSet(setId, artistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: setQueries.lists() });
      queryClient.invalidateQueries({ queryKey: ["artists"] });
    },
    onError: (error) => {
      console.error("Error removing artist from set:", error);
      toast({
        title: "Error",
        description: "Failed to remove artist from set",
        variant: "destructive",
      });
    },
  });
};
