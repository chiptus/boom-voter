import { useCallback } from 'react';
import { useOnlineStatus } from './useOffline';
import { offlineStorage } from '@/lib/offlineStorage';
import { useToast } from '@/hooks/use-toast';

export const useOfflineProfile = () => {
  const isOnline = useOnlineStatus();
  const { toast } = useToast();

  const cacheProfile = useCallback(async (userId: string, profile: any) => {
    try {
      await offlineStorage.saveProfile(userId, profile);
    } catch (error) {
      console.error('Error caching profile:', error);
    }
  }, []);

  const getCachedProfile = useCallback(async (userId: string) => {
    try {
      return await offlineStorage.getProfile(userId);
    } catch (error) {
      console.error('Error getting cached profile:', error);
      return null;
    }
  }, []);

  const clearCachedProfile = useCallback(async (userId: string) => {
    try {
      await offlineStorage.clearProfile(userId);
    } catch (error) {
      console.error('Error clearing cached profile:', error);
    }
  }, []);

  const showOfflineProfileToast = useCallback(() => {
    if (!isOnline) {
      toast({
        title: "Using cached profile",
        description: "Profile data is from offline cache (will sync when online)",
      });
    }
  }, [isOnline, toast]);

  return {
    cacheProfile,
    getCachedProfile,
    clearCachedProfile,
    showOfflineProfileToast,
    isOnline,
  };
};