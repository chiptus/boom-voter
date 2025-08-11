import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOfflineArtistData } from "@/hooks/useOfflineArtistData";
import { useUserPermissionsQuery } from "@/hooks/queries/useGroupsQuery";

export function useArtistDetail(id: string | undefined) {
  const { user, loading: authLoading } = useAuth();
  const { data: canEdit = false, isLoading: isLoadingPermissions } =
    useUserPermissionsQuery(user?.id, "edit_artists");

  const {
    artists,
    loading: artistsLoading,
    archiveArtist: archiveArtistOffline,
  } = useOfflineArtistData();

  // Find the artist from offline-first data
  const artist = useMemo(() => {
    if (!id || !artists.length) return null;
    return artists.find((a) => a.id === id) || null;
  }, [id, artists]);

  async function archiveArtist() {
    if (!id) return;
    await archiveArtistOffline(id);
  }

  return {
    artist,
    user,
    loading: authLoading || isLoadingPermissions || artistsLoading,
    canEdit,
    archiveArtist,
  };
}
