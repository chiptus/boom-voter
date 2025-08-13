import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Music, Play } from "lucide-react";
import { Artist } from "@/hooks/queries/useArtistsQuery";
import { GenreBadge } from "../Index/GenreBadge";
import { ArtistImageLoader } from "../ArtistImageLoader";

interface IndividualArtistCardProps {
  artist: Artist;
  showFullDetails?: boolean;
}

export function IndividualArtistCard({
  artist,
  showFullDetails = false,
}: IndividualArtistCardProps) {
  return (
    <Card className="bg-white/5 backdrop-blur-sm border-purple-400/20">
      {/* Artist Image */}
      <div className="aspect-square overflow-hidden rounded-t-lg">
        <ArtistImageLoader
          src={artist.image_url}
          alt={artist.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-white">
          {artist.name}
        </CardTitle>

        {/* Genres */}
        <div className="flex flex-wrap gap-1">
          {artist.artist_music_genres
            ?.slice(0, showFullDetails ? undefined : 2)
            .map((genre) => (
              <GenreBadge
                key={genre.music_genre_id}
                genreId={genre.music_genre_id}
                size="sm"
              />
            ))}
          {!showFullDetails &&
            artist.artist_music_genres &&
            artist.artist_music_genres.length > 2 && (
              <Badge
                variant="outline"
                className="text-xs border-purple-400/50 text-purple-300"
              >
                +{artist.artist_music_genres.length - 2}
              </Badge>
            )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Description (only if showFullDetails) */}
        {showFullDetails && artist.description && (
          <p className="text-purple-200 text-sm mb-3 line-clamp-3">
            {artist.description}
          </p>
        )}

        {/* External Links */}
        <div className="flex flex-wrap gap-2">
          {artist.spotify_url && (
            <Button
              asChild
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-xs"
            >
              <a
                href={artist.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play className="h-3 w-3 mr-1" />
                Spotify
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          )}
          {artist.soundcloud_url && (
            <Button
              asChild
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-xs"
            >
              <a
                href={artist.soundcloud_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Music className="h-3 w-3 mr-1" />
                SoundCloud
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
