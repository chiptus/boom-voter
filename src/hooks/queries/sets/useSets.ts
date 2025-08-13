import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Artist } from "../artists/useArtists";

export type FestivalSet = Database["public"]["Tables"]["sets"]["Row"] & {
  artists: Artist[];
  votes: { vote_type: number; user_id: string }[];
  stages?: { name: string } | null;
};

export type Stage = Database["public"]["Tables"]["stages"]["Row"];

// Query key factory
export const setsKeys = {
  all: ["sets"] as const,
  lists: () => [...setsKeys.all, "list"] as const,
  list: (filters?: unknown) => [...setsKeys.lists(), filters] as const,
  details: () => [...setsKeys.all, "detail"] as const,
  detail: (id: string) => [...setsKeys.details(), id] as const,
  bySlug: (slug: string) => [...setsKeys.details(), "slug", slug] as const,
  byEdition: (editionId: string) =>
    [...setsKeys.all, "edition", editionId] as const,
};

// Business logic function
async function fetchSets(): Promise<FestivalSet[]> {
  const { data, error } = await supabase
    .from("sets")
    .select(
      `
      *,
      set_artists!inner (
        artists (
          *,
          artist_music_genres (
            music_genre_id
          )
        )
      ),
      votes (vote_type, user_id)
    `,
    )
    .eq("archived", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sets:", error);
    throw new Error("Failed to fetch sets");
  }

  // Get stages separately since the FK relationship isn't working
  const { data: stagesData } = await supabase
    .from("stages")
    .select("*")
    .eq("archived", false);

  const stagesMap =
    stagesData?.reduce(
      (acc, stage) => {
        acc[stage.id] = stage;
        return acc;
      },
      {} as Record<string, Stage>,
    ) || {};

  // Transform the data to match expected structure
  const transformedData =
    data?.map((set) => ({
      ...set,
      artists:
        set.set_artists
          ?.map((sa) => ({
            ...sa.artists,
            votes: [], // Artists in sets don't have individual votes
          }))
          .filter(Boolean) || [],
      stages: set.stage_id ? stagesMap[set.stage_id] : null,
      set_artists: undefined, // Remove junction data from final response
    })) || [];

  return transformedData;
}

// Hook
export function useSets() {
  return useQuery({
    queryKey: setsKeys.lists(),
    queryFn: fetchSets,
  });
}
