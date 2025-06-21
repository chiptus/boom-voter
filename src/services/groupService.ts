
import { supabase } from "@/integrations/supabase/client";
import type { Group, GroupMember } from "@/types/groups";

export const groupService = {
  async fetchUserGroups(currentUserId: string): Promise<Group[]> {
    // First fetch groups
    const { data: groupsData, error } = await supabase
      .from("groups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message || "Failed to fetch groups");
    }

    if (!groupsData) return [];

    // Then fetch member counts separately
    const groupsWithCounts = await Promise.all(
      groupsData.map(async (group) => {
        const { count } = await supabase
          .from("group_members")
          .select("*", { count: "exact", head: true })
          .eq("group_id", group.id);
        
        return {
          ...group,
          member_count: count || 0,
          is_creator: group.created_by === currentUserId,
        };
      })
    );
    
    return groupsWithCounts;
  },

  async createGroup(name: string, description: string | undefined, userId: string) {
    const { data: group, error } = await supabase
      .from("groups")
      .insert({
        name,
        description,
        created_by: userId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message || "Failed to create group");
    }

    // Add creator as first member
    const { error: memberError } = await supabase
      .from("group_members")
      .insert({
        group_id: group.id,
        user_id: userId,
        role: "creator",
      });

    if (memberError) {
      throw new Error("Group created but failed to add you as member");
    }

    return group;
  },

  async joinGroup(groupId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("group_members")
      .insert({
        group_id: groupId,
        user_id: userId,
      });

    if (error) {
      throw new Error("Failed to join group");
    }
  },

  async leaveGroup(groupId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", userId);

    if (error) {
      throw new Error("Failed to leave group");
    }
  },

  async deleteGroup(groupId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("groups")
      .delete()
      .eq("id", groupId)
      .eq("created_by", userId);

    if (error) {
      throw new Error("Failed to delete group");
    }
  },

  async findUserByUsernameOrEmail(usernameOrEmail: string) {
    // First, try to find the user by username or email in profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .or(`username.eq.${usernameOrEmail},email.eq.${usernameOrEmail}`)
      .single();

    // If not found in profiles, check auth.users by email
    if (profileError || !profile) {
      // Check if it's an email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(usernameOrEmail)) {
        // Try to find by email in auth system
        const { data: authData, error: authError } = await supabase
          .rpc('get_user_id_by_email', { user_email: usernameOrEmail });
        
        if (authError || !authData) {
          return { found: false, userId: null, foundBy: 'email' as const };
        }
        
        return { found: true, userId: authData, foundBy: 'email' as const };
      } else {
        return { found: false, userId: null, foundBy: 'username' as const };
      }
    }

    return { found: true, userId: profile.id, foundBy: 'profile' as const };
  },

  async checkIfUserInGroup(groupId: string, userId: string): Promise<boolean> {
    const { data: existingMember } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .single();

    return !!existingMember;
  },

  async addUserToGroup(groupId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("group_members")
      .insert({
        group_id: groupId,
        user_id: userId,
      });

    if (error) {
      throw new Error("Failed to invite user to group");
    }
  },

  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    // First get the group members
    const { data: members, error } = await supabase
      .from("group_members")
      .select("*")
      .eq("group_id", groupId)
      .order("joined_at", { ascending: true });

    if (error) {
      console.error('Error fetching group members:', error);
      return [];
    }

    if (!members || members.length === 0) {
      return [];
    }

    // Then fetch profile information for each member
    const membersWithProfiles = await Promise.all(
      members.map(async (member) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, email")
          .eq("id", member.user_id)
          .single();

        return {
          ...member,
          profiles: profile || { username: null, email: null }
        };
      })
    );

    return membersWithProfiles;
  },

  async removeMemberFromGroup(groupId: string, userId: string, currentUserId: string): Promise<void> {
    // First check if current user is the group creator
    const { data: group, error: groupError } = await supabase
      .from("groups")
      .select("created_by")
      .eq("id", groupId)
      .single();

    if (groupError || !group) {
      throw new Error("Group not found");
    }

    if (group.created_by !== currentUserId) {
      throw new Error("Only group creators can remove members");
    }

    // Prevent removing the creator
    if (userId === currentUserId) {
      throw new Error("You cannot remove yourself as the group creator");
    }

    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", userId);

    if (error) {
      throw new Error("Failed to remove member from group");
    }
  },

  async getGroupById(groupId: string): Promise<Group | null> {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single();

    if (error) {
      throw new Error("Failed to fetch group details");
    }

    return data;
  },

  // New invite-related functions
  async validateInviteToken(token: string) {
    const { data, error } = await supabase
      .rpc('validate_invite_token', { token });

    if (error) {
      throw new Error(error.message || "Failed to validate invite");
    }

    return data?.[0] || null;
  },

  async useInviteToken(token: string, userId: string) {
    const { data, error } = await supabase
      .rpc('use_invite_token', { 
        token, 
        user_id: userId 
      });

    if (error) {
      throw new Error(error.message || "Failed to use invite");
    }

    return data?.[0] || null;
  },
};
