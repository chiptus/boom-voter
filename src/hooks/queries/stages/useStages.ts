import { useQuery } from "@tanstack/react-query";
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
