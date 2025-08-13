import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authQueries,
  queryFunctions,
  mutationFunctions,
} from "@/services/queries";
import { profileOfflineService } from "@/services/profileOfflineService";
import { useOfflineProfileToast } from "@/hooks/useOfflineProfileToast";

export function useProfileQuery(userId?: string) {
  const { showOfflineProfileToast, isOnline } = useOfflineProfileToast();

  return useQuery({
    queryKey: authQueries.profile(userId),
    queryFn: async () => {
      if (!userId) return null;

      try {
        // Try online fetch first
        if (isOnline) {
          const profile = await queryFunctions.fetchProfile(userId);
          // Cache successful fetch
          await profileOfflineService.cacheProfile(userId, profile);
          return profile;
        } else {
          // Use cached data when offline
          const cachedProfile =
            await profileOfflineService.getCachedProfile(userId);
          if (cachedProfile) {
            showOfflineProfileToast();
            return cachedProfile;
          }
          throw new Error("No profile data available offline");
        }
      } catch (error) {
        // Fallback to cache on error
        if (isOnline) {
          console.error("Online profile fetch failed, using cache:", error);
          const cachedProfile =
            await profileOfflineService.getCachedProfile(userId);
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
    retry: (failureCount, _error) => {
      // Don't retry if we're offline and have cached data
      if (!isOnline) return false;
      return failureCount < 2;
    },
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutationFunctions.updateProfile,
    onSuccess: async (data, variables) => {
      // Update the profile cache
      queryClient.setQueryData(authQueries.profile(variables.userId), data);

      // Update offline cache
      await profileOfflineService.cacheProfile(variables.userId, data);

      // Invalidate to ensure consistency
      queryClient.invalidateQueries({
        queryKey: authQueries.profile(variables.userId),
      });
    },
  });
}
