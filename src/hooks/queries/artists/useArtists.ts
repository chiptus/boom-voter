import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Artist = Database["public"]["Tables"]["artists"]["Row"] & {
  artist_music_genres: { music_genre_id: string }[] | null;
};

// Query key factory
export const artistsKeys = {
  all: ["artists"] as const,
  lists: () => [...artistsKeys.all, "list"] as const,
  list: (filters?: unknown) => [...artistsKeys.lists(), filters] as const,
  details: () => [...artistsKeys.all, "detail"] as const,
  detail: (id: string) => [...artistsKeys.details(), id] as const,
  bySlug: (slug: string) => [...artistsKeys.details(), "slug", slug] as const,
};

// Business logic function
async function fetchArtists(): Promise<Artist[]> {
  const { data, error } = await supabase
    .from("artists")
    .select(
      `
      *,
      artist_music_genres (music_genre_id)
    `,
    )
    .eq("archived", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching artists:", error);
    throw new Error("Failed to fetch artists");
  }

  return data || [];
}

// Hook
export function useArtists() {
  return useQuery({
    queryKey: artistsKeys.lists(),
    queryFn: fetchArtists,
  });
}
