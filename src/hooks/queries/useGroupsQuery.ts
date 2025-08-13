// Re-export new group hooks for backwards compatibility
// TODO: Update imports throughout codebase to use direct imports
export { useUserGroupsQuery } from "./groups/useUserGroups";
export { useGroupDetailQuery } from "./groups/useGroupDetail";
export { useGroupMembersQuery } from "./groups/useGroupMembers";
export { useUserPermissionsQuery } from "./auth/useUserPermissions";
export { useCreateGroupMutation } from "./groups/useCreateGroup";
export { useDeleteGroupMutation } from "./groups/useDeleteGroup";
export { useJoinGroupMutation } from "./groups/useJoinGroup";
export { useLeaveGroupMutation } from "./groups/useLeaveGroup";
export { useInviteToGroupMutation } from "./groups/useInviteToGroup";
