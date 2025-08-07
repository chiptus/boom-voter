import { useQuery } from "@tanstack/react-query";
import { festivalQueries, queryFunctions } from "@/services/queries";

export const useFestivalsQuery = () => {
  return useQuery({
    queryKey: festivalQueries.all(),
    queryFn: queryFunctions.fetchFestivals,
  });
};

export const useFestivalQuery = (festivalId: string | undefined) => {
  return useQuery({
    queryKey: festivalQueries.item(festivalId!),
    queryFn: () => queryFunctions.fetchFestival(festivalId!),
    enabled: !!festivalId,
  });
};

export const useFestivalEditionsForFestival = (
  festivalId: string | undefined,
) => {
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
