import { Button } from "@/components/ui/button";
import { Users, Eye } from "lucide-react";
import type { Artist } from "@/hooks/queries/artists/useArtists";

interface MatchingArtistsProps {
  matches: Artist[];
  conflictIndex: number;
  onViewComparison: (conflictIndex: number, artistId?: string) => void;
}

export function MatchingArtists({
  matches,
  conflictIndex,
  onViewComparison,
}: MatchingArtistsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-orange-600" />
        <span className="font-medium">
          {matches.length} Existing Match{matches.length !== 1 ? "es" : ""}
        </span>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {matches.map((artist) => (
          <div
            key={artist.id}
            className="p-2 border rounded-md bg-orange-50 flex-shrink-0"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium truncate mr-2">{artist.name}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewComparison(conflictIndex, artist.id)}
                className="flex-shrink-0"
              >
                <Eye className="h-3 w-3 mr-1" />
                Compare
              </Button>
            </div>
            {artist.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {artist.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
