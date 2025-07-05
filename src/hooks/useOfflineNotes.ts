import { useState, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { offlineStorage } from '@/lib/offlineStorage';
import { useOnlineStatus, useOfflineQueue } from './useOffline';
import type { ArtistNote } from '@/services/queries';

export const useOfflineNotes = (artistId: string, userId: string | null) => {
  const [notes, setNotes] = useState<ArtistNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const isOnline = useOnlineStatus();
  const { updateQueueSize } = useOfflineQueue();

  const loadNotes = useCallback(async () => {
    if (!artistId || !userId) return;
    
    setLoading(true);
    try {
      // Load offline notes first
      const offlineNotes = await offlineStorage.getNotes(artistId);
      const processedOfflineNotes = offlineNotes.map(note => ({
        id: note.id,
        artist_id: note.artistId,
        user_id: note.userId,
        note_content: note.content,
        created_at: new Date(note.timestamp).toISOString(),
        updated_at: new Date(note.timestamp).toISOString(),
        author_username: 'You (offline)',
        author_email: '',
      }));

      setNotes(processedOfflineNotes);

      // If online, also fetch from server and merge
      if (isOnline) {
        try {
          const { data: serverNotes, error } = await supabase
            .from("artist_notes")
            .select("*")
            .eq("artist_id", artistId)
            .order("created_at", { ascending: false });

          if (!error && serverNotes) {
            // Get author profiles for server notes
            const userIds = serverNotes.map(note => note.user_id);
            const { data: profilesData } = await supabase
              .from("profiles")
              .select("id, username, email")
              .in("id", userIds);

            const serverNotesWithAuthor = serverNotes.map(note => {
              const profile = profilesData?.find(p => p.id === note.user_id);
              return {
                ...note,
                author_username: profile?.username,
                author_email: profile?.email,
              };
            });

            // Merge offline and server notes (remove duplicates, server takes precedence)
            const mergedNotes = [...serverNotesWithAuthor];
            processedOfflineNotes.forEach(offlineNote => {
              if (!mergedNotes.find(serverNote => serverNote.id === offlineNote.id)) {
                mergedNotes.push(offlineNote);
              }
            });

            setNotes(mergedNotes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
          }
        } catch (error) {
          console.error('Error fetching server notes:', error);
        }
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [artistId, userId, isOnline, toast]);

  useEffect(() => {
    if (artistId && userId) {
      loadNotes();
    }
  }, [loadNotes]);

  const saveNote = useCallback(async (noteContent: string) => {
    if (!artistId || !userId) return false;

    setSaving(true);
    try {
      // Save to offline storage
      const offlineNoteId = await offlineStorage.saveNote({
        artistId,
        content: noteContent,
        userId,
        timestamp: Date.now(),
        synced: false,
      });

      // Update local state immediately
      const newNote: ArtistNote = {
        id: offlineNoteId,
        artist_id: artistId,
        user_id: userId,
        note_content: noteContent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author_username: 'You (offline)',
        author_email: '',
      };

      setNotes(prev => [newNote, ...prev]);

      // If online, sync immediately
      if (isOnline) {
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

          if (!error && data) {
            // Mark as synced and update with server data
            await offlineStorage.markNoteSynced(offlineNoteId);
            
            // Update the note with server data
            setNotes(prev => prev.map(note => 
              note.id === offlineNoteId 
                ? { ...data, author_username: 'You', author_email: '' }
                : note
            ));
          }
        } catch (error) {
          console.error('Error syncing note to server:', error);
        }
      }

      await updateQueueSize();
      
      toast({
        title: "Success",
        description: isOnline ? "Note saved successfully" : "Note saved (will sync when online)",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [artistId, userId, isOnline, toast, updateQueueSize]);

  const deleteNote = useCallback(async (noteId: string) => {
    if (!noteId) return false;

    setSaving(true);
    try {
      // Remove from offline storage
      await offlineStorage.deleteNote(noteId);

      // Update local state
      setNotes(prev => prev.filter(note => note.id !== noteId));

      // If online, also delete from server
      if (isOnline) {
        try {
          await supabase
            .from("artist_notes")
            .delete()
            .eq("id", noteId);
        } catch (error) {
          console.error('Error deleting note from server:', error);
        }
      }

      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [isOnline, toast]);

  const fetchNotes = useCallback(async () => {
    await loadNotes();
  }, [loadNotes]);

  return {
    notes,
    loading,
    saving,
    saveNote,
    deleteNote,
    fetchNotes,
    isOffline: !isOnline,
  };
};