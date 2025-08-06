import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryFunctions, mutationFunctions } from "@/services/queries";
import { useAuth } from "@/hooks/useAuth";

export const useUserKnowledgeQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["knowledge", "user", userId || ""],
    queryFn: () => queryFunctions.fetchUserKnowledge(userId!),
    enabled: !!userId,
  });
};

export const useKnowledgeToggleMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mutationFunctions.toggleKnowledge,
    onMutate: async (variables) => {
      const { artistId, userId, isKnown } = variables;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["knowledge", "user", userId],
      });

      // Snapshot the previous value
      const previousKnowledge = queryClient.getQueryData<
        Record<string, boolean>
      >(["knowledge", "user", userId]);

      // Optimistically update to the new value
      queryClient.setQueryData<Record<string, boolean>>(
        ["knowledge", "user", userId],
        (old) => {
          if (!old) return {};
          const newKnowledge = { ...old };

          if (isKnown) {
            // Remove knowledge
            delete newKnowledge[artistId];
          } else {
            // Add knowledge
            newKnowledge[artistId] = true;
          }

          return newKnowledge;
        }
      );

      return { previousKnowledge, userId };
    },
    onError: (_error, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousKnowledge) {
        queryClient.setQueryData(
          ["knowledge", "user", context.userId],
          context.previousKnowledge
        );
      }

      toast({
        title: "Error",
        description: "Failed to update knowledge. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: (_data, _error, variables) => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["knowledge", "user", variables.userId],
      });
    },
  });
};

export const useKnowledge = () => {
  const { user } = useAuth();
  const { data: userKnowledge = {} } = useUserKnowledgeQuery(user?.id);
  const knowledgeToggleMutation = useKnowledgeToggleMutation();

  const handleKnowledgeToggle = async (artistId: string) => {
    if (!user) {
      return { requiresAuth: true };
    }

    const isKnown = userKnowledge[artistId];

    try {
      await knowledgeToggleMutation.mutateAsync({
        artistId,
        userId: user.id,
        isKnown,
      });
      return { requiresAuth: false };
    } catch (error) {
      return { requiresAuth: false };
    }
  };

  return {
    userKnowledge,
    handleKnowledgeToggle,
  };
};
