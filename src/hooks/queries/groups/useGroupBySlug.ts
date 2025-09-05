import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Group } from "@/types/groups";

// Query key factory
export const groupBySlugKeys = {
  all: ["groups"] as const,
  bySlug: () => [...groupBySlugKeys.all, "by-slug"] as const,
  detail: (slug: string, userId: string) =>
    [...groupBySlugKeys.bySlug(), slug, userId] as const,
};

interface UseGroupBySlugParams {
  slug?: string;
  userId?: string;
}

async function fetchGroupBySlug(slug: string, userId: string): Promise<Group> {
  // First, try to find the group where user is a member
  const { data: membership, error: membershipError } = await supabase
    .from("group_members")
    .select(
      `
      group_id,
      groups!inner (
        id,
        name,
        slug,
        description,
        created_by,
        archived,
        created_at,
        updated_at
      )
    `,
    )
    .eq("user_id", userId)
    .eq("groups.slug", slug)
    .eq("groups.archived", false)
    .single();

  if (!membershipError && membership) {
    return membership.groups as Group;
  }

  // If not found as a member, check if user is the creator
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("slug", slug)
    .eq("created_by", userId)
    .eq("archived", false)
    .single();

  if (error) {
    throw new Error("Group not found or you don't have access");
  }

  return data;
}

export function useGroupBySlugQuery({ slug, userId }: UseGroupBySlugParams) {
  return useQuery({
    queryKey: groupBySlugKeys.detail(slug!, userId!),
    queryFn: () => fetchGroupBySlug(slug!, userId!),
    enabled: !!slug && !!userId,
  });
}
