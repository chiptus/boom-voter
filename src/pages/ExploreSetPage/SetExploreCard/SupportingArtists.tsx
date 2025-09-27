import { Badge } from "@/components/ui/badge";

interface Artist {
  id: string;
  name: string;
}

interface SupportingArtistsProps {
  artists: Artist[];
}

export function SupportingArtists({ artists }: SupportingArtistsProps) {
  if (artists.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-center text-sm text-gray-400">
        {artists.length === 1 ? "With" : "With"}
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {artists.slice(0, 3).map((artist) => (
          <Badge
            key={artist.id}
            variant="outline"
            className="bg-white/10 text-white border-white/20 text-xs"
          >
            {artist.name}
          </Badge>
        ))}
        {artists.length > 3 && (
          <Badge
            variant="outline"
            className="bg-white/10 text-white border-white/20 text-xs"
          >
            +{artists.length - 3} more
          </Badge>
        )}
      </div>
    </div>
  );
}
