import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { artistsKeys } from "./useArtists";

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

// Query key factory
export const artistNotesKeys = {
  notes: (artistId: string) =>
    [...artistsKeys.detail(artistId), "notes"] as const,
};

// Business logic functions
async function fetchArtistNotes(artistId: string): Promise<SetNote[]> {
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
}

async function saveArtistNote(variables: {
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
}

async function deleteArtistNote(noteId: string) {
  const { error } = await supabase
    .from("artist_notes")
    .delete()
    .eq("id", noteId);

  if (error) throw new Error("Failed to delete note");
  return true;
}

// Hooks
export function useArtistNotesQuery(artistId: string) {
  return useQuery({
    queryKey: artistNotesKeys.notes(artistId),
    queryFn: () => fetchArtistNotes(artistId),
    enabled: !!artistId,
  });
}

export function useSaveNoteMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: saveArtistNote,
    onSuccess: (_, variables) => {
      // Invalidate and refetch notes for this artist
      queryClient.invalidateQueries({
        queryKey: artistNotesKeys.notes(variables.artistId),
      });
      toast({
        title: "Success",
        description: "Note saved successfully",
      });
    },
    onError: (error) => {
      console.error("Error saving note:", error);
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteArtistNote,
    onSuccess: () => {
      // Invalidate all artist notes queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    },
  });
}

export function useArtistNotes(artistId: string, userId: string | null) {
  const { data: notes = [], isLoading: loading } =
    useArtistNotesQuery(artistId);
  const saveNoteMutation = useSaveNoteMutation();
  const deleteNoteMutation = useDeleteNoteMutation();

  async function saveNote(noteContent: string) {
    if (!artistId || !userId) return false;

    try {
      await saveNoteMutation.mutateAsync({
        artistId,
        userId,
        noteContent,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async function deleteNote(noteId: string) {
    if (!noteId) return false;

    try {
      await deleteNoteMutation.mutateAsync(noteId);
      return true;
    } catch (error) {
      return false;
    }
  }

  return {
    notes,
    loading,
    saving: saveNoteMutation.isPending || deleteNoteMutation.isPending,
    saveNote,
    deleteNote,
    fetchNotes: () => {}, // No longer needed with TanStack Query
  };
}
