import { useQuery } from "@tanstack/react-query";
import { genreQueries, queryFunctions } from "@/services/queries";

export const useGenresQuery = () => {
  return useQuery({
    queryKey: genreQueries.all(),
    queryFn: queryFunctions.fetchGenres,
    staleTime: 10 * 60 * 1000, // 10 minutes - genres don't change often
  });
};

export const useGenres = () => {
  const { data: genres = [], isLoading, error } = useGenresQuery();

  return {
    genres,
    loading: isLoading,
    error,
  };
};