import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Save, Search, Grid3X3, RotateCcw, Plus, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import {
  useArtistsQuery,
  type Artist,
} from "@/hooks/queries/artists/useArtists";
import { TextCell } from "./BulkEditor/TextCell";
import { TextareaCell } from "./BulkEditor/TextareaCell";
import { UrlCell } from "./BulkEditor/UrlCell";
import { GenresCell } from "./BulkEditor/GenresCell";
import { BulkActionsToolbar } from "./BulkEditor/BulkActionsToolbar";
import { ChangePreviewDialog } from "./BulkEditor/ChangePreviewDialog";
import { AddArtistDialog } from "./AddArtistDialog";

export type ArtistChange = {
  id: string;
  field: keyof Artist;
  oldValue: any;
  newValue: any;
};

export type SortConfig = {
  key: keyof Artist | "genres";
  direction: "asc" | "desc";
} | null;

export function ArtistBulkEditor() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [changes, setChanges] = useState<Map<string, ArtistChange[]>>(
    new Map(),
  );
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [showChangePreview, setShowChangePreview] = useState(false);
  const [addArtistOpen, setAddArtistOpen] = useState(false);

  const artistsQuery = useArtistsQuery();
  const artists = useMemo(() => artistsQuery.data || [], [artistsQuery.data]);

  // Filter and sort artists
  // Note: artists dependency is correct - React Query properly memoizes the data
  const filteredAndSortedArtists = useMemo(() => {
    let filtered = artists.filter(
      (artist) =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortConfig.key === "genres") {
          aValue = a.artist_music_genres?.length || 0;
          bValue = b.artist_music_genres?.length || 0;
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === "asc" ? 1 : -1;
        if (bValue == null) return sortConfig.direction === "asc" ? -1 : 1;

        // String comparison
        if (typeof aValue === "string" && typeof bValue === "string") {
          const comparison = aValue.localeCompare(bValue);
          return sortConfig.direction === "asc" ? comparison : -comparison;
        }

        // Numeric comparison
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, sortConfig, artists]);

  // Get artist with pending changes applied
  function getArtistWithChanges(artist: Artist): Artist {
    const artistChanges = changes.get(artist.id);
    if (!artistChanges || artistChanges.length === 0) return artist;

    let modifiedArtist = { ...artist };
    artistChanges.forEach((change) => {
      (modifiedArtist as any)[change.field] = change.newValue;
    });

    return modifiedArtist;
  }

  function handleCellChange(
    artistId: string,
    field: keyof Artist,
    newValue: any,
  ) {
    const artist = artists.find((a) => a.id === artistId);
    if (!artist) return;

    const oldValue = (artist as any)[field];
    if (oldValue === newValue) {
      // Value unchanged, remove any existing change
      const artistChanges = changes.get(artistId) || [];
      const updatedChanges = artistChanges.filter((c) => c.field !== field);

      if (updatedChanges.length === 0) {
        const newChanges = new Map(changes);
        newChanges.delete(artistId);
        setChanges(newChanges);
      } else {
        const newChanges = new Map(changes);
        newChanges.set(artistId, updatedChanges);
        setChanges(newChanges);
      }
      return;
    }

    // Add or update change
    const artistChanges = changes.get(artistId) || [];
    const existingChangeIndex = artistChanges.findIndex(
      (c) => c.field === field,
    );

    const newChange: ArtistChange = {
      id: artistId,
      field,
      oldValue,
      newValue,
    };

    let updatedChanges;
    if (existingChangeIndex >= 0) {
      updatedChanges = [...artistChanges];
      updatedChanges[existingChangeIndex] = newChange;
    } else {
      updatedChanges = [...artistChanges, newChange];
    }

    const newChanges = new Map(changes);
    newChanges.set(artistId, updatedChanges);
    setChanges(newChanges);
  }

  function handleSort(key: keyof Artist | "genres") {
    setSortConfig((current) => {
      if (current?.key === key) {
        return current.direction === "asc" ? { key, direction: "desc" } : null; // Remove sort
      }
      return { key, direction: "asc" };
    });
  }

  function handleSelectAll() {
    if (selectedIds.size === filteredAndSortedArtists.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedArtists.map((a) => a.id)));
    }
  }

  function handleSelectArtist(artistId: string, isSelected: boolean) {
    const newSelected = new Set(selectedIds);
    if (isSelected) {
      newSelected.add(artistId);
    } else {
      newSelected.delete(artistId);
    }
    setSelectedIds(newSelected);
  }

  const totalChanges = Array.from(changes.values()).reduce(
    (sum, artistChanges) => sum + artistChanges.length,
    0,
  );

  function getSortIndicator(key: keyof Artist | "genres") {
    if (sortConfig?.key !== key) return null;
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  }

  if (artistsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading artists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Grid3X3 className="h-5 w-5 text-blue-600" />
              <span>Artists Management</span>
              {totalChanges > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800"
                >
                  {totalChanges} changes
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link to="/admin/artists/duplicates">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-600 hover:text-orange-700"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  <span className="hidden md:block">Manage Duplicates</span>
                </Button>
              </Link>

              <Button
                onClick={() => setAddArtistOpen(true)}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span className="hidden md:block">Add Artist</span>
              </Button>

              {totalChanges > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChanges(new Map())}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowChangePreview(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search and Bulk Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <BulkActionsToolbar
              selectedCount={selectedIds.size}
              totalCount={filteredAndSortedArtists.length}
              onSelectAll={handleSelectAll}
              onClearSelection={() => setSelectedIds(new Set())}
            />
          </div>

          {/* Data Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedIds.size === filteredAndSortedArtists.length &&
                        filteredAndSortedArtists.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 min-w-48"
                    onClick={() => handleSort("name")}
                  >
                    Name{getSortIndicator("name")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 min-w-64"
                    onClick={() => handleSort("description")}
                  >
                    Description{getSortIndicator("description")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 min-w-32"
                    onClick={() => handleSort("genres")}
                  >
                    Genres{getSortIndicator("genres")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 min-w-48"
                    onClick={() => handleSort("spotify_url")}
                  >
                    Spotify URL{getSortIndicator("spotify_url")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 min-w-48"
                    onClick={() => handleSort("soundcloud_url")}
                  >
                    SoundCloud URL{getSortIndicator("soundcloud_url")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("created_at")}
                  >
                    Created{getSortIndicator("created_at")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedArtists.map((artist) => {
                  const artistWithChanges = getArtistWithChanges(artist);
                  const hasChanges = changes.has(artist.id);

                  return (
                    <TableRow
                      key={artist.id}
                      className={`${hasChanges ? "bg-orange-50 border-l-4 border-l-orange-400" : ""}`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(artist.id)}
                          onCheckedChange={(checked) =>
                            handleSelectArtist(artist.id, !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextCell
                          value={artistWithChanges.name}
                          onSave={(value) =>
                            handleCellChange(artist.id, "name", value)
                          }
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <TextareaCell
                          value={artistWithChanges.description}
                          onSave={(value) =>
                            handleCellChange(artist.id, "description", value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <GenresCell
                          value={artistWithChanges.artist_music_genres}
                          onSave={(value) =>
                            handleCellChange(
                              artist.id,
                              "artist_music_genres",
                              value,
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <UrlCell
                          value={artistWithChanges.spotify_url}
                          placeholder="https://open.spotify.com/artist/..."
                          onSave={(value) =>
                            handleCellChange(artist.id, "spotify_url", value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <UrlCell
                          value={artistWithChanges.soundcloud_url}
                          placeholder="https://soundcloud.com/..."
                          onSave={(value) =>
                            handleCellChange(artist.id, "soundcloud_url", value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {new Date(artist.created_at).toLocaleDateString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredAndSortedArtists.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? "No artists found matching your search."
                  : "No artists found."}
              </div>
            )}
          </div>

          {filteredAndSortedArtists.length > 0 && (
            <div className="text-sm text-muted-foreground text-center">
              Showing {filteredAndSortedArtists.length} of {artists.length}{" "}
              artists
              {selectedIds.size > 0 && (
                <span className="ml-2">• {selectedIds.size} selected</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {showChangePreview && (
        <ChangePreviewDialog
          changes={changes}
          artists={artists}
          onClose={() => setShowChangePreview(false)}
          onConfirm={() => {
            // TODO: Implement bulk save
            console.log("Saving changes:", changes);
            setChanges(new Map());
            setShowChangePreview(false);
          }}
        />
      )}

      <AddArtistDialog
        open={addArtistOpen}
        onOpenChange={setAddArtistOpen}
        onSuccess={() => {
          // Artist list will refresh automatically via React Query
        }}
      />
    </div>
  );
}
