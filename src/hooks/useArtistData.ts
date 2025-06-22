
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

  // Set up real-time subscriptions
  useEffect(() => {
    // Clean up existing channel if it exists
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    // Create new channel with unique name
    const channelName = `artists-changes-${Date.now()}`;
    const artistsChannel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'artists' }, () => {
        console.log('Artists table changed, invalidating queries');
        queryClient.invalidateQueries({ queryKey: artistQueries.lists() });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, () => {
        console.log('Votes table changed, invalidating queries');
        queryClient.invalidateQueries({ queryKey: artistQueries.lists() });
        queryClient.invalidateQueries({ queryKey: voteQueries.all() });
      });

    // Subscribe to the channel
    artistsChannel.subscribe((status) => {
      console.log('Channel subscription status:', status);
    });

    // Store reference for cleanup
    channelRef.current = artistsChannel;

    return () => {
      if (channelRef.current) {
        console.log('Cleaning up channel subscription');
        channelRef.current.unsubscribe();
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
