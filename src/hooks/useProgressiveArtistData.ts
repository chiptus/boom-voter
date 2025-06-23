import { useMemo } from "react";
import { useArtistsBasicQuery } from "./queries/useArtistsBasicQuery";
import { useVoteSummariesQuery } from "./queries/useVoteSummariesQuery";
import { useArchiveArtistMutation } from "./queries/useArtistsQuery";
import type { Artist } from "@/services/queries";

export const useProgressiveArtistData = () => {
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