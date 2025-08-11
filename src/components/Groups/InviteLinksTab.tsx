import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { InviteManagement } from "@/components/Groups/InviteManagement";

export function InviteLinksTab({
  groups,
  selectedGroupId,
  setSelectedGroupId,
}: {
  groups: any[];
  selectedGroupId: string;
  setSelectedGroupId: (id: string) => void;
}) {
  if (selectedGroupId) {
    const group = groups.find((g) => g.id === selectedGroupId);
    return (
      <div>
        <Button
          variant="outline"
          className="mb-4 bg-white/10 border-purple-400/30 text-white hover:bg-white/20"
          onClick={() => setSelectedGroupId("")}
        >
          ← Back to Groups
        </Button>
        <InviteManagement
          groupId={selectedGroupId}
          groupName={group?.name || ""}
        />
      </div>
    );
  }
  const creatorGroups = groups.filter((g) => g.is_creator);
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-white">
        Select a Group to Manage Invites
      </h3>
      <div className="space-y-2">
        {creatorGroups.map((group) => (
          <Card
            key={group.id}
            className="cursor-pointer hover:bg-white/20 bg-white/10 border-purple-400/30"
            onClick={() => setSelectedGroupId(group.id)}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h4 className="font-medium text-white">{group.name}</h4>
                <p className="text-sm text-purple-200">
                  {group.member_count} members
                </p>
              </div>
              <Link className="h-5 w-5 text-purple-300" />
            </CardContent>
          </Card>
        ))}
        {creatorGroups.length === 0 && (
          <Card className="bg-white/10 border-purple-400/30">
            <CardContent className="text-center py-8">
              <p className="text-purple-200">
                You need to be a group creator to manage invite links.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
