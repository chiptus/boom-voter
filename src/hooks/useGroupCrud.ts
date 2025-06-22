
import { useAuth } from "./useAuth";
import { 
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useJoinGroupMutation,
  useLeaveGroupMutation 
} from "./queries/useGroupsQuery";
import { useToast } from "@/components/ui/use-toast";

export const useGroupCrud = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const createGroupMutation = useCreateGroupMutation();
  const deleteGroupMutation = useDeleteGroupMutation();
  const joinGroupMutation = useJoinGroupMutation();
  const leaveGroupMutation = useLeaveGroupMutation();

  const createGroup = async (name: string, description?: string) => {
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
  };

  const joinGroup = async (groupId: string) => {
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
  };

  const leaveGroup = async (groupId: string) => {
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
  };

  const deleteGroup = async (groupId: string) => {
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
  };

  return {
    createGroup,
    joinGroup,
    leaveGroup,
    deleteGroup,
  };
};
