
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useGenres } from "@/hooks/useGenres";
import { Edit } from "lucide-react";
import { STAGES } from "@/components/filters/constants";
import type { Artist } from "@/hooks/useArtists";

interface EditArtistDialogProps {
  artist: Artist;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export const EditArtistDialog = ({ artist, onSuccess, trigger }: EditArtistDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: artist.name,
    description: artist.description || "",
    genre_id: artist.genre_id,
    stage: artist.stage || "",
    estimated_date: artist.estimated_date || "",
    spotify_url: artist.spotify_url || "",
    soundcloud_url: artist.soundcloud_url || "",
    image_url: artist.image_url || "",
  });

  const { genres } = useGenres();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("artists")
        .update({
          name: formData.name,
          description: formData.description || null,
          genre_id: formData.genre_id,
          stage: formData.stage || null,
          estimated_date: formData.estimated_date || null,
          spotify_url: formData.spotify_url || null,
          soundcloud_url: formData.soundcloud_url || null,
          image_url: formData.image_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", artist.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Artist updated successfully",
      });

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error updating artist:", error);
      toast({
        title: "Error",
        description: "Failed to update artist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Edit className="h-4 w-4 mr-2" />
      Edit
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Artist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Artist Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre *</Label>
            <Select value={formData.genre_id} onValueChange={(value) => setFormData({ ...formData, genre_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage">Stage</Label>
            <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a stage" />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_date">Performance Date</Label>
            <Input
              id="estimated_date"
              type="date"
              value={formData.estimated_date}
              onChange={(e) => setFormData({ ...formData, estimated_date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us about this artist..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spotify_url">Spotify URL</Label>
            <Input
              id="spotify_url"
              type="url"
              value={formData.spotify_url}
              onChange={(e) => setFormData({ ...formData, spotify_url: e.target.value })}
              placeholder="https://open.spotify.com/artist/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="soundcloud_url">SoundCloud URL</Label>
            <Input
              id="soundcloud_url"
              type="url"
              value={formData.soundcloud_url}
              onChange={(e) => setFormData({ ...formData, soundcloud_url: e.target.value })}
              placeholder="https://soundcloud.com/artist"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Artist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
