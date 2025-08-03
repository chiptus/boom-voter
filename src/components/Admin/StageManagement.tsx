import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryFunctions } from "@/services/queries";
import { useFestivalQuery } from "@/hooks/queries/useFestivalQuery";
import { useStagesQuery } from "@/hooks/queries/useStagesQuery";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Edit2, Trash2, MapPin } from "lucide-react";
import type { Stage, Festival, FestivalEdition } from "@/services/queries";

interface StageFormData {
  name: string;
  festival_edition_id: string;
}

interface StageManagementProps {
  festivalId?: string;
}

export const StageManagement = ({ festivalId }: StageManagementProps) => {
  const { data: festivals = [] } = useFestivalQuery.useFestivals();
  const { data: editions = [] } = useFestivalQuery.useFestivalEditionsForFestival(festivalId);
  const { data: stages = [], isLoading } = useStagesQuery();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [formData, setFormData] = useState<StageFormData>({
    name: '',
    festival_edition_id: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEditionFilter, setSelectedEditionFilter] = useState<string>('all');

  const resetForm = () => {
    setFormData({
      name: '',
      festival_edition_id: '',
    });
    setEditingStage(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (stage: Stage) => {
    setFormData({
      name: stage.name,
      festival_edition_id: stage.festival_edition_id,
    });
    setEditingStage(stage);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.festival_edition_id) {
      toast({
        title: "Error",
        description: "Stage name and festival edition are required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingStage) {
        await queryFunctions.updateStage(editingStage.id, formData);
        toast({
          title: "Success",
          description: "Stage updated successfully",
        });
      } else {
        await queryFunctions.createStage(formData);
        toast({
          title: "Success",
          description: "Stage created successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ['stages'] });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save stage",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (stage: Stage) => {
    if (!confirm(`Are you sure you want to delete "${stage.name}"? This will also affect all sets assigned to this stage.`)) {
      return;
    }

    try {
      await queryFunctions.deleteStage(stage.id);
      toast({
        title: "Success",
        description: "Stage deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['stages'] });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete stage",
        variant: "destructive",
      });
    }
  };

  const getEditionName = (editionId: string) => {
    const edition = editions.find(e => e.id === editionId);
    const festival = festivals.find(f => f.id === edition?.festival_id);
    return edition ? `${festival?.name || 'Unknown'} - ${edition.name}` : 'Unknown Edition';
  };

  // Filter stages by selected edition
  const filteredStages = selectedEditionFilter && selectedEditionFilter !== "all"
    ? stages.filter(stage => stage.festival_edition_id === selectedEditionFilter)
    : stages;

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
            <Select value={selectedEditionFilter} onValueChange={setSelectedEditionFilter}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter by edition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Editions</SelectItem>
                {editions.map((edition) => (
                  <SelectItem key={edition.id} value={edition.id}>
                    {getEditionName(edition.id)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stage
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingStage ? 'Edit Stage' : 'Create New Stage'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="edition">Festival Edition</Label>
                    <Select
                      value={formData.festival_edition_id}
                      onValueChange={(value) => setFormData({ ...formData, festival_edition_id: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a festival edition" />
                      </SelectTrigger>
                      <SelectContent>
                        {editions.map((edition) => (
                          <SelectItem key={edition.id} value={edition.id}>
                            {getEditionName(edition.id)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="name">Stage Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {editingStage ? 'Update' : 'Create'}
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
                <TableHead>Festival Edition</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStages.map((stage) => (
                <TableRow key={stage.id}>
                  <TableCell className="font-medium">{stage.name}</TableCell>
                  <TableCell>{getEditionName(stage.festival_edition_id)}</TableCell>
                  <TableCell>{new Date(stage.created_at).toLocaleDateString()}</TableCell>
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
              {selectedEditionFilter && selectedEditionFilter !== "all"
                ? "No stages found for the selected edition." 
                : "No stages found. Create your first stage to get started."
              }
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};