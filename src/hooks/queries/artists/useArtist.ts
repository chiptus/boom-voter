import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Artist, artistsKeys } from "./useArtists";

// Business logic function
async function fetchArtist(id: string): Promise<Artist> {
  const { data, error } = await supabase
    .from("artists")
    .select(
      `
      *,
      artist_music_genres (music_genre_id),
      votes (vote_type, user_id)
    `,
    )
    .eq("id", id)
    .eq("archived", false)
    .single();

  if (error) {
    console.error("Error fetching artist:", error);
    throw new Error("Failed to fetch artist details");
  }

  return data;
}

// Hook
export function useArtist(id: string) {
  return useQuery({
    queryKey: artistsKeys.detail(id),
    queryFn: () => fetchArtist(id),
    enabled: !!id,
  });
}
