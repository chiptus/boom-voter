import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FestivalEdition, editionsKeys } from "./types";

async function fetchFestivalEdition({
  editionId,
  festivalId,
}: {
  festivalId: string;
  editionId: string;
}): Promise<FestivalEdition> {
  const query = supabase
    .from("festival_editions")
    .select("*")
    .eq("archived", false)
    .eq("festival_id", festivalId)
    .eq("id", editionId)
    .single();

  const { data, error } = await query;

  if (error) {
    throw new Error("Failed to load festival edition");
  }

  return data;
}

export function useFestivalEditionQuery({
  editionId,
  festivalId,
}: {
  festivalId?: string;
  editionId?: string;
}) {
  return useQuery({
    queryKey: editionsKeys.item({
      festivalId: festivalId!,
      editionId: editionId!,
    }),
    queryFn: () =>
      fetchFestivalEdition({
        festivalId: festivalId!,
        editionId: editionId!,
      }),
    enabled: !!festivalId && !!editionId,
  });
}
