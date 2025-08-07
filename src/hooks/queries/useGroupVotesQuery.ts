import { useQuery } from "@tanstack/react-query";
import { groupQueries, queryFunctions } from "@/services/queries";
import { offlineStorage } from "@/lib/offlineStorage";
import { useOnlineStatus } from "@/hooks/useOffline";

export interface GroupVote {
  vote_type: number;
  user_id: string;
  username: string | null;
}

export const useGroupVotesQuery = (setId: string, groupId: string) => {
  const isOnline = useOnlineStatus();

  return useQuery({
    queryKey: groupQueries.votes(setId, groupId),
    queryFn: async (): Promise<GroupVote[]> => {
      if (!setId || !groupId) return [];

      try {
        if (isOnline) {
          return await queryFunctions.fetchSetGroupVotes(setId, groupId);
        } else {
          return await offlineStorage.getSetGroupVotes(setId, groupId);
        }
      } catch (error) {
        console.error("Error fetching group votes:", error);
        return [];
      }
    },
    enabled: !!setId && !!groupId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount) => {
      // Don't retry if we're offline and have no cached data
      if (!isOnline) return false;
      return failureCount < 2;
    },
  });
};
