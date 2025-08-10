import { MapPin, Clock } from "lucide-react";
import { formatTimeRange } from "@/lib/timeUtils";
import { GenreBadge } from "../GenreBadge";
import { FestivalSet } from "@/services/queries";

interface SetMetadataProps {
  set: FestivalSet;
  use24Hour?: boolean;
}

export function SetMetadata({ set, use24Hour = false }: SetMetadataProps) {
  const uniqueGenres = set.artists
    ?.flatMap((a) => a.artist_music_genres || [])
    .filter(
      (genre, index, self) =>
        self.findIndex((g) => g.music_genre_id === genre.music_genre_id) ===
        index,
    );

  return (
    <div className="flex items-center flex-wrap gap-2">
      {/* Genres */}
      {uniqueGenres.length > 0 && (
        <div className="flex flex-wrap gap-1 items-center">
          {uniqueGenres?.map((genre) => (
            <GenreBadge
              key={genre.music_genre_id}
              genreId={genre.music_genre_id}
              size="sm"
            />
          ))}
        </div>
      )}

      {/* Stage and Time Information */}
      <div className="flex flex-wrap gap-2 items-center">
        {set.stages?.name && (
          <div className="flex items-center gap-1 text-purple-200 text-xs">
            <MapPin className="h-3 w-3" />
            <span>{set.stages.name}</span>
          </div>
        )}
        {formatTimeRange(set.time_start, set.time_end, use24Hour) && (
          <div className="flex items-center gap-1 text-sm text-purple-200">
            <Clock className="h-3 w-3" />
            <span>
              {formatTimeRange(set.time_start, set.time_end, use24Hour)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
