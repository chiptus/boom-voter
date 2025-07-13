import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Vote } from "lucide-react";

interface GroupAnalytics {
  id: string;
  name: string;
  member_count: number;
  created_at: string;
}

interface UserAnalytics {
  id: string;
  username: string | null;
  email: string | null;
  vote_count: number;
  created_at: string;
}

const fetchGroupAnalytics = async (): Promise<GroupAnalytics[]> => {
  const { data: groups, error: groupsError } = await supabase
    .from("groups")
    .select("id, name, created_at")
    .eq("archived", false)
    .order("created_at", { ascending: false });

  if (groupsError) throw new Error("Failed to fetch groups");

  // Get member counts for each group
  const groupsWithCounts = await Promise.all(
    (groups || []).map(async (group) => {
      const { count } = await supabase
        .from("group_members")
        .select("*", { count: "exact", head: true })
        .eq("group_id", group.id);

      return {
        ...group,
        member_count: count || 0,
      };
    })
  );

  return groupsWithCounts;
};

const fetchUserAnalytics = async (): Promise<UserAnalytics[]> => {
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, username, email, created_at")
    .order("created_at", { ascending: false });

  if (profilesError) throw new Error("Failed to fetch users");

  // Get vote counts for each user
  const usersWithCounts = await Promise.all(
    (profiles || []).map(async (profile) => {
      const { count } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", profile.id);

      return {
        ...profile,
        vote_count: count || 0,
      };
    })
  );

  return usersWithCounts;
};

export function AnalyticsTable() {
  const {
    data: groupAnalytics = [],
    isLoading: isLoadingGroups,
    error: groupsError,
  } = useQuery({
    queryKey: ["admin-analytics", "groups"],
    queryFn: fetchGroupAnalytics,
  });

  const {
    data: userAnalytics = [],
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery({
    queryKey: ["admin-analytics", "users"],
    queryFn: fetchUserAnalytics,
  });

  if (groupsError || usersError) {
    return (
      <div className="text-destructive">
        Failed to load analytics data
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Groups Analytics */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            Groups Analytics
          </CardTitle>
          <CardDescription className="text-white/70">
            Groups with member counts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingGroups ? (
            <div className="text-white/70">Loading groups...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/20">
                  <TableHead className="text-white">Group Name</TableHead>
                  <TableHead className="text-white">Members</TableHead>
                  <TableHead className="text-white">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupAnalytics.map((group) => (
                  <TableRow key={group.id} className="border-white/10">
                    <TableCell className="text-white font-medium">
                      {group.name}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {group.member_count}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {new Date(group.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Users Analytics */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Vote className="h-5 w-5" />
            Users Analytics
          </CardTitle>
          <CardDescription className="text-white/70">
            Users with vote counts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingUsers ? (
            <div className="text-white/70">Loading users...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/20">
                  <TableHead className="text-white">Username</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Votes</TableHead>
                  <TableHead className="text-white">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userAnalytics.map((user) => (
                  <TableRow key={user.id} className="border-white/10">
                    <TableCell className="text-white font-medium">
                      {user.username || "No username"}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {user.email || "No email"}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {user.vote_count}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}