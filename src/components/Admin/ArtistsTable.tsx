import { useState, useEffect, useMemo } from "react";
import { useArtistsQuery } from "@/hooks/queries/useArtistsQuery";
import { useGenres } from "@/hooks/queries/useGenresQuery";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Artist } from "@/services/queries";
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
import { Loader2, Search, Archive, Edit2, Check, X } from "lucide-react";
import { StageSelector } from "@/components/StageSelector";
import { formatDateTime, toDatetimeLocal, toISOString } from "@/lib/timeUtils";

interface EditingState {
  artistId: string;
  field: string;
  value: string;
}

export const ArtistsTable = () => {
  const { data: artists, isLoading, refetch } = useArtistsQuery();
  const { toast } = useToast();
  const [editingState, setEditingState] = useState<EditingState | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArtists = useMemo(
    () =>
      artists?.filter(
        (artist) =>
          !artist.archived &&
          artist.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [artists, searchTerm]
  );

  const startEditing = (
    artistId: string,
    field: string,
    currentValue: string
  ) => {
    let value = currentValue;

    // Convert ISO strings to datetime-local format for editing
    if (field === "time_start" || field === "time_end") {
      value = toDatetimeLocal(currentValue);
    }

    setEditingState({ artistId, field, value });
  };

  const cancelEditing = () => {
    setEditingState(null);
  };

  const saveEdit = async () => {
    if (!editingState) return;

    const { artistId, field, value } = editingState;

    try {
      let updateValue: string | null = value;

      // Convert datetime-local back to ISO string for time fields
      if (field === "time_start" || field === "time_end") {
        updateValue = value ? toISOString(value) : null;
      } else if (!value.trim()) {
        updateValue = null;
      }

      const { error } = await supabase
        .from("artists")
        .update({
          [field]: updateValue,
          updated_at: new Date().toISOString(),
        })
        .eq("id", artistId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Artist updated successfully",
      });

      refetch();
      setEditingState(null);
    } catch (error) {
      console.error("Error updating artist:", error);
      toast({
        title: "Error",
        description: "Failed to update artist",
        variant: "destructive",
      });
    }
  };

  const archiveArtist = async (artistId: string) => {
    try {
      const { error } = await supabase
        .from("artists")
        .update({
          archived: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", artistId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Artist archived successfully",
      });

      refetch();
    } catch (error) {
      console.error("Error archiving artist:", error);
      toast({
        title: "Error",
        description: "Failed to archive artist",
        variant: "destructive",
      });
    }
  };

  const renderEditableCell = (
    artist: Artist,
    field: keyof Artist,
    value: string | null
  ) => {
    const isEditing =
      editingState?.artistId === artist.id && editingState?.field === field;
    const displayValue = value || "";

    if (isEditing) {
      if (field === "stage") {
        return (
          <div className="flex items-center gap-2">
            <StageSelector
              value={editingState.value}
              onValueChange={(newValue) =>
                setEditingState({ ...editingState, value: newValue })
              }
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
    }

    return (
      <div
        className="cursor-pointer hover:bg-muted/20 p-2 rounded min-h-8 flex items-center group"
        onClick={() => startEditing(artist.id, field, value || "")}
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
          <span>Artists Management</span>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {filteredArtists.length} artists
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArtists.map((artist) => (
                <TableRow key={artist.id}>
                  <TableCell className="font-medium">
                    {renderEditableCell(artist, "name", artist.name)}
                  </TableCell>
                  <TableCell>
                    {renderEditableCell(artist, "stage", artist.stage)}
                  </TableCell>
                  <TableCell>
                    {renderEditableCell(
                      artist,
                      "time_start",
                      artist.time_start
                    )}
                  </TableCell>
                  <TableCell>
                    {renderEditableCell(artist, "time_end", artist.time_end)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => archiveArtist(artist.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredArtists.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "No artists found matching your search."
                : "No artists found."}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
