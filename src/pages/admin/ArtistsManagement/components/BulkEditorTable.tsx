import { Table, TableBody } from "@/components/ui/table";
import type { Artist } from "@/hooks/queries/artists/useArtists";
import type { ArtistChange } from "../hooks/useArtistChangeTracking";
import type { SortConfig } from "../hooks/useArtistSorting";
import { BulkEditorTableHeader } from "./BulkEditorTableHeader";
import { BulkEditorTableRow } from "./BulkEditorTableRow";

interface BulkEditorTableProps {
  artists: Artist[];
  changes: Map<string, ArtistChange[]>;
  selectedIds: Set<string>;
  sortConfig: SortConfig;
  searchTerm: string;
  onSort: (key: keyof Artist | "genres") => void;
  onSelectAll: () => void;
  onSelectArtist: (artistId: string, isSelected: boolean) => void;
  onCellChange: <T extends keyof Artist>(
    artistId: string,
    field: T,
    newValue: Artist[T],
  ) => void;
  getArtistWithChanges: (artist: Artist) => Artist;
}

export function BulkEditorTable({
  artists,
  changes,
  selectedIds,
  sortConfig,
  searchTerm,
  onSort,
  onSelectAll,
  onSelectArtist,
  onCellChange,
  getArtistWithChanges,
}: BulkEditorTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <BulkEditorTableHeader
          selectedCount={selectedIds.size}
          totalCount={artists.length}
          onSelectAll={onSelectAll}
          sortConfig={sortConfig}
          onSort={onSort}
        />
        <TableBody>
          {artists.map((artist) => {
            const artistWithChanges = getArtistWithChanges(artist);
            const hasChanges = changes.has(artist.id);

            return (
              <BulkEditorTableRow
                key={artist.id}
                artist={artist}
                artistWithChanges={artistWithChanges}
                hasChanges={hasChanges}
                isSelected={selectedIds.has(artist.id)}
                onSelectChange={(isSelected) =>
                  onSelectArtist(artist.id, isSelected)
                }
                onCellChange={(field, newValue) =>
                  onCellChange(artist.id, field, newValue)
                }
              />
            );
          })}
        </TableBody>
      </Table>

      {artists.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm
            ? "No artists found matching your search."
            : "No artists found."}
        </div>
      )}
    </div>
  );
}
