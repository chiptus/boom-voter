import { Badge } from "@/components/ui/badge";
import { useGenres } from "@/hooks/queries/useGenresQuery";

interface GenreBadgeProps {
  genreId: string;
}

export function GenreBadge({ genreId }: GenreBadgeProps) {
  const { genres, loading, error } = useGenres();

  if (loading || error) return null;

  const genre = genres.find((g) => g.id === genreId);
  if (!genre) return null;

  return (
    <Badge
      variant="secondary"
      className="bg-purple-600/50 text-purple-100 mb-2"
    >
      {genre.name}
    </Badge>
  );
}
