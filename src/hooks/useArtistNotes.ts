import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ArtistNote {
  id: string;
  artist_id: string;
  user_id: string;
  note_content: string;
  created_at: string;
  updated_at: string;
  author_username?: string;
  author_email?: string;
}

export const useArtistNotes = (artistId: string, userId: string | null) => {
  const [notes, setNotes] = useState<ArtistNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (artistId && userId) {
      fetchNotes();
    }
  }, [artistId, userId]);

  const fetchNotes = async () => {
    if (!artistId || !userId) return;

    setLoading(true);
    try {
      const { data: notesData, error: notesError } = await supabase
        .from("artist_notes")
        .select("*")
        .eq("artist_id", artistId)
        .order("created_at", { ascending: false });

      if (notesError) {
        throw notesError;
      }

      // Get author profiles for all notes
      const userIds = notesData?.map(note => note.user_id) || [];
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

      setNotes(notesWithAuthor);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async (noteContent: string) => {
    if (!artistId || !userId) return false;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("artist_notes")
        .upsert({
          artist_id: artistId,
          user_id: userId,
          note_content: noteContent,
        })
        .select()
        .single();

      if (error) throw error;

      fetchNotes(); // Refresh the notes list
      toast({
        title: "Success",
        description: "Note saved successfully",
      });
      return true;
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!noteId) return false;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("artist_notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;

      fetchNotes(); // Refresh the notes list
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
      return true;
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    notes,
    loading,
    saving,
    saveNote,
    deleteNote,
    fetchNotes,
  };
};