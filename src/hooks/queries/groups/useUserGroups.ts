import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Group } from "@/types/groups";

// Query key factory
export const userGroupsKeys = {
  all: ["groups"] as const,
  user: (userId: string) => [...userGroupsKeys.all, "user", userId] as const,
};

// Business logic function
async function fetchUserGroups(userId: string): Promise<Group[]> {
  // First fetch groups, filtering out archived ones
  const { data: groupsData, error } = await supabase
    .from("groups")
    .select("*")
    .eq("archived", false)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch groups");
  }

  if (!groupsData) return [];

  // Then fetch member counts separately
  const groupsWithCounts = await Promise.all(
    groupsData.map(async (group) => {
      const { count } = await supabase
        .from("group_members")
        .select("*", { count: "exact", head: true })
        .eq("group_id", group.id);

      return {
        ...group,
        member_count: count || 0,
        is_creator: group.created_by === userId,
      };
    }),
  );

  return groupsWithCounts;
}

// Hook
export function useUserGroups(userId: string | undefined) {
  return useQuery({
    queryKey: userGroupsKeys.user(userId!),
    queryFn: () => fetchUserGroups(userId!),
    enabled: !!userId,
  });
}
