import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { artistQueries, setQueries, queryFunctions, mutationFunctions } from "@/services/queries";

// Legacy artist queries - these will fetch sets by default for Boom 2025
export const useArtistsQuery = () => {
  return useQuery({
    queryKey: setQueries.lists(),
    queryFn: queryFunctions.fetchSets,
  });
};

export const useArtistQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: setQueries.detail(id || ''),
    queryFn: () => queryFunctions.fetchSet(id!),
    enabled: !!id,
  });
};

export const useArchiveArtistMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mutationFunctions.archiveArtist,
    onSuccess: () => {
      // Invalidate both artists and sets lists
      queryClient.invalidateQueries({ queryKey: artistQueries.lists() });
      queryClient.invalidateQueries({ queryKey: setQueries.lists() });
      toast({
        title: "Success",
        description: "Artist archived successfully",
      });
    },
    onError: (error) => {
      console.error('Error archiving artist:', error);
      toast({
        title: "Error",
        description: "Failed to archive artist",
        variant: "destructive",
      });
    },
  });
};