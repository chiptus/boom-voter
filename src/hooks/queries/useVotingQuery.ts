import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { voteQueries, queryFunctions, mutationFunctions, artistQueries } from "@/services/queries";
import { useAuth } from "@/hooks/useAuth";

export const useUserVotesQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: voteQueries.user(userId || ''),
    queryFn: () => queryFunctions.fetchUserVotes(userId!),
    enabled: !!userId,
  });
};

export const useVoteMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mutationFunctions.vote,
    onMutate: async (variables) => {
      const { artistId, voteType, userId, existingVote } = variables;
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: voteQueries.user(userId) });
      
      // Snapshot the previous value
      const previousVotes = queryClient.getQueryData<Record<string, number>>(voteQueries.user(userId));
      
      // Optimistically update to the new value
      queryClient.setQueryData<Record<string, number>>(voteQueries.user(userId), old => {
        if (!old) return {};
        const newVotes = { ...old };
        
        if (existingVote === voteType) {
          // Remove vote
          delete newVotes[artistId];
        } else {
          // Add/update vote
          newVotes[artistId] = voteType;
        }
        
        return newVotes;
      });
      
      return { previousVotes, userId };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousVotes) {
        queryClient.setQueryData(voteQueries.user(context.userId), context.previousVotes);
      }
      
      toast({
        title: "Error",
        description: "Failed to save vote. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: voteQueries.user(variables.userId) });
      queryClient.invalidateQueries({ queryKey: artistQueries.lists() });
      queryClient.invalidateQueries({ queryKey: artistQueries.detail(variables.artistId) });
    },
  });
};
