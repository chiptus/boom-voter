import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateSlug } from "@/lib/slug";
import { Artist, artistsKeys } from "./useArtists";

// Mutation function
async function createArtist(
  artistData: Omit<
    Artist,
    | "created_at"
    | "updated_at"
    | "archived"
    | "artist_music_genres"
    | "id"
    | "last_soundcloud_sync"
    | "soundcloud_followers"
    | "votes"
    | "estimated_date"
    | "slug"
  > & {
    genre_ids: string[];
  },
): Promise<Artist> {
  // First, create the artist without slug
  const { data, error } = await supabase
    .from("artists")
    .insert({
      ...artistData,
      slug: generateSlug(artistData.name),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error creating artist:", error);
    throw new Error("Failed to create artist");
  }

  if (artistData.genre_ids.length > 0) {
    const { error: genreError } = await supabase
      .from("artist_music_genres")
      .insert(
        artistData.genre_ids.map((genreId) => ({
          artist_id: data.id,
          music_genre_id: genreId,
        })),
      );

    if (genreError) {
      console.error("Error adding genres:", genreError);
      throw new Error("Failed to add genres");
    }
  }

  return {
    ...data,
    artist_music_genres: artistData.genre_ids.map((genreId) => ({
      music_genre_id: genreId,
    })),
  };
}

// Hook
export function useCreateArtistMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createArtist,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: artistsKeys.all,
      });
      toast({
        title: "Success",
        description: "Artist created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create artist",
        variant: "destructive",
      });
    },
  });
}
