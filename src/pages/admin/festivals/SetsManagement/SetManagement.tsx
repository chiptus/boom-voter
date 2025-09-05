import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Music, Upload } from "lucide-react";
import { CSVImportDialog } from "../CSVImportDialog";
import { FestivalSet } from "@/hooks/queries/sets/useSets";
import { useSetsQuery } from "@/hooks/queries/sets/useSets";
import { useFestivalEditionBySlugQuery } from "@/hooks/queries/festivals/editions/useFestivalEditionBySlug";
import { useDeleteSetMutation } from "@/hooks/queries/sets/useDeleteSet";
import { SetFormDialog } from "../SetFormDialog";
import { SetsTable } from "../SetsTable";

interface SetManagementProps {
  editionSlug: string;
  festivalSlug: string;
}

export function SetManagement({
  editionSlug,
  festivalSlug,
}: SetManagementProps) {
  // All hooks must be at the top level
  const editionQuery = useFestivalEditionBySlugQuery({
    editionSlug,
    festivalSlug,
  });
  const { data: sets = [], isLoading } = useSetsQuery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<FestivalSet | null>(null);
  const deleteSetMutation = useDeleteSetMutation();

  if (editionQuery.isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading edition...</span>
        </CardContent>
      </Card>
    );
  }

  if (!editionQuery.data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <span>Edition not found</span>
        </CardContent>
      </Card>
    );
  }

  function handleCreate() {
    setEditingSet(null);
    setIsDialogOpen(true);
  }

  function handleEdit(set: FestivalSet) {
    setEditingSet(set);
    setIsDialogOpen(true);
  }

  async function handleDelete(set: FestivalSet) {
    if (
      !confirm(
        `Are you sure you want to delete "${set.name}"? This will also delete all votes for this set.`,
      )
    ) {
      return;
    }

    deleteSetMutation.mutate(set.id);
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setEditingSet(null);
  }

  // Filter sets by selected edition
  const filteredSets = sets.filter(
    (set) => set.festival_edition_id === editionQuery.data.id,
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
          <div className="flex gap-2">
            <CSVImportDialog editionId={editionQuery.data.id} defaultTab="sets">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
            </CSVImportDialog>
            <Button
              onClick={handleCreate}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Set
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SetsTable
          sets={filteredSets}
          onEdit={handleEdit}
          onDelete={handleDelete}
          editionId={editionQuery.data.id}
        />
      </CardContent>

      <SetFormDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        editingSet={editingSet}
        editionId={editionQuery.data.id}
      />
    </Card>
  );
}
