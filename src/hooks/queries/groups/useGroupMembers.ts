import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { GroupMember } from "@/types/groups";

// Query key factory
export const groupMembersKeys = {
  all: ["groups"] as const,
  members: (groupId: string) =>
    [...groupMembersKeys.all, "members", groupId] as const,
};

// Business logic function
async function fetchGroupMembers(groupId: string): Promise<GroupMember[]> {
  // First get the group members
  const { data: members, error } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
    .order("joined_at", { ascending: true });

  if (error) {
    console.error("Error fetching group members:", error);
    return [];
  }

  if (!members || members.length === 0) {
    return [];
  }

  // Then fetch profile information for each member
  const membersWithProfiles = await Promise.all(
    members.map(async (member) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, email")
        .eq("id", member.user_id)
        .single();

      return {
        ...member,
        profiles: {
          username: profile?.username || undefined,
          email: profile?.email || undefined,
        },
      };
    }),
  );

  return membersWithProfiles;
}

// Hook
export function useGroupMembers(groupId: string) {
  return useQuery({
    queryKey: groupMembersKeys.members(groupId),
    queryFn: () => fetchGroupMembers(groupId),
    enabled: !!groupId,
  });
}
