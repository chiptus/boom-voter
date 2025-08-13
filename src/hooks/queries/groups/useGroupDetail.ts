import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Group } from "@/types/groups";

// Query key factory
export const groupDetailKeys = {
  all: ["groups"] as const,
  details: () => [...groupDetailKeys.all, "detail"] as const,
  detail: (groupId: string) => [...groupDetailKeys.details(), groupId] as const,
};

// Business logic function
async function fetchGroupById(groupId: string): Promise<Group | null> {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (error) {
    throw new Error("Failed to fetch group details");
  }

  return data;
}

// Hook
export function useGroupDetail(groupId: string) {
  return useQuery({
    queryKey: groupDetailKeys.detail(groupId),
    queryFn: () => fetchGroupById(groupId),
    enabled: !!groupId,
  });
}
