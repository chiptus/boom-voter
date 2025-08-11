import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGroups } from "@/hooks/useGroups";
import { DeleteGroupDialog } from "@/components/DeleteGroupDialog";
import { CreateGroupDialog } from "@/components/Groups/CreateGroupDialog";
import { SignInRequired } from "@/components/Groups/SignInRequired";
import { GroupsHeader } from "@/components/Groups/GroupsHeader";
import { MyGroupsList } from "@/components/Groups/MyGroupsList";

function Groups() {
  const navigate = useNavigate();
  const { user, groups, loading, deleteGroup } = useGroups();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  if (!user) {
    return <SignInRequired />;
  }

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="container mx-auto px-4 py-8">
        <GroupsHeader onCreate={() => setCreateDialogOpen(true)} />

        <MyGroupsList
          groups={groups}
          loading={loading}
          onDelete={handleDeleteGroup}
        />

        <CreateGroupDialog
          isOpen={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onGroupCreated={(groupId) => {
            navigate(`/groups/${groupId}`);
            setCreateDialogOpen(false);
          }}
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
