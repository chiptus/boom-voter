import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Artist = Database["public"]["Tables"]["artists"]["Row"] & {
  music_genres: { name: string } | null;
  votes: { vote_type: number; user_id: string }[];
};

type ArtistNote = {
  id: string;
  artist_id: string;
  user_id: string;
  note_content: string;
  created_at: string;
  updated_at: string;
  author_username?: string;
  author_email?: string;
};

// Artist Queries
export const artistQueries = {
  all: () => ['artists'] as const,
  lists: () => [...artistQueries.all(), 'list'] as const,
  list: (filters?: unknown) => [...artistQueries.lists(), filters] as const,
  details: () => [...artistQueries.all(), 'detail'] as const,
  detail: (id: string) => [...artistQueries.details(), id] as const,
  notes: (artistId: string) => [...artistQueries.detail(artistId), 'notes'] as const,
};

// Voting Queries
export const voteQueries = {
  all: () => ['votes'] as const,
  user: (userId: string) => [...voteQueries.all(), 'user', userId] as const,
};

// Genre Queries
export const genreQueries = {
  all: () => ['genres'] as const,
};

// Group Queries
export const groupQueries = {
  all: () => ['groups'] as const,
  user: (userId: string) => [...groupQueries.all(), 'user', userId] as const,
  detail: (groupId: string) => [...groupQueries.all(), 'detail', groupId] as const,
  members: (groupId: string) => [...groupQueries.detail(groupId), 'members'] as const,
};

// Auth Queries
export const authQueries = {
  user: () => ['auth', 'user'] as const,
  profile: (userId?: string) => ['auth', 'profile', userId] as const,
};

// Query Functions
export const queryFunctions = {
  // Artists
  async fetchArtists(): Promise<Artist[]> {
    
    const { data, error } = await supabase
      .from("artists")
      .select(`
        *,
        music_genres (name),
        votes (vote_type, user_id)
      `)
      .eq('archived', false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Error fetching artists:', error);
      throw new Error('Failed to fetch artists');
    }

    
    return data || [];
  },

  async fetchArtist(id: string): Promise<Artist> {
    
    const { data, error } = await supabase
      .from("artists")
      .select(`
        *,
        music_genres (name),
        votes (vote_type, user_id)
      `)
      .eq("id", id)
      .eq("archived", false)
      .single();

    if (error) {
      console.error('Error fetching artist:', error);
      throw new Error('Failed to fetch artist details');
    }

    
    return data;
  },

  async fetchUserVotes(userId: string): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from("votes")
      .select("artist_id, vote_type")
      .eq("user_id", userId);

    if (error) {
      throw new Error('Failed to fetch user votes');
    }

    return (data || []).reduce((acc, vote) => {
      acc[vote.artist_id] = vote.vote_type;
      return acc;
    }, {} as Record<string, number>);
  },

  async fetchUserKnowledge(userId: string): Promise<Record<string, boolean>> {
    const { data, error } = await supabase
      .from("artist_knowledge")
      .select("artist_id")
      .eq("user_id", userId);

    if (error) {
      throw new Error('Failed to fetch user knowledge');
    }

    return (data || []).reduce((acc, knowledge) => {
      acc[knowledge.artist_id] = true;
      return acc;
    }, {} as Record<string, boolean>);
  },

  async fetchArtistNotes(artistId: string): Promise<ArtistNote[]> {
    const { data: notesData, error: notesError } = await supabase
      .from("artist_notes")
      .select("*")
      .eq("artist_id", artistId)
      .order("created_at", { ascending: false });

    if (notesError) {
      throw new Error('Failed to fetch notes');
    }

    // Get author profiles for all notes
    const userIds = notesData?.map(note => note.user_id) || [];
    if (userIds.length === 0) return [];

    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username, email")
      .in("id", userIds);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
    }

    const notesWithAuthor = notesData?.map(note => {
      const profile = profilesData?.find(p => p.id === note.user_id);
      return {
        ...note,
        author_username: profile?.username,
        author_email: profile?.email,
      };
    }) || [];

    return notesWithAuthor;
  },

  async fetchArtistGroupVotes(artistId: string, groupId: string): Promise<Array<{
    vote_type: number;
    user_id: string;
    username: string | null;
  }>> {
    // First get group member user IDs
    const { data: groupMembers, error: membersError } = await supabase
      .from("group_members")
      .select("user_id")
      .eq("group_id", groupId);

    if (membersError) {
      throw new Error('Failed to fetch group members');
    }

    if (!groupMembers || groupMembers.length === 0) {
      return [];
    }

    const memberIds = groupMembers.map(member => member.user_id);

    // Then get votes from those users for this artist
    const { data: votes, error: votesError } = await supabase
      .from("votes")
      .select("vote_type, user_id")
      .eq("artist_id", artistId)
      .in("user_id", memberIds);

    if (votesError) {
      throw new Error('Failed to fetch group votes');
    }

    if (!votes || votes.length === 0) {
      return [];
    }

    // Finally get usernames for the voters
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", votes.map(vote => vote.user_id));

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
    }

    return votes.map(vote => {
      const profile = profiles?.find(p => p.id === vote.user_id);
      return {
        vote_type: vote.vote_type,
        user_id: vote.user_id,
        username: profile?.username || null,
      };
    });
  },

  async fetchGenres(): Promise<Array<{ id: string; name: string }>> {
    const { data, error } = await supabase
      .from('music_genres')
      .select('id, name')
      .order('name');
    
    if (error) {
      throw new Error('Failed to load genres');
    }

    return data || [];
  },

  // Groups
  async fetchUserGroups(userId: string) {
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
          is_creator: group.created_by === userId,
        };
      })
    );
    
    return groupsWithCounts;
  },

  async fetchGroupMembers(groupId: string) {
    const { data: members, error } = await supabase
      .from("group_members")
      .select("*")
      .eq("group_id", groupId)
      .order("joined_at", { ascending: true });

    if (error) {
      throw new Error('Failed to fetch group members');
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

  async checkUserPermissions(userId: string, permission: 'edit_artists' | 'is_admin') {
    try {
      // Use new admin roles system
      if (permission === 'edit_artists') {
        const { data, error } = await supabase.rpc('can_edit_artists', { check_user_id: userId });
        if (error) {
          console.error('Error checking edit_artists permission:', error);
          return false;
        }
        return data || false;
      } else if (permission === 'is_admin') {
        const { data, error } = await supabase.rpc('is_admin', { check_user_id: userId });
        if (error) {
          console.error('Error checking is_admin permission:', error);
          return false;
        }
        return data || false;
      }
      
      return false;
    } catch (error) {
      console.error('Error in checkUserPermissions:', error);
      return false;
    }
  },

  async fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error('Failed to fetch profile');
    }

    return data;
  },
};

// Mutation Functions
export const mutationFunctions = {
  async vote(variables: { artistId: string; voteType: number; userId: string; existingVote?: number }) {
    const { artistId, voteType, userId, existingVote } = variables;
    
    if (existingVote === voteType) {
      // Remove vote if clicking the same vote type
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("user_id", userId)
        .eq("artist_id", artistId);

      if (error) throw new Error('Failed to remove vote');
      return null;
    } else {
      // Add or update vote
      const { error } = await supabase
        .from("votes")
        .upsert({
          user_id: userId,
          artist_id: artistId,
          vote_type: voteType,
        }, {
          onConflict: 'user_id,artist_id'
        });

      if (error) throw new Error('Failed to save vote');
      return voteType;
    }
  },

  async toggleKnowledge(variables: { artistId: string; userId: string; isKnown: boolean }) {
    const { artistId, userId, isKnown } = variables;
    
    if (isKnown) {
      // Remove knowledge entry
      const { error } = await supabase
        .from("artist_knowledge")
        .delete()
        .eq("user_id", userId)
        .eq("artist_id", artistId);

      if (error) throw new Error('Failed to remove knowledge');
      return false;
    } else {
      // Add knowledge entry
      const { error } = await supabase
        .from("artist_knowledge")
        .insert({
          user_id: userId,
          artist_id: artistId,
        });

      if (error) throw new Error('Failed to add knowledge');
      return true;
    }
  },

  async archiveArtist(artistId: string) {
    
    const { error } = await supabase
      .from("artists")
      .update({ archived: true })
      .eq("id", artistId);

    if (error) {
      console.error('Error archiving artist:', error);
      throw new Error('Failed to archive artist');
    }

    
    return true;
  },

  async saveArtistNote(variables: { artistId: string; userId: string; noteContent: string }) {
    const { artistId, userId, noteContent } = variables;
    
    const { data, error } = await supabase
      .from("artist_notes")
      .upsert({
        artist_id: artistId,
        user_id: userId,
        note_content: noteContent,
      })
      .select()
      .single();

    if (error) throw new Error('Failed to save note');
    return data;
  },

  async deleteArtistNote(noteId: string) {
    const { error } = await supabase
      .from("artist_notes")
      .delete()
      .eq("id", noteId);

    if (error) throw new Error('Failed to delete note');
    return true;
  },

  // Groups
  async createGroup(variables: { name: string; description?: string; userId: string }) {
    const { name, description, userId } = variables;
    
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

  async deleteGroup(variables: { groupId: string; userId: string }) {
    const { groupId, userId } = variables;
    
    const { error } = await supabase
      .from("groups")
      .delete()
      .eq("id", groupId)
      .eq("created_by", userId);

    if (error) {
      throw new Error("Failed to delete group");
    }

    return true;
  },

  async joinGroup(variables: { groupId: string; userId: string }) {
    const { groupId, userId } = variables;
    
    const { error } = await supabase
      .from("group_members")
      .insert({
        group_id: groupId,
        user_id: userId,
      });

    if (error) {
      throw new Error("Failed to join group");
    }

    return true;
  },

  async leaveGroup(variables: { groupId: string; userId: string }) {
    const { groupId, userId } = variables;
    
    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", userId);

    if (error) {
      throw new Error("Failed to leave group");
    }

    return true;
  },

  async updateProfile(variables: { userId: string; updates: unknown }) {
    const { userId, updates } = variables;
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update profile');
    }

    return data;
  },
};

export type { Artist, ArtistNote };