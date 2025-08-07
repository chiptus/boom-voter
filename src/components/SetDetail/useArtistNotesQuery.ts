import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  artistQueries,
  queryFunctions,
  mutationFunctions,
} from "@/services/queries";

export const useArtistNotesQuery = (artistId: string) => {
  return useQuery({
    queryKey: artistQueries.notes(artistId),
    queryFn: () => queryFunctions.fetchArtistNotes(artistId),
    enabled: !!artistId,
  });
};

export const useSaveNoteMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mutationFunctions.saveArtistNote,
    onSuccess: (_, variables) => {
      // Invalidate and refetch notes for this artist
      queryClient.invalidateQueries({
        queryKey: artistQueries.notes(variables.artistId),
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
};

export const useDeleteNoteMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mutationFunctions.deleteArtistNote,
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
};

export const useArtistNotes = (artistId: string, userId: string | null) => {
  const { data: notes = [], isLoading: loading } =
    useArtistNotesQuery(artistId);
  const saveNoteMutation = useSaveNoteMutation();
  const deleteNoteMutation = useDeleteNoteMutation();

  const saveNote = async (noteContent: string) => {
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
  };

  const deleteNote = async (noteId: string) => {
    if (!noteId) return false;

    try {
      await deleteNoteMutation.mutateAsync(noteId);
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    notes,
    loading,
    saving: saveNoteMutation.isPending || deleteNoteMutation.isPending,
    saveNote,
    deleteNote,
    fetchNotes: () => {}, // No longer needed with TanStack Query
  };
};
