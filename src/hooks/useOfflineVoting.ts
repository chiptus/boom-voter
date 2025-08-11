import { useState, useCallback } from "react";
import {
  useOfflineVotingQuery,
  useOfflineVoteMutation,
} from "./queries/useOfflineVotingQuery";
import type { User } from "@supabase/supabase-js";

export function useOfflineVoting(user: User | null, onVoteUpdate?: () => void) {
  const [votingLoading, setVotingLoading] = useState<Record<string, boolean>>(
    {},
  );

  const {
    data: userVotes = {},
    isLoading,
    error,
  } = useOfflineVotingQuery(user);

  const voteMutation = useOfflineVoteMutation(user, onVoteUpdate);

  const handleVote = useCallback(
    async (setId: string, voteType: number) => {
      if (!user) {
        return { requiresAuth: true };
      }

      if (votingLoading[setId]) {
        return { requiresAuth: false };
      }

      try {
        setVotingLoading((prev) => ({ ...prev, [setId]: true }));

        await voteMutation.mutateAsync({ setId, voteType });

        return { requiresAuth: false };
      } catch (error) {
        console.error("Error voting:", error);
        return { requiresAuth: false, error: true };
      } finally {
        setVotingLoading((prev) => ({ ...prev, [setId]: false }));
      }
    },
    [user, votingLoading, voteMutation],
  );

  const getUserVote = useCallback(
    (itemId: string): number | undefined => {
      return userVotes[itemId];
    },
    [userVotes],
  );

  return {
    userVotes,
    loading: isLoading,
    error: error?.message || null,
    votingLoading,
    handleVote,
    getUserVote,
  };
}
