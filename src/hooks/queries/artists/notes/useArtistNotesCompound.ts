import { useArtistNotesQuery } from "./useArtistNotes";
import { useSaveNoteMutation } from "./useSaveNoteMutation";
import { useDeleteNoteMutation } from "./useDeleteNoteMutation";

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
