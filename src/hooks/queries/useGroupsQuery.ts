import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { groupQueries, queryFunctions, mutationFunctions, authQueries } from "@/services/queries";
import { useAuth } from "@/hooks/useAuth";

export const useUserGroupsQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: groupQueries.user(userId || ''),
    queryFn: () => queryFunctions.fetchUserGroups(userId!),
    enabled: !!userId,
  });
};

export const useGroupMembersQuery = (groupId: string) => {
  return useQuery({
    queryKey: groupQueries.members(groupId),
    queryFn: () => queryFunctions.fetchGroupMembers(groupId),
    enabled: !!groupId,
  });
};

export const useUserPermissionsQuery = (userId: string | undefined, permission: 'edit_artists') => {
  return useQuery({
    queryKey: ['permissions', userId, permission],
    queryFn: () => queryFunctions.checkUserPermissions(userId!, permission),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes - permissions don't change often
  });
};

export const useCreateGroupMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mutationFunctions.createGroup,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: groupQueries.user(variables.userId) });
      toast({
        title: "Success",
        description: "Group created successfully",
      });
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to create group";
      toast({
        title: message.includes("failed to add") ? "Warning" : "Error",
        description: message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteGroupMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mutationFunctions.deleteGroup,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: groupQueries.user(variables.userId) });
      toast({
        title: "Success",
        description: "Group deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete group",
        variant: "destructive",
      });
    },
  });
};

export const useJoinGroupMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mutationFunctions.joinGroup,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: groupQueries.user(variables.userId) });
      toast({
        title: "Success",
        description: "Joined group successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to join group",
        variant: "destructive",
      });
    },
  });
};

export const useLeaveGroupMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mutationFunctions.leaveGroup,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: groupQueries.user(variables.userId) });
      toast({
        title: "Success",
        description: "Left group successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to leave group",
        variant: "destructive",
      });
    },
  });
};