import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useArtistsQuery, useArchiveArtistMutation } from "./queries/useArtistsQuery";
import { artistQueries, voteQueries } from "@/services/queries";
import { useOnlineStatus, useOfflineData } from "./useOffline";
import { offlineStorage } from "@/lib/offlineStorage";
import type { Artist } from "@/services/queries";

export const useOfflineArtistData = () => {
  const queryClient = useQueryClient();
  const { data: artists = [], isLoading, error, refetch } = useArtistsQuery();
  const archiveArtistMutation = useArchiveArtistMutation();
  const channelRef = useRef<any>(null);
  const isOnline = useOnlineStatus();
  const { offlineReady, saveArtistsOffline, getArtistsOffline } = useOfflineData();
  const [offlineArtists, setOfflineArtists] = useState<Artist[]>([]);
  const [dataSource, setDataSource] = useState<'online' | 'offline'>('online');

  // Load offline data when ready
  useEffect(() => {
    if (offlineReady && !isOnline) {
      loadOfflineArtists();
    }
  }, [offlineReady, isOnline]);

  // Save online data to offline storage when available
  useEffect(() => {
    if (artists.length > 0 && offlineReady && isOnline) {
      saveArtistsOffline(artists);
    }
  }, [artists, offlineReady, isOnline, saveArtistsOffline]);

  // Set up real-time subscriptions with proper cleanup (only when online)
  useEffect(() => {
    if (!isOnline) return;

    // Clean up any existing channel first
    if (channelRef.current) {
      console.log('Cleaning up existing channel before creating new one');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Create unique channel name to prevent conflicts
    const channelName = `artists-changes-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('Setting up artist data subscriptions:', channelName);
    
    try {
      const artistsChannel = supabase
        .channel(channelName)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'artists' }, (payload) => {
          console.log('Artists table changed:', payload);
          queryClient.invalidateQueries({ queryKey: artistQueries.lists() });
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, (payload) => {
          console.log('Votes table changed:', payload);
          queryClient.invalidateQueries({ queryKey: artistQueries.lists() });
          queryClient.invalidateQueries({ queryKey: voteQueries.all() });
        })
        .subscribe((status, err) => {
          if (err) {
            console.error('Subscription error:', err);
          } else {
            console.log('Subscription status:', status);
          }
        });

      channelRef.current = artistsChannel;
    } catch (err) {
      console.error('Failed to create subscription channel:', err);
    }

    return () => {
      if (channelRef.current) {
        console.log('Cleaning up artist data subscriptions:', channelName);
        try {
          supabase.removeChannel(channelRef.current);
        } catch (err) {
          console.error('Error cleaning up channel:', err);
        }
        channelRef.current = null;
      }
    };
  }, [queryClient, isOnline]);

  const loadOfflineArtists = useCallback(async () => {
    try {
      const cachedArtists = await getArtistsOffline();
      if (cachedArtists.length > 0) {
        setOfflineArtists(cachedArtists);
        setDataSource('offline');
        console.log('Loaded', cachedArtists.length, 'artists from offline storage');
      }
    } catch (error) {
      console.error('Error loading offline artists:', error);
    }
  }, [getArtistsOffline]);

  const fetchArtists = async () => {
    if (isOnline) {
      refetch();
    } else {
      await loadOfflineArtists();
    }
  };

  const archiveArtist = async (artistId: string) => {
    if (isOnline) {
      await archiveArtistMutation.mutateAsync(artistId);
    } else {
      // When offline, queue the action
      await offlineStorage.saveSetting(`archive_${artistId}`, {
        action: 'archive',
        artistId,
        timestamp: Date.now(),
        synced: false,
      });
      
      // Update local data
      const updatedArtists = offlineArtists.map(artist => 
        artist.id === artistId ? { ...artist, archived: true } : artist
      );
      setOfflineArtists(updatedArtists);
      await saveArtistsOffline(updatedArtists);
    }
  };

  // Determine which data to return
  const currentArtists = isOnline ? artists : offlineArtists;
  const currentLoading = isOnline ? isLoading : !offlineReady;
  const currentError = isOnline ? error : null;

  return {
    artists: currentArtists,
    fetchArtists,
    archiveArtist,
    loading: currentLoading,
    error: currentError,
    dataSource,
    isOffline: !isOnline,
  };
};

export type { Artist };