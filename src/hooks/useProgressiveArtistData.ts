import { useMemo, useEffect, useRef, useCallback } from "react";
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
  const artistsDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const votesDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const subscriptionDelayRef = useRef<NodeJS.Timeout | null>(null);
  
  // Progressive queries with optimized caching
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

  // Debounced query invalidation to prevent rapid successive updates
  const debouncedInvalidateArtists = useCallback(() => {
    if (artistsDebounceRef.current) {
      clearTimeout(artistsDebounceRef.current);
    }
    artistsDebounceRef.current = setTimeout(() => {
      console.log('Debounced: invalidating basic artists query');
      queryClient.invalidateQueries({ queryKey: [...artistQueries.lists(), 'basic'] });
    }, 500);
  }, [queryClient]);

  const debouncedInvalidateVotes = useCallback(() => {
    if (votesDebounceRef.current) {
      clearTimeout(votesDebounceRef.current);
    }
    votesDebounceRef.current = setTimeout(() => {
      console.log('Debounced: invalidating vote summaries');
      queryClient.invalidateQueries({ queryKey: voteSummaryQueries.byArtist() });
      queryClient.invalidateQueries({ queryKey: voteQueries.all() });
    }, 500);
  }, [queryClient]);

  // Set up real-time subscriptions with optimization
  useEffect(() => {
    // Clean up existing subscriptions
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
    if (subscriptionDelayRef.current) {
      clearTimeout(subscriptionDelayRef.current);
      subscriptionDelayRef.current = null;
    }
    if (artistsDebounceRef.current) {
      clearTimeout(artistsDebounceRef.current);
      artistsDebounceRef.current = null;
    }
    if (votesDebounceRef.current) {
      clearTimeout(votesDebounceRef.current);
      votesDebounceRef.current = null;
    }

    // Only set up subscriptions after initial data loads and user stays on page
    const setupSubscriptions = () => {
      try {
        const channelName = `progressive-artists-changes-${Date.now()}`;
        const artistsChannel = supabase
          .channel(channelName)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'artists' }, debouncedInvalidateArtists)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, debouncedInvalidateVotes);

        artistsChannel.subscribe((status) => {
          console.log('Progressive channel subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('Real-time subscriptions active');
          }
        });

        channelRef.current = artistsChannel;
      } catch (error) {
        console.warn('Failed to set up real-time subscriptions:', error);
      }
    };

    // Only set up subscriptions if initial data has loaded and user stays for 2 seconds
    if (!basicLoading && !votesLoading && basicArtists.length > 0) {
      subscriptionDelayRef.current = setTimeout(setupSubscriptions, 2000);
    }

    return () => {
      if (channelRef.current) {
        console.log('Cleaning up progressive channel subscription');
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
      if (subscriptionDelayRef.current) {
        clearTimeout(subscriptionDelayRef.current);
        subscriptionDelayRef.current = null;
      }
      if (artistsDebounceRef.current) {
        clearTimeout(artistsDebounceRef.current);
        artistsDebounceRef.current = null;
      }
      if (votesDebounceRef.current) {
        clearTimeout(votesDebounceRef.current);
        votesDebounceRef.current = null;
      }
    };
  }, [queryClient, basicLoading, votesLoading, basicArtists.length, debouncedInvalidateArtists, debouncedInvalidateVotes]);

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