import {
  useUserGroupsQuery,
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useJoinGroupMutation,
  useLeaveGroupMutation,
} from "./queries/useGroupsQuery";
import { groupService } from "@/services/groupService";
import { useToast } from "@/components/ui/use-toast";
import type { GroupMember } from "@/types/groups";
import { useAuth } from "@/contexts/AuthContext";

export function useGroups() {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const {
    data: groups = [],
    isLoading: groupsLoading,
    refetch: fetchUserGroups,
  } = useUserGroupsQuery(user?.id);

  const createGroupMutation = useCreateGroupMutation();
  const deleteGroupMutation = useDeleteGroupMutation();
  const joinGroupMutation = useJoinGroupMutation();
  const leaveGroupMutation = useLeaveGroupMutation();

  async function createGroup(name: string, description?: string) {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a group",
        variant: "destructive",
      });
      return null;
    }

    try {
      const group = await createGroupMutation.mutateAsync({
        name,
        description,
        userId: user.id,
      });
      return group;
    } catch (error) {
      return null;
    }
  }

  async function joinGroup(groupId: string) {
    if (!user) return false;

    try {
      await joinGroupMutation.mutateAsync({
        groupId,
        userId: user.id,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async function leaveGroup(groupId: string) {
    if (!user) return false;

    try {
      await leaveGroupMutation.mutateAsync({
        groupId,
        userId: user.id,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async function deleteGroup(groupId: string) {
    if (!user) return false;

    try {
      await deleteGroupMutation.mutateAsync({
        groupId,
        userId: user.id,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Keep some legacy functions that use groupService directly
  async function inviteToGroup(groupId: string, usernameOrEmail: string) {
    if (!user) return false;

    try {
      // Find user by username or email
      const userResult =
        await groupService.findUserByUsernameOrEmail(usernameOrEmail);

      if (!userResult.found) {
        const errorMessage =
          userResult.foundBy === "email"
            ? `No user found with email: ${usernameOrEmail}`
            : "User not found";
        toast({
          title: "User not found",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }

      // Show success toast for finding user
      const foundMessage =
        userResult.foundBy === "email"
          ? `Found user with email: ${usernameOrEmail}`
          : `Found user: ${usernameOrEmail}`;
      toast({
        title: "User found",
        description: foundMessage,
      });

      // Check if user is already in the group
      const isAlreadyMember = await groupService.checkIfUserInGroup(
        groupId,
        userResult.userId!,
      );
      if (isAlreadyMember) {
        toast({
          title: "Error",
          description: "User is already in this group",
          variant: "destructive",
        });
        return false;
      }

      // Add user to group
      await groupService.addUserToGroup(groupId, userResult.userId!);

      toast({
        title: "Success",
        description: `${usernameOrEmail} has been added to the group`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to invite user to group",
        variant: "destructive",
      });
      return false;
    }
  }

  async function getGroupMembers(groupId: string): Promise<GroupMember[]> {
    return groupService.getGroupMembers(groupId);
  }

  async function removeMemberFromGroup(groupId: string, userId: string) {
    if (!user) return false;

    try {
      await groupService.removeMemberFromGroup(groupId, userId, user.id);
      toast({
        title: "Success",
        description: "Member removed from group successfully",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to remove member",
        variant: "destructive",
      });
      return false;
    }
  }

  return {
    user,
    groups,
    loading: loading || groupsLoading,
    createGroup,
    joinGroup,
    leaveGroup,
    inviteToGroup,
    deleteGroup,
    getGroupMembers,
    removeMemberFromGroup,

    fetchUserGroups,
  };
}
