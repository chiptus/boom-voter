import { useCallback } from 'react';
import { useOnlineStatus } from './useOffline';
import { useToast } from '@/hooks/use-toast';

export const useOfflineProfileToast = () => {
  const isOnline = useOnlineStatus();
  const { toast } = useToast();

  const showOfflineProfileToast = useCallback(() => {
    if (!isOnline) {
      toast({
        title: "Using cached profile",
        description: "Profile data is from offline cache (will sync when online)",
      });
    }
  }, [isOnline, toast]);

  return {
    showOfflineProfileToast,
    isOnline,
  };
};