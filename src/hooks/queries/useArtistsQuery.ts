import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { artistQueries, queryFunctions, mutationFunctions } from "@/services/queries";

export const useArtistsQuery = () => {
  return useQuery({
    queryKey: artistQueries.lists(),
    queryFn: queryFunctions.fetchArtists,
  });
};

export const useArtistQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: artistQueries.detail(id || ''),
    queryFn: () => queryFunctions.fetchArtist(id!),
    enabled: !!id,
  });
};

export const useArchiveArtistMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mutationFunctions.archiveArtist,
    onSuccess: () => {
      // Invalidate and refetch artists list
      queryClient.invalidateQueries({ queryKey: artistQueries.lists() });
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