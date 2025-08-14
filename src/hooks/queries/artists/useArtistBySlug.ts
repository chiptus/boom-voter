import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Artist, artistsKeys } from "./useArtists";

// Business logic function
async function fetchArtistBySlug(slug: string): Promise<Artist> {
  const { data, error } = await supabase
    .from("artists")
    .select(
      `
      *,
      artist_music_genres (music_genre_id)
    `,
    )
    .eq("slug", slug)
    .eq("archived", false)
    .single();

  if (error) {
    console.error("Error fetching artist by slug:", error);
    throw new Error("Artist not found");
  }

  return data;
}

// Hook
export function useArtistBySlugQuery(slug: string) {
  return useQuery({
    queryKey: artistsKeys.bySlug(slug),
    queryFn: () => fetchArtistBySlug(slug),
    enabled: !!slug,
  });
}
