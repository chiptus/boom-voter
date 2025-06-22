
import { useAuth } from "./useAuth";
import { groupService } from "@/services/groupService";
import { useToast } from "@/components/ui/use-toast";
import type { GroupMember } from "@/types/groups";

export const useGroupMembers = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const inviteToGroup = async (groupId: string, usernameOrEmail: string) => {
    if (!user) return false;

    try {
      const userResult = await groupService.findUserByUsernameOrEmail(usernameOrEmail);
      
      if (!userResult.found) {
        const errorMessage = userResult.foundBy === 'email' 
          ? `No user found with email: ${usernameOrEmail}`
          : "User not found";
        toast({
          title: "User not found",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }

      const foundMessage = userResult.foundBy === 'email' 
        ? `Found user with email: ${usernameOrEmail}`
        : `Found user: ${usernameOrEmail}`;
      toast({
        title: "User found",
        description: foundMessage,
      });

      const isAlreadyMember = await groupService.checkIfUserInGroup(groupId, userResult.userId!);
      if (isAlreadyMember) {
        toast({
          title: "Error",
          description: "User is already in this group",
          variant: "destructive",
        });
        return false;
      }

      await groupService.addUserToGroup(groupId, userResult.userId!);
      
      toast({
        title: "Success",
        description: `${usernameOrEmail} has been added to the group`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to invite user to group",
        variant: "destructive",
      });
      return false;
    }
  };

  const getGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
    return groupService.getGroupMembers(groupId);
  };

  const removeMemberFromGroup = async (groupId: string, userId: string) => {
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
        description: error instanceof Error ? error.message : "Failed to remove member",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    inviteToGroup,
    getGroupMembers,
    removeMemberFromGroup,
  };
};
