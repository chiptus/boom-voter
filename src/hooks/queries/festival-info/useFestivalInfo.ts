import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type FestivalInfo = Tables<"festival_info">;

export const festivalInfoKeys = {
  all: ["festivalInfo"] as const,
  byFestival: (festivalId: string) =>
    [...festivalInfoKeys.all, festivalId] as const,
};

async function fetchFestivalInfo(festivalId: string): Promise<FestivalInfo> {
  const { data, error } = await supabase
    .from("festival_info")
    .select("*")
    .eq("festival_id", festivalId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Festival info not found");
    }

    console.error("Error fetching festival info:", error);
    throw new Error("Failed to fetch festival info");
  }

  return data;
}

export function useFestivalInfoQuery(festivalId: string | undefined) {
  return useQuery({
    queryKey: festivalInfoKeys.byFestival(festivalId || ""),
    queryFn: () => fetchFestivalInfo(festivalId!),
    enabled: !!festivalId,
  });
}
