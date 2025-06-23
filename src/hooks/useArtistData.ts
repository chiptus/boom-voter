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
    // Listen for real-time updates to artists
    const artistsChannel = supabase
      .channel('artists-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'artists' }, () => {
        queryClient.invalidateQueries({ queryKey: artistQueries.lists() });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, () => {
        queryClient.invalidateQueries({ queryKey: artistQueries.lists() });
        queryClient.invalidateQueries({ queryKey: voteQueries.all() });
      })
      .subscribe();

    return () => {
      artistsChannel.unsubscribe();
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