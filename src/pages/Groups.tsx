import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Users, Trash2, UserPlus, Crown, Link } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { InviteManagement } from "@/components/InviteManagement";

const Groups = () => {
  const navigate = useNavigate();
  const { user, groups, loading, createGroup, leaveGroup, deleteGroup, inviteToGroup } = useGroups();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [inviteUsername, setInviteUsername] = useState("");
  const [invitingToGroup, setInvitingToGroup] = useState<string | null>(null);
  const [selectedGroupForInvites, setSelectedGroupForInvites] = useState<string>("");
  const [creating, setCreating] = useState(false);
  const [inviting, setInviting] = useState(false);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Error",
        description: "Group name is required",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    const result = await createGroup(newGroupName.trim(), newGroupDescription.trim() || undefined);
    if (result) {
      setNewGroupName("");
      setNewGroupDescription("");
    }
    setCreating(false);
  };

  const handleInviteUser = async (groupId: string) => {
    if (!inviteUsername.trim()) {
      toast({
        title: "Error",
        description: "Username or email is required",
        variant: "destructive",
      });
      return;
    }

    setInviting(true);
    const success = await inviteToGroup(groupId, inviteUsername.trim());
    if (success) {
      setInviteUsername("");
      setInvitingToGroup(null);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
            <CardDescription>Please sign in to manage groups</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white hover:text-purple-200 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Artists
          </Button>
          
          <h1 className="text-4xl font-bold text-white">My Groups</h1>
        </div>

        <Tabs defaultValue="my-groups" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger value="my-groups" className="text-white data-[state=active]:bg-purple-600">My Groups</TabsTrigger>
            <TabsTrigger value="create-group" className="text-white data-[state=active]:bg-purple-600">Create Group</TabsTrigger>
            <TabsTrigger value="invite-links" className="text-white data-[state=active]:bg-purple-600">Invite Links</TabsTrigger>
          </TabsList>

          <TabsContent value="my-groups" className="space-y-4">
            {loading ? (
              <div className="text-center text-white">Loading groups...</div>
            ) : groups.length === 0 ? (
              <Card className="bg-white/10 border-purple-400/30">
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto mb-4 text-purple-300" />
                  <h3 className="text-xl font-semibold text-white mb-2">No groups yet</h3>
                  <p className="text-purple-200 mb-4">Create your first group to start sharing votes with friends</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {groups.map((group) => (
                  <Card key={group.id} className="bg-white/10 border-purple-400/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center space-x-2 text-white">
                            <span>{group.name}</span>
                            {group.is_creator && (
                              <Badge variant="secondary" className="text-xs bg-purple-600/50 text-purple-100">
                                <Crown className="h-3 w-3 mr-1" />
                                Creator
                              </Badge>
                            )}
                          </CardTitle>
                          {group.description && (
                            <CardDescription className="mt-1 text-purple-200">
                              {group.description}
                            </CardDescription>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/groups/${group.id}`)}
                            className="bg-white/10 border-purple-400/30 text-white hover:bg-white/20"
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                          {group.is_creator ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedGroupForInvites(group.id)}
                                className="bg-white/10 border-purple-400/30 text-white hover:bg-white/20"
                              >
                                <Link className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteGroup(group.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLeaveGroup(group.id)}
                              className="bg-white/10 border-purple-400/30 text-white hover:bg-white/20"
                            >
                              Leave
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-purple-200">
                          <Users className="h-4 w-4" />
                          <span>{group.member_count} members</span>
                        </div>
                        {group.is_creator && (
                          <div className="flex items-center space-x-2">
                            <Input
                              placeholder="Username or email"
                              value={invitingToGroup === group.id ? inviteUsername : ""}
                              onChange={(e) => {
                                setInvitingToGroup(group.id);
                                setInviteUsername(e.target.value);
                              }}
                              className="w-40 h-8 bg-white/10 border-purple-400/30 text-white"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleInviteUser(group.id)}
                              disabled={!inviteUsername.trim() || inviting || invitingToGroup !== group.id}
                              className="bg-purple-600 hover:bg-purple-700"
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
            <Card className="bg-white/10 border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white">Create New Group</CardTitle>
                <CardDescription className="text-purple-200">
                  Create a group to share and compare votes with friends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="group-name" className="text-white">Group Name</Label>
                  <Input
                    id="group-name"
                    placeholder="e.g., Festival Squad, Close Friends, Work Colleagues"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="bg-white/10 border-purple-400/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="group-description" className="text-white">Description (Optional)</Label>
                  <Textarea
                    id="group-description"
                    placeholder="What's this group for?"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    rows={3}
                    className="bg-white/10 border-purple-400/30 text-white"
                  />
                </div>
                <Button
                  onClick={handleCreateGroup}
                  disabled={!newGroupName.trim() || creating}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {creating ? "Creating..." : "Create Group"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invite-links" className="space-y-4">
            {selectedGroupForInvites ? (
              <div>
                <Button
                  variant="outline"
                  className="mb-4 bg-white/10 border-purple-400/30 text-white hover:bg-white/20"
                  onClick={() => setSelectedGroupForInvites("")}
                >
                  ← Back to Groups
                </Button>
                <InviteManagement
                  groupId={selectedGroupForInvites}
                  groupName={groups.find(g => g.id === selectedGroupForInvites)?.name || ""}
                />
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Select a Group to Manage Invites</h3>
                <div className="space-y-2">
                  {groups.filter(g => g.is_creator).map((group) => (
                    <Card 
                      key={group.id} 
                      className="cursor-pointer hover:bg-white/20 bg-white/10 border-purple-400/30" 
                      onClick={() => setSelectedGroupForInvites(group.id)}
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <h4 className="font-medium text-white">{group.name}</h4>
                          <p className="text-sm text-purple-200">{group.member_count} members</p>
                        </div>
                        <Link className="h-5 w-5 text-purple-300" />
                      </CardContent>
                    </Card>
                  ))}
                  {groups.filter(g => g.is_creator).length === 0 && (
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
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Groups;