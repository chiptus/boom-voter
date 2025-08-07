import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inviteQueries } from "@/services/queries";
import { inviteService } from "@/services/inviteService";
import { useToast } from "@/components/ui/use-toast";

export const useGroupInvitesQuery = (groupId: string) => {
  return useQuery({
    queryKey: inviteQueries.group(groupId),
    queryFn: () => inviteService.getGroupInvites(groupId),
    enabled: !!groupId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGenerateInviteMutation = (groupId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (
      options: {
        expiresAt?: Date;
        maxUses?: number;
      } = {},
    ) => {
      const inviteUrl = await inviteService.generateInviteLink(
        groupId,
        options,
      );

      // Copy to clipboard
      await navigator.clipboard.writeText(inviteUrl);

      return inviteUrl;
    },
    onSuccess: () => {
      toast({
        title: "Invite Created",
        description: "Invite link copied to clipboard!",
      });
      // Refetch invites to show the new one
      queryClient.invalidateQueries({ queryKey: inviteQueries.group(groupId) });
    },
    onError: (error) => {
      console.error("Error generating invite:", error);
      toast({
        title: "Error",
        description: "Failed to generate invite link",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteInviteMutation = (groupId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (inviteId: string) => {
      await inviteService.deleteInvite(inviteId);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Invite deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: inviteQueries.group(groupId) });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete invite",
        variant: "destructive",
      });
    },
  });
};
