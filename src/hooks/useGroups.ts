import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Group, GroupMember } from "@/types/groups";
import { groupService } from "@/services/groupService";

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
    
    try {
      const groups = await groupService.fetchUserGroups(currentUser.id);
      setGroups(groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch groups",
        variant: "destructive",
      });
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
    
    try {
      const group = await groupService.createGroup(name, description, user.id);
      toast({
        title: "Success",
        description: "Group created successfully",
      });
      fetchUserGroups();
      return group;
    } catch (error) {
      console.error('Error creating group:', error);
      const message = error instanceof Error ? error.message : "Failed to create group";
      toast({
        title: message.includes("failed to add") ? "Warning" : "Error",
        description: message,
        variant: "destructive",
      });
      return null;
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!user) return false;

    try {
      await groupService.joinGroup(groupId, user.id);
      toast({
        title: "Success",
        description: "Joined group successfully",
      });
      fetchUserGroups();
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join group",
        variant: "destructive",
      });
      return false;
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return false;

    try {
      await groupService.leaveGroup(groupId, user.id);
      toast({
        title: "Success",
        description: "Left group successfully",
      });
      fetchUserGroups();
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to leave group",
        variant: "destructive",
      });
      return false;
    }
  };

  const inviteToGroup = async (groupId: string, usernameOrEmail: string) => {
    if (!user) return false;

    try {
      // Find user by username or email
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

      // Show success toast for finding user
      const foundMessage = userResult.foundBy === 'email' 
        ? `Found user with email: ${usernameOrEmail}`
        : `Found user: ${usernameOrEmail}`;
      toast({
        title: "User found",
        description: foundMessage,
      });

      // Check if user is already in the group
      const isAlreadyMember = await groupService.checkIfUserInGroup(groupId, userResult.userId!);
      if (isAlreadyMember) {
        toast({
          title: "Error",
          description: "User is already in this group",
          variant: "destructive",
        });
        return false;
      }

      // Add user to group
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

  const deleteGroup = async (groupId: string) => {
    if (!user) return false;

    try {
      await groupService.deleteGroup(groupId, user.id);
      toast({
        title: "Success",
        description: "Group deleted successfully",
      });
      fetchUserGroups();
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete group",
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

  const getGroupById = async (groupId: string) => {
    return groupService.getGroupById(groupId);
  };

  const checkUserPermission = async (permission: 'edit_artists') => {
    if (!user) return false;
    
    try {
      // Check if user is in the Core group
      const { data, error } = await supabase
        .from("group_members")
        .select("groups!inner(name)")
        .eq("user_id", user.id)
        .eq("groups.name", "Core")
        .single();

      return !error && !!data;
    } catch (error) {
      console.error('Error checking user permission:', error);
      return false;
    }
  };

  const canEditArtists = async () => {
    return checkUserPermission('edit_artists');
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
    removeMemberFromGroup,
    getGroupById,
    fetchUserGroups,
    checkUserPermission,
    canEditArtists,
  };
};