import { useState, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Edit2, Archive, Search, Music, Plus } from "lucide-react";
import { Artist, useArtistsQuery } from "@/hooks/queries/artists/useArtists";
import { useArchiveArtistMutation } from "@/hooks/queries/artists/useArchiveArtist";
import { AddArtistDialog } from "./AddArtistDialog";
import { EditArtistDialog } from "./EditArtistDialog";
import { GenreBadge } from "../Index/GenreBadge";

export function ArtistsManagement() {
  const [addArtistOpen, setAddArtistOpen] = useState(false);
  const [edittedArtist, setEdittedArtist] = useState<Artist>();

  const archiveMutation = useArchiveArtistMutation();

  const [searchTerm, setSearchTerm] = useState("");

  const artistsQuery = useArtistsQuery();

  const artists = artistsQuery.data;

  const filteredArtists = useMemo(
    () =>
      (artists || []).filter(
        (artist) =>
          artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artist.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [artists, searchTerm],
  );

  async function handleArchive(artist: Artist) {
    if (
      !confirm(
        `Are you sure you want to archive "${artist.name}"? This will hide the artist from the main interface but preserve all data.`,
      )
    ) {
      return;
    }

    archiveMutation.mutate(artist.id, {});
  }

  return (
    <>
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
                  className="pl-10 md:w-64"
                />
              </div>

              <Button
                onClick={() => setAddArtistOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 flex gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden md:block">Add Artist</span>
              </Button>
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
                    <TableCell className="font-medium">{artist.name}</TableCell>
                    <TableCell>{artist.description}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {artist.artist_music_genres ? (
                          artist.artist_music_genres.map((genre) => (
                            <GenreBadge
                              key={genre.music_genre_id}
                              genreId={genre.music_genre_id}
                            />
                          ))
                        ) : (
                          <span className="text-muted-foreground">
                            No genres
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {artist.spotify_url && (
                          <a
                            href={artist.spotify_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Badge variant="outline" className="text-xs">
                              Spotify
                            </Badge>
                          </a>
                        )}
                        {artist.soundcloud_url && (
                          <a
                            href={artist.soundcloud_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Badge variant="outline" className="text-xs">
                              SoundCloud
                            </Badge>
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEdittedArtist(artist)}
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
                  : "No artists found. Create your first artist to get started."}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddArtistDialog
        open={addArtistOpen}
        onOpenChange={setAddArtistOpen}
        onSuccess={() => {}}
      />

      {!!edittedArtist && (
        <EditArtistDialog
          artist={edittedArtist}
          onClose={() => setEdittedArtist(undefined)}
        />
      )}
    </>
  );
}
