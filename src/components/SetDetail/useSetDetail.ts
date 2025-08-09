import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOfflineVoting } from "@/hooks/useOfflineVoting";
import { useUserPermissionsQuery } from "@/hooks/queries/useGroupsQuery";
import { useOfflineSetsData } from "@/hooks/useOfflineSetsData";

export const useSetDetail = (slug: string | undefined) => {
  const { user, loading: authLoading } = useAuth();
  const { data: canEdit = false, isLoading: isLoadingPermissions } =
    useUserPermissionsQuery(user?.id, "edit_artists");

  const setsQuery = useOfflineSetsData();
  const { userVotes, handleVote } = useOfflineVoting(user);

  const sets = setsQuery.sets;
  const currentSet = useMemo(() => {
    if (!slug || !sets.length) {
      return null;
    }

    return sets.find((a) => a.slug === slug) || null;
  }, [slug, sets]);

  const handleVoteAction = async (voteType: number) => {
    if (!currentSet?.id) return;
    await handleVote(currentSet.id, voteType);
  };

  const getVoteCount = (voteType: number) => {
    if (!currentSet) return 0;
    return (
      currentSet.votes?.filter((vote) => vote.vote_type === voteType).length ||
      0
    );
  };

  const netVoteScore = currentSet ? getVoteCount(1) - getVoteCount(-1) : 0;

  const userVote = userVotes[currentSet?.id || ""] || null;

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
