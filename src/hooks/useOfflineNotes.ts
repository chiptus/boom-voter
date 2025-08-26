import { useCallback } from "react";
import {
  useOfflineNotesQuery,
  useSaveNoteMutation,
  useDeleteNoteMutation,
} from "./queries/useOfflineNotesQuery";

export function useOfflineNotes(setId: string, userId: string | null) {
  // Use React Query for data fetching
  const {
    data: notes = [],
    isLoading: loading,
    error,
    refetch,
  } = useOfflineNotesQuery(setId, userId);

  // Use React Query mutations
  const saveNoteMutation = useSaveNoteMutation(setId);
  const deleteNoteMutation = useDeleteNoteMutation(setId);

  const saveNote = useCallback(
    async (noteContent: string) => {
      if (!setId || !userId) return false;

      try {
        await saveNoteMutation.mutateAsync({ noteContent, userId });
        return true;
      } catch (error) {
        console.error("Error saving note:", error);
        return false;
      }
    },
    [saveNoteMutation, setId, userId],
  );

  const deleteNote = useCallback(
    async (noteId: string) => {
      if (!noteId) return false;

      try {
        await deleteNoteMutation.mutateAsync(noteId);
        return true;
      } catch (error) {
        console.error("Error deleting note:", error);
        return false;
      }
    },
    [deleteNoteMutation],
  );

  const refreshNotes = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    notes,
    loading,
    saving: saveNoteMutation.isPending,
    error: error?.message || null,
    saveNote,
    deleteNote,
    refreshNotes,
  };
}
