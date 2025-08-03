import { useState, useEffect, useMemo } from "react";
import { useArtistsQuery } from "@/hooks/queries/useArtistsQuery";
import { useStagesQuery } from "@/hooks/queries/useStagesQuery";
import { queryFunctions } from "@/services/queries";
import { useToast } from "@/hooks/use-toast";
import { Set } from "@/services/queries";
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
import { Loader2, Search, Archive, Edit2, Check, X, Music } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateTime, toDatetimeLocal, toISOString } from "@/lib/timeUtils";
import { useQueryClient } from "@tanstack/react-query";

interface EditingState {
  setId: string;
  field: string;
  value: string;
}

export const ArtistsTable = () => {
  const { data: sets, isLoading, refetch } = useArtistsQuery();
  const { data: stages = [] } = useStagesQuery();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingState, setEditingState] = useState<EditingState | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSets = useMemo(
    () =>
      sets?.filter((set) =>
        set.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        set.artists?.some(artist => 
          artist.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) || [],
    [sets, searchTerm]
  );

  const startEditing = (
    setId: string,
    field: string,
    currentValue: string
  ) => {
    let value = currentValue;

    // Convert ISO strings to datetime-local format for editing
    if (field === "time_start" || field === "time_end") {
      value = toDatetimeLocal(currentValue);
    } else if (field === "stage_id" && !currentValue) {
      value = "none";
    }

    setEditingState({ setId, field, value });
  };

  const cancelEditing = () => {
    setEditingState(null);
  };

  const saveEdit = async () => {
    if (!editingState) return;

    const { setId, field, value } = editingState;

    try {
      let updateValue: any = value;

      // Convert datetime-local back to ISO string for time fields
      if (field === "time_start" || field === "time_end") {
        updateValue = value ? toISOString(value) : null;
      } else if (field === "stage_id") {
        updateValue = value && value !== "none" ? value : null;
      } else if (!value.trim()) {
        updateValue = null;
      }

      await queryFunctions.updateSet(setId, {
        [field]: updateValue,
      });

      toast({
        title: "Success",
        description: "Set updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['sets'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      setEditingState(null);
    } catch (error) {
      console.error("Error updating set:", error);
      toast({
        title: "Error",
        description: "Failed to update set",
        variant: "destructive",
      });
    }
  };

  const deleteSet = async (setId: string) => {
    if (!confirm("Are you sure you want to delete this set? This action cannot be undone.")) {
      return;
    }

    try {
      await queryFunctions.deleteSet(setId);

      toast({
        title: "Success",
        description: "Set deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['sets'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
    } catch (error) {
      console.error("Error deleting set:", error);
      toast({
        title: "Error",
        description: "Failed to delete set",
        variant: "destructive",
      });
    }
  };

  const renderEditableCell = (
    set: Set,
    field: string,
    value: string | null
  ) => {
    const isEditing =
      editingState?.setId === set.id && editingState?.field === field;
    const displayValue = value || "";

    if (isEditing) {
      if (field === "stage_id") {
        return (
          <div className="flex items-center gap-2">
            <Select
              value={editingState.value}
              onValueChange={(newValue) =>
                setEditingState({ ...editingState, value: newValue })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No stage</SelectItem>
                {stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" variant="ghost" onClick={saveEdit}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={cancelEditing}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        );
      }

      if (field === "time_start" || field === "time_end") {
        return (
          <div className="flex items-center gap-2">
            <Input
              type="datetime-local"
              value={editingState.value}
              onChange={(e) =>
                setEditingState({ ...editingState, value: e.target.value })
              }
              className="w-48"
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") cancelEditing();
              }}
            />
            <Button size="sm" variant="ghost" onClick={saveEdit}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={cancelEditing}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <Input
            value={editingState.value}
            onChange={(e) =>
              setEditingState({ ...editingState, value: e.target.value })
            }
            className="min-w-32"
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") cancelEditing();
            }}
            autoFocus
          />
          <Button size="sm" variant="ghost" onClick={saveEdit}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={cancelEditing}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    // Display mode
    let formattedValue = displayValue;
    if (field === "time_start" || field === "time_end") {
      formattedValue = value ? formatDateTime(value, true) || "" : "";
    } else if (field === "stage_id") {
      const stage = stages.find(s => s.id === value);
      formattedValue = stage ? stage.name : "";
    }

    return (
      <div
        className="cursor-pointer hover:bg-muted/20 p-2 rounded min-h-8 flex items-center group"
        onClick={() => startEditing(set.id, field, value || "")}
      >
        <span className="flex-1">{formattedValue || "—"}</span>
        <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-50 ml-2" />
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading artists...</span>
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
            Sets Management
          </span>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sets and artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {filteredSets.length} sets
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Set Name</TableHead>
                <TableHead>Artists</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSets.map((set) => (
                <TableRow key={set.id}>
                  <TableCell className="font-medium">
                    {renderEditableCell(set, "name", set.name)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {set.artists?.map((artist) => (
                        <span key={artist.id} className="text-sm bg-muted px-2 py-1 rounded">
                          {artist.name}
                        </span>
                      ))}
                      {!set.artists?.length && <span className="text-muted-foreground">No artists</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {renderEditableCell(set, "stage_id", set.stage_id)}
                  </TableCell>
                  <TableCell>
                    {renderEditableCell(set, "time_start", set.time_start)}
                  </TableCell>
                  <TableCell>
                    {renderEditableCell(set, "time_end", set.time_end)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteSet(set.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "No sets found matching your search."
                : "No sets found."}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
