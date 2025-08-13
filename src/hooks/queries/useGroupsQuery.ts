// Re-export new group hooks for backwards compatibility
// TODO: Update imports throughout codebase to use direct imports
export { useUserGroups as useUserGroupsQuery } from "./groups/useUserGroups";
export { useGroupDetail as useGroupDetailQuery } from "./groups/useGroupDetail";
export { useGroupMembers as useGroupMembersQuery } from "./groups/useGroupMembers";
export { useUserPermissions as useUserPermissionsQuery } from "./auth/useUserPermissions";
export { useCreateGroup as useCreateGroupMutation } from "./groups/useCreateGroup";
export { useDeleteGroup as useDeleteGroupMutation } from "./groups/useDeleteGroup";
export { useJoinGroup as useJoinGroupMutation } from "./groups/useJoinGroup";
export { useLeaveGroup as useLeaveGroupMutation } from "./groups/useLeaveGroup";
export { useInviteToGroup as useInviteToGroupMutation } from "./groups/useInviteToGroup";
