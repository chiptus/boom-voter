
import { useAuth } from "./useAuth";
import { useUserPermissionsQuery } from "./queries/useGroupsQuery";

export const useGroupPermissions = () => {
  const { user } = useAuth();
  const { data: canEdit = false } = useUserPermissionsQuery(user?.id, 'edit_artists');

  const checkUserPermission = async (permission: 'edit_artists') => {
    return canEdit;
  };

  const canEditArtists = async () => {
    return canEdit;
  };

  const canAddArtists = async () => {
    return canEdit;
  };

  const canAddGenres = async () => {
    return canEdit;
  };

  return {
    canEdit,
    checkUserPermission,
    canEditArtists,
    canAddArtists,
    canAddGenres,
  };
};
