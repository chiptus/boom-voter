import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useOnlineStatus, useOfflineData } from "@/hooks/useOffline";
import { useArtistsQuery } from "./useArtistsQuery";
import type { Artist } from "@/services/queries";
import { RealtimeChannel } from "@supabase/supabase-js";

// Note: Currently not using merge logic, but keeping for future enhancement

export const useOfflineArtistsQuery = () => {
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isOnline = useOnlineStatus();
  const { offlineReady, saveArtistsOffline, getArtistsOffline } =
    useOfflineData();

  // Get online data when available
  const {
    data: onlineArtists = [],
    isLoading: onlineLoading,
    error: onlineError,
    refetch,
  } = useArtistsQuery();

  // Query for offline data
  const offlineQuery = useQuery({
    queryKey: ["artists", "offline"],
    queryFn: getArtistsOffline,
    enabled: offlineReady && !isOnline,
    staleTime: Infinity, // Offline data doesn't expire
  });

  // Main query that combines online and offline data
  const combinedQuery = useQuery({
    queryKey: ["artists", "combined", isOnline],
    queryFn: async (): Promise<{
      artists: Artist[];
      dataSource: "online" | "offline";
    }> => {
      if (isOnline && onlineArtists.length > 0) {
        // Save to offline storage when online data is available
        if (offlineReady) {
          await saveArtistsOffline(onlineArtists);
        }
        return { artists: onlineArtists, dataSource: "online" };
      } else if (!isOnline && offlineQuery.data) {
        // Use offline data when offline
        return { artists: offlineQuery.data, dataSource: "offline" };
      } else if (isOnline && !onlineArtists.length && offlineQuery.data) {
        // Fallback to offline if online fails but offline available
        return { artists: offlineQuery.data, dataSource: "offline" };
      }

      return { artists: [], dataSource: isOnline ? "online" : "offline" };
    },
    enabled:
      (isOnline && !onlineLoading) ||
      (!isOnline && !!offlineQuery.data) ||
      (offlineReady && !isOnline),
    staleTime: isOnline ? 5 * 60 * 1000 : Infinity, // 5 min for online, infinite for offline
  });

  // Set up real-time subscriptions when online
  useEffect(() => {
    if (!isOnline) {
      // Clean up any existing channel when going offline
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    // Clean up any existing channel first
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    try {
      // Create unique channel name to prevent conflicts
      const channelName = `artists-changes-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const artistsChannel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "artists",
          },
          () => {
            // Invalidate queries to refetch fresh data
            queryClient.invalidateQueries({ queryKey: ["artists"] });
          },
        )
        .subscribe((_, err) => {
          if (err) {
            console.error("Subscription error:", err);
          }
        });

      channelRef.current = artistsChannel;
    } catch (err) {
      console.error("Failed to create subscription channel:", err);
    }

    return () => {
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        } catch (err) {
          console.error("Error cleaning up channel:", err);
        }
        channelRef.current = null;
      }
    };
  }, [queryClient, isOnline]);

  const fetchArtists = async () => {
    if (isOnline) {
      refetch();
      combinedQuery.refetch();
    } else {
      offlineQuery.refetch();
      combinedQuery.refetch();
    }
  };

  return {
    artists: combinedQuery.data?.artists || [],
    dataSource:
      combinedQuery.data?.dataSource || (isOnline ? "online" : "offline"),
    loading: combinedQuery.isLoading || onlineLoading,
    error: combinedQuery.error || onlineError || offlineQuery.error,
    fetchArtists,
    refetch: fetchArtists,
  };
};
