import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Users, Trash2, UserPlus } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const Groups = () => {
  const navigate = useNavigate();
  const { user, groups, loading, createGroup, leaveGroup, deleteGroup, inviteToGroup } = useGroups();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [inviteUsername, setInviteUsername] = useState("");
  const [invitingToGroup, setInvitingToGroup] = useState<string | null>(null);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Error",
        description: "Group name is required",
        variant: "destructive",
      });
      return;
    }

    const result = await createGroup(newGroupName, newGroupDescription);
    if (result) {
      setIsCreateDialogOpen(false);
      setNewGroupName("");
      setNewGroupDescription("");
    }
  };

  const handleInvite = async (groupId: string) => {
    if (!inviteUsername.trim()) {
      toast({
        title: "Error",
        description: "Username is required",
        variant: "destructive",
      });
      return;
    }

    const success = await inviteToGroup(groupId, inviteUsername);
    if (success) {
      setInviteUsername("");
      setInvitingToGroup(null);
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
          
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-white">My Groups</h1>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Group</DialogTitle>
                  <DialogDescription>
                    Create a group to share and compare votes with friends
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="group-name">Group Name</Label>
                    <Input
                      id="group-name"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="Enter group name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="group-description">Description (optional)</Label>
                    <Textarea
                      id="group-description"
                      value={newGroupDescription}
                      onChange={(e) => setNewGroupDescription(e.target.value)}
                      placeholder="Enter group description"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleCreateGroup} className="w-full">
                    Create Group
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-white">Loading groups...</div>
        ) : groups.length === 0 ? (
          <Card className="bg-white/10 border-purple-400/30">
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-purple-300" />
              <h3 className="text-xl font-semibold text-white mb-2">No groups yet</h3>
              <p className="text-purple-200 mb-4">Create your first group to start sharing votes with friends</p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Group
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="bg-white/10 border-purple-400/30">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">{group.name}</CardTitle>
                      {group.description && (
                        <CardDescription className="text-purple-200 mt-1">
                          {group.description}
                        </CardDescription>
                      )}
                    </div>
                    {group.is_creator && (
                      <Badge className="bg-purple-600/50 text-purple-100">Creator</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-purple-200">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{group.member_count} members</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {invitingToGroup === group.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={inviteUsername}
                          onChange={(e) => setInviteUsername(e.target.value)}
                          placeholder="Enter username"
                          className="bg-white/10 border-purple-400/30 text-white"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleInvite(group.id)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Add
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setInvitingToGroup(null);
                            setInviteUsername("");
                          }}
                          className="text-purple-300 hover:text-purple-100"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setInvitingToGroup(group.id)}
                          className="flex-1 bg-white/10 border-purple-400/30 text-white hover:bg-white/20"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Invite Member
                        </Button>
                        {group.is_creator ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteGroup(group.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => leaveGroup(group.id)}
                            className="bg-white/10 border-purple-400/30 text-white hover:bg-white/20"
                          >
                            Leave
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;