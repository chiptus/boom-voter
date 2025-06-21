
import { supabase } from "@/integrations/supabase/client";
import type { GroupInvite } from "@/types/invites";

export const inviteService = {
  async generateInviteLink(groupId: string, options?: {
    expiresAt?: Date;
    maxUses?: number;
  }): Promise<string> {
    // Generate a cryptographically secure random token
    const token = crypto.randomUUID() + '-' + Date.now().toString(36);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
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

    const { error } = await supabase
      .from("group_invites")
      .insert(inviteData);

    if (error) {
      throw new Error("Failed to generate invite link");
    }

    // Return the full invite URL
    const baseUrl = window.location.origin;
    return `${baseUrl}/?invite=${token}`;
  },

  async getGroupInvites(groupId: string): Promise<GroupInvite[]> {
    const { data, error } = await supabase
      .from("group_invites")
      .select("*")
      .eq("group_id", groupId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Failed to fetch group invites");
    }

    return data || [];
  },

  async deactivateInvite(inviteId: string): Promise<void> {
    const { error } = await supabase
      .from("group_invites")
      .update({ is_active: false })
      .eq("id", inviteId);

    if (error) {
      throw new Error("Failed to deactivate invite");
    }
  },

  async deleteInvite(inviteId: string): Promise<void> {
    const { error } = await supabase
      .from("group_invites")
      .delete()
      .eq("id", inviteId);

    if (error) {
      throw new Error("Failed to delete invite");
    }
  },
};
