import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Stage, stagesKeys } from "./types";

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

export function useStagesQuery() {
  return useQuery({
    queryKey: stagesKeys.all,
    queryFn: fetchStages,
  });
}
