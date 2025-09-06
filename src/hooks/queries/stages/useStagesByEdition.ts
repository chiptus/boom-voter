import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Stage, stagesKeys } from "./types";

async function fetchStagesByEdition(editionId: string): Promise<Stage[]> {
  const { data, error } = await supabase
    .from("stages")
    .select("*")
    .eq("festival_edition_id", editionId)
    .eq("archived", false)
    .order("stage_order")
    .order("name");

  if (error) {
    throw new Error("Failed to load stages for edition");
  }

  return data || [];
}

export function useStagesByEditionQuery(editionId: string | undefined) {
  return useQuery({
    queryKey: stagesKeys.byEdition(editionId || ""),
    queryFn: () => fetchStagesByEdition(editionId!),
    enabled: !!editionId,
  });
}
