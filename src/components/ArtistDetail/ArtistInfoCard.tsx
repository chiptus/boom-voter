import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Artist } from "@/hooks/queries/useArtistsQuery";
import { ExternalLink, Music, Play, Clock, MapPin } from "lucide-react";
import { formatTimeRange } from "@/lib/timeUtils";
import { GenreBadge } from "../Index/GenreBadge";

interface ArtistInfoCardProps {
  artist: Artist;
  use24Hour?: boolean;
}

export function ArtistInfoCard({
  artist,
  use24Hour = false,
}: ArtistInfoCardProps) {
  return (
    <div className="lg:col-span-2">
      <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold text-white mb-2">
                {artist.name}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mb-4">
                {artist.artist_music_genres?.map((genre) => (
                  <GenreBadge
                    key={genre.music_genre_id}
                    genreId={genre.music_genre_id}
                  />
                ))}
              </div>

              {/* Performance Information */}
              <div className="flex flex-wrap gap-4 mb-4 text-purple-200">
                {artist.stage && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{artist.stage}</span>
                  </div>
                )}
                {formatTimeRange(
                  artist.time_start,
                  artist.time_end,
                  use24Hour,
                ) && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {formatTimeRange(
                        artist.time_start,
                        artist.time_end,
                        use24Hour,
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {artist.description && (
            <CardDescription className="text-purple-200 text-lg leading-relaxed">
              {artist.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {/* External Links */}
          {(artist.spotify_url || artist.soundcloud_url) && (
            <div className="flex flex-wrap gap-4">
              {artist.spotify_url && (
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <a
                    href={artist.spotify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Open in Spotify
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              )}
              {artist.soundcloud_url && (
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                  <a
                    href={artist.soundcloud_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Music className="h-4 w-4 mr-2" />
                    Open in SoundCloud
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
