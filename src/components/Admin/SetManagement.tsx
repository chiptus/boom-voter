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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit2, Trash2, Music, Users, X } from "lucide-react";
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
}

interface SetManagementProps {
  festivalId?: string;
}

export const SetManagement = ({ festivalId }: SetManagementProps) => {
  const { data: festivals = [] } = useFestivalQuery.useFestivals();
  const { data: editions = [] } = useFestivalQuery.useFestivalEditionsForFestival(festivalId);
  const { data: stages = [] } = useStagesQuery();
  const { data: sets = [], isLoading } = useSetsQuery(); // This gets sets
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<FestivalSet | null>(null);
  const [formData, setFormData] = useState<SetFormData>({
    name: '',
    description: '',
    festival_edition_id: '',
    stage_id: '',
    time_start: '',
    time_end: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEditionFilter, setSelectedEditionFilter] = useState<string>('all');
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [artistSearchDialog, setArtistSearchDialog] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      festival_edition_id: '',
      stage_id: 'none',
      time_start: '',
      time_end: '',
    });
    setSelectedArtists([]);
    setEditingSet(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (set: FestivalSet) => {
    setFormData({
      name: set.name,
      description: set.description || '',
      festival_edition_id: set.festival_edition_id,
      stage_id: set.stage_id || 'none',
      time_start: set.time_start || '',
      time_end: set.time_end || '',
    });
    setSelectedArtists(set.artists?.map(a => a.id) || []);
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
        stage_id: formData.stage_id && formData.stage_id !== "none" ? formData.stage_id : null,
        time_start: formData.time_start || null,
        time_end: formData.time_end || null,
        description: formData.description || null,
        created_by: 'admin', // This should come from auth context
      };

      let setId: string;
      if (editingSet) {
        const updatedSet = await queryFunctions.updateSet(editingSet.id, submitData);
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

      queryClient.invalidateQueries({ queryKey: ['sets'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save set",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (set: FestivalSet) => {
    if (!confirm(`Are you sure you want to delete "${set.name}"? This will also delete all votes for this set.`)) {
      return;
    }

    try {
      await queryFunctions.deleteSet(set.id);
      toast({
        title: "Success",
        description: "Set deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['sets'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete set",
        variant: "destructive",
      });
    }
  };

  const getEditionName = (editionId: string) => {
    const edition = editions.find(e => e.id === editionId);
    const festival = festivals.find(f => f.id === edition?.festival_id);
    return edition ? `${festival?.name || 'Unknown'} - ${edition.name}` : 'Unknown Edition';
  };

  const getStageName = (stageId: string | null) => {
    if (!stageId) return '—';
    return stages.find(s => s.id === stageId)?.name || 'Unknown Stage';
  };

  // Filter stages by selected edition in form
  const availableStages = formData.festival_edition_id 
    ? stages.filter(stage => stage.festival_edition_id === formData.festival_edition_id)
    : [];

  // Filter sets by festival editions
  const editionIds = editions.map(e => e.id);
  const festivalSets = sets.filter(set => editionIds.includes(set.festival_edition_id));
  
  // Filter sets by selected edition
  const filteredSets = selectedEditionFilter && selectedEditionFilter !== "all"
    ? festivalSets.filter(set => set.festival_edition_id === selectedEditionFilter)
    : festivalSets;

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
                  Add Set
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingSet ? 'Edit Set' : 'Create New Set'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edition">Festival Edition</Label>
                      <Select
                        value={formData.festival_edition_id}
                        onValueChange={(value) => setFormData({ ...formData, festival_edition_id: value })}
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
                        onValueChange={(value) => setFormData({ ...formData, stage_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No stage assigned</SelectItem>
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
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Shpongle Live Set"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Set description..."
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="time_start">Start Time</Label>
                      <Input
                        id="time_start"
                        type="datetime-local"
                        value={formData.time_start}
                        onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time_end">End Time</Label>
                      <Input
                        id="time_end"
                        type="datetime-local"
                        value={formData.time_end}
                        onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Artists in Set ({selectedArtists.length})</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedArtists.map((artistId) => {
                        const artist = sets.flatMap(s => s.artists || []).find(a => a.id === artistId);
                        return artist ? (
                          <Badge key={artistId} variant="secondary" className="flex items-center gap-1">
                            {artist.name}
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-4 w-4 p-0 hover:bg-destructive/20"
                              onClick={() => setSelectedArtists(prev => prev.filter(id => id !== artistId))}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ) : null;
                      })}
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
                      {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {editingSet ? 'Update' : 'Create'}
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
                  <TableCell>{getEditionName(set.festival_edition_id)}</TableCell>
                  <TableCell>{getStageName(set.stage_id)}</TableCell>
                  <TableCell>
                    {set.time_start && set.time_end 
                      ? formatTimeRange(set.time_start, set.time_end, true)
                      : '—'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {set.artists?.slice(0, 2).map((artist) => (
                        <Badge key={artist.id} variant="outline" className="text-xs">
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
                : "No sets found. Create your first set to get started."
              }
            </div>
          )}
        </div>
      </CardContent>

      {/* Artist Selection Dialog - Simplified for now */}
      <Dialog open={artistSearchDialog} onOpenChange={setArtistSearchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Artists in Set</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Artist management interface coming soon. For now, you can select artists by their IDs.
            </p>
            <Button onClick={() => setArtistSearchDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};