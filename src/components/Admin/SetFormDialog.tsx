import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryFunctions } from "@/services/queries";
import { useStagesQuery } from "@/hooks/queries/useStagesQuery";
import { useArtistsQuery } from "@/hooks/queries/useArtistsQuery";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { FestivalSet } from "@/services/queries";
import { ArtistMultiSelect } from "./ArtistMultiSelect";

interface SetFormData {
  name: string;
  description?: string;
  stage_id?: string;
  time_start?: string;
  time_end?: string;
  estimated_date?: string;
}

interface SetFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingSet: FestivalSet | null;
  editionId: string;
}

export function SetFormDialog({
  isOpen,
  onClose,
  editingSet,
  editionId,
}: SetFormDialogProps) {
  const { data: stages = [] } = useStagesQuery();
  const { data: artists = [] } = useArtistsQuery();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<SetFormData>({
    name: "",
    description: "",
    stage_id: "none",
    time_start: "",
    time_end: "",
    estimated_date: "",
  });
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes or editingSet changes
  useEffect(() => {
    if (isOpen) {
      if (editingSet) {
        setFormData({
          name: editingSet.name,
          description: editingSet.description || "",
          stage_id: editingSet.stage_id || "none",
          time_start: formatDateTimeLocal(editingSet.time_start),
          time_end: formatDateTimeLocal(editingSet.time_end),
          estimated_date: "",
        });
        setSelectedArtists(editingSet.artists?.map((a) => a.id) || []);
      } else {
        setFormData({
          name: "",
          description: "",
          stage_id: "none",
          time_start: "",
          time_end: "",
          estimated_date: "",
        });
        setSelectedArtists([]);
      }
    }
  }, [isOpen, editingSet]);

  const availableStages = stages.filter(
    (stage) => stage.festival_edition_id === editionId,
  );

  // Helper function to convert ISO datetime to datetime-local format
  const formatDateTimeLocal = (isoString: string | null): string => {
    if (!isoString) return "";
    // Remove the timezone part and return in format: YYYY-MM-DDTHH:mm
    return isoString.slice(0, 16);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Set name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        festival_edition_id: editionId,
        stage_id:
          formData.stage_id && formData.stage_id !== "none"
            ? formData.stage_id
            : null,
        time_start: formData.time_start || null,
        time_end: formData.time_end || null,
        description: formData.description || null,
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
      onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingSet ? "Edit Set" : "Create New Set"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
            <Label htmlFor="artists">Artists in Set</Label>
            <ArtistMultiSelect
              artists={artists.map((a) => ({ id: a.id, name: a.name }))}
              value={selectedArtists}
              onValueChange={setSelectedArtists}
              placeholder="Select artists for this set..."
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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
  );
}
