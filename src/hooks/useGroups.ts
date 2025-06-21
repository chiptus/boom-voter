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
    
    // First fetch groups
    const { data: groupsData, error } = await supabase
      .from("groups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch groups",
        variant: "destructive",
      });
    } else if (groupsData) {
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
            is_creator: group.created_by === currentUser.id,
          };
        })
      );
      
      setGroups(groupsWithCounts);
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

  const inviteToGroup = async (groupId: string, usernameOrEmail: string) => {
    if (!user) return false;

    // First, try to find the user by username or email
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
          toast({
            title: "User not found",
            description: `No user found with email: ${usernameOrEmail}`,
            variant: "destructive",
          });
          return false;
        }
        
        toast({
          title: "User found",
          description: `Found user with email: ${usernameOrEmail}`,
        });
        
        // Use the auth user ID
        const userId = authData;
        
        // Check if user is already in the group
        const { data: existingMember } = await supabase
          .from("group_members")
          .select("id")
          .eq("group_id", groupId)
          .eq("user_id", userId)
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
            user_id: userId,
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
          description: `${usernameOrEmail} has been added to the group`,
        });

        return true;
      } else {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return false;
      }
    }

    toast({
      title: "User found",
      description: `Found user: ${usernameOrEmail}`,
    });

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
      description: `${usernameOrEmail} has been added to the group`,
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