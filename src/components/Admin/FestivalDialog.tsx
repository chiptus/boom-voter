import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryFunctions } from "@/services/queries";
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
import { Loader2 } from "lucide-react";
import type { Festival } from "@/services/queries";

interface FestivalFormData {
  name: string;
  description?: string;
  website_url?: string;
}

interface FestivalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingFestival: Festival | null;
}

export const FestivalDialog = ({
  open,
  onOpenChange,
  editingFestival,
}: FestivalDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<FestivalFormData>({
    name: "",
    description: "",
    website_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes or editing festival changes
  useEffect(() => {
    if (open) {
      if (editingFestival) {
        setFormData({
          name: editingFestival.name,
          description: editingFestival.description || "",
          website_url: editingFestival.website_url || "",
        });
      } else {
        setFormData({
          name: "",
          description: "",
          website_url: "",
        });
      }
    }
  }, [open, editingFestival]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Festival name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingFestival) {
        await queryFunctions.updateFestival(editingFestival.id, formData);
        toast({
          title: "Success",
          description: "Festival updated successfully",
        });
      } else {
        await queryFunctions.createFestival({
          ...formData,
          description: formData.description || null,
          website_url: formData.website_url || null,
        });
        toast({
          title: "Success",
          description: "Festival created successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["festivals"] });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save festival",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingFestival ? "Edit Festival" : "Create New Festival"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Festival Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Boom Festival"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Festival description..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              type="url"
              value={formData.website_url}
              onChange={(e) =>
                setFormData({ ...formData, website_url: e.target.value })
              }
              placeholder="https://example.com"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingFestival ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
