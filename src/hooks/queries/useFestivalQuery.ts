import { useQuery } from "@tanstack/react-query";
import {
  editionQueries,
  festivalQueries,
  queryFunctions,
} from "@/services/queries";

export function useFestivalsQuery() {
  return useQuery({
    queryKey: festivalQueries.all(),
    queryFn: queryFunctions.fetchFestivals,
  });
}

export function useFestivalQuery(festivalId: string | undefined) {
  return useQuery({
    queryKey: festivalQueries.item(festivalId!),
    queryFn: () => queryFunctions.fetchFestival(festivalId!),
    enabled: !!festivalId,
  });
}

export function useFestivalEditionsForFestival(festivalId: string | undefined) {
  return useQuery({
    queryKey: editionQueries.all(festivalId || ""),
    queryFn: () => queryFunctions.fetchFestivalEditions(festivalId!),
    enabled: !!festivalId,
  });
}

export function useFestivalEditionQuery({
  editionId,
  festivalId,
}: {
  festivalId?: string;
  editionId?: string;
}) {
  return useQuery({
    queryKey: editionQueries.item({
      festivalId: festivalId!,
      editionId: editionId!,
    }),
    queryFn: () =>
      queryFunctions.fetchFestivalEdition({
        festivalId: festivalId!,
        editionId: editionId!,
      }),
    enabled: !!festivalId && !!editionId,
  });
}
