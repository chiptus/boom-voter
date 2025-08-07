import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Music } from "lucide-react";
import type { FestivalSet } from "@/services/queries";
import {
  useDeleteSetMutation,
  useSetsQuery,
} from "@/hooks/queries/useSetsQuery";
import { SetFormDialog } from "./SetFormDialog";
import { SetsTable } from "./SetsTable";

interface SetManagementProps {
  editionId: string;
}

export const SetManagement = ({ editionId }: SetManagementProps) => {
  const { data: sets = [], isLoading } = useSetsQuery();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<FestivalSet | null>(null);

  const deleteSetMutation = useDeleteSetMutation();

  const handleCreate = () => {
    setEditingSet(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (set: FestivalSet) => {
    setEditingSet(set);
    setIsDialogOpen(true);
  };

  const handleDelete = async (set: FestivalSet) => {
    if (
      !confirm(
        `Are you sure you want to delete "${set.name}"? This will also delete all votes for this set.`,
      )
    ) {
      return;
    }

    deleteSetMutation.mutate(set.id);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSet(null);
  };

  // Filter sets by selected edition
  const filteredSets = sets.filter(
    (set) => set.festival_edition_id === editionId,
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading sets...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Set Management
          </span>
          <Button
            onClick={handleCreate}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Set
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SetsTable
          sets={filteredSets}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </CardContent>

      <SetFormDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        editingSet={editingSet}
        editionId={editionId}
      />
    </Card>
  );
};
