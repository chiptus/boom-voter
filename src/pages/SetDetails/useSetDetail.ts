import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOfflineVoting } from "@/hooks/useOfflineVoting";
import { useUserPermissionsQuery } from "@/hooks/queries/auth/useUserPermissions";
import { useOfflineSetsData } from "@/hooks/useOfflineSetsData";

export function useSetDetail(setId: string | undefined) {
  const { user, loading: authLoading } = useAuth();
  const { data: canEdit = false, isLoading: isLoadingPermissions } =
    useUserPermissionsQuery(user?.id, "edit_artists");

  const setsQuery = useOfflineSetsData();
  const { userVotes, handleVote } = useOfflineVoting(user);

  const sets = setsQuery.sets;
  const currentSet = useMemo(() => {
    if (!setId || !sets.length) {
      return null;
    }

    return sets.find((a) => a.id === setId) || null;
  }, [setId, sets]);

  async function handleVoteAction(voteType: number) {
    if (!setId) return;
    await handleVote(setId, voteType);
  }

  function getVoteCount(voteType: number) {
    if (!currentSet) return 0;
    return (
      currentSet.votes?.filter((vote) => vote.vote_type === voteType).length ||
      0
    );
  }

  const netVoteScore = currentSet
    ? 2 * getVoteCount(2) + getVoteCount(1) - getVoteCount(-1)
    : 0;

  const userVote = userVotes[setId || ""] || null;

  return {
    userVote,
    loading: authLoading || isLoadingPermissions || setsQuery.loading,
    canEdit,
    handleVote: handleVoteAction,
    getVoteCount,
    netVoteScore,
  };
}
