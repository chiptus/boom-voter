import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authQueries, queryFunctions, mutationFunctions } from "@/services/queries";
import { useOfflineProfile } from "@/hooks/useOfflineProfile";
import type { Database } from "@/integrations/supabase/types";


export const useProfileQuery = (userId?: string) => {
  const { cacheProfile, getCachedProfile, showOfflineProfileToast, isOnline } = useOfflineProfile();

  return useQuery({
    queryKey: authQueries.profile(userId),
    queryFn: async () => {
      if (!userId) return null;

      try {
        // Try online fetch first
        if (isOnline) {
          const profile = await queryFunctions.fetchProfile(userId);
          // Cache successful fetch
          await cacheProfile(userId, profile);
          return profile;
        } else {
          // Use cached data when offline
          const cachedProfile = await getCachedProfile(userId);
          if (cachedProfile) {
            showOfflineProfileToast();
            return cachedProfile;
          }
          throw new Error('No profile data available offline');
        }
      } catch (error) {
        // Fallback to cache on error
        if (isOnline) {
          console.error('Online profile fetch failed, using cache:', error);
          const cachedProfile = await getCachedProfile(userId);
          if (cachedProfile) {
            showOfflineProfileToast();
            return cachedProfile;
          }
        }
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours (was cacheTime)
    retry: (failureCount, error) => {
      // Don't retry if we're offline and have cached data
      if (!isOnline) return false;
      return failureCount < 2;
    },
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const { cacheProfile } = useOfflineProfile();
  
  return useMutation({
    mutationFn: mutationFunctions.updateProfile,
    onSuccess: async (data, variables) => {
      // Update the profile cache
      queryClient.setQueryData(authQueries.profile(variables.userId), data);
      
      // Update offline cache
      await cacheProfile(variables.userId, data);
      
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({
        queryKey: authQueries.profile(variables.userId),
      });
    },
  });
};