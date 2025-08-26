import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Query key factory
export const knowledgeKeys = {
  all: ["knowledge"] as const,
  user: (userId: string) => [...knowledgeKeys.all, "user", userId] as const,
};

// Business logic functions
async function fetchUserKnowledge(
  userId: string,
): Promise<Record<string, boolean>> {
  const { data, error } = await supabase
    .from("artist_knowledge")
    .select("artist_id")
    .eq("user_id", userId);

  if (error) {
    throw new Error("Failed to fetch user knowledge");
  }

  return (data || []).reduce(
    (acc, knowledge) => {
      acc[knowledge.artist_id] = true;
      return acc;
    },
    {} as Record<string, boolean>,
  );
}

async function toggleKnowledge(variables: {
  artistId: string;
  userId: string;
  isKnown: boolean;
}) {
  const { artistId, userId, isKnown } = variables;

  if (isKnown) {
    const { error } = await supabase
      .from("artist_knowledge")
      .delete()
      .eq("user_id", userId)
      .eq("artist_id", artistId);

    if (error) throw new Error("Failed to remove knowledge");
    return false;
  } else {
    const { error } = await supabase.from("artist_knowledge").insert({
      user_id: userId,
      artist_id: artistId,
    });

    if (error) throw new Error("Failed to add knowledge");
    return true;
  }
}

// Hooks
export function useUserKnowledgeQuery(userId: string | undefined) {
  return useQuery({
    queryKey: knowledgeKeys.user(userId || ""),
    queryFn: () => fetchUserKnowledge(userId!),
    enabled: !!userId,
  });
}

export function useKnowledgeToggleMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: toggleKnowledge,
    onMutate: async (variables) => {
      const { artistId, userId, isKnown } = variables;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: knowledgeKeys.user(userId),
      });

      // Snapshot the previous value
      const previousKnowledge = queryClient.getQueryData<
        Record<string, boolean>
      >(knowledgeKeys.user(userId));

      // Optimistically update to the new value
      queryClient.setQueryData<Record<string, boolean>>(
        knowledgeKeys.user(userId),
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
        },
      );

      return { previousKnowledge, userId };
    },
    onError: (_error, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousKnowledge) {
        queryClient.setQueryData(
          knowledgeKeys.user(context.userId),
          context.previousKnowledge,
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
        queryKey: knowledgeKeys.user(variables.userId),
      });
    },
  });
}

export function useKnowledge() {
  const { user } = useAuth();
  const { data: userKnowledge = {} } = useUserKnowledgeQuery(user?.id);
  const knowledgeToggleMutation = useKnowledgeToggleMutation();

  async function handleKnowledgeToggle(artistId: string) {
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
      console.error("failed toggling knowledge", error);
      return { requiresAuth: false };
    }
  }

  return {
    userKnowledge,
    handleKnowledgeToggle,
  };
}
