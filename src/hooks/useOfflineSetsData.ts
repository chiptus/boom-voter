import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { setQueries, voteQueries } from "@/services/queries";
import { useOnlineStatus, useOfflineData } from "./useOffline";
import type { FestivalSet } from "@/services/queries";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useSetsQuery } from "./queries/useSetsQuery";

export const useOfflineSetsData = () => {
  const queryClient = useQueryClient();
  const { data: sets = [], isLoading, error, refetch } = useSetsQuery();

  const channelRef = useRef<RealtimeChannel | null>(null);
  const isOnline = useOnlineStatus();
  const { offlineReady, saveSetsOffline, getSetsOffline } = useOfflineData();
  const [offlineSets, setOfflineSets] = useState<FestivalSet[]>([]);
  const [dataSource, setDataSource] = useState<"online" | "offline">("online");

  // Load offline data when ready
  useEffect(() => {
    if (offlineReady && !isOnline) {
      loadOfflineSets();
    }
  }, [offlineReady, isOnline]);

  // Save online data to offline storage when available
  useEffect(() => {
    if (sets.length > 0 && offlineReady && isOnline) {
      saveSetsOffline(sets);
    }
  }, [sets, offlineReady, isOnline, saveSetsOffline]);

  // Set up real-time subscriptions with proper cleanup (only when online)
  useEffect(() => {
    if (!isOnline) return;

    // Clean up any existing channel first
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Create unique channel name to prevent conflicts
    const channelName = `sets-changes-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    try {
      const setChannel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "sets" },
          (_) => {
            queryClient.invalidateQueries({ queryKey: setQueries.lists() });
          },
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "artists" },
          (_) => {
            queryClient.invalidateQueries({ queryKey: setQueries.lists() });
          },
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "votes" },
          (_) => {
            queryClient.invalidateQueries({ queryKey: setQueries.lists() });
            queryClient.invalidateQueries({ queryKey: voteQueries.all() });
          },
        )
        .subscribe((_, err) => {
          if (err) {
            console.error("Subscription error:", err);
          }
        });

      channelRef.current = setChannel;
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

  const loadOfflineSets = useCallback(async () => {
    try {
      const cachedSets = await getSetsOffline();
      if (cachedSets.length > 0) {
        setOfflineSets(cachedSets);
        setDataSource("offline");
      }
    } catch (error) {
      console.error("Error loading offline sets:", error);
    }
  }, [getSetsOffline]);

  const fetchArtists = async () => {
    if (isOnline) {
      refetch();
    } else {
      await loadOfflineSets();
    }
  };

  // Determine which data to return
  const currentSets = isOnline ? sets : offlineSets;
  const currentLoading = isOnline ? isLoading : !offlineReady;
  const currentError = isOnline ? error : null;

  return {
    sets: currentSets, // Keep same interface for backward compatibility
    fetchArtists,
    loading: currentLoading,
    error: currentError,
    dataSource,
    isOffline: !isOnline,
  };
};

export type { FestivalSet };
export type { Artist } from "@/services/queries"; // Re-export for backward compatibility
