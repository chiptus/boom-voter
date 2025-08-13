import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useOnlineStatus, useOfflineData } from "@/hooks/useOffline";
import { useSetsQuery } from "./useSetsQuery";
import { RealtimeChannel } from "@supabase/supabase-js";
import { FestivalSet, setsKeys } from "./sets/useSets";
import { userVotesKeys } from "./voting/useUserVotes";

export function useOfflineSetsQuery() {
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isOnline = useOnlineStatus();
  const { offlineReady, saveSetsOffline, getSetsOffline } = useOfflineData();

  // Get online data when available
  const {
    data: onlineSets = [],
    isLoading: onlineLoading,
    error: onlineError,
    refetch,
  } = useSetsQuery();

  // Query for offline data
  const offlineQuery = useQuery({
    queryKey: ["sets", "offline"],
    queryFn: getSetsOffline,
    enabled: offlineReady && !isOnline,
    staleTime: Infinity, // Offline data doesn't expire
  });

  // Main query that combines online and offline data
  const combinedQuery = useQuery({
    queryKey: ["sets", "combined", isOnline],
    queryFn: async (): Promise<{
      sets: FestivalSet[];
      dataSource: "online" | "offline";
    }> => {
      if (isOnline && onlineSets.length > 0) {
        // Save to offline storage when online data is available
        if (offlineReady) {
          await saveSetsOffline(onlineSets);
        }
        return { sets: onlineSets, dataSource: "online" };
      } else if (!isOnline && offlineQuery.data) {
        // Use offline data when offline
        return { sets: offlineQuery.data, dataSource: "offline" };
      } else if (isOnline && !onlineSets.length && offlineQuery.data) {
        // Fallback to offline if online fails but offline available
        return { sets: offlineQuery.data, dataSource: "offline" };
      }

      return { sets: [], dataSource: isOnline ? "online" : "offline" };
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
      const channelName = `sets-changes-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const setsChannel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "sets",
          },
          () => {
            // Invalidate queries to refetch fresh data
            queryClient.invalidateQueries({ queryKey: setsKeys.all });
            queryClient.invalidateQueries({ queryKey: userVotesKeys.all });
          },
        )
        .subscribe((_, err) => {
          if (err) {
            console.error("Subscription error:", err);
          }
        });

      channelRef.current = setsChannel;
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

  async function fetchSets() {
    if (isOnline) {
      refetch();
      combinedQuery.refetch();
    } else {
      offlineQuery.refetch();
      combinedQuery.refetch();
    }
  }

  return {
    sets: combinedQuery.data?.sets || [],
    dataSource:
      combinedQuery.data?.dataSource || (isOnline ? "online" : "offline"),
    loading: combinedQuery.isLoading || onlineLoading,
    error: combinedQuery.error || onlineError || offlineQuery.error,
    fetchSets,
    refetch: fetchSets,
  };
}
