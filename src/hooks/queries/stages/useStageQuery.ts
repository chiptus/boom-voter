import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Stage, stagesKeys } from "./types";

async function fetchStage(stageId: string): Promise<Stage | null> {
  const { data, error } = await supabase
    .from("stages")
    .select("*")
    .eq("id", stageId)
    .eq("archived", false)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    throw new Error("Failed to load stage");
  }

  return data;
}

export function useStageQuery(stageId: string | undefined | null) {
  return useQuery({
    queryKey: stagesKeys.byId(stageId || ""),
    queryFn: () => fetchStage(stageId!),
    enabled: !!stageId,
  });
}
