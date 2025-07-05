
import type { FilterSortState } from "./useUrlState";
import { useAuth } from "./useAuth";
import { useOfflineArtistData } from "./useOfflineArtistData";
import { useOfflineVoting } from "./useOfflineVoting";
import { useKnowledge } from "./queries/useKnowledgeQuery";
import { useArtistFiltering } from "./useArtistFiltering";

export const useArtists = (filterSortState?: FilterSortState) => {
  const { user, loading, signOut } = useAuth();
  const { artists, fetchArtists, archiveArtist, loading: artistsLoading } = useOfflineArtistData();
  const { userVotes, votingLoading, handleVote } = useOfflineVoting(user);
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

export type { Artist } from "./useOfflineArtistData";
