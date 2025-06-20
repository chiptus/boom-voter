import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserPlus, Users, Crown } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";

interface GroupManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GroupManagementDialog = ({ open, onOpenChange }: GroupManagementDialogProps) => {
  const { groups, createGroup, deleteGroup, inviteToGroup, leaveGroup } = useGroups();
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [inviteUsername, setInviteUsername] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [creating, setCreating] = useState(false);
  const [inviting, setInviting] = useState(false);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    setCreating(true);
    const group = await createGroup(newGroupName.trim(), newGroupDescription.trim() || undefined);
    if (group) {
      setNewGroupName("");
      setNewGroupDescription("");
    }
    setCreating(false);
  };

  const handleInviteUser = async () => {
    if (!inviteUsername.trim() || !selectedGroupId) return;
    
    setInviting(true);
    const success = await inviteToGroup(selectedGroupId, inviteUsername.trim());
    if (success) {
      setInviteUsername("");
    }
    setInviting(false);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      await deleteGroup(groupId);
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (window.confirm("Are you sure you want to leave this group?")) {
      await leaveGroup(groupId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Manage Groups</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="my-groups" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-groups">My Groups</TabsTrigger>
            <TabsTrigger value="create-group">Create Group</TabsTrigger>
          </TabsList>

          <TabsContent value="my-groups" className="space-y-4">
            {groups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>You're not in any groups yet.</p>
                <p className="text-sm">Create a group to organize your friends!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {groups.map((group) => (
                  <Card key={group.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <span>{group.name}</span>
                            {group.is_creator && (
                              <Badge variant="secondary" className="text-xs">
                                <Crown className="h-3 w-3 mr-1" />
                                Creator
                              </Badge>
                            )}
                          </CardTitle>
                          {group.description && (
                            <CardDescription className="mt-1">
                              {group.description}
                            </CardDescription>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {group.is_creator ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteGroup(group.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLeaveGroup(group.id)}
                            >
                              Leave
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{group.member_count} members</span>
                        </div>
                        {group.is_creator && (
                          <div className="flex items-center space-x-2">
                            <Input
                              placeholder="Username to invite"
                              value={selectedGroupId === group.id ? inviteUsername : ""}
                              onChange={(e) => {
                                setSelectedGroupId(group.id);
                                setInviteUsername(e.target.value);
                              }}
                              className="w-40 h-8"
                            />
                            <Button
                              size="sm"
                              onClick={handleInviteUser}
                              disabled={!inviteUsername.trim() || inviting || selectedGroupId !== group.id}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="create-group" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  placeholder="e.g., Festival Squad, Close Friends, Work Colleagues"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="group-description">Description (Optional)</Label>
                <Textarea
                  id="group-description"
                  placeholder="What's this group for?"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <Button
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim() || creating}
                className="w-full"
              >
                {creating ? "Creating..." : "Create Group"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};