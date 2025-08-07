import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryFunctions } from "@/services/queries";
import { useFestivalQuery } from "@/hooks/queries/useFestivalQuery";
import { useStagesQuery } from "@/hooks/queries/useStagesQuery";
import { useArtistsQuery } from "@/hooks/queries/useArtistsQuery";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Music,
  Users,
  X,
  Search,
} from "lucide-react";
import { formatTimeRange } from "@/lib/timeUtils";
import type { FestivalSet } from "@/services/queries";
import { useSetsQuery } from "@/hooks/queries/useSetsQuery";

interface SetFormData {
  name: string;
  description?: string;
  festival_edition_id: string;
  stage_id?: string;
  time_start?: string;
  time_end?: string;
  estimated_date?: string;
}

interface SetManagementProps {
  festivalId?: string;
}

export const SetManagement = ({ festivalId }: SetManagementProps) => {
  const { data: festivals = [] } = useFestivalQuery.useFestivals();
  const { data: editions = [] } =
    useFestivalQuery.useFestivalEditionsForFestival(festivalId);
  const { data: stages = [] } = useStagesQuery();
  const { data: sets = [], isLoading } = useSetsQuery(); // This gets sets
  const { data: artists = [], isLoading: isLoadingArtists } = useArtistsQuery();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<FestivalSet | null>(null);
  const [formData, setFormData] = useState<SetFormData>({
    name: "",
    description: "",
    festival_edition_id: "",
    stage_id: "",
    time_start: "",
    time_end: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEditionFilter, setSelectedEditionFilter] =
    useState<string>("all");
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [artistSearchDialog, setArtistSearchDialog] = useState(false);
  const [artistSearchQuery, setArtistSearchQuery] = useState("");

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      festival_edition_id: "",
      stage_id: "none",
      time_start: "",
      time_end: "",
      estimated_date: "",
    });
    setSelectedArtists([]);
    setEditingSet(null);
    setArtistSearchQuery("");
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (set: FestivalSet) => {
    setFormData({
      name: set.name,
      description: set.description || "",
      festival_edition_id: set.festival_edition_id,
      stage_id: set.stage_id || "none",
      time_start: set.time_start || "",
      time_end: set.time_end || "",
      estimated_date: "", // Sets don't currently store estimated_date, so this will be empty
    });
    setSelectedArtists(set.artists?.map((a) => a.id) || []);
    setEditingSet(set);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.festival_edition_id) {
      toast({
        title: "Error",
        description: "Set name and festival edition are required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        stage_id:
          formData.stage_id && formData.stage_id !== "none"
            ? formData.stage_id
            : null,
        time_start: formData.time_start || null,
        time_end: formData.time_end || null,
        description: formData.description || null,
        // Note: estimated_date is not currently part of the sets table schema
        // but we're keeping it in the form for potential future use
        created_by: "admin", // This should come from auth context
      };

      let setId: string;
      if (editingSet) {
        const updatedSet = await queryFunctions.updateSet(
          editingSet.id,
          submitData,
        );
        setId = updatedSet.id;
        toast({
          title: "Success",
          description: "Set updated successfully",
        });
      } else {
        const newSet = await queryFunctions.createSet(submitData);
        setId = newSet.id;
        toast({
          title: "Success",
          description: "Set created successfully",
        });
      }

      // Update artist associations
      if (editingSet) {
        // Remove all existing artist associations
        for (const artist of editingSet.artists || []) {
          await queryFunctions.removeArtistFromSet(editingSet.id, artist.id);
        }
      }

      // Add selected artists to set
      for (const artistId of selectedArtists) {
        await queryFunctions.addArtistToSet(setId, artistId);
      }

      queryClient.invalidateQueries({ queryKey: ["sets"] });
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save set",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (set: FestivalSet) => {
    if (
      !confirm(
        `Are you sure you want to delete "${set.name}"? This will also delete all votes for this set.`,
      )
    ) {
      return;
    }

    try {
      await queryFunctions.deleteSet(set.id);
      toast({
        title: "Success",
        description: "Set deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["sets"] });
      queryClient.invalidateQueries({ queryKey: ["artists"] });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete set",
        variant: "destructive",
      });
    }
  };

  const getEditionName = (editionId: string) => {
    const edition = editions.find((e) => e.id === editionId);
    const festival = festivals.find((f) => f.id === edition?.festival_id);
    return edition
      ? `${festival?.name || "Unknown"} - ${edition.name}`
      : "Unknown Edition";
  };

  const getStageName = (stageId: string | null) => {
    if (!stageId) return "—";
    return stages.find((s) => s.id === stageId)?.name || "Unknown Stage";
  };

  // Filter stages by selected edition in form
  const availableStages = formData.festival_edition_id
    ? stages.filter(
        (stage) => stage.festival_edition_id === formData.festival_edition_id,
      )
    : [];

  // Filter sets by festival editions
  const editionIds = editions.map((e) => e.id);
  const festivalSets = sets.filter((set) =>
    editionIds.includes(set.festival_edition_id),
  );

  // Filter sets by selected edition
  const filteredSets =
    selectedEditionFilter && selectedEditionFilter !== "all"
      ? festivalSets.filter(
          (set) => set.festival_edition_id === selectedEditionFilter,
        )
      : festivalSets;

  // Filter artists for search dialog
  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(artistSearchQuery.toLowerCase()),
  );

  // Helper function to toggle artist selection
  const toggleArtistSelection = (artistId: string) => {
    setSelectedArtists((prev) =>
      prev.includes(artistId)
        ? prev.filter((id) => id !== artistId)
        : [...prev, artistId],
    );
  };

  // Get artist name by ID
  const getArtistName = (artistId: string) => {
    return artists.find((a) => a.id === artistId)?.name || "Unknown Artist";
  };

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
            <Select
              value={selectedEditionFilter}
              onValueChange={setSelectedEditionFilter}
            >
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
                <Button
                  onClick={handleCreate}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Set
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingSet ? "Edit Set" : "Create New Set"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edition">Festival Edition</Label>
                      <Select
                        value={formData.festival_edition_id}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            festival_edition_id: value,
                          })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select edition" />
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
                      <Label htmlFor="stage">Stage</Label>
                      <Select
                        value={formData.stage_id}
                        onValueChange={(value) =>
                          setFormData({ ...formData, stage_id: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            No stage assigned
                          </SelectItem>
                          {availableStages.map((stage) => (
                            <SelectItem key={stage.id} value={stage.id}>
                              {stage.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="name">Set Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Shpongle Live Set"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Set description..."
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="time_start">Start Time</Label>
                      <Input
                        id="time_start"
                        type="datetime-local"
                        value={formData.time_start}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            time_start: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="time_end">End Time</Label>
                      <Input
                        id="time_end"
                        type="datetime-local"
                        value={formData.time_end}
                        onChange={(e) =>
                          setFormData({ ...formData, time_end: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimated_date">Estimated Date</Label>
                      <Input
                        id="estimated_date"
                        type="date"
                        value={formData.estimated_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            estimated_date: e.target.value,
                          })
                        }
                        placeholder="If exact time unknown"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Use when exact start/end times are unknown
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label>Artists in Set ({selectedArtists.length})</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedArtists.map((artistId) => (
                        <Badge
                          key={artistId}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {getArtistName(artistId)}
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 hover:bg-destructive/20"
                            onClick={() =>
                              setSelectedArtists((prev) =>
                                prev.filter((id) => id !== artistId),
                              )
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setArtistSearchDialog(true)}
                      className="mt-2"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Artists
                    </Button>
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
                      {editingSet ? "Update" : "Create"}
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
                <TableHead>Set Name</TableHead>
                <TableHead>Edition</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Artists</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSets.map((set) => (
                <TableRow key={set.id}>
                  <TableCell className="font-medium">{set.name}</TableCell>
                  <TableCell>
                    {getEditionName(set.festival_edition_id)}
                  </TableCell>
                  <TableCell>{getStageName(set.stage_id)}</TableCell>
                  <TableCell>
                    {set.time_start && set.time_end
                      ? formatTimeRange(set.time_start, set.time_end, true)
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {set.artists?.slice(0, 2).map((artist) => (
                        <Badge
                          key={artist.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {artist.name}
                        </Badge>
                      ))}
                      {(set.artists?.length || 0) > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{(set.artists?.length || 0) - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(set)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(set)}
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

          {filteredSets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {selectedEditionFilter && selectedEditionFilter !== "all"
                ? "No sets found for the selected edition."
                : "No sets found. Create your first set to get started."}
            </div>
          )}
        </div>
      </CardContent>

      {/* Artist Selection Dialog */}
      <Dialog open={artistSearchDialog} onOpenChange={setArtistSearchDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Select Artists for Set</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artists..."
                value={artistSearchQuery}
                onChange={(e) => setArtistSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Selected artists count */}
            <div className="text-sm text-muted-foreground">
              {selectedArtists.length} artist
              {selectedArtists.length !== 1 ? "s" : ""} selected
            </div>

            {/* Artists list */}
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              {isLoadingArtists ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading artists...</span>
                </div>
              ) : filteredArtists.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {artistSearchQuery
                    ? "No artists found matching your search."
                    : "No artists available."}
                </div>
              ) : (
                <div className="space-y-1 p-4">
                  {filteredArtists.map((artist) => (
                    <div
                      key={artist.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                      onClick={() => toggleArtistSelection(artist.id)}
                    >
                      <Checkbox
                        checked={selectedArtists.includes(artist.id)}
                        onChange={() => toggleArtistSelection(artist.id)}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{artist.name}</div>
                        {artist.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {artist.description}
                          </div>
                        )}
                        {artist.artist_music_genres &&
                          artist.artist_music_genres.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {artist.artist_music_genres
                                .slice(0, 2)
                                .map((genre, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    Genre ID: {genre.music_genre_id}
                                  </Badge>
                                ))}
                              {artist.artist_music_genres.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{artist.artist_music_genres.length - 2} more
                                </Badge>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedArtists([]);
                  setArtistSearchQuery("");
                }}
                disabled={selectedArtists.length === 0}
              >
                Clear Selection
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setArtistSearchDialog(false);
                    setArtistSearchQuery("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setArtistSearchDialog(false);
                    setArtistSearchQuery("");
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Done ({selectedArtists.length})
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
