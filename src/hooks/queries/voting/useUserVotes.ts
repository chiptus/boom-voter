import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Query key factory
export const userVotesKeys = {
  all: ["votes"] as const,
  user: (userId: string) => [...userVotesKeys.all, "user", userId] as const,
};

// Business logic function
async function fetchUserVotes(userId: string): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("votes")
    .select("set_id, vote_type")
    .eq("user_id", userId);

  if (error) {
    throw new Error("Failed to fetch user votes");
  }

  const votes: Record<string, number> = {};

  (data || []).forEach((vote) => {
    if (vote.set_id) {
      votes[vote.set_id] = vote.vote_type;
    }
  });

  return votes;
}

// Hook
export function useUserVotes(userId: string | undefined) {
  return useQuery({
    queryKey: userVotesKeys.user(userId!),
    queryFn: () => fetchUserVotes(userId!),
    enabled: !!userId,
  });
}
