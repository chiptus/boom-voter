
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
import type { Database } from "@/integrations/supabase/types";

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
  const [genres, setGenres] = useState<MusicGenre[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

    const { error } = await supabase
      .from("artists")
      .insert({
        name,
        description,
        genre_id: genreId,
        added_by: user.id,
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
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding artist..." : "Add Artist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
