import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, X } from "lucide-react";
import type { ArtistChange } from "../hooks/useArtistChangeTracking";
import type { Artist } from "@/hooks/queries/artists/useArtists";

interface ChangePreviewDialogProps {
  changes: Map<string, ArtistChange[]>;
  artists: Artist[];
  onClose: () => void;
  onConfirm: () => void;
}

export function ChangePreviewDialog({
  changes,
  artists,
  onClose,
  onConfirm,
}: ChangePreviewDialogProps) {
  const totalChanges = Array.from(changes.values()).reduce(
    (sum, artistChanges) => sum + artistChanges.length,
    0,
  );

  const artistsWithChanges = Array.from(changes.keys())
    .map((artistId) => {
      const artist = artists.find((a) => a.id === artistId);
      const artistChanges = changes.get(artistId) || [];
      return { artist, changes: artistChanges };
    })
    .filter((item) => item.artist);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Confirm Changes</DialogTitle>
          <DialogDescription>
            Review {totalChanges} changes across {artistsWithChanges.length}{" "}
            artists before saving.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {artistsWithChanges.map(({ artist, changes: artistChanges }) => (
            <div key={artist?.id} className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">{artist?.name}</h4>
              <div className="space-y-1">
                {artistChanges.map((change, index) => (
                  <div key={`${change.field}-${index}`} className="text-sm">
                    <span className="font-medium capitalize">
                      {String(change.field).replace("_", " ")}:
                    </span>
                    <div className="ml-4 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <Badge variant="outline" className="mr-1">
                          Old
                        </Badge>
                        <span className="text-muted-foreground">
                          {String(change.oldValue) || "(empty)"}
                        </span>
                      </div>
                      <div>
                        <Badge variant="default" className="mr-1">
                          New
                        </Badge>
                        <span>{String(change.newValue) || "(empty)"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-1" />
            Save {totalChanges} Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
