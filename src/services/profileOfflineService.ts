import { OffineProfile, offlineStorage } from "@/lib/offlineStorage";

export const profileOfflineService = {
  async cacheProfile(userId: string, profile: OffineProfile): Promise<void> {
    try {
      await offlineStorage.saveProfile(userId, profile);
    } catch (error) {
      console.error("Error caching profile:", error);
    }
  },

  async getCachedProfile(userId: string): Promise<OffineProfile | null> {
    try {
      return await offlineStorage.getProfile(userId);
    } catch (error) {
      console.error("Error getting cached profile:", error);
      return null;
    }
  },

  async clearCachedProfile(userId: string): Promise<void> {
    try {
      await offlineStorage.clearProfile(userId);
    } catch (error) {
      console.error("Error clearing cached profile:", error);
    }
  },
};
