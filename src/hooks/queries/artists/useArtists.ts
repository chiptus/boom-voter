import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Artist = Database["public"]["Tables"]["artists"]["Row"] & {
  artist_music_genres: { music_genre_id: string }[] | null;
  soundcloud_followers?: number;
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

  const { data: soundcloudData, error: soundcloudError } = await supabase
    .from("soundcloud")
    .select("artist_id, followers_count");

  if (soundcloudError) {
    console.error("Error fetching soundcloud data:", soundcloudError);
    throw new Error("Failed to fetch soundcloud data");
  }

  const soundcloudMap = new Map(
    soundcloudData?.map((sc) => [sc.artist_id, sc.followers_count]) || [],
  );

  return (
    data.map((artist) => {
      return {
        ...artist,
        soundcloud_followers: soundcloudMap.get(artist.id) || 0,
      };
    }) || []
  );
}

// Hook
export function useArtistsQuery() {
  return useQuery({
    queryKey: artistsKeys.lists(),
    queryFn: fetchArtists,
  });
}
