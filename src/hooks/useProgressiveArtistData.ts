import { useMemo, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useArtistsBasicQuery } from "./queries/useArtistsBasicQuery";
import { useVoteSummariesQuery } from "./queries/useVoteSummariesQuery";
import { useArchiveArtistMutation } from "./queries/useArtistsQuery";
import { artistQueries, voteQueries, voteSummaryQueries } from "@/services/queries";
import type { Artist } from "@/services/queries";

export const useProgressiveArtistData = () => {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);
  
  // Progressive queries
  const { data: basicArtists = [], isLoading: basicLoading, error: basicError, refetch: refetchBasic } = useArtistsBasicQuery();
  const { data: voteSummaries = {}, isLoading: votesLoading, error: votesError, refetch: refetchVotes } = useVoteSummariesQuery();
  const archiveArtistMutation = useArchiveArtistMutation();

  // Combine basic artists with vote summaries
  const artists: Artist[] = useMemo(() => {
    return basicArtists.map(artist => ({
      ...artist,
      votes: voteSummaries[artist.id] || []
    }));
  }, [basicArtists, voteSummaries]);

  // Set up real-time subscriptions
  useEffect(() => {
    // Clean up existing channel if it exists
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    // Create new channel with unique name
    const channelName = `progressive-artists-changes-${Date.now()}`;
    const artistsChannel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'artists' }, () => {
        console.log('Artists table changed, invalidating basic artists query');
        queryClient.invalidateQueries({ queryKey: [...artistQueries.lists(), 'basic'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, () => {
        console.log('Votes table changed, invalidating vote summaries and user votes');
        queryClient.invalidateQueries({ queryKey: voteSummaryQueries.byArtist() });
        queryClient.invalidateQueries({ queryKey: voteQueries.all() });
      });

    // Subscribe to the channel
    artistsChannel.subscribe((status) => {
      console.log('Progressive channel subscription status:', status);
    });

    // Store reference for cleanup
    channelRef.current = artistsChannel;

    return () => {
      if (channelRef.current) {
        console.log('Cleaning up progressive channel subscription');
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [queryClient]);

  const fetchArtists = async () => {
    await Promise.all([refetchBasic(), refetchVotes()]);
  };

  const archiveArtist = async (artistId: string) => {
    await archiveArtistMutation.mutateAsync(artistId);
  };

  return {
    artists,
    fetchArtists,
    archiveArtist,
    loading: basicLoading,
    votesLoading,
    error: basicError || votesError,
  };
};

export type { Artist };