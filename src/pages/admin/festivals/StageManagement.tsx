import { useState } from "react";
import { useStagesByEditionQuery } from "@/hooks/queries/stages/useStagesByEdition";
import { useCreateStageMutation } from "@/hooks/queries/stages/useCreateStage";
import { useUpdateStageMutation } from "@/hooks/queries/stages/useUpdateStage";
import { useDeleteStageMutation } from "@/hooks/queries/stages/useDeleteStage";
import { Stage } from "@/hooks/queries/stages/types";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Edit2, Trash2, MapPin, Upload } from "lucide-react";
import { CSVImportDialog } from "./CSVImportDialog";

interface StageFormData {
  name: string;
}

interface StageManagementProps {
  editionId: string;
}

export function StageManagement({ editionId }: StageManagementProps) {
  const { data: stages = [], isLoading } = useStagesByEditionQuery(editionId);
  const createStageMutation = useCreateStageMutation();
  const updateStageMutation = useUpdateStageMutation();
  const deleteStageMutation = useDeleteStageMutation();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [formData, setFormData] = useState<StageFormData>({
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetForm() {
    setFormData({
      name: "",
    });
    setEditingStage(null);
  }

  function handleCreate() {
    resetForm();
    setIsDialogOpen(true);
  }

  function handleEdit(stage: Stage) {
    setFormData({
      name: stage.name,
    });
    setEditingStage(stage);
    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Stage name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingStage) {
        await updateStageMutation.mutateAsync({
          stageId: editingStage.id,
          stageData: formData,
        });
      } else {
        await createStageMutation.mutateAsync({
          ...formData,
          festival_edition_id: editionId,
        });
      }

      setIsDialogOpen(false);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(stage: Stage) {
    if (
      !confirm(
        `Are you sure you want to delete "${stage.name}"? This will also affect all sets assigned to this stage.`,
      )
    ) {
      return;
    }

    deleteStageMutation.mutate(stage.id);
  }

  // Filter stages by selected edition
  const filteredStages = stages.filter(
    (stage) => stage.festival_edition_id === editionId,
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading stages...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Stage Management
          </span>
          <div className="flex gap-2">
            <CSVImportDialog editionId={editionId}>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
            </CSVImportDialog>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleCreate}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stage
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingStage ? "Edit Stage" : "Create New Stage"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingStage
                      ? "Update the stage name and details."
                      : "Create a new stage where artists will perform."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Stage Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Dance Temple, Sacred Ground"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      {editingStage ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stage Name</TableHead>

                <TableHead>Created</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStages.map((stage) => (
                <TableRow key={stage.id}>
                  <TableCell className="font-medium">{stage.name}</TableCell>

                  <TableCell>
                    {new Date(stage.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(stage)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(stage)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredStages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No stages found for the selected edition.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
