import { useQueryClient } from "@tanstack/react-query";
import { artistQueries, voteQueries, groupQueries } from "@/services/queries";

// Prefetching strategies for better UX
export const usePrefetching = () => {
  const queryClient = useQueryClient();

  const prefetchArtistDetail = (artistId: string) => {
    queryClient.prefetchQuery({
      queryKey: artistQueries.detail(artistId),
      queryFn: () => import("@/services/queries").then(({ queryFunctions }) => 
        queryFunctions.fetchArtist(artistId)
      ),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const prefetchArtistNotes = (artistId: string) => {
    queryClient.prefetchQuery({
      queryKey: artistQueries.notes(artistId),
      queryFn: () => import("@/services/queries").then(({ queryFunctions }) => 
        queryFunctions.fetchArtistNotes(artistId)
      ),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  const prefetchUserData = (userId: string) => {
    // Prefetch user votes
    queryClient.prefetchQuery({
      queryKey: voteQueries.user(userId),
      queryFn: () => import("@/services/queries").then(({ queryFunctions }) => 
        queryFunctions.fetchUserVotes(userId)
      ),
      staleTime: 30 * 1000, // 30 seconds
    });

    // Prefetch user knowledge
    queryClient.prefetchQuery({
      queryKey: ['knowledge', 'user', userId],
      queryFn: () => import("@/services/queries").then(({ queryFunctions }) => 
        queryFunctions.fetchUserKnowledge(userId)
      ),
      staleTime: 30 * 1000, // 30 seconds
    });

    // Prefetch user groups
    queryClient.prefetchQuery({
      queryKey: groupQueries.user(userId),
      queryFn: () => import("@/services/queries").then(({ queryFunctions }) => 
        queryFunctions.fetchUserGroups(userId)
      ),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  return {
    prefetchArtistDetail,
    prefetchArtistNotes,
    prefetchUserData,
  };
};