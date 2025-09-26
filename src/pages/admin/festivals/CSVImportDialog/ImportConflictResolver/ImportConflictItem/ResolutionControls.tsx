import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye } from "lucide-react";
import type {
  ConflictResolution,
  ImportConflict,
} from "@/services/csv/conflictDetector";

interface ResolutionControlsProps {
  conflict: ImportConflict;
  conflictIndex: number;
  resolution?: ConflictResolution;
  onResolutionChange: (resolution: ConflictResolution) => void;
  onViewComparison: (conflictIndex: number) => void;
}

export function ResolutionControls({
  conflict,
  conflictIndex,
  resolution,
  onResolutionChange,
  onViewComparison,
}: ResolutionControlsProps) {
  const [renameValue, setRenameValue] = useState(conflict.candidate.name);

  // Set default resolution to merge when component mounts
  useEffect(() => {
    if (!resolution && conflict.matches.length > 0) {
      onResolutionChange({
        type: "merge",
        targetArtistId: conflict.matches[0].id,
      });
    }
  }, [resolution, conflict.matches, onResolutionChange]);

  function handleResolutionTypeChange(type: string) {
    switch (type) {
      case "skip":
        onResolutionChange({ type: "skip" });
        break;
      case "import_new":
        onResolutionChange({ type: "import_new" });
        break;
      case "merge":
        if (conflict.matches.length === 1) {
          onResolutionChange({
            type: "merge",
            targetArtistId: conflict.matches[0].id,
          });
        }
        break;
    }
  }

  function handleMergeTargetChange(artistId: string) {
    onResolutionChange({ type: "merge", targetArtistId: artistId });
  }

  function handleRenameChange(rename: string) {
    setRenameValue(rename);
    onResolutionChange({ type: "import_new", rename });
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Resolution</Label>
      <Select
        value={resolution?.type || "merge"}
        onValueChange={handleResolutionTypeChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choose action..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="skip">Skip - Keep existing artist(s)</SelectItem>
          <SelectItem value="import_new">Import as new artist</SelectItem>
          <SelectItem value="merge">Merge with existing</SelectItem>
        </SelectContent>
      </Select>

      {resolution?.type === "import_new" && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Artist name (rename if needed):
          </Label>
          <Input
            value={renameValue}
            onChange={(e) => handleRenameChange(e.target.value)}
            placeholder="Artist name"
          />
        </div>
      )}

      {resolution?.type === "merge" && conflict.matches.length > 1 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Merge into which artist:
          </Label>
          <Select
            value={resolution.type === "merge" ? resolution.targetArtistId : ""}
            onValueChange={handleMergeTargetChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select target artist..." />
            </SelectTrigger>
            <SelectContent>
              {conflict.matches.map((artist) => (
                <SelectItem key={artist.id} value={artist.id}>
                  {artist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {resolution?.type === "merge" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewComparison(conflictIndex)}
          className="w-full"
        >
          <Eye className="h-3 w-3 mr-1" />
          Preview Merge
        </Button>
      )}
    </div>
  );
}
