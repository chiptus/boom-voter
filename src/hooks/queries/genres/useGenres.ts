import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Query key factory
export const genresKeys = {
  all: ["genres"] as const,
};

// Business logic function
async function fetchGenres(): Promise<Array<{ id: string; name: string }>> {
  const { data, error } = await supabase
    .from("music_genres")
    .select("id, name")
    .order("name");

  if (error) {
    throw new Error("Failed to load genres");
  }

  return data || [];
}

// Hook
export function useGenresQuery() {
  return useQuery({
    queryKey: genresKeys.all,
    queryFn: fetchGenres,
    staleTime: 10 * 60 * 1000, // 10 minutes - genres don't change often
  });
}

export function useGenres() {
  const { data: genres = [], isLoading, error } = useGenresQuery();

  return {
    genres,
    loading: isLoading,
    error,
  };
}
