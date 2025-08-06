import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOfflineArtistData } from "@/hooks/useOfflineArtistData";
import { useOfflineVoting } from "@/hooks/useOfflineVoting";
import { useUserPermissionsQuery } from "@/hooks/queries/useGroupsQuery";
import { useOfflineSetsData } from "@/hooks/useOfflineSetsData";

export const useSetDetail = (id: string | undefined) => {
  const { user, loading: authLoading } = useAuth();
  const { data: canEdit = false, isLoading: isLoadingPermissions } =
    useUserPermissionsQuery(user?.id, "edit_artists");

  const setsQuery= useOfflineSetsData();
  const { userVotes, handleVote } = useOfflineVoting(user);


  const sets = setsQuery.sets
  const currentSet = useMemo(() => {
    if (!id || !sets.length) return null;
    return sets.find((a) => a.id === id) || null;
  }, [id, sets]);

  const handleVoteAction = async (voteType: number) => {
    if (!id) return;
    await handleVote(id, voteType);
  };

  const getVoteCount = (voteType: number) => {
    if (!currentSet) return 0;
    return currentSet.votes?.filter((vote) => vote.vote_type === voteType).length || 0;
  };

  const netVoteScore = currentSet ? getVoteCount(1) - getVoteCount(-1) : 0;

  

  const userVote = userVotes[id || ""] || null;

  return {
    currentSet,
    user,
    userVote,
    loading: authLoading || isLoadingPermissions || setsQuery.loading,
    canEdit,
    handleVote: handleVoteAction,
    getVoteCount,
    netVoteScore,
  };
};
