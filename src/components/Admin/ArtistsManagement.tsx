import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryFunctions } from "@/services/queries";
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
import { Loader2, Plus, Edit2, Archive, Search, Music, Check, X } from "lucide-react";
import type { Artist, Genre } from "@/services/queries";

interface ArtistFormData {
  name: string;
  description?: string;
  genre_ids: string[];
  spotify_url?: string;
  soundcloud_url?: string;
  website_url?: string;
  image_url?: string;
}

interface EditingState {
  artistId: string;
  field: string;
  value: string;
}

export const ArtistsManagement = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [editingState, setEditingState] = useState<EditingState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ArtistFormData>({
    name: '',
    description: '',
    genre_ids: [],
    spotify_url: '',
    soundcloud_url: '',
    website_url: '',
    image_url: '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch artists and genres
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [artistsData, genresData] = await Promise.all([
        queryFunctions.fetchArtists(),
        queryFunctions.fetchGenres(),
      ]);
      setArtists(artistsData.filter(artist => !artist.archived));
      setGenres(genresData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data
  useState(() => {
    fetchData();
  });

  const filteredArtists = useMemo(
    () =>
      artists.filter((artist) =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.description?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [artists, searchTerm]
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      genre_ids: [],
      spotify_url: '',
      soundcloud_url: '',
      website_url: '',
      image_url: '',
    });
    setEditingArtist(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (artist: Artist) => {
    setFormData({
      name: artist.name,
      description: artist.description || '',
      genre_ids: artist.genres?.map(g => g.id) || [],
      spotify_url: artist.spotify_url || '',
      soundcloud_url: artist.soundcloud_url || '',
      website_url: artist.website_url || '',
      image_url: artist.image_url || '',
    });
    setEditingArtist(artist);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Artist name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        spotify_url: formData.spotify_url?.trim() || null,
        soundcloud_url: formData.soundcloud_url?.trim() || null,
        website_url: formData.website_url?.trim() || null,
        image_url: formData.image_url?.trim() || null,
        archived: false,
      };

      if (editingArtist) {
        await queryFunctions.updateArtist(editingArtist.id, submitData);
        
        // Update genre associations
        if (editingArtist.genres) {
          for (const genre of editingArtist.genres) {
            await queryFunctions.removeArtistGenre(editingArtist.id, genre.id);
          }
        }
        for (const genreId of formData.genre_ids) {
          await queryFunctions.addArtistGenre(editingArtist.id, genreId);
        }

        toast({
          title: "Success",
          description: "Artist updated successfully",
        });
      } else {
        const newArtist = await queryFunctions.createArtist(submitData);
        
        // Add genre associations
        for (const genreId of formData.genre_ids) {
          await queryFunctions.addArtistGenre(newArtist.id, genreId);
        }

        toast({
          title: "Success",
          description: "Artist created successfully",
        });
      }

      await fetchData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save artist",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = async (artist: Artist) => {
    if (!confirm(`Are you sure you want to archive "${artist.name}"? This will hide the artist from the main interface but preserve all data.`)) {
      return;
    }

    try {
      await queryFunctions.updateArtist(artist.id, { archived: true });
      toast({
        title: "Success",
        description: "Artist archived successfully",
      });
      await fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to archive artist",
        variant: "destructive",
      });
    }
  };

  // Inline editing functions
  const startEditing = (artistId: string, field: string, currentValue: string) => {
    setEditingState({ artistId, field, value: currentValue || "" });
  };

  const cancelEditing = () => {
    setEditingState(null);
  };

  const saveEdit = async () => {
    if (!editingState) return;
    const { artistId, field, value } = editingState;

    try {
      await queryFunctions.updateArtist(artistId, {
        [field]: value.trim() || null,
      });

      toast({
        title: "Success",
        description: "Artist updated successfully",
      });

      await fetchData();
      setEditingState(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update artist",
        variant: "destructive",
      });
    }
  };

  const renderEditableCell = (artist: Artist, field: string, value: string | null) => {
    const isEditing = editingState?.artistId === artist.id && editingState?.field === field;
    
    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <Input
            value={editingState.value}
            onChange={(e) => setEditingState({ ...editingState, value: e.target.value })}
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

    return (
      <div
        className="cursor-pointer hover:bg-muted/20 p-2 rounded min-h-8 flex items-center group"
        onClick={() => startEditing(artist.id, field, value || "")}
      >
        <span>{value || "—"}</span>
        <Edit2 className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-50" />
      </div>
    );
  };

  const getGenreNames = (artist: Artist) => {
    return artist.genres?.map(g => g.name).join(", ") || "No genres";
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
          <span className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Artists Management
          </span>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Artist
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingArtist ? 'Edit Artist' : 'Create New Artist'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Artist Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Shpongle"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Artist description..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Genres</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {genres.map((genre) => (
                        <Badge
                          key={genre.id}
                          variant={formData.genre_ids.includes(genre.id) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const isSelected = formData.genre_ids.includes(genre.id);
                            setFormData({
                              ...formData,
                              genre_ids: isSelected
                                ? formData.genre_ids.filter(id => id !== genre.id)
                                : [...formData.genre_ids, genre.id]
                            });
                          }}
                        >
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="spotify_url">Spotify URL</Label>
                      <Input
                        id="spotify_url"
                        value={formData.spotify_url}
                        onChange={(e) => setFormData({ ...formData, spotify_url: e.target.value })}
                        placeholder="https://open.spotify.com/artist/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="soundcloud_url">SoundCloud URL</Label>
                      <Input
                        id="soundcloud_url"
                        value={formData.soundcloud_url}
                        onChange={(e) => setFormData({ ...formData, soundcloud_url: e.target.value })}
                        placeholder="https://soundcloud.com/..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="website_url">Website URL</Label>
                      <Input
                        id="website_url"
                        value={formData.website_url}
                        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                        placeholder="https://artist-website.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image_url">Image URL</Label>
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://example.com/artist-image.jpg"
                      />
                    </div>
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
                      {editingArtist ? 'Update' : 'Create'}
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
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Genres</TableHead>
                <TableHead>Links</TableHead>
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
                    {renderEditableCell(artist, "description", artist.description)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {artist.genres?.map((genre) => (
                        <Badge key={genre.id} variant="outline" className="text-xs">
                          {genre.name}
                        </Badge>
                      ))}
                      {!artist.genres?.length && <span className="text-muted-foreground">No genres</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {artist.spotify_url && (
                        <a href={artist.spotify_url} target="_blank" rel="noopener noreferrer">
                          <Badge variant="outline" className="text-xs">Spotify</Badge>
                        </a>
                      )}
                      {artist.soundcloud_url && (
                        <a href={artist.soundcloud_url} target="_blank" rel="noopener noreferrer">
                          <Badge variant="outline" className="text-xs">SoundCloud</Badge>
                        </a>
                      )}
                      {artist.website_url && (
                        <a href={artist.website_url} target="_blank" rel="noopener noreferrer">
                          <Badge variant="outline" className="text-xs">Website</Badge>
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(artist)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleArchive(artist)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredArtists.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm 
                ? "No artists found matching your search." 
                : "No artists found. Create your first artist to get started."
              }
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};