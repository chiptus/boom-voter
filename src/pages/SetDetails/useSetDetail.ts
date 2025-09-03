import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPermissionsQuery } from "@/hooks/queries/auth/useUserPermissions";
import { useOfflineSetsData } from "@/hooks/useOfflineSetsData";
import { useVoteCount } from "@/hooks/useVoteCount";

export function useSetDetail(setId: string | undefined) {
  const { user, loading: authLoading } = useAuth();
  const { data: canEdit = false, isLoading: isLoadingPermissions } =
    useUserPermissionsQuery(user?.id, "edit_artists");

  const setsQuery = useOfflineSetsData();

  const sets = setsQuery.sets;
  const currentSet = useMemo(() => {
    if (!setId || !sets.length) {
      return undefined;
    }

    return sets.find((a) => a.id === setId);
  }, [setId, sets]);

  const { getVoteCount } = useVoteCount(currentSet);

  const netVoteScore = currentSet
    ? 2 * getVoteCount(2) + getVoteCount(1) - getVoteCount(-1)
    : 0;

  return {
    loading: authLoading || isLoadingPermissions || setsQuery.loading,
    canEdit,
    netVoteScore,
  };
}
