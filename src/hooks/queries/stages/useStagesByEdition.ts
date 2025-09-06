import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Stage, stagesKeys } from "./types";

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

  // Apply custom sorting: stages with order > 0 first (sorted by order), then order 0 stages (sorted by name)
  const sortedData = (data || []).sort((a, b) => {
    const orderA = a.stage_order ?? 0;
    const orderB = b.stage_order ?? 0;

    // Stages with order > 0 come first, sorted by order
    // Stages with order 0 come last, sorted by name
    if (orderA > 0 && orderB > 0) {
      return orderA - orderB;
    }
    if (orderA > 0 && orderB === 0) {
      return -1; // A comes before B
    }
    if (orderA === 0 && orderB > 0) {
      return 1; // B comes before A
    }
    // Both are 0, sort by name
    return a.name.localeCompare(b.name);
  });

  return sortedData;
}

export function useStagesByEditionQuery(editionId: string | undefined) {
  return useQuery({
    queryKey: stagesKeys.byEdition(editionId || ""),
    queryFn: () => fetchStagesByEdition(editionId!),
    enabled: !!editionId,
  });
}
