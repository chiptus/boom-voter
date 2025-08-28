import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  LinkIcon,
  Music,
  FileText,
  Merge,
  X,
  Loader2,
} from "lucide-react";
import type { Artist } from "@/hooks/queries/artists/useArtists";
import { GenreBadge } from "@/components/GenreBadge";
import { useMergeArtistsMutation } from "@/hooks/queries/artists/useMergeArtists";
import { useToast } from "@/components/ui/use-toast";

interface ArtistComparisonModalProps {
  artists: Artist[];
  onClose: () => void;
}

type MergeChoices = {
  name: string;
  description: string | null;
  spotify_url: string | null;
  soundcloud_url: string | null;
  genres: string[];
};

export function ArtistComparisonModal({
  artists,
  onClose,
}: ArtistComparisonModalProps) {
  const [mergeChoices, setMergeChoices] = useState<MergeChoices>({
    name: artists[0]?.name || "",
    description: null,
    spotify_url: null,
    soundcloud_url: null,
    genres: [],
  });

  const [showMergePreview, setShowMergePreview] = useState(false);
  const mergeMutation = useMergeArtistsMutation();
  const { toast } = useToast();

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function handleFieldChange(field: keyof MergeChoices, value: any) {
    setMergeChoices((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function getAllGenres() {
    const allGenres = new Set<string>();
    artists.forEach((artist) => {
      if (artist.artist_music_genres) {
        artist.artist_music_genres.forEach((genre) => {
          allGenres.add(genre.music_genre_id);
        });
      }
    });
    return Array.from(allGenres);
  }

  function handleGenreToggle(genreId: string) {
    setMergeChoices((prev) => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter((g) => g !== genreId)
        : [...prev.genres, genreId],
    }));
  }

  function handleMergePreview() {
    const allGenres = getAllGenres();
    setMergeChoices((prev) => ({
      ...prev,
      genres: prev.genres.length === 0 ? allGenres : prev.genres,
    }));
    setShowMergePreview(true);
  }

  function handleConfirmMerge() {
    const primaryArtist = artists[0];
    const duplicateIds = artists.slice(1).map((artist) => artist.id);

    mergeMutation.mutate(
      {
        primaryArtistId: primaryArtist.id,
        duplicateArtistIds: duplicateIds,
        mergeData: {
          name: mergeChoices.name,
          description: mergeChoices.description,
          spotify_url: mergeChoices.spotify_url,
          soundcloud_url: mergeChoices.soundcloud_url,
          genreIds: mergeChoices.genres,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Artists Merged Successfully",
            description: `Successfully merged ${duplicateIds.length} duplicate artist(s) into "${mergeChoices.name}".`,
          });
          onClose();
        },
        onError: (error) => {
          toast({
            title: "Merge Failed",
            description: `Failed to merge artists: ${error.message}`,
            variant: "destructive",
          });
        },
      },
    );
  }

  if (showMergePreview) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirm Merge</DialogTitle>
            <DialogDescription>
              Review the merged artist data before confirming. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
              <h3 className="font-semibold mb-3">Merged Artist Preview</h3>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">NAME</Label>
                  <p className="font-medium">{mergeChoices.name}</p>
                </div>

                {mergeChoices.description && (
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      DESCRIPTION
                    </Label>
                    <p className="text-sm">{mergeChoices.description}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  {mergeChoices.spotify_url && (
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        SPOTIFY
                      </Label>
                      <p className="text-sm text-blue-600">Connected</p>
                    </div>
                  )}
                  {mergeChoices.soundcloud_url && (
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        SOUNDCLOUD
                      </Label>
                      <p className="text-sm text-blue-600">Connected</p>
                    </div>
                  )}
                </div>

                {mergeChoices.genres.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">
                      GENRES
                    </Label>
                    <div className="flex flex-wrap gap-1">
                      {mergeChoices.genres.map((genreId) => (
                        <GenreBadge key={genreId} genreId={genreId} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-red-50 border-red-200">
              <h3 className="font-semibold text-red-800 mb-2">
                Artists to be Deleted
              </h3>
              <p className="text-sm text-red-700 mb-3">
                The following {artists.length - 1} duplicate artist(s) will be
                permanently deleted:
              </p>
              <ul className="text-sm text-red-700 space-y-1">
                {artists.slice(1).map((artist) => (
                  <li key={artist.id}>
                    • ID: {artist.id.slice(-8)} (Created:{" "}
                    {formatDate(artist.created_at)})
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowMergePreview(false)}
              disabled={mergeMutation.isPending}
            >
              Back to Edit
            </Button>
            <Button
              onClick={handleConfirmMerge}
              className="bg-red-600 hover:bg-red-700"
              disabled={mergeMutation.isPending}
            >
              {mergeMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {mergeMutation.isPending
                ? "Merging..."
                : "Confirm Merge & Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Merge className="h-5 w-5" />
            Compare & Merge: {artists[0]?.name}
          </DialogTitle>
          <DialogDescription>
            Choose which data to keep for each field. All votes and notes will
            be preserved.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {artists.map((artist, index) => (
              <div key={artist.id} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={index === 0 ? "default" : "secondary"}>
                    #{index + 1}
                  </Badge>
                  <span className="text-sm font-medium">
                    ID: {artist.id.slice(-8)}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(artist.created_at)}
                  </div>

                  {artist.description && (
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <FileText className="h-3 w-3" />
                        <span className="text-xs font-medium">Description</span>
                      </div>
                      <p className="text-xs">{artist.description}</p>
                    </div>
                  )}

                  <div className="space-y-1">
                    {artist.spotify_url && (
                      <div className="flex items-center gap-1 text-green-600">
                        <LinkIcon className="h-3 w-3" />
                        <span className="text-xs">Spotify</span>
                      </div>
                    )}
                    {artist.soundcloud_url && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <LinkIcon className="h-3 w-3" />
                        <span className="text-xs">SoundCloud</span>
                      </div>
                    )}
                  </div>

                  {artist.artist_music_genres &&
                    artist.artist_music_genres.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <Music className="h-3 w-3" />
                          <span className="text-xs font-medium">Genres</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {artist.artist_music_genres.map((genre) => (
                            <GenreBadge
                              key={genre.music_genre_id}
                              genreId={genre.music_genre_id}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-6">
            <h3 className="font-semibold">Choose Data to Keep</h3>

            {/* Description */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Description
              </Label>
              <RadioGroup
                value={mergeChoices.description || "none"}
                onValueChange={(value) =>
                  handleFieldChange(
                    "description",
                    value === "none" ? null : value,
                  )
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="desc-none" />
                  <Label
                    htmlFor="desc-none"
                    className="text-sm text-muted-foreground"
                  >
                    No description
                  </Label>
                </div>
                {artists.map(
                  (artist, index) =>
                    artist.description && (
                      <div
                        key={artist.id}
                        className="flex items-start space-x-2"
                      >
                        <RadioGroupItem
                          value={artist.description}
                          id={`desc-${index}`}
                        />
                        <Label
                          htmlFor={`desc-${index}`}
                          className="text-sm flex-1"
                        >
                          <span className="font-medium">#{index + 1}:</span>{" "}
                          {artist.description}
                        </Label>
                      </div>
                    ),
                )}
              </RadioGroup>
            </div>

            {/* Spotify URL */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Spotify URL
              </Label>
              <RadioGroup
                value={mergeChoices.spotify_url || "none"}
                onValueChange={(value) =>
                  handleFieldChange(
                    "spotify_url",
                    value === "none" ? null : value,
                  )
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="spotify-none" />
                  <Label
                    htmlFor="spotify-none"
                    className="text-sm text-muted-foreground"
                  >
                    No Spotify link
                  </Label>
                </div>
                {artists.map(
                  (artist, index) =>
                    artist.spotify_url && (
                      <div
                        key={artist.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={artist.spotify_url}
                          id={`spotify-${index}`}
                        />
                        <Label htmlFor={`spotify-${index}`} className="text-sm">
                          <span className="font-medium">#{index + 1}:</span>{" "}
                          {artist.spotify_url}
                        </Label>
                      </div>
                    ),
                )}
              </RadioGroup>
            </div>

            {/* SoundCloud URL */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                SoundCloud URL
              </Label>
              <RadioGroup
                value={mergeChoices.soundcloud_url || "none"}
                onValueChange={(value) =>
                  handleFieldChange(
                    "soundcloud_url",
                    value === "none" ? null : value,
                  )
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="soundcloud-none" />
                  <Label
                    htmlFor="soundcloud-none"
                    className="text-sm text-muted-foreground"
                  >
                    No SoundCloud link
                  </Label>
                </div>
                {artists.map(
                  (artist, index) =>
                    artist.soundcloud_url && (
                      <div
                        key={artist.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={artist.soundcloud_url}
                          id={`soundcloud-${index}`}
                        />
                        <Label
                          htmlFor={`soundcloud-${index}`}
                          className="text-sm"
                        >
                          <span className="font-medium">#{index + 1}:</span>{" "}
                          {artist.soundcloud_url}
                        </Label>
                      </div>
                    ),
                )}
              </RadioGroup>
            </div>

            {/* Genres */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Genres (select all that apply)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {getAllGenres().map((genreId) => (
                  <div key={genreId} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`genre-${genreId}`}
                      checked={mergeChoices.genres.includes(genreId)}
                      onChange={() => handleGenreToggle(genreId)}
                      className="rounded"
                    />
                    <Label htmlFor={`genre-${genreId}`} className="text-sm">
                      <GenreBadge genreId={genreId} />
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button onClick={handleMergePreview}>
            <Merge className="h-4 w-4 mr-1" />
            Preview Merge
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
