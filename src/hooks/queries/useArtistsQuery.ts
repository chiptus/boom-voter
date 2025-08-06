import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  artistQueries,
  queryFunctions,
  mutationFunctions,
  UpdateArtistUpdates,
} from "@/services/queries";
import { useToast } from "@/components/ui/use-toast";

export const useArtistsQuery = () => {
  return useQuery({
    queryKey: artistQueries.lists(),
    queryFn: queryFunctions.fetchArtists,
  });
};

export const useArtistQuery = (id: string) => {
  return useQuery({
    queryKey: artistQueries.detail(id),
    queryFn: () => queryFunctions.fetchArtist(id),
    enabled: !!id,
  });
};

export const useCreateArtistMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mutationFunctions.createArtist,
    onSuccess: () => {
      // Invalidate and refetch artists lists
      queryClient.invalidateQueries({ queryKey: artistQueries.lists() });

      toast({
        title: "Success",
        description: "Artist added successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create artist",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateArtistMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateArtistUpdates;
    }) => mutationFunctions.updateArtist(id, updates),
    onSuccess: (data, variables) => {
      // Update the specific artist in cache
      queryClient.setQueryData(artistQueries.detail(variables.id), data);

      // Invalidate and refetch artists lists
      queryClient.invalidateQueries({ queryKey: artistQueries.lists() });

      toast({
        title: "Success",
        description: "Artist updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update artist",
        variant: "destructive",
      });
    },
  });
};

export const useArchiveArtistMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mutationFunctions.archiveArtist,
    onSuccess: () => {
      // Invalidate artists lists
      queryClient.invalidateQueries({ queryKey: artistQueries.lists() });
      toast({
        title: "Success",
        description: "Artist archived successfully",
      });
    },
    onError: (error) => {
      console.error("Error archiving artist:", error);
      toast({
        title: "Error",
        description: "Failed to archive artist",
        variant: "destructive",
      });
    },
  });
};
