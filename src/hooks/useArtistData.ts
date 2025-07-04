import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useArtistsQuery, useArchiveArtistMutation } from "./queries/useArtistsQuery";
import { artistQueries, voteQueries } from "@/services/queries";
import type { Artist } from "@/services/queries";

export const useArtistData = () => {
  const queryClient = useQueryClient();
  const { data: artists = [], isLoading, error, refetch } = useArtistsQuery();
  const archiveArtistMutation = useArchiveArtistMutation();
  const channelRef = useRef<any>(null);

  // Set up real-time subscriptions with proper cleanup
  useEffect(() => {
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
  }, [queryClient]);

  const fetchArtists = async () => {
    refetch();
  };

  const archiveArtist = async (artistId: string) => {
    await archiveArtistMutation.mutateAsync(artistId);
  };

  return {
    artists,
    fetchArtists,
    archiveArtist,
    loading: isLoading,
    error,
  };
};

export type { Artist };