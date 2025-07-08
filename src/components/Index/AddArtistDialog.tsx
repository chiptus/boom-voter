
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Music } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";
import type { Database } from "@/integrations/supabase/types";
import { StageSelector } from "../StageSelector";

type MusicGenre = Database["public"]["Tables"]["music_genres"]["Row"];

interface AddArtistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AddArtistDialog = ({ open, onOpenChange, onSuccess }: AddArtistDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [genreId, setGenreId] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [soundcloudUrl, setSoundcloudUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [stage, setStage] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [genres, setGenres] = useState<MusicGenre[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { canEditArtists } = useGroups();

  useEffect(() => {
    if (open) {
      fetchGenres();
    }
  }, [open]);

  const fetchGenres = async () => {
    const { data, error } = await supabase
      .from("music_genres")
      .select("*")
      .order("name");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch genres",
        variant: "destructive",
      });
    } else {
      setGenres(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add an artist",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Check Core team permissions
    const hasPermission = await canEditArtists();
    if (!hasPermission) {
      toast({
        title: "Permission Denied",
        description: "Only Core team members can add artists",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("artists")
      .insert({
        name,
        description,
        genre_id: genreId,
        added_by: user.id,
        spotify_url: spotifyUrl || null,
        soundcloud_url: soundcloudUrl || null,
        image_url: imageUrl || null,
        stage: stage || null,
        time_start: timeStart || null,
        time_end: timeEnd || null,
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Artist added successfully!",
      });
      setName("");
      setDescription("");
      setGenreId("");
      setSpotifyUrl("");
      setSoundcloudUrl("");
      setImageUrl("");
      setStage("");
      setTimeStart("");
      setTimeEnd("");
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Add New Artist
          </DialogTitle>
          <DialogDescription>
            Add an artist to the Boom Festival voting list.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="artist-name">Artist Name</Label>
            <Input
              id="artist-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter artist name"
            />
          </div>
          
          <div>
            <Label htmlFor="artist-genre">Music Genre</Label>
            <Select value={genreId} onValueChange={setGenreId} required>
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
          
          <div>
            <Label htmlFor="artist-description">Description (Optional)</Label>
            <Textarea
              id="artist-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about this artist..."
              rows={3}
            />
          </div>

          <StageSelector value={stage} onValueChange={setStage} />

          <div>
            <Label htmlFor="time-start">Performance Start Time (Optional)</Label>
            <Input
              id="time-start"
              type="datetime-local"
              value={timeStart}
              onChange={(e) => setTimeStart(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="time-end">Performance End Time (Optional)</Label>
            <Input
              id="time-end"
              type="datetime-local"
              value={timeEnd}
              onChange={(e) => setTimeEnd(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="spotify-url">Spotify URL (Optional)</Label>
            <Input
              id="spotify-url"
              type="url"
              value={spotifyUrl}
              onChange={(e) => setSpotifyUrl(e.target.value)}
              placeholder="https://open.spotify.com/artist/..."
            />
          </div>

          <div>
            <Label htmlFor="soundcloud-url">SoundCloud URL (Optional)</Label>
            <Input
              id="soundcloud-url"
              type="url"
              value={soundcloudUrl}
              onChange={(e) => setSoundcloudUrl(e.target.value)}
              placeholder="https://soundcloud.com/..."
            />
          </div>

          <div>
            <Label htmlFor="image-url">Image URL (Optional)</Label>
            <Input
              id="image-url"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding artist..." : "Add Artist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
