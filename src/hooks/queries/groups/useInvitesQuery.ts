import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface GroupInvite {
  id: string;
  group_id: string;
  invite_token: string;
  created_by: string;
  created_at: string;
  expires_at?: string;
  max_uses?: number;
  used_count: number;
  is_active: boolean;
}

export interface InviteValidation {
  invite_id: string;
  group_id: string;
  group_name: string;
  is_valid: boolean;
  reason: string;
}

export interface InviteUsageResult {
  success: boolean;
  message: string;
  group_id: string;
}

// Invite Queries
export const inviteKeys = {
  all: () => ["invites"] as const,
  group: (groupId: string) => [...inviteKeys.all(), "group", groupId] as const,
  validation: (token: string) =>
    [...inviteKeys.all(), "validation", token] as const,
};

export function useGroupInvitesQuery(groupId: string) {
  return useQuery({
    queryKey: inviteKeys.group(groupId),
    queryFn: () => getGroupInvites(groupId),
    enabled: !!groupId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useGenerateInviteMutation(groupId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (
      options: {
        expiresAt?: Date;
        maxUses?: number;
      } = {},
    ) => {
      const inviteUrl = await generateInviteLink(groupId, options);

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
      queryClient.invalidateQueries({ queryKey: inviteKeys.group(groupId) });
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
}

export function useDeleteInviteMutation(groupId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (inviteId: string) => {
      await deleteInvite(inviteId);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Invite deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: inviteKeys.group(groupId) });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete invite",
        variant: "destructive",
      });
    },
  });
}

async function generateInviteLink(
  groupId: string,
  options?: {
    expiresAt?: Date;
    maxUses?: number;
  },
): Promise<string> {
  // Generate a cryptographically secure random token
  const token = crypto.randomUUID() + "-" + Date.now().toString(36);

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Authentication required");
  }

  const inviteData = {
    group_id: groupId,
    invite_token: token,
    created_by: user.id,
    expires_at: options?.expiresAt?.toISOString(),
    max_uses: options?.maxUses,
  };

  const { error } = await supabase.from("group_invites").insert(inviteData);

  if (error) {
    throw new Error("Failed to generate invite link");
  }

  // Return the full invite URL
  const baseUrl = window.location.origin;
  return `${baseUrl}/?invite=${token}`;
}

async function getGroupInvites(groupId: string): Promise<Array<GroupInvite>> {
  const { data, error } = await supabase
    .from("group_invites")
    .select("*")
    .eq("group_id", groupId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch group invites");
  }

  return (
    data.map((i) => ({
      ...i,
      expires_at: i.expires_at || "",
      max_uses: i.max_uses || 0,
    })) || []
  );
}

async function deleteInvite(inviteId: string): Promise<void> {
  const { error } = await supabase
    .from("group_invites")
    .delete()
    .eq("id", inviteId);

  if (error) {
    throw new Error("Failed to delete invite");
  }
}
