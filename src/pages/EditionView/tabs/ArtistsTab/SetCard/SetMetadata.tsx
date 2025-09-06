import { Clock } from "lucide-react";
import { formatTimeRange } from "@/lib/timeUtils";
import { GenreBadge } from "@/components/GenreBadge";
import { StageBadge } from "@/components/StageBadge";
import { useFestivalSet } from "../FestivalSetContext";
import { useStageQuery } from "@/hooks/queries/stages/useStageQuery";

export function SetMetadata() {
  const { set, use24Hour } = useFestivalSet();
  const stageQuery = useStageQuery(set?.stage_id);
  const uniqueGenres = set.artists
    ?.flatMap((a) => a.artist_music_genres || [])
    .filter(
      (genre, index, self) =>
        self.findIndex((g) => g.music_genre_id === genre.music_genre_id) ===
        index,
    );

  const timeRangeFormatted = formatTimeRange(
    set.time_start,
    set.time_end,
    use24Hour,
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
        {stageQuery.data && (
          <StageBadge
            stageName={stageQuery.data.name}
            stageColor={stageQuery.data.color || undefined}
            size="sm"
          />
        )}
        {timeRangeFormatted && (
          <div className="flex items-center gap-1 text-sm text-purple-200">
            <Clock className="h-3 w-3" />
            <span>{timeRangeFormatted}</span>
          </div>
        )}
      </div>
    </div>
  );
}
