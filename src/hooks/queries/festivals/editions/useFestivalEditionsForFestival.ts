import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FestivalEdition, editionsKeys } from "./types";

async function fetchFestivalEditions(
  festivalId: string,
  { all }: { all?: boolean } = {},
): Promise<FestivalEdition[]> {
  let query = supabase
    .from("festival_editions")
    .select("*")
    .eq("archived", false)
    .order("year", { ascending: false });

  if (festivalId) {
    query = query.eq("festival_id", festivalId);
  }

  if (!all) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Failed to load festival editions");
  }

  return data || [];
}

export function useFestivalEditionsForFestivalQuery(
  festivalId: string | undefined,
  { all }: { all?: boolean } = {},
) {
  return useQuery({
    queryKey: editionsKeys.all(festivalId || ""),
    queryFn: () => fetchFestivalEditions(festivalId!, { all }),
    enabled: !!festivalId,
  });
}
