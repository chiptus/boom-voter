import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { profileOfflineService } from "@/services/profileOfflineService";
import { useOfflineProfileToast } from "@/hooks/useOfflineProfileToast";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Query key factory
export const profileKeys = {
  all: ["auth", "profile"] as const,
  detail: (userId?: string) => [...profileKeys.all, userId] as const,
};

// Business logic function
async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error("Failed to fetch profile");
  }

  return data;
}

// Hook with offline support
export function useProfileQuery(userId: string | undefined) {
  const { showOfflineProfileToast, isOnline } = useOfflineProfileToast();

  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: async () => {
      if (!userId) return null;

      try {
        // Try online fetch first
        if (isOnline) {
          const profile = await fetchProfile(userId);
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
