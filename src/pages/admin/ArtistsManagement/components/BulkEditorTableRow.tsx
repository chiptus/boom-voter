import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import type { Artist } from "@/hooks/queries/artists/useArtists";
import { TextCell } from "../BulkEditor/TextCell";
import { TextareaCell } from "../BulkEditor/TextareaCell";
import { UrlCell } from "../BulkEditor/UrlCell";
import { GenresCell } from "../BulkEditor/GenresCell";

interface BulkEditorTableRowProps {
  artist: Artist;
  artistWithChanges: Artist;
  hasChanges: boolean;
  isSelected: boolean;
  onSelectChange: (isSelected: boolean) => void;
  onCellChange: <T extends keyof Artist>(field: T, newValue: Artist[T]) => void;
}

export function BulkEditorTableRow({
  artist,
  artistWithChanges,
  hasChanges,
  isSelected,
  onSelectChange,
  onCellChange,
}: BulkEditorTableRowProps) {
  return (
    <TableRow
      className={`${hasChanges ? "bg-orange-50 border-l-4 border-l-orange-400" : ""}`}
    >
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelectChange(!!checked)}
        />
      </TableCell>
      <TableCell>
        <TextCell
          value={artistWithChanges.name}
          onSave={(value) => onCellChange("name", value || "")}
          required
        />
      </TableCell>
      <TableCell>
        <TextareaCell
          value={artistWithChanges.description}
          onSave={(value) => onCellChange("description", value)}
        />
      </TableCell>
      <TableCell>
        <GenresCell
          value={artistWithChanges.artist_music_genres}
          onSave={(value) => onCellChange("artist_music_genres", value)}
        />
      </TableCell>
      <TableCell>
        <UrlCell
          value={artistWithChanges.spotify_url}
          placeholder="https://open.spotify.com/artist/..."
          onSave={(value) => onCellChange("spotify_url", value)}
        />
      </TableCell>
      <TableCell>
        <UrlCell
          value={artistWithChanges.soundcloud_url}
          placeholder="https://soundcloud.com/..."
          onSave={(value) => onCellChange("soundcloud_url", value)}
        />
      </TableCell>
      <TableCell>
        <span className="text-xs text-muted-foreground">
          {new Date(artist.created_at).toLocaleDateString()}
        </span>
      </TableCell>
    </TableRow>
  );
}
