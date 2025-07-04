import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useArtistsQuery, useArchiveArtistMutation } from "./queries/useArtistsQuery";
import { artistQueries, voteQueries } from "@/services/queries";
import type { Artist } from "@/services/queries";

export const useArtistData = () => {
  const queryClient = useQueryClient();
  const { data: artists = [], isLoading, error, refetch } = useArtistsQuery();
  const archiveArtistMutation = useArchiveArtistMutation();

  // Set up real-time subscriptions
  useEffect(() => {
    // Create unique channel name to prevent conflicts
    const channelName = `artists-changes-${Date.now()}`;
    console.log('Setting up artist data subscriptions:', channelName);
    
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

    return () => {
      console.log('Cleaning up artist data subscriptions:', channelName);
      supabase.removeChannel(artistsChannel);
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