import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  groupQueries,
  queryFunctions,
  mutationFunctions,
} from "@/services/queries";

export function useUserGroupsQuery(userId: string | undefined) {
  return useQuery({
    queryKey: groupQueries.user(userId!),
    queryFn: () => queryFunctions.fetchUserGroups(userId!),
    enabled: !!userId,
  });
}

export function useGroupDetailQuery(groupId: string) {
  return useQuery({
    queryKey: groupQueries.detail(groupId),
    queryFn: () => queryFunctions.fetchGroupById(groupId),
    enabled: !!groupId,
  });
}

export function useGroupMembersQuery(groupId: string) {
  return useQuery({
    queryKey: groupQueries.members(groupId),
    queryFn: () => queryFunctions.fetchGroupMembers(groupId),
    enabled: !!groupId,
  });
}

export function useUserPermissionsQuery(
  userId: string | undefined,
  permission: "edit_artists" | "is_admin",
) {
  return useQuery({
    queryKey: ["permissions", { userId, permission }],
    queryFn: () => queryFunctions.checkUserPermissions(userId!, permission),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes - permissions don't change often
  });
}

export function useCreateGroupMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mutationFunctions.createGroup,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: groupQueries.user(variables.userId),
      });
      toast({
        title: "Success",
        description: "Group created successfully",
      });
    },
    onError: (error) => {
      const message = error?.message || "Failed to create group";
      toast({
        title: message.includes("failed to add") ? "Warning" : "Error",
        description: message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteGroupMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mutationFunctions.deleteGroup,
    onSuccess: (_data, variables) => {
      // Invalidate all group-related queries
      queryClient.invalidateQueries({
        queryKey: groupQueries.user(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: groupQueries.all(),
      });
      toast({
        title: "Success",
        description: "Group deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete group",
        variant: "destructive",
      });
    },
  });
}

export function useJoinGroupMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mutationFunctions.joinGroup,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: groupQueries.user(variables.userId),
      });
      toast({
        title: "Success",
        description: "Joined group successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to join group",
        variant: "destructive",
      });
    },
  });
}

export function useLeaveGroupMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mutationFunctions.leaveGroup,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: groupQueries.user(variables.userId),
      });
      toast({
        title: "Success",
        description: "Left group successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to leave group",
        variant: "destructive",
      });
    },
  });
}
