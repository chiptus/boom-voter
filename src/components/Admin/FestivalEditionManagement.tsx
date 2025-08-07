import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryFunctions } from "@/services/queries";
import { useFestivalQuery } from "@/hooks/queries/useFestivalQuery";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Edit2, Trash2, CalendarDays } from "lucide-react";
import type { FestivalEdition } from "@/services/queries";

interface EditionFormData {
  festival_id: string;
  name: string;
  year: number;
  start_date?: string;
  end_date?: string;
}

interface FestivalEditionManagementProps {
  festivalId?: string;
}

export const FestivalEditionManagement = ({
  festivalId,
}: FestivalEditionManagementProps) => {
  const { data: festivals = [] } = useFestivalQuery.useFestivals();
  const { data: editions = [], isLoading } =
    useFestivalQuery.useFestivalEditionsForFestival(festivalId);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEdition, setEditingEdition] = useState<FestivalEdition | null>(
    null,
  );
  const [formData, setFormData] = useState<EditionFormData>({
    festival_id: "",
    name: "",
    year: new Date().getFullYear(),
    start_date: "",
    end_date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      festival_id: festivalId || "",
      name: "",
      year: new Date().getFullYear(),
      start_date: "",
      end_date: "",
    });
    setEditingEdition(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (edition: FestivalEdition) => {
    setFormData({
      festival_id: edition.festival_id,
      name: edition.name,
      year: edition.year,
      start_date: edition.start_date || "",
      end_date: edition.end_date || "",
    });
    setEditingEdition(edition);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.festival_id) {
      toast({
        title: "Error",
        description: "Edition name and festival are required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };

      if (editingEdition) {
        await queryFunctions.updateFestivalEdition(
          editingEdition.id,
          submitData,
        );
        toast({
          title: "Success",
          description: "Festival edition updated successfully",
        });
      } else {
        await queryFunctions.createFestivalEdition(submitData);
        toast({
          title: "Success",
          description: "Festival edition created successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["festival-editions"] });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save festival edition",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (edition: FestivalEdition) => {
    if (
      !confirm(
        `Are you sure you want to delete "${edition.name}"? This will also delete all associated stages and sets.`,
      )
    ) {
      return;
    }

    try {
      await queryFunctions.deleteFestivalEdition(edition.id);
      toast({
        title: "Success",
        description: "Festival edition deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["festival-editions"] });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete festival edition",
        variant: "destructive",
      });
    }
  };

  const getFestivalName = (festivalId: string) => {
    return (
      festivals.find((f) => f.id === festivalId)?.name || "Unknown Festival"
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading festival editions...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Festival Edition Management
          </span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleCreate}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Edition
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingEdition
                    ? "Edit Festival Edition"
                    : "Create New Festival Edition"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="festival">Festival</Label>
                  <Select
                    value={formData.festival_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, festival_id: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a festival" />
                    </SelectTrigger>
                    <SelectContent>
                      {festivals.map((festival) => (
                        <SelectItem key={festival.id} value={festival.id}>
                          {festival.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="name">Edition Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Boom Festival 2025"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        year: parseInt(e.target.value),
                      })
                    }
                    min="2000"
                    max="2100"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
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
                    {editingEdition ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Festival</TableHead>
                <TableHead>Edition Name</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editions.map((edition) => (
                <TableRow key={edition.id}>
                  <TableCell className="font-medium">
                    {getFestivalName(edition.festival_id)}
                  </TableCell>
                  <TableCell>{edition.name}</TableCell>
                  <TableCell>{edition.year}</TableCell>
                  <TableCell>{edition.start_date || "—"}</TableCell>
                  <TableCell>{edition.end_date || "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(edition)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(edition)}
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

          {editions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No festival editions found. Create your first edition to get
              started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
