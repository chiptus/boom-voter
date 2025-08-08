import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Artist = Database["public"]["Tables"]["artists"]["Row"] & {
  artist_music_genres: { music_genre_id: string }[] | null;
  votes: { vote_type: number; user_id: string }[];
};

export type FestivalSet = Database["public"]["Tables"]["sets"]["Row"] & {
  artists: Artist[];
  votes: { vote_type: number; user_id: string }[];
  stages?: { name: string } | null;
};

export type Festival = Database["public"]["Tables"]["festivals"]["Row"];
export type FestivalEdition =
  Database["public"]["Tables"]["festival_editions"]["Row"];
export type Stage = Database["public"]["Tables"]["stages"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type SetNote = {
  id: string;
  set_id: string;
  user_id: string;
  note_content: string;
  created_at: string;
  updated_at: string;
  author_username?: string;
  author_email?: string;
};

// Artist Queries (legacy)
export const artistQueries = {
  all: () => ["artists"] as const,
  lists: () => [...artistQueries.all(), "list"] as const,
  list: (filters?: unknown) => [...artistQueries.lists(), filters] as const,
  details: () => [...artistQueries.all(), "detail"] as const,
  detail: (id: string) => [...artistQueries.details(), id] as const,
  notes: (artistId: string) =>
    [...artistQueries.detail(artistId), "notes"] as const,
};

// Set Queries
export const setQueries = {
  all: () => ["sets"] as const,
  lists: () => [...setQueries.all(), "list"] as const,
  list: (filters?: unknown) => [...setQueries.lists(), filters] as const,
  details: () => [...setQueries.all(), "detail"] as const,
  detail: (id: string) => [...setQueries.details(), id] as const,
  notes: (setId: string) => [...setQueries.detail(setId), "notes"] as const,
  byEdition: (editionId: string) =>
    [...setQueries.all(), "edition", editionId] as const,
};

// Festival Queries
export const festivalQueries = {
  all: () => ["festivals"] as const,
  item: (festivalId: string) => [...festivalQueries.all(), festivalId] as const,
};

export const editionQueries = {
  all: (festivalId: string) =>
    [...festivalQueries.all(), festivalId, "editions"] as const,
  item: ({
    editionId,
    festivalId,
  }: {
    festivalId: string;
    editionId: string;
  }) => [...editionQueries.all(festivalId), editionId] as const,
};

// Voting Queries
export const voteQueries = {
  all: () => ["votes"] as const,
  user: (userId: string) => [...voteQueries.all(), "user", userId] as const,
};

// Genre Queries
export const genreQueries = {
  all: () => ["genres"] as const,
};

// Group Queries
export const groupQueries = {
  all: () => ["groups"] as const,
  user: (userId: string) => [...groupQueries.all(), "user", userId] as const,
  detail: (groupId: string) =>
    [...groupQueries.all(), "detail", groupId] as const,
  members: (groupId: string) =>
    [...groupQueries.detail(groupId), "members"] as const,
  votes: (setId: string, groupId: string) =>
    [...groupQueries.all(), "votes", setId, groupId] as const,
};

// Stage Queries
export const stageQueries = {
  all: () => ["stages"] as const,
  byEdition: (editionId: string) =>
    [...stageQueries.all(), "edition", editionId] as const,
};

// Auth Queries
export const authQueries = {
  user: () => ["auth", "user"] as const,
  profile: (userId?: string) => ["auth", "profile", userId] as const,
};

// Invite Queries
export const inviteQueries = {
  all: () => ["invites"] as const,
  group: (groupId: string) =>
    [...inviteQueries.all(), "group", groupId] as const,
  validation: (token: string) =>
    [...inviteQueries.all(), "validation", token] as const,
};

// Query Functions
export const queryFunctions = {
  // Sets (main data source)
  async fetchSets(): Promise<FestivalSet[]> {
    const { data, error } = await supabase
      .from("sets")
      .select(
        `
        *,
        set_artists!inner (
          artists (
            *,
            artist_music_genres (
              music_genre_id
            )
          )
        ),
        votes (vote_type, user_id)
      `,
      )
      .eq("archived", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching sets:", error);
      throw new Error("Failed to fetch sets");
    }

    // Get stages separately since the FK relationship isn't working
    const { data: stagesData } = await supabase
      .from("stages")
      .select("*")
      .eq("archived", false);

    const stagesMap =
      stagesData?.reduce(
        (acc, stage) => {
          acc[stage.id] = stage;
          return acc;
        },
        {} as Record<string, Stage>,
      ) || {};

    // Transform the data to match expected structure
    const transformedData =
      data?.map((set) => ({
        ...set,
        artists:
          set.set_artists
            ?.map((sa) => ({
              ...sa.artists,
              votes: [], // Artists in sets don't have individual votes
            }))
            .filter(Boolean) || [],
        stages: set.stage_id ? stagesMap[set.stage_id] : null,
        set_artists: undefined, // Remove junction data from final response
      })) || [];

    return transformedData;
  },

  async fetchArtists(): Promise<Artist[]> {
    const { data, error } = await supabase
      .from("artists")
      .select(
        `
        *,
        artist_music_genres (music_genre_id),
        votes (vote_type, user_id)
      `,
      )
      .eq("archived", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching artists:", error);
      throw new Error("Failed to fetch artists");
    }

    return data || [];
  },

  async fetchSet(id: string): Promise<FestivalSet> {
    const { data, error } = await supabase
      .from("sets")
      .select(
        `
        *,
        stages (name),
        set_artists!inner (
          artists (
            *,
            artist_music_genres (music_genre_id)
          )
        ),
        votes (vote_type, user_id)
      `,
      )
      .eq("id", id)
      .eq("archived", false)
      .single();

    if (error) {
      console.error("Error fetching set:", error);
      throw new Error("Failed to fetch set details");
    }

    // Transform the data to match expected structure
    const transformedData = {
      ...data,
      artists:
        data.set_artists
          ?.map((sa) => ({
            ...sa.artists,
            votes: [], // Artists in sets don't have individual votes
          }))
          .filter(Boolean) || [],
      set_artists: undefined, // Remove junction data from final response
    };

    return transformedData;
  },

  async fetchArtist(id: string): Promise<Artist> {
    const { data, error } = await supabase
      .from("artists")
      .select(
        `
        *,
        artist_music_genres (music_genre_id),
        votes (vote_type, user_id)
      `,
      )
      .eq("id", id)
      .eq("archived", false)
      .single();

    if (error) {
      console.error("Error fetching artist:", error);
      throw new Error("Failed to fetch artist details");
    }

    return data;
  },

  async fetchUserVotes(userId: string): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from("votes")
      .select("set_id, artist_id, vote_type")
      .eq("user_id", userId);

    if (error) {
      throw new Error("Failed to fetch user votes");
    }

    const votes: Record<string, number> = {};

    (data || []).forEach((vote) => {
      // Prioritize set-based votes over legacy artist votes
      if (vote.set_id) {
        votes[vote.set_id] = vote.vote_type;
      } else if (vote.artist_id && !votes[vote.artist_id]) {
        votes[vote.artist_id] = vote.vote_type;
      }
    });

    return votes;
  },

  async fetchUserKnowledge(userId: string): Promise<Record<string, boolean>> {
    const { data, error } = await supabase
      .from("artist_knowledge")
      .select("artist_id")
      .eq("user_id", userId);

    if (error) {
      throw new Error("Failed to fetch user knowledge");
    }

    return (data || []).reduce(
      (acc, knowledge) => {
        acc[knowledge.artist_id] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );
  },

  async fetchArtistNotes(artistId: string): Promise<SetNote[]> {
    const { data: notesData, error: notesError } = await supabase
      .from("artist_notes")
      .select("*")
      .eq("artist_id", artistId)
      .order("created_at", { ascending: false });

    if (notesError) {
      throw new Error("Failed to fetch notes");
    }

    // Get author profiles for all notes
    const userIds = notesData?.map((note) => note.user_id) || [];
    if (userIds.length === 0) return [];

    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username, email")
      .in("id", userIds);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
    }

    const notesWithAuthor =
      notesData?.map(({ artist_id, ...note }) => {
        const profile = profilesData?.find((p) => p.id === note.user_id);
        return {
          ...note,
          set_id: artist_id,
          author_username: profile?.username || undefined,
          author_email: profile?.email || undefined,
        };
      }) || [];

    return notesWithAuthor;
  },

  async fetchSetGroupVotes(
    setId: string,
    groupId: string,
  ): Promise<
    Array<{
      vote_type: number;
      user_id: string;
      username: string | null;
    }>
  > {
    // First get group member user IDs
    const { data: groupMembers, error: membersError } = await supabase
      .from("group_members")
      .select("user_id")
      .eq("group_id", groupId);

    if (membersError) {
      throw new Error("Failed to fetch group members");
    }

    if (!groupMembers || groupMembers.length === 0) {
      return [];
    }

    const memberIds = groupMembers.map((member) => member.user_id);

    // Then get votes from those users for this artist
    const { data: votes, error: votesError } = await supabase
      .from("votes")
      .select("vote_type, user_id")
      .eq("set_id", setId)
      .in("user_id", memberIds);

    if (votesError) {
      throw new Error("Failed to fetch group votes");
    }

    if (!votes || votes.length === 0) {
      return [];
    }

    // Finally get usernames for the voters
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username")
      .in(
        "id",
        votes.map((vote) => vote.user_id),
      );

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
    }

    return votes.map((vote) => {
      const profile = profiles?.find((p) => p.id === vote.user_id);
      return {
        vote_type: vote.vote_type,
        user_id: vote.user_id,
        username: profile?.username || null,
      };
    });
  },

  async fetchGenres(): Promise<Array<{ id: string; name: string }>> {
    const { data, error } = await supabase
      .from("music_genres")
      .select("id, name")
      .order("name");

    if (error) {
      throw new Error("Failed to load genres");
    }

    return data || [];
  },

  // Festival functions
  async fetchFestivals({ all }: { all?: boolean }): Promise<Festival[]> {
    let query = supabase.from("festivals").select("*").eq("archived", false);

    if (!all) {
      query = query.eq("published", true);
    }

    const { data, error } = await query.order("name");

    if (error) {
      throw new Error("Failed to load festivals");
    }

    return data || [];
  },

  async fetchFestival(festivalId: string): Promise<Festival> {
    const { data, error } = await supabase
      .from("festivals")
      .select("*")
      .eq("archived", false)
      .eq("id", festivalId)
      .order("name")
      .single();

    if (error) {
      throw new Error("Failed to load festivals");
    }

    return data;
  },

  async fetchFestivalBySlug(festivalSlug: string): Promise<Festival> {
    const { data, error } = await supabase
      .from("festivals")
      .select("*")
      .eq("archived", false)
      .eq("slug", festivalSlug)
      .single();

    if (error) {
      throw new Error("Failed to load festival");
    }

    return data;
  },

  async fetchFestivalEditions(
    festivalId: string,
    { all }: { all?: boolean } = {},
  ): Promise<FestivalEdition[]> {
    let query = supabase
      .from("festival_editions")
      .select("*")
      .eq("archived", false)
      .order("year", { ascending: false });

    if (festivalId) {
      query = query.eq("festival_id", festivalId);
    }

    if (!all) {
      query = query.eq("published", true);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error("Failed to load festival editions");
    }

    return data || [];
  },

  async fetchFestivalEdition({
    editionId,
    festivalId,
  }: {
    festivalId: string;
    editionId: string;
  }): Promise<FestivalEdition> {
    const query = supabase
      .from("festival_editions")
      .select("*")
      .eq("archived", false)
      .eq("festival_id", festivalId)
      .eq("id", editionId)
      .single();

    const { data, error } = await query;

    if (error) {
      throw new Error("Failed to load festival editions");
    }

    return data;
  },

  async fetchFestivalEditionBySlug({
    editionSlug,
    festivalSlug,
  }: {
    festivalSlug: string;
    editionSlug: string;
  }): Promise<FestivalEdition> {
    // First get the festival ID from the slug
    const festival = await queryFunctions.fetchFestivalBySlug(festivalSlug);

    const query = supabase
      .from("festival_editions")
      .select("*")
      .eq("archived", false)
      .eq("festival_id", festival.id)
      .eq("slug", editionSlug)
      .single();

    const { data, error } = await query;

    if (error) {
      throw new Error("Failed to load festival edition");
    }

    return data;
  },

  async fetchSetsByEdition(editionId: string): Promise<FestivalSet[]> {
    const { data, error } = await supabase
      .from("sets")
      .select(
        `
        *,
        stages (name),
        set_artists!inner (
          artists (
            *,
            artist_music_genres (music_genre_id)
          )
        ),
        votes (vote_type, user_id)
      `,
      )
      .eq("festival_edition_id", editionId)
      .eq("archived", false)
      .order("time_start", { ascending: true });

    if (error) {
      console.error("Error fetching sets by edition:", error);
      throw new Error("Failed to fetch sets");
    }

    // Transform the data to match expected structure
    const transformedData =
      data?.map((set) => ({
        ...set,
        artists:
          set.set_artists
            ?.map((sa) => ({
              ...sa.artists,
              votes: [], // Artists in sets don't have individual votes
            }))
            .filter(Boolean) || [],
        set_artists: undefined, // Remove junction data from final response
      })) || [];

    return transformedData;
  },

  // Stages
  async fetchStages(): Promise<Stage[]> {
    const { data, error } = await supabase
      .from("stages")
      .select("*")
      .eq("archived", false)
      .order("name");

    if (error) {
      throw new Error("Failed to load stages");
    }

    return data || [];
  },

  async fetchStagesByEdition(editionId: string): Promise<Stage[]> {
    const { data, error } = await supabase
      .from("stages")
      .select("*")
      .eq("festival_edition_id", editionId)
      .eq("archived", false)
      .order("name");

    if (error) {
      throw new Error("Failed to load stages for edition");
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
      }),
    );

    return groupsWithCounts;
  },

  async fetchGroupById(groupId: string) {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single();

    if (error) {
      console.error("Error fetching group:", error);
      throw new Error("Failed to fetch group");
    }

    return data;
  },

  async fetchGroupMembers(groupId: string) {
    const { data: members, error } = await supabase
      .from("group_members")
      .select("*")
      .eq("group_id", groupId)
      .order("joined_at", { ascending: true });

    if (error) {
      throw new Error("Failed to fetch group members");
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
          profiles: profile || { username: null, email: null },
        };
      }),
    );

    return membersWithProfiles;
  },

  async checkUserPermissions(
    userId: string,
    permission: "edit_artists" | "is_admin",
  ) {
    try {
      // Use new admin roles system
      if (permission === "edit_artists") {
        const { data, error } = await supabase.rpc("can_edit_artists", {
          check_user_id: userId,
        });
        if (error) {
          console.error("Error checking edit_artists permission:", error);
          return false;
        }
        return data || false;
      } else if (permission === "is_admin") {
        const { data, error } = await supabase.rpc("is_admin", {
          check_user_id: userId,
        });
        if (error) {
          console.error("Error checking is_admin permission:", error);
          return false;
        }
        return data || false;
      }

      return false;
    } catch (error) {
      console.error("Error in checkUserPermissions:", error);
      return false;
    }
  },

  async fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error("Failed to fetch profile");
    }

    return data;
  },

  // Management Functions for Admin Interface
  async createFestival(
    festival: Omit<Festival, "id" | "created_at" | "updated_at" | "archived">,
  ): Promise<Festival> {
    const { data, error } = await supabase
      .from("festivals")
      .insert(festival)
      .select()
      .single();

    if (error) {
      console.error("Error creating festival:", error);
      throw new Error("Failed to create festival");
    }

    return data;
  },

  async updateFestival(
    id: string,
    updates: Partial<Festival>,
  ): Promise<Festival> {
    const { data, error } = await supabase
      .from("festivals")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating festival:", error);
      throw new Error("Failed to update festival");
    }

    return data;
  },

  async deleteFestival(id: string): Promise<void> {
    const { error } = await supabase
      .from("festivals")
      .update({ archived: true, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error archiving festival:", error);
      throw new Error("Failed to archive festival");
    }
  },

  async createFestivalEdition(
    edition: Omit<
      FestivalEdition,
      | "id"
      | "created_at"
      | "updated_at"
      | "archived"
      | "is_active"
      | "description"
      | "location"
    > & {
      description?: string | null;
      location?: string | null;
    },
  ): Promise<FestivalEdition> {
    const { data, error } = await supabase
      .from("festival_editions")
      .insert({
        ...edition,
        description: edition.description ?? null,
        location: edition.location ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating festival edition:", error);
      throw new Error("Failed to create festival edition");
    }

    return data;
  },

  async updateFestivalEdition(
    id: string,
    updates: Partial<FestivalEdition>,
  ): Promise<FestivalEdition> {
    const { data, error } = await supabase
      .from("festival_editions")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating festival edition:", error);
      throw new Error("Failed to update festival edition");
    }

    return data;
  },

  async deleteFestivalEdition(id: string): Promise<void> {
    const { error } = await supabase
      .from("festival_editions")
      .update({ archived: true, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error archiving festival edition:", error);
      throw new Error("Failed to archive festival edition");
    }
  },

  async createStage(
    stage: Omit<Stage, "id" | "created_at" | "updated_at" | "archived">,
  ): Promise<Stage> {
    const { data, error } = await supabase
      .from("stages")
      .insert(stage)
      .select()
      .single();

    if (error) {
      console.error("Error creating stage:", error);
      throw new Error("Failed to create stage");
    }

    return data;
  },

  async updateStage(id: string, updates: Partial<Stage>): Promise<Stage> {
    const { data, error } = await supabase
      .from("stages")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating stage:", error);
      throw new Error("Failed to update stage");
    }

    return data;
  },

  async deleteStage(id: string): Promise<void> {
    const { error } = await supabase
      .from("stages")
      .update({ archived: true, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error archiving stage:", error);
      throw new Error("Failed to archive stage");
    }
  },

  async createSet(
    set: Omit<
      FestivalSet,
      | "id"
      | "created_at"
      | "updated_at"
      | "artists"
      | "votes"
      | "stages"
      | "archived"
    >,
  ): Promise<FestivalSet> {
    const { data, error } = await supabase
      .from("sets")
      .insert({
        ...set,
        archived: false, // Explicit default
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating set:", error);
      throw new Error("Failed to create set");
    }

    return {
      ...data,
      artists: [],
      votes: [],
    };
  },

  async updateSet(
    id: string,
    updates: Partial<Omit<FestivalSet, "artists" | "votes" | "stages">>,
  ) {
    const { data, error } = await supabase
      .from("sets")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating set:", error);
      throw new Error("Failed to update set");
    }

    return data;
  },

  async deleteSet(id: string): Promise<void> {
    const { error } = await supabase
      .from("sets")
      .update({ archived: true, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error archiving set:", error);
      throw new Error("Failed to archive set");
    }
  },

  async addArtistToSet(setId: string, artistId: string): Promise<void> {
    const { error } = await supabase
      .from("set_artists")
      .insert({ set_id: setId, artist_id: artistId });

    if (error) {
      console.error("Error adding artist to set:", error);
      throw new Error("Failed to add artist to set");
    }
  },

  async removeArtistFromSet(setId: string, artistId: string): Promise<void> {
    const { error } = await supabase
      .from("set_artists")
      .delete()
      .eq("set_id", setId)
      .eq("artist_id", artistId);

    if (error) {
      console.error("Error removing artist from set:", error);
      throw new Error("Failed to remove artist from set");
    }
  },
};

export type UpdateArtistUpdates = Partial<
  Omit<Artist, "artist_music_genres"> & { genre_ids: string[] }
>;

// Mutation Functions
export const mutationFunctions = {
  async vote({
    setId,
    voteType,
    userId,
    existingVote,
  }: {
    setId: string;
    voteType: number;
    userId: string;
    existingVote?: number;
  }) {
    // Prioritize set voting over artist voting
    const targetField = "set_id";

    if (existingVote === voteType) {
      // Remove vote if clicking the same vote type
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("user_id", userId)
        .eq(targetField, setId);

      if (error) throw new Error("Failed to remove vote");
      return null;
    } else {
      // Add or update vote
      const voteData: {
        artist_id: "";

        set_id: string;
        updated_at?: string;
        user_id: string;
        vote_type: number;
      } = {
        artist_id: "",
        user_id: userId,
        vote_type: voteType,
        set_id: setId,
      };

      const { error } = await supabase.from("votes").upsert(voteData, {
        onConflict: "user_id,set_id",
      });

      if (error) throw new Error("Failed to save vote");
      return voteType;
    }
  },

  async toggleKnowledge({
    artistId,
    userId,
    isKnown,
  }: {
    artistId: string;
    userId: string;
    isKnown: boolean;
  }) {
    if (isKnown) {
      const { error } = await supabase
        .from("artist_knowledge")
        .delete()
        .eq("user_id", userId)
        .eq("artist_id", artistId);

      if (error) throw new Error("Failed to remove knowledge");
      return false;
    } else {
      const { error } = await supabase.from("artist_knowledge").insert({
        user_id: userId,
        artist_id: artistId,
      });

      if (error) throw new Error("Failed to add knowledge");
      return true;
    }
  },

  async archiveArtist(artistId: string) {
    const { error } = await supabase
      .from("artists")
      .update({ archived: true })
      .eq("id", artistId);

    if (error) {
      console.error("Error archiving artist:", error);
      throw new Error("Failed to archive artist");
    }

    return true;
  },

  async createArtist(
    artistData: Omit<
      Artist,
      | "created_at"
      | "updated_at"
      | "archived"
      | "artist_music_genres"
      | "id"
      | "last_soundcloud_sync"
      | "soundcloud_followers"
      | "votes"
      | "estimated_date"
    > & {
      genre_ids: string[];
    },
  ): Promise<Artist> {
    const { data, error } = await supabase
      .from("artists")
      .insert({
        ...artistData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(
        `
        *,
        artist_music_genres (music_genre_id)
      `,
      )
      .single();

    if (error) {
      console.error("Error creating artist:", error);
      throw new Error("Failed to create artist");
    }

    if (artistData.genre_ids.length > 0) {
      const { error: genreError } = await supabase
        .from("artist_music_genres")
        .insert(
          artistData.genre_ids.map((genreId) => ({
            artist_id: data.id,
            music_genre_id: genreId,
          })),
        );

      if (genreError) {
        console.error("Error adding genres:", genreError);
        throw new Error("Failed to add genres");
      }
    }

    return {
      ...data,
      artist_music_genres: artistData.genre_ids.map((genreId) => ({
        music_genre_id: genreId,
      })),
      votes: [],
    };
  },

  async updateArtist(
    id: string,
    updates: UpdateArtistUpdates,
  ): Promise<Omit<Artist, "votes">> {
    const { genre_ids, ...rest } = updates;
    const { data, error } = await supabase
      .from("artists")
      .update({
        ...rest,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        `
        *,
        artist_music_genres (music_genre_id)
      `,
      )
      .single();

    if (error) {
      console.error("Error updating artist:", error);
      throw new Error("Failed to update artist");
    }

    // Handle genre updates if provided
    if (genre_ids !== undefined) {
      // Get current genre IDs from the fetched data
      const currentGenreIds =
        data.artist_music_genres?.map((g) => g.music_genre_id) || [];

      // Calculate differences
      const genresToAdd = genre_ids.filter(
        (id) => !currentGenreIds.includes(id),
      );
      const genresToRemove = currentGenreIds.filter(
        (id) => !genre_ids.includes(id),
      );

      // Remove genres that are no longer selected
      if (genresToRemove.length > 0) {
        const { error: removeError } = await supabase
          .from("artist_music_genres")
          .delete()
          .eq("artist_id", id)
          .in("music_genre_id", genresToRemove);

        if (removeError) {
          console.error("Error removing genres:", removeError);
          throw new Error("Failed to remove genres");
        }
      }

      // Add new genres
      if (genresToAdd.length > 0) {
        const genreInserts = genresToAdd.map((genreId) => ({
          artist_id: id,
          music_genre_id: genreId,
        }));

        const { error: addError } = await supabase
          .from("artist_music_genres")
          .insert(genreInserts);

        if (addError) {
          console.error("Error adding genres:", addError);
          throw new Error("Failed to add genres");
        }
      }

      // Only re-fetch if we made changes
      if (genresToAdd.length > 0 || genresToRemove.length > 0) {
        const { data: updatedData, error: fetchError } = await supabase
          .from("artists")
          .select(
            `
            *,
            artist_music_genres (music_genre_id)
          `,
          )
          .eq("id", id)
          .single();

        if (fetchError) {
          console.error("Error fetching updated artist:", fetchError);
          throw new Error("Failed to fetch updated artist");
        }

        return {
          ...updatedData,
          artist_music_genres: updatedData.artist_music_genres,
        };
      }
    }

    return {
      ...data,
      artist_music_genres: data.artist_music_genres,
    };
  },

  async addArtistGenre(artistId: string, genreId: string): Promise<void> {
    const { error } = await supabase
      .from("artist_music_genres")
      .insert({ artist_id: artistId, music_genre_id: genreId });

    if (error) {
      console.error("Error adding artist genre:", error);
      throw new Error("Failed to add artist genre");
    }
  },

  async removeArtistGenre(artistId: string, genreId: string): Promise<void> {
    const { error } = await supabase
      .from("artist_music_genres")
      .delete()
      .eq("artist_id", artistId)
      .eq("music_genre_id", genreId);

    if (error) {
      console.error("Error removing artist genre:", error);
      throw new Error("Failed to remove artist genre");
    }
  },

  async saveArtistNote(variables: {
    artistId: string;
    userId: string;
    noteContent: string;
  }) {
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

    if (error) throw new Error("Failed to save note");
    return data;
  },

  async deleteArtistNote(noteId: string) {
    const { error } = await supabase
      .from("artist_notes")
      .delete()
      .eq("id", noteId);

    if (error) throw new Error("Failed to delete note");
    return true;
  },

  // Groups
  async createGroup(variables: {
    name: string;
    description?: string;
    userId: string;
  }) {
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
    const { error: memberError } = await supabase.from("group_members").insert({
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

    const { error } = await supabase.from("group_members").insert({
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

  async updateProfile(variables: {
    userId: string;
    updates: { email?: string | null; username?: string | null };
  }) {
    const { userId, updates } = variables;

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      throw new Error("Failed to update profile");
    }

    return data;
  },
};
