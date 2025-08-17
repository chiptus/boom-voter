import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FestivalSet, setsKeys } from "./useSets";

// Business logic function
async function fetchSetsByEdition(editionId: string): Promise<FestivalSet[]> {
  const { data, error } = await supabase
    .from("sets")
    .select(
      `
      *,
      stages (name),
      set_artists (
        artists (
          *,
          artist_music_genres (music_genre_id)
        )
      ),
      votes (vote_type, user_id)
    `,
    )
    .eq("festival_edition_id", editionId)
    .eq("archived", false)
    .order("time_start", { ascending: true });

  if (error) {
    console.error("Error fetching sets by edition:", error);
    throw new Error("Failed to fetch sets");
  }

  // Transform the data to match expected structure
  const transformedData =
    data?.map((set) => ({
      ...set,
      artists:
        set.set_artists
          ?.map((sa) => ({
            ...sa.artists,
          }))
          .filter(Boolean) || [],
      set_artists: undefined, // Remove junction data from final response
    })) || [];

  return transformedData;
}

// Hook
export function useSetsByEditionQuery(editionId: string | undefined) {
  return useQuery({
    queryKey: setsKeys.byEdition(editionId || ""),
    queryFn: () => fetchSetsByEdition(editionId!),
    enabled: !!editionId,
  });
}
