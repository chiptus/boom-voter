import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Group = Database["public"]["Tables"]["groups"]["Row"] & {
  member_count?: number;
  is_creator?: boolean;
};

type GroupMember = Database["public"]["Tables"]["group_members"]["Row"];

export const useGroups = () => {
  const [user, setUser] = useState<any>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    getUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchUserGroups();
      } else {
        setGroups([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      fetchUserGroups();
    }
    setLoading(false);
  };

  const fetchUserGroups = async () => {
    const currentUser = user || (await supabase.auth.getUser()).data.user;
    if (!currentUser) return;
    
    const { data: groupsData, error } = await supabase
      .from("groups")
      .select(`
        *,
        group_members!inner(user_id)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: "Error",
        description: "Failed to fetch groups",
        variant: "destructive",
      });
    } else {
      // Transform data to include member count and creator info
      const transformedGroups = groupsData?.map(group => ({
        ...group,
        member_count: group.group_members?.length || 0,
        is_creator: group.created_by === currentUser.id,
      })) || [];
      
      setGroups(transformedGroups);
    }
  };

  const createGroup = async (name: string, description?: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a group",
        variant: "destructive",
      });
      return null;
    }

    console.log('Creating group with user:', user.id);
    
    const { data: group, error } = await supabase
      .from("groups")
      .insert({
        name,
        description,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating group:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create group",
        variant: "destructive",
      });
      return null;
    }

    // Add creator as first member
    const { error: memberError } = await supabase
      .from("group_members")
      .insert({
        group_id: group.id,
        user_id: user.id,
        role: "creator",
      });

    if (memberError) {
      toast({
        title: "Warning",
        description: "Group created but failed to add you as member",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Group created successfully",
      });
    }

    fetchUserGroups();
    return group;
  };

  const joinGroup = async (groupId: string) => {
    if (!user) return false;

    const { error } = await supabase
      .from("group_members")
      .insert({
        group_id: groupId,
        user_id: user.id,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to join group",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Joined group successfully",
    });

    fetchUserGroups();
    return true;
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return false;

    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to leave group",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Left group successfully",
    });

    fetchUserGroups();
    return true;
  };

  const inviteToGroup = async (groupId: string, username: string) => {
    if (!user) return false;

    // First, find the user by username (assuming profiles table has usernames)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (profileError || !profile) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive",
      });
      return false;
    }

    // Check if user is already in the group
    const { data: existingMember } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", profile.id)
      .single();

    if (existingMember) {
      toast({
        title: "Error",
        description: "User is already in this group",
        variant: "destructive",
      });
      return false;
    }

    // Add user to group
    const { error } = await supabase
      .from("group_members")
      .insert({
        group_id: groupId,
        user_id: profile.id,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to invite user to group",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: `${username} has been added to the group`,
    });

    return true;
  };

  const deleteGroup = async (groupId: string) => {
    if (!user) return false;

    const { error } = await supabase
      .from("groups")
      .delete()
      .eq("id", groupId)
      .eq("created_by", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete group",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Group deleted successfully",
    });

    fetchUserGroups();
    return true;
  };

  const getGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
    const { data, error } = await supabase
      .from("group_members")
      .select(`
        *,
        profiles:user_id(username)
      `)
      .eq("group_id", groupId);

    if (error) {
      console.error('Error fetching group members:', error);
      return [];
    }

    return data || [];
  };

  return {
    user,
    groups,
    loading,
    createGroup,
    joinGroup,
    leaveGroup,
    inviteToGroup,
    deleteGroup,
    getGroupMembers,
    fetchUserGroups,
  };
};