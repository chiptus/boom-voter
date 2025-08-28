import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GenreMultiSelect } from "../GenreMultiSelect";
import { useGenresQuery } from "@/hooks/queries/genres/useGenres";
import { Check, X } from "lucide-react";

interface GenresCellProps {
  value: Array<{ music_genre_id: string }> | null;
  onSave: (value: Array<{ music_genre_id: string }>) => void;
}

export function GenresCell({ value, onSave }: GenresCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [genreIds, setGenreIds] = useState<string[]>([]);

  const { data: genres = [] } = useGenresQuery();

  function handleEdit() {
    const currentGenreIds = value?.map((g: any) => g.music_genre_id) || [];
    setGenreIds(currentGenreIds);
    setIsEditing(true);
  }

  function handleSave() {
    const genreObjects = genreIds.map((id) => ({ music_genre_id: id }));
    onSave(genreObjects);
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
    setGenreIds([]);
  }

  if (isEditing) {
    return (
      <div className="min-w-32">
        <div className="space-y-2">
          <GenreMultiSelect
            genres={genres}
            value={genreIds}
            onValueChange={setGenreIds}
            placeholder="Select genres..."
          />
          <div className="flex gap-1">
            <Button size="sm" onClick={handleSave} className="h-6 px-2">
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              className="h-6 px-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const artistGenres = value || [];
  const genreNames = artistGenres
    .map((ag: any) => {
      const genre = genres.find((g) => g.id === ag.music_genre_id);
      return genre?.name;
    })
    .filter(Boolean);

  return (
    <div
      className="cursor-pointer hover:bg-gray-50 p-1 rounded min-h-6 text-sm"
      onClick={handleEdit}
      title="Click to edit"
    >
      {genreNames.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {genreNames.map((name, idx) => (
            <span
              key={idx}
              className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
            >
              {name}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-muted-foreground italic">
          Click to add genres...
        </span>
      )}
    </div>
  );
}
