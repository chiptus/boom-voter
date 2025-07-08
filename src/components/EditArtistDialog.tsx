import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useGroups } from "@/hooks/useGroups";
import { Edit } from "lucide-react";
import { Artist } from "@/services/queries";
import { useGenres } from "@/hooks/queries/useGenresQuery";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { StageSelector } from "./StageSelector";
import { formatISO } from "date-fns";

// Get user's timezone
const getUserTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

// Helper function to convert UTC ISO string to local datetime-local format
const toDatetimeLocal = (isoString: string | null): string => {
  if (!isoString) return "";
  const utcDate = new Date(isoString);
  const userTimeZone = getUserTimeZone();
  const localDate = toZonedTime(utcDate, userTimeZone);

  // Format the date in local timezone for datetime-local input
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");
  const hours = String(localDate.getHours()).padStart(2, "0");
  const minutes = String(localDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Helper function to convert local datetime-local to UTC ISO string
const toISOString = (datetimeLocal: string): string => {
  if (!datetimeLocal) return "";
  const localDate = new Date(datetimeLocal);
  const userTimeZone = getUserTimeZone();
  const utcDate = fromZonedTime(localDate, userTimeZone);
  return utcDate.toISOString();
};

// Helper function to subtract one hour from datetime-local string
const subtractOneHour = (datetimeLocal: string): string => {
  if (!datetimeLocal) return "";
  const date = new Date(datetimeLocal);
  date.setHours(date.getHours() - 1);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

interface EditArtistDialogProps {
  artist: Artist;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export const EditArtistDialog = ({
  artist,
  onSuccess,
  trigger,
}: EditArtistDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: artist.name,
    description: artist.description || "",
    genre_id: artist.genre_id,
    stage: artist.stage || "",
    time_start: toDatetimeLocal(artist.time_start),
    time_end: toDatetimeLocal(artist.time_end),
    spotify_url: artist.spotify_url || "",
    soundcloud_url: artist.soundcloud_url || "",
    image_url: artist.image_url || "",
  });

  const { genres } = useGenres();
  const { toast } = useToast();
  const { canEditArtists } = useGroups();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check Core team permissions
    const hasPermission = await canEditArtists();
    if (!hasPermission) {
      toast({
        title: "Permission Denied",
        description: "Only Core team members can edit artists",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("artists")
        .update({
          name: formData.name,
          description: formData.description || null,
          genre_id: formData.genre_id,
          stage: formData.stage || null,
          time_start: formData.time_start
            ? toISOString(formData.time_start)
            : null,
          time_end: formData.time_end ? toISOString(formData.time_end) : null,
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
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre *</Label>
            <Select
              value={formData.genre_id}
              onValueChange={(value) =>
                setFormData({ ...formData, genre_id: value })
              }
            >
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

          <StageSelector
            value={formData.stage}
            onValueChange={(value) =>
              setFormData({ ...formData, stage: value })
            }
          />

          <div className="space-y-2">
            <Label htmlFor="time_start">Performance Start Time</Label>
            <Input
              id="time_start"
              type="datetime-local"
              value={formData.time_start}
              onChange={(e) =>
                setFormData({ ...formData, time_start: e.target.value })
              }
            />
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (formData.time_start || formData.time_end) {
                  setFormData({
                    ...formData,
                    time_start: formData.time_start ? subtractOneHour(formData.time_start) : "",
                    time_end: formData.time_end ? subtractOneHour(formData.time_end) : "",
                  });
                }
              }}
              disabled={!formData.time_start && !formData.time_end}
            >
              -1 Hour
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time_end">Performance End Time</Label>
            <Input
              id="time_end"
              type="datetime-local"
              value={formData.time_end}
              onChange={(e) =>
                setFormData({ ...formData, time_end: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Tell us about this artist..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spotify_url">Spotify URL</Label>
            <Input
              id="spotify_url"
              type="url"
              value={formData.spotify_url}
              onChange={(e) =>
                setFormData({ ...formData, spotify_url: e.target.value })
              }
              placeholder="https://open.spotify.com/artist/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="soundcloud_url">SoundCloud URL</Label>
            <Input
              id="soundcloud_url"
              type="url"
              value={formData.soundcloud_url}
              onChange={(e) =>
                setFormData({ ...formData, soundcloud_url: e.target.value })
              }
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
