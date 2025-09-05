import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type CustomLink = Tables<"custom_links">;

export const customLinksKeys = {
  all: ["customLinks"] as const,
  byFestival: (festivalId: string) =>
    [...customLinksKeys.all, festivalId] as const,
};

async function fetchCustomLinks(festivalId: string): Promise<CustomLink[]> {
  const { data, error } = await supabase
    .from("custom_links")
    .select("*")
    .eq("festival_id", festivalId)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching custom links:", error);
    throw new Error("Failed to fetch custom links");
  }

  return data || [];
}

export function useCustomLinksQuery(festivalId: string | undefined) {
  return useQuery({
    queryKey: customLinksKeys.byFestival(festivalId || ""),
    queryFn: () => fetchCustomLinks(festivalId!),
    enabled: !!festivalId,
  });
}
