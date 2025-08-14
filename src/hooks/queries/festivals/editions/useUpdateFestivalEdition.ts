import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { festivalsKeys } from "../types";

async function updateFestivalEdition(
  editionId: string,
  editionData: {
    name: string;
    slug: string;
    start_date: string | null;
    end_date: string | null;
    description?: string | null;
    year?: number;
    published?: boolean;
  },
) {
  const { data, error } = await supabase
    .from("festival_editions")
    .update(editionData)
    .eq("id", editionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function useUpdateFestivalEditionMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      editionId,
      editionData,
    }: {
      editionId: string;
      editionData: {
        name: string;
        slug: string;
        start_date: string | null;
        end_date: string | null;
        description?: string | null;
        year?: number;
        published?: boolean;
      };
    }) => updateFestivalEdition(editionId, editionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: festivalsKeys.all() });
      toast({
        title: "Success",
        description: "Festival edition updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating festival edition:", error);
      toast({
        title: "Error",
        description: "Failed to update festival edition",
        variant: "destructive",
      });
    },
  });
}
