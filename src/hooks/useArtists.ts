
import type { FilterSortState } from "./useUrlState";
import { useAuth } from "./useAuth";
import { useArtistData } from "./useArtistData";
import { useVoting } from "./queries/useVotingQuery";
import { useKnowledge } from "./queries/useKnowledgeQuery";
import { useArtistFiltering } from "./useArtistFiltering";

export const useArtists = (filterSortState?: FilterSortState) => {
  const { user, loading, signOut } = useAuth();
  const { artists, fetchArtists, archiveArtist, loading: artistsLoading } = useArtistData();
  const { userVotes, votingLoading, handleVote } = useVoting();
  const { userKnowledge, handleKnowledgeToggle } = useKnowledge();
  const { filteredAndSortedArtists } = useArtistFiltering(artists, filterSortState);

  return {
    user,
    artists: filteredAndSortedArtists,
    allArtists: artists,
    userVotes,
    userKnowledge,
    loading: loading || artistsLoading,
    votingLoading,
    handleVote,
    handleKnowledgeToggle,
    signOut,
    fetchArtists,
    archiveArtist,
  };
};

export type { Artist } from "./useArtistData";
