import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

// Background refetching strategies
export const useBackgroundRefresh = () => {
  const queryClient = useQueryClient();

  // Smart invalidation - only invalidate related queries
  const invalidateArtistData = useCallback((artistId?: string) => {
    if (artistId) {
      // Invalidate specific artist
      queryClient.invalidateQueries({ queryKey: ['artists', 'detail', artistId] });
      queryClient.invalidateQueries({ queryKey: ['artists', 'detail', artistId, 'notes'] });
    } else {
      // Invalidate all artist lists
      queryClient.invalidateQueries({ queryKey: ['artists', 'list'] });
    }
  }, [queryClient]);

  const invalidateUserData = useCallback((userId: string) => {
    queryClient.invalidateQueries({ queryKey: ['votes', 'user', userId] });
    queryClient.invalidateQueries({ queryKey: ['knowledge', 'user', userId] });
    queryClient.invalidateQueries({ queryKey: ['groups', 'user', userId] });
  }, [queryClient]);

  // Background refetch without showing loading states
  const refreshArtistsInBackground = useCallback(() => {
    queryClient.refetchQueries({ 
      queryKey: ['artists', 'list'],
      type: 'active' // Only refetch if query is currently being used
    });
  }, [queryClient]);

  const refreshUserDataInBackground = useCallback((userId: string) => {
    queryClient.refetchQueries({ 
      queryKey: ['votes', 'user', userId],
      type: 'active'
    });
    queryClient.refetchQueries({ 
      queryKey: ['knowledge', 'user', userId],
      type: 'active'
    });
  }, [queryClient]);

  // Optimized query removal for better memory management
  const cleanupOldData = useCallback(() => {
    queryClient.removeQueries({ 
      predicate: (query) => {
        const lastUpdated = query.state.dataUpdatedAt;
        const isOld = Date.now() - lastUpdated > (10 * 60 * 1000); // 10 minutes old
        return isOld && !query.getObserversCount();
      }
    });
  }, [queryClient]);

  return {
    invalidateArtistData,
    invalidateUserData,
    refreshArtistsInBackground,
    refreshUserDataInBackground,
    cleanupOldData,
  };
};