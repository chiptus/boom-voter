import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CreateGenreParams {
  name: string;
  created_by: string;
}

export function useCreateGenreMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ name, created_by }: CreateGenreParams) => {
      const { data, error } = await supabase
        .from("music_genres")
        .insert({
          name,
          created_by,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate genres query if it exists
      queryClient.invalidateQueries({ queryKey: ["genres"] });

      toast({
        title: "Success",
        description: "Music genre added successfully!",
      });
    },
    onError: (error) => {
      if ("code" in error && error.code === "23505") {
        toast({
          title: "Error",
          description: "This genre already exists",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });
}
