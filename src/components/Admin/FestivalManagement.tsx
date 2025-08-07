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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Edit2, Trash2, Calendar } from "lucide-react";
import { FestivalDialog } from "./FestivalDialog";
import type { Festival } from "@/services/queries";

export const FestivalManagement = () => {
  const { data: festivals = [], isLoading } = useFestivalQuery.useFestivals();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFestival, setEditingFestival] = useState<Festival | null>(null);

  const handleCreate = () => {
    setEditingFestival(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (festival: Festival) => {
    setEditingFestival(festival);
    setIsDialogOpen(true);
  };

  const handleDelete = async (festival: Festival) => {
    if (
      !confirm(
        `Are you sure you want to delete "${festival.name}"? This will also delete all associated editions, stages, and sets.`,
      )
    ) {
      return;
    }

    try {
      await queryFunctions.deleteFestival(festival.id);
      toast({
        title: "Success",
        description: "Festival deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["festivals"] });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete festival",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading festivals...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Festival Management
          </span>
          <Button
            onClick={handleCreate}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Festival
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Website</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {festivals.map((festival) => (
                <TableRow key={festival.id}>
                  <TableCell className="font-medium">{festival.name}</TableCell>
                  <TableCell>{festival.description || "—"}</TableCell>
                  <TableCell>
                    {festival.website_url ? (
                      <a
                        href={festival.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
                      >
                        Visit
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(festival)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(festival)}
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

          {festivals.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No festivals found. Create your first festival to get started.
            </div>
          )}
        </div>
      </CardContent>

      <FestivalDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingFestival={editingFestival}
      />
    </Card>
  );
};
