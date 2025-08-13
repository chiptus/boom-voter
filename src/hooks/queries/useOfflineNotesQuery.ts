import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { offlineStorage } from "@/lib/offlineStorage";
import { useOnlineStatus, useOfflineQueue } from "@/hooks/useOffline";
import { SetNote } from "./artists/useArtistNotes";

interface OfflineNote {
  id: string;
  setId: string;
  content: string;
  userId: string;
  timestamp: number;
  synced: boolean;
}

function mergeOfflineAndServerNotes(
  offlineNotes: OfflineNote[],
  serverNotes: SetNote[],
): SetNote[] {
  // Transform offline notes to match server format
  const processedOfflineNotes = offlineNotes.map((note) => ({
    id: note.id,
    set_id: note.setId,
    user_id: note.userId,
    note_content: note.content,
    created_at: new Date(note.timestamp).toISOString(),
    updated_at: new Date(note.timestamp).toISOString(),
    author_username: "You (offline)",
    author_email: "",
  }));

  // Merge offline and server notes (remove duplicates, server takes precedence)
  const mergedNotes = [...serverNotes];
  processedOfflineNotes.forEach((offlineNote) => {
    if (!mergedNotes.find((serverNote) => serverNote.id === offlineNote.id)) {
      mergedNotes.push(offlineNote);
    }
  });

  return mergedNotes.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

async function fetchNotesWithOffline(
  setId: string,
  isOnline: boolean,
): Promise<SetNote[]> {
  // Always load offline notes first
  const offlineNotes = await offlineStorage.getNotes(setId);

  if (!isOnline) {
    // Transform offline notes to match expected format
    return offlineNotes.map((note) => ({
      id: note.id,
      set_id: note.setId,
      user_id: note.userId,
      note_content: note.content,
      created_at: new Date(note.timestamp).toISOString(),
      updated_at: new Date(note.timestamp).toISOString(),
      author_username: "You (offline)",
      author_email: "",
    }));
  }

  // Fetch server notes when online
  try {
    const { data: serverNotes, error } = await supabase
      .from("artist_notes")
      .select("*")
      .eq("artist_id", setId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    if (!serverNotes || serverNotes.length === 0) {
      // Return transformed offline notes if no server notes
      return offlineNotes.map((note) => ({
        id: note.id,
        set_id: note.setId,
        user_id: note.userId,
        note_content: note.content,
        created_at: new Date(note.timestamp).toISOString(),
        updated_at: new Date(note.timestamp).toISOString(),
        author_username: "You (offline)",
        author_email: "",
      }));
    }

    // Get author profiles for server notes
    const userIds = serverNotes.map((note) => note.user_id);
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, username, email")
      .in("id", userIds);

    const serverNotesWithAuthor = serverNotes.map(({ artist_id, ...note }) => {
      const profile = profilesData?.find((p) => p.id === note.user_id);
      return {
        ...note,
        set_id: artist_id,
        author_username: profile?.username || undefined,
        author_email: profile?.email || undefined,
      };
    });

    // Merge offline and server notes
    return mergeOfflineAndServerNotes(offlineNotes, serverNotesWithAuthor);
  } catch (error) {
    console.error("Error fetching server notes:", error);
    // Fall back to offline notes only
    return offlineNotes.map((note) => ({
      id: note.id,
      set_id: note.setId,
      user_id: note.userId,
      note_content: note.content,
      created_at: new Date(note.timestamp).toISOString(),
      updated_at: new Date(note.timestamp).toISOString(),
      author_username: "You (offline)",
      author_email: "",
    }));
  }
}

export function useOfflineNotesQuery(setId: string, userId: string | null) {
  const isOnline = useOnlineStatus();

  return useQuery({
    queryKey: ["notes", setId, userId],
    queryFn: () => fetchNotesWithOffline(setId, isOnline),
    enabled: !!setId && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes - notes don't change often
    refetchOnWindowFocus: isOnline, // Only refetch on focus when online
  });
}

export function useSaveNoteMutation(setId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isOnline = useOnlineStatus();
  const { updateQueueSize } = useOfflineQueue();

  return useMutation({
    mutationFn: async ({
      noteContent,
      userId,
    }: {
      noteContent: string;
      userId: string;
    }) => {
      // Save to offline storage first
      const offlineNoteId = await offlineStorage.saveNote({
        setId: setId,
        content: noteContent,
        userId,
        timestamp: Date.now(),
        synced: false,
      });

      // If online, also save to server
      if (isOnline) {
        try {
          const { data, error } = await supabase
            .from("artist_notes")
            .upsert({
              artist_id: setId,
              user_id: userId,
              note_content: noteContent,
            })
            .select()
            .single();

          if (error) {
            throw new Error(error.message);
          }

          // Mark as synced since it's now saved online
          await offlineStorage.markNoteSynced(offlineNoteId);

          return data;
        } catch (error) {
          console.error("Error saving note to server:", error);
          // Keep in offline storage for later sync
          updateQueueSize();
          throw error;
        }
      } else {
        // Offline mode - add to queue
        updateQueueSize();
        return { id: offlineNoteId, offline: true };
      }
    },
    onSuccess: () => {
      // Invalidate and refetch notes
      queryClient.invalidateQueries({
        queryKey: ["notes", setId],
      });

      toast({
        title: "Success",
        description: isOnline ? "Note saved" : "Note saved offline",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save note",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteNoteMutation(setId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isOnline = useOnlineStatus();

  return useMutation({
    mutationFn: async (noteId: string) => {
      // Try to delete from offline storage first
      try {
        await offlineStorage.deleteNote(noteId);
      } catch (error) {
        console.error("Note not found in offline storage:", error);
      }

      // If online, also delete from server
      if (isOnline) {
        const { error } = await supabase
          .from("artist_notes")
          .delete()
          .eq("id", noteId);

        if (error) {
          throw new Error(error.message);
        }
      }

      return noteId;
    },
    onSuccess: () => {
      // Invalidate and refetch notes
      queryClient.invalidateQueries({
        queryKey: ["notes", setId],
      });

      toast({
        title: "Success",
        description: "Note deleted",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete note",
        variant: "destructive",
      });
    },
  });
}
