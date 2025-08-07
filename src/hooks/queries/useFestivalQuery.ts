import { useQuery } from "@tanstack/react-query";
import { festivalQueries, queryFunctions } from "@/services/queries";

export const useFestivalsQuery = () => {
  return useQuery({
    queryKey: festivalQueries.all(),
    queryFn: queryFunctions.fetchFestivals,
  });
};

export const useFestivalEditionsQuery = (festivalId: string | undefined) => {
  return useQuery({
    queryKey: festivalQueries.editions(festivalId || ""),
    queryFn: () => queryFunctions.fetchFestivalEditions(festivalId!),
    enabled: !!festivalId,
  });
};

// Hook to get ALL festival editions (for admin management)
export const useAllFestivalEditionsQuery = () => {
  return useQuery({
    queryKey: ["festival-editions"],
    queryFn: () => queryFunctions.fetchFestivalEditions(), // Without festivalId gets all
  });
};

// Export object for easier importing
export const useFestivalQuery = {
  useFestivals: useFestivalsQuery,
  useFestivalEditions: useAllFestivalEditionsQuery,
  useFestivalEditionsForFestival: useFestivalEditionsQuery,
};
