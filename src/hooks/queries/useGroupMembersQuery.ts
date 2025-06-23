import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { groupQueries } from "@/services/queries";

const fetchGroupMembers = async (groupId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from("group_members")
    .select("user_id")
    .eq("group_id", groupId);

  if (error) {
    console.error("Error fetching group members:", error);
    return [];
  }

  return data ? data.map(member => member.user_id) : [];
};

export const useGroupMembersQuery = (groupId: string | undefined) => {
  return useQuery({
    queryKey: groupId ? groupQueries.members(groupId) : ['group-members', 'none'],
    queryFn: () => groupId ? fetchGroupMembers(groupId) : Promise.resolve([]),
    enabled: !!groupId,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    gcTime: 1000 * 60 * 15, // Keep in memory for 15 minutes
    refetchOnWindowFocus: false, // Prevent refetch on navigation back
  });
};