import { useState, useEffect } from "react";
import { useCreateFestivalMutation } from "@/hooks/queries/festivals/useCreateFestival";
import { useUpdateFestivalMutation } from "@/hooks/queries/festivals/useUpdateFestival";
import { Festival } from "@/hooks/queries/festivals/types";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { generateSlug, isValidSlug, sanitizeSlug } from "@/lib/slug";

interface FestivalFormData {
  name: string;
  slug: string;
  description?: string;
  website_url?: string;
  published: boolean;
}

interface FestivalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingFestival: Festival | null;
}

export function FestivalDialog({
  open,
  onOpenChange,
  editingFestival,
}: FestivalDialogProps) {
  const createFestivalMutation = useCreateFestivalMutation();
  const updateFestivalMutation = useUpdateFestivalMutation();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FestivalFormData>({
    name: "",
    slug: "",
    description: "",
    website_url: "",
    published: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugError, setSlugError] = useState("");

  // Reset form when dialog opens/closes or editing festival changes
  useEffect(() => {
    if (open) {
      if (editingFestival) {
        setFormData({
          name: editingFestival.name,
          slug: editingFestival.slug || generateSlug(editingFestival.name),
          description: editingFestival.description || "",
          website_url: editingFestival.website_url || "",
          published: editingFestival.published || false,
        });
      } else {
        setFormData({
          name: "",
          slug: "",
          description: "",
          website_url: "",
          published: false,
        });
      }
      setSlugError("");
    }
  }, [open, editingFestival]);

  // Auto-generate slug when name changes
  function handleNameChange(name: string) {
    setFormData((prev) => ({
      ...prev,
      name,
      // Only auto-generate slug if it's empty or matches the generated slug from previous name
      slug:
        prev.slug === "" || prev.slug === generateSlug(prev.name)
          ? generateSlug(name)
          : prev.slug,
    }));
  }

  // Validate slug when it changes
  function handleSlugChange(slug: string) {
    const cleanSlug = sanitizeSlug(slug);
    setFormData((prev) => ({ ...prev, slug: cleanSlug }));

    if (cleanSlug && !isValidSlug(cleanSlug)) {
      setSlugError(
        "Slug must contain only lowercase letters, numbers, and hyphens",
      );
    } else {
      setSlugError("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Festival name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.slug.trim()) {
      toast({
        title: "Error",
        description: "Festival slug is required",
        variant: "destructive",
      });
      return;
    }

    if (!isValidSlug(formData.slug)) {
      toast({
        title: "Error",
        description: "Please enter a valid slug",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const festivalData = {
        ...formData,
        description: formData.description,
        website_url: formData.website_url || null,
      };

      if (editingFestival) {
        await updateFestivalMutation.mutateAsync({
          festivalId: editingFestival.id,
          festivalData: festivalData,
        });
      } else {
        await createFestivalMutation.mutateAsync({
          ...festivalData,
          logo_url: null,
        });
      }
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
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingFestival ? "Edit Festival" : "Create New Festival"}
          </DialogTitle>
          <DialogDescription>
            {editingFestival
              ? "Update festival information including name, description, and settings."
              : "Create a new festival with basic information and publish settings."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Festival Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Boom Festival"
              required
            />
          </div>
          <div>
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="e.g., boom-festival"
              required
            />
            {slugError && (
              <p className="text-sm text-destructive mt-1">{slugError}</p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              This will be used in the URL: /festivals/
              {formData.slug || "your-slug"}
            </p>
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
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, published: checked })
              }
            />
            <Label htmlFor="published">Published</Label>
            <p className="text-sm text-muted-foreground">
              {formData.published
                ? "Visible to public users"
                : "Only visible to admins"}
            </p>
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
}
