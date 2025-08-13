import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Festival = Database["public"]["Tables"]["festivals"]["Row"];
export type FestivalEdition =
  Database["public"]["Tables"]["festival_editions"]["Row"];

// Query key factory
export const festivalsKeys = {
  all: () => ["festivals"] as const,
  item: (festivalId: string) => [...festivalsKeys.all(), festivalId] as const,
  bySlug: (festivalSlug: string) =>
    [...festivalsKeys.all(), "slug", festivalSlug] as const,
};

export const editionsKeys = {
  all: (festivalId: string) =>
    [...festivalsKeys.all(), festivalId, "editions"] as const,
  item: ({
    editionId,
    festivalId,
  }: {
    festivalId: string;
    editionId: string;
  }) => [...editionsKeys.all(festivalId), editionId] as const,
  bySlug: (festivalSlug: string, editionSlug: string) =>
    [...editionsKeys.all(""), "slug", festivalSlug, editionSlug] as const,
};

// Business logic functions
async function fetchFestivals({ all }: { all?: boolean }): Promise<Festival[]> {
  let query = supabase.from("festivals").select("*").eq("archived", false);

  if (!all) {
    query = query.eq("published", true);
  }

  const { data, error } = await query.order("name");

  if (error) {
    throw new Error("Failed to load festivals");
  }

  return data || [];
}

async function fetchFestival(festivalId: string): Promise<Festival> {
  const { data, error } = await supabase
    .from("festivals")
    .select("*")
    .eq("archived", false)
    .eq("id", festivalId)
    .order("name")
    .single();

  if (error) {
    throw new Error("Failed to load festivals");
  }

  return data;
}

async function fetchFestivalBySlug(festivalSlug: string): Promise<Festival> {
  const { data, error } = await supabase
    .from("festivals")
    .select("*")
    .eq("archived", false)
    .eq("slug", festivalSlug)
    .single();

  if (error) {
    throw new Error("Failed to load festival");
  }

  return data;
}

async function fetchFestivalEditions(
  festivalId: string,
  { all }: { all?: boolean } = {},
): Promise<FestivalEdition[]> {
  let query = supabase
    .from("festival_editions")
    .select("*")
    .eq("archived", false)
    .order("year", { ascending: false });

  if (festivalId) {
    query = query.eq("festival_id", festivalId);
  }

  if (!all) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Failed to load festival editions");
  }

  return data || [];
}

async function fetchFestivalEdition({
  editionId,
  festivalId,
}: {
  festivalId: string;
  editionId: string;
}): Promise<FestivalEdition> {
  const query = supabase
    .from("festival_editions")
    .select("*")
    .eq("archived", false)
    .eq("festival_id", festivalId)
    .eq("id", editionId)
    .single();

  const { data, error } = await query;

  if (error) {
    throw new Error("Failed to load festival editions");
  }

  return data;
}

async function fetchFestivalEditionBySlug({
  editionSlug,
  festivalSlug,
}: {
  festivalSlug: string;
  editionSlug: string;
}): Promise<FestivalEdition> {
  // First get the festival ID from the slug
  const festival = await fetchFestivalBySlug(festivalSlug);

  const query = supabase
    .from("festival_editions")
    .select("*")
    .eq("archived", false)
    .eq("festival_id", festival.id)
    .eq("slug", editionSlug)
    .single();

  const { data, error } = await query;

  if (error) {
    throw new Error("Failed to load festival edition");
  }

  return data;
}

// Hooks
export function useFestivalsQuery({ all }: { all?: boolean } = {}) {
  return useQuery({
    queryKey: festivalsKeys.all(),
    queryFn: () => fetchFestivals({ all }),
  });
}

export function useFestivalQuery(festivalId: string | undefined) {
  return useQuery({
    queryKey: festivalsKeys.item(festivalId!),
    queryFn: () => fetchFestival(festivalId!),
    enabled: !!festivalId,
  });
}

export function useFestivalBySlugQuery(festivalSlug: string | undefined) {
  return useQuery({
    queryKey: festivalsKeys.bySlug(festivalSlug!),
    queryFn: () => fetchFestivalBySlug(festivalSlug!),
    enabled: !!festivalSlug,
  });
}

export function useFestivalEditionsForFestival(
  festivalId: string | undefined,
  { all }: { all?: boolean } = {},
) {
  return useQuery({
    queryKey: editionsKeys.all(festivalId || ""),
    queryFn: () => fetchFestivalEditions(festivalId!, { all }),
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
    queryKey: editionsKeys.item({
      festivalId: festivalId!,
      editionId: editionId!,
    }),
    queryFn: () =>
      fetchFestivalEdition({
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
    queryKey: editionsKeys.bySlug(festivalSlug!, editionSlug!),
    queryFn: () =>
      fetchFestivalEditionBySlug({
        festivalSlug: festivalSlug!,
        editionSlug: editionSlug!,
      }),
    enabled: !!festivalSlug && !!editionSlug,
  });
}
