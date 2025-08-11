import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGroups } from "@/hooks/useGroups";
import { DeleteGroupDialog } from "@/components/DeleteGroupDialog";
import { CreateGroupDialog } from "@/components/Groups/CreateGroupDialog";
import { SignInRequired } from "@/components/Groups/SignInRequired";
import { GroupsHeader } from "@/components/Groups/GroupsHeader";
import { MyGroupsList } from "@/components/Groups/MyGroupsList";
import { InviteLinksTab } from "@/components/Groups/InviteLinksTab";

function Groups() {
  const navigate = useNavigate();
  const { user, groups, loading, createGroup, leaveGroup, deleteGroup } =
    useGroups();
  const [selectedGroupForInvites, setSelectedGroupForInvites] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleCreateGroup(name: string, description?: string) {
    setCreating(true);
    const result = await createGroup(name, description);
    if (result) {
      navigate(`/groups/${result.id}`);
      setCreating(false);
      return true;
    }
    setCreating(false);
    return false;
  }

  function handleDeleteGroup(groupId: string, groupName: string) {
    setGroupToDelete({ id: groupId, name: groupName });
    setDeleteDialogOpen(true);
  }

  async function confirmDeleteGroup() {
    if (!groupToDelete) return;
    setDeleting(true);
    await deleteGroup(groupToDelete.id);
    setDeleting(false);
    setDeleteDialogOpen(false);
    setGroupToDelete(null);
  }

  async function handleLeaveGroup(groupId: string) {
    if (window.confirm("Are you sure you want to leave this group?")) {
      await leaveGroup(groupId);
    }
  }

  if (!user) {
    return <SignInRequired />;
  }

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="container mx-auto px-4 py-8">
        <GroupsHeader onCreate={() => setCreateDialogOpen(true)} />
        <Tabs defaultValue="my-groups" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger
              value="my-groups"
              className="text-white data-[state=active]:bg-purple-600"
            >
              My Groups
            </TabsTrigger>
            <TabsTrigger
              value="invite-links"
              className="text-white data-[state=active]:bg-purple-600"
            >
              Invite Links
            </TabsTrigger>
          </TabsList>
          <TabsContent value="my-groups" className="space-y-4">
            <MyGroupsList
              groups={groups}
              loading={loading}
              onView={(id) => navigate(`/groups/${id}`)}
              onDelete={handleDeleteGroup}
              onLeave={handleLeaveGroup}
            />
          </TabsContent>
          <TabsContent value="invite-links" className="space-y-4">
            <InviteLinksTab
              groups={groups}
              selectedGroupId={selectedGroupForInvites}
              setSelectedGroupId={setSelectedGroupForInvites}
            />
          </TabsContent>
        </Tabs>
        <CreateGroupDialog
          isOpen={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreateGroup={handleCreateGroup}
          isCreating={creating}
        />
        <DeleteGroupDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setGroupToDelete(null);
          }}
          onConfirm={confirmDeleteGroup}
          groupName={groupToDelete?.name || ""}
          isDeleting={deleting}
        />
      </div>
    </div>
  );
}

export default Groups;
