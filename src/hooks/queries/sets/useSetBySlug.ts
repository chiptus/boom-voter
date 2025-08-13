import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FestivalSet, setsKeys } from "./useSets";

// Business logic function
async function fetchSetBySlug(slug: string): Promise<FestivalSet> {
  const { data, error } = await supabase
    .from("sets")
    .select(
      `
      *,
      stages (name),
      set_artists!inner (
        artists (
          *,
          artist_music_genres (music_genre_id)
        )
      ),
      votes (vote_type, user_id)
    `,
    )
    .eq("slug", slug)
    .eq("archived", false)
    .single();

  if (error) {
    console.error("Error fetching set by slug:", error);
    throw new Error("Set not found");
  }

  // Transform to expected format
  const transformedData: FestivalSet = {
    ...data,
    artists:
      data.set_artists
        ?.map((sa) => ({
          ...sa.artists,
          artist_music_genres: sa.artists?.artist_music_genres || [],
          votes: [],
        }))
        .filter(Boolean) || [],
    stages: data.stage_id && data.stages ? data.stages : null,
    votes: data.votes || [],
  };

  return transformedData;
}

// Hook
export function useSetBySlug(slug: string) {
  return useQuery({
    queryKey: setsKeys.bySlug(slug),
    queryFn: () => fetchSetBySlug(slug),
    enabled: !!slug,
  });
}
