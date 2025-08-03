import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOfflineArtistData } from "@/hooks/useOfflineArtistData";
import { useOfflineVoting } from "@/hooks/useOfflineVoting";
import { useUserPermissionsQuery } from "@/hooks/queries/useGroupsQuery";

export const useArtistDetail = (id: string | undefined) => {
  const { user, loading: authLoading } = useAuth();
  const { data: canEdit = false, isLoading: isLoadingPermissions } =
    useUserPermissionsQuery(user?.id, "edit_artists");

  const { artists, loading: artistsLoading, archiveArtist: archiveArtistOffline } = useOfflineArtistData();
  const { userVotes, handleVote } = useOfflineVoting(user);

  // Find the artist from offline-first data
  const artist = useMemo(() => {
    if (!id || !artists.length) return null;
    return artists.find((a) => a.id === id) || null;
  }, [id, artists]);

  const handleVoteAction = async (voteType: number) => {
    if (!id) return;
    await handleVote(id, voteType);
  };

  const getVoteCount = (voteType: number) => {
    if (!artist) return 0;
    return artist.votes?.filter((vote) => vote.vote_type === voteType).length || 0;
  };

  const netVoteScore = artist ? getVoteCount(1) - getVoteCount(-1) : 0;

  const archiveArtist = async () => {
    if (!id) return;
    await archiveArtistOffline(id);
  };

  const userVote = userVotes[id || ""] || null;

  return {
    artist,
    user,
    userVote,
    loading: authLoading || isLoadingPermissions || artistsLoading,
    canEdit,
    handleVote: handleVoteAction,
    getVoteCount,
    netVoteScore,
    archiveArtist,
  };
};
