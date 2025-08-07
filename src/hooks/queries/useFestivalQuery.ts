import { useQuery } from "@tanstack/react-query";
import {
  editionQueries,
  festivalQueries,
  queryFunctions,
} from "@/services/queries";

export function useFestivalsQuery({ all }: { all?: boolean } = {}) {
  return useQuery({
    queryKey: festivalQueries.all(),
    queryFn: () => queryFunctions.fetchFestivals({ all }),
  });
}

export function useFestivalQuery(festivalId: string | undefined) {
  return useQuery({
    queryKey: festivalQueries.item(festivalId!),
    queryFn: () => queryFunctions.fetchFestival(festivalId!),
    enabled: !!festivalId,
  });
}

export function useFestivalBySlugQuery(festivalSlug: string | undefined) {
  return useQuery({
    queryKey: [...festivalQueries.all(), "slug", festivalSlug!] as const,
    queryFn: () => queryFunctions.fetchFestivalBySlug(festivalSlug!),
    enabled: !!festivalSlug,
  });
}

export function useFestivalEditionsForFestival(
  festivalId: string | undefined,
  { all }: { all?: boolean } = {},
) {
  return useQuery({
    queryKey: editionQueries.all(festivalId || ""),
    queryFn: () => queryFunctions.fetchFestivalEditions(festivalId!, { all }),
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

export function useFestivalEditionBySlugQuery({
  editionSlug,
  festivalSlug,
}: {
  festivalSlug?: string;
  editionSlug?: string;
}) {
  return useQuery({
    queryKey: [
      ...editionQueries.all(""),
      "slug",
      festivalSlug!,
      editionSlug!,
    ] as const,
    queryFn: () =>
      queryFunctions.fetchFestivalEditionBySlug({
        festivalSlug: festivalSlug!,
        editionSlug: editionSlug!,
      }),
    enabled: !!festivalSlug && !!editionSlug,
  });
}
