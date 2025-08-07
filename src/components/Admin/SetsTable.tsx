import { useStagesQuery } from "@/hooks/queries/useStagesQuery";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";
import { formatTimeRange } from "@/lib/timeUtils";
import type { FestivalSet } from "@/services/queries";

interface SetsTableProps {
  sets: FestivalSet[];
  onEdit: (set: FestivalSet) => void;
  onDelete: (set: FestivalSet) => void;
}

export function SetsTable({ sets, onEdit, onDelete }: SetsTableProps) {
  const { data: stages = [] } = useStagesQuery();

  const getStageName = (stageId: string | null) => {
    if (!stageId) return "—";
    return stages.find((s) => s.id === stageId)?.name || "Unknown Stage";
  };

  if (sets.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="text-center py-8 text-muted-foreground">
          No sets found for the selected edition.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Set Name</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Artists</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sets.map((set) => (
            <TableRow key={set.id}>
              <TableCell className="font-medium">{set.name}</TableCell>
              <TableCell>{getStageName(set.stage_id)}</TableCell>
              <TableCell>
                {set.time_start && set.time_end
                  ? formatTimeRange(set.time_start, set.time_end, true)
                  : "—"}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {set.artists?.slice(0, 2).map((artist) => (
                    <Badge
                      key={artist.id}
                      variant="outline"
                      className="text-xs"
                    >
                      {artist.name}
                    </Badge>
                  ))}
                  {(set.artists?.length || 0) > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{(set.artists?.length || 0) - 2} more
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(set)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(set)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
