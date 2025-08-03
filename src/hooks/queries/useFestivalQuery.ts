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
    queryKey: festivalQueries.editions(festivalId || ''),
    queryFn: () => queryFunctions.fetchFestivalEditions(festivalId!),
    enabled: !!festivalId,
  });
};

// Hook to get ALL festival editions (for admin management)
export const useAllFestivalEditionsQuery = () => {
  return useQuery({
    queryKey: ['festival-editions'],
    queryFn: () => queryFunctions.fetchFestivalEditions(), // Without festivalId gets all
  });
};

// Hook to get the default Boom Festival 2025 edition ID
export const useBoomFestival2025 = () => {
  const { data: festivals } = useFestivalsQuery();
  const boomFestival = festivals?.find(f => f.name === 'Boom Festival');
  
  const { data: editions } = useFestivalEditionsQuery(boomFestival?.id);
  const boom2025 = editions?.find(e => e.name === 'Boom 2025');
  
  return {
    festivalId: boomFestival?.id,
    editionId: boom2025?.id,
    festival: boomFestival,
    edition: boom2025,
  };
};

// Export object for easier importing
export const useFestivalQuery = {
  useFestivals: useFestivalsQuery,
  useFestivalEditions: useAllFestivalEditionsQuery,
  useFestivalEditionsForFestival: useFestivalEditionsQuery,
  useBoomFestival2025,
};