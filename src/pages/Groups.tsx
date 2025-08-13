import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserGroupsQuery } from "@/hooks/queries/groups/useUserGroups";
import { useDeleteGroupMutation } from "@/hooks/queries/groups/useDeleteGroup";
import { DeleteGroupDialog } from "@/components/DeleteGroupDialog";
import { CreateGroupDialog } from "@/components/Groups/CreateGroupDialog";
import { SignInRequired } from "@/components/Groups/SignInRequired";
import { GroupsHeader } from "@/components/Groups/GroupsHeader";
import { MyGroupsList } from "@/components/Groups/MyGroupsList";

function Groups() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: groups = [], isLoading: groupsLoading } = useUserGroupsQuery(
    user?.id,
  );
  const deleteGroupMutation = useDeleteGroupMutation();
  const loading = authLoading || groupsLoading;
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  function handleDeleteGroup(groupId: string, groupName: string) {
    setGroupToDelete({ id: groupId, name: groupName });
    setDeleteDialogOpen(true);
  }

  function confirmDeleteGroup() {
    if (!groupToDelete || !user) return;

    deleteGroupMutation.mutate(
      {
        groupId: groupToDelete.id,
        userId: user.id,
      },
      {
        onSettled: () => {
          setDeleteDialogOpen(false);
          setGroupToDelete(null);
        },
      },
    );
    // The mutation automatically handles success/error toasts
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
          isDeleting={deleteGroupMutation.isPending}
        />
      </div>
    </div>
  );
}

export default Groups;
