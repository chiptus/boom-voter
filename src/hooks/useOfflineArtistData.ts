import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  useArtistsQuery,
  useArchiveArtistMutation,
} from "./queries/useArtistsQuery";
import { setQueries, voteQueries } from "@/services/queries";
import { useOnlineStatus, useOfflineData } from "./useOffline";
import { offlineStorage } from "@/lib/offlineStorage";
import type { Set } from "@/services/queries";
import { RealtimeChannel } from "@supabase/supabase-js";

export const useOfflineArtistData = () => {
  const queryClient = useQueryClient();
  const { data: sets = [], isLoading, error, refetch } = useArtistsQuery();
  const archiveArtistMutation = useArchiveArtistMutation();
  const channelRef = useRef<RealtimeChannel>(null);
  const isOnline = useOnlineStatus();
  const { offlineReady, saveArtistsOffline, getArtistsOffline } =
    useOfflineData();
  const [offlineSets, setOfflineSets] = useState<Set[]>([]);
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
      saveArtistsOffline(sets);
    }
  }, [sets, offlineReady, isOnline, saveArtistsOffline]);

  // Set up real-time subscriptions with proper cleanup (only when online)
  useEffect(() => {
    if (!isOnline) return;

    // Clean up any existing channel first
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Create unique channel name to prevent conflicts
    const channelName = `artists-changes-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    try {
      const artistsChannel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "sets" },
          (payload) => {
            queryClient.invalidateQueries({ queryKey: setQueries.lists() });
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "artists" },
          (payload) => {
            queryClient.invalidateQueries({ queryKey: setQueries.lists() });
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "votes" },
          (payload) => {
            queryClient.invalidateQueries({ queryKey: setQueries.lists() });
            queryClient.invalidateQueries({ queryKey: voteQueries.all() });
          }
        )
        .subscribe((status, err) => {
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

  const loadOfflineSets = useCallback(async () => {
    try {
      const cachedSets = await getArtistsOffline();
      if (cachedSets.length > 0) {
        setOfflineSets(cachedSets);
        setDataSource("offline");
      }
    } catch (error) {
      console.error("Error loading offline sets:", error);
    }
  }, [getArtistsOffline]);

  const fetchArtists = async () => {
    if (isOnline) {
      refetch();
    } else {
      await loadOfflineSets();
    }
  };

  const archiveArtist = async (artistId: string) => {
    if (isOnline) {
      await archiveArtistMutation.mutateAsync(artistId);
    } else {
      // When offline, queue the action
      await offlineStorage.saveSetting(`archive_${artistId}`, {
        action: "archive",
        artistId,
        timestamp: Date.now(),
        synced: false,
      });

      // Update local data - find set containing this artist
      const updatedSets = offlineSets.map((set) => {
        const hasArtist = set.artists?.some(artist => artist.id === artistId);
        if (hasArtist) {
          return {
            ...set,
            artists: set.artists?.map(artist => 
              artist.id === artistId ? { ...artist, archived: true } : artist
            ) || []
          };
        }
        return set;
      });
      setOfflineSets(updatedSets);
      await saveArtistsOffline(updatedSets);
    }
  };

  // Determine which data to return
  const currentSets = isOnline ? sets : offlineSets;
  const currentLoading = isOnline ? isLoading : !offlineReady;
  const currentError = isOnline ? error : null;

  return {
    artists: currentSets, // Keep same interface for backward compatibility
    fetchArtists,
    archiveArtist,
    loading: currentLoading,
    error: currentError,
    dataSource,
    isOffline: !isOnline,
  };
};

export type { Set };
export type { Artist } from "@/services/queries"; // Re-export for backward compatibility
