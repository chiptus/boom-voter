
import type { FilterSortState } from "./useUrlState";
import { useAuth } from "./useAuth";
import { useArtistData } from "./useArtistData";
import { useVoting } from "./useVoting";
import { useKnowledge } from "./useKnowledge";
import { useArtistFiltering } from "./useArtistFiltering";

export const useArtists = (filterSortState?: FilterSortState) => {
  const { user, loading, signOut } = useAuth();
  const { artists, fetchArtists, archiveArtist } = useArtistData();
  const { userVotes, votingLoading, handleVote } = useVoting(user, fetchArtists);
  const { userKnowledge, handleKnowledgeToggle } = useKnowledge(user);
  const { filteredAndSortedArtists } = useArtistFiltering(artists, filterSortState);

  return {
    user,
    artists: filteredAndSortedArtists,
    allArtists: artists,
    userVotes,
    userKnowledge,
    loading,
    votingLoading,
    handleVote,
    handleKnowledgeToggle,
    signOut,
    fetchArtists,
    archiveArtist,
  };
};

export type { Artist } from "./useArtistData";
