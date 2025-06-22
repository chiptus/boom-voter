
import { useAuth } from "./useAuth";
import { useUserGroupsQuery } from "./queries/useGroupsQuery";
import { groupService } from "@/services/groupService";
import { useGroupPermissions } from "./useGroupPermissions";
import { useGroupCrud } from "./useGroupCrud";
import { useGroupMembers } from "./useGroupMembers";

export const useGroups = () => {
  const { user, loading } = useAuth();
  const { data: groups = [], isLoading: groupsLoading, refetch: fetchUserGroups } = useUserGroupsQuery(user?.id);
  
  const permissions = useGroupPermissions();
  const crud = useGroupCrud();
  const members = useGroupMembers();

  const getGroupById = async (groupId: string) => {
    return groupService.getGroupById(groupId);
  };

  return {
    user,
    groups,
    loading: loading || groupsLoading,
    fetchUserGroups,
    getGroupById,
    // CRUD operations
    ...crud,
    // Member management
    ...members,
    // Permissions
    ...permissions,
  };
};
