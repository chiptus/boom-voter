import {
  useFestivalsQuery,
  useDeleteFestivalMutation,
  Festival,
} from "@/hooks/queries/festivals/useFestivals";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FestivalLogoDialog } from "./FestivalLogoDialog";
import { useState } from "react";

export function FestivalManagementTable({
  onEdit,
  onSelect,
  selected,
}: {
  onEdit: (festival: Festival) => void;
  onSelect: (festival: Festival) => void;
  selected: string;
}) {
  const { data: festivals = [], isLoading } = useFestivalsQuery({ all: true });
  const deleteFestivalMutation = useDeleteFestivalMutation();

  const [logoDialogOpen, setLogoDialogOpen] = useState(false);
  const [selectedFestivalForLogo, setSelectedFestivalForLogo] =
    useState<Festival | null>(null);

  async function handleDelete(festival: Festival) {
    if (
      !confirm(
        `Are you sure you want to delete "${festival.name}"? This will also delete all associated editions, stages, and sets.`,
      )
    ) {
      return;
    }

    try {
      await deleteFestivalMutation.mutateAsync(festival.id);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  }

  function handleLogoManagement(festival: Festival) {
    setSelectedFestivalForLogo(festival);
    setLogoDialogOpen(true);
  }

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
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Website</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {festivals.map((festival) => (
            <TableRow
              key={festival.id}
              onClick={() => onSelect(festival)}
              className={cn(
                selected === festival.id ? "bg-slate-200 selected" : "",
              )}
            >
              <TableCell>
                {festival.logo_url ? (
                  <img
                    src={festival.logo_url}
                    alt={`${festival.name} logo`}
                    className="h-8 w-8 object-contain rounded"
                  />
                ) : (
                  <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
                    <ImageIcon className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </TableCell>
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
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLogoManagement(festival);
                    }}
                    title="Manage logo"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEdit(festival);
                    }}
                    title="Edit festival"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(festival);
                    }}
                    className="text-destructive hover:text-destructive"
                    title="Delete festival"
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

      <FestivalLogoDialog
        open={logoDialogOpen}
        onOpenChange={setLogoDialogOpen}
        festival={selectedFestivalForLogo}
      />
    </>
  );
}
