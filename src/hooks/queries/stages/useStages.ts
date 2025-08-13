import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Stage = Database["public"]["Tables"]["stages"]["Row"];

// Query key factory
export const stagesKeys = {
  all: ["stages"] as const,
  byEdition: (editionId: string) =>
    [...stagesKeys.all, "edition", editionId] as const,
};

// Business logic functions
async function fetchStages(): Promise<Stage[]> {
  const { data, error } = await supabase
    .from("stages")
    .select("*")
    .eq("archived", false)
    .order("name");

  if (error) {
    throw new Error("Failed to load stages");
  }

  return data || [];
}

async function fetchStagesByEdition(editionId: string): Promise<Stage[]> {
  const { data, error } = await supabase
    .from("stages")
    .select("*")
    .eq("festival_edition_id", editionId)
    .eq("archived", false)
    .order("name");

  if (error) {
    throw new Error("Failed to load stages for edition");
  }

  return data || [];
}

// Hooks
export function useStagesQuery() {
  return useQuery({
    queryKey: stagesKeys.all,
    queryFn: fetchStages,
  });
}

export function useStagesByEditionQuery(editionId: string | undefined) {
  return useQuery({
    queryKey: stagesKeys.byEdition(editionId || ""),
    queryFn: () => fetchStagesByEdition(editionId!),
    enabled: !!editionId,
  });
}

// Mutation functions
async function createStage(stageData: {
  name: string;
  festival_edition_id: string;
}) {
  const { data, error } = await supabase
    .from("stages")
    .insert(stageData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateStage(stageId: string, stageData: { name: string }) {
  const { data, error } = await supabase
    .from("stages")
    .update(stageData)
    .eq("id", stageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function deleteStage(stageId: string) {
  const { error } = await supabase.from("stages").delete().eq("id", stageId);

  if (error) throw error;
  return true;
}

// Mutation hooks
export function useCreateStageMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createStage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stagesKeys.all });
      toast({
        title: "Success",
        description: "Stage created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating stage:", error);
      toast({
        title: "Error",
        description: "Failed to create stage",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateStageMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      stageId,
      stageData,
    }: {
      stageId: string;
      stageData: { name: string };
    }) => updateStage(stageId, stageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stagesKeys.all });
      toast({
        title: "Success",
        description: "Stage updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating stage:", error);
      toast({
        title: "Error",
        description: "Failed to update stage",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteStageMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteStage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stagesKeys.all });
      toast({
        title: "Success",
        description: "Stage deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting stage:", error);
      toast({
        title: "Error",
        description: "Failed to delete stage",
        variant: "destructive",
      });
    },
  });
}
