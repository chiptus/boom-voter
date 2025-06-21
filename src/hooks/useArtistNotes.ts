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
}

export const useArtistNotes = (artistId: string, userId: string | null) => {
  const [note, setNote] = useState<ArtistNote | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (artistId && userId) {
      fetchNote();
    }
  }, [artistId, userId]);

  const fetchNote = async () => {
    if (!artistId || !userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("artist_notes")
        .select("*")
        .eq("artist_id", artistId)
        .eq("user_id", userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setNote(data);
    } catch (error) {
      console.error("Error fetching note:", error);
      toast({
        title: "Error",
        description: "Failed to fetch note",
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

      setNote(data);
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

  const deleteNote = async () => {
    if (!note) return false;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("artist_notes")
        .delete()
        .eq("id", note.id);

      if (error) throw error;

      setNote(null);
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
    note,
    loading,
    saving,
    saveNote,
    deleteNote,
    fetchNote,
  };
};