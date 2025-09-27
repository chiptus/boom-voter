import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";
import type {
  ImportConflict,
  ImportCandidate,
  ConflictResolution,
} from "@/services/csv/conflictDetector";
import { useImportConflictResolution } from "@/hooks/useImportConflictResolution";
import { ImportConflictItem } from "./ImportConflictItem/ImportConflictItem";
import { ArtistComparisonModal } from "@/pages/admin/ArtistsManagement/ArtistComparisonModal";

import { ConflictSummaryHeader } from "./ConflictSummaryHeader";
import { BulkActions } from "./BulkActions";
import { ConflictResolutionFooter } from "./ConflictResolutionFooter";

interface ImportConflictResolverProps {
  conflicts: ImportConflict[];
  candidatesWithoutConflicts: ImportCandidate[];
  onResolve: (
    resolutions: Map<number, ConflictResolution>,
    candidatesWithoutConflicts: ImportCandidate[],
  ) => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

type MergeStrategy = "smart" | "first" | "newest" | "oldest";

export function ImportConflictResolver({
  conflicts,
  candidatesWithoutConflicts,
  onResolve,
  onCancel,
  isProcessing = false,
}: ImportConflictResolverProps) {
  const {
    resolutions,
    updateResolution,
    applyBulkResolution,
    getUnresolvedCount,
    getResolutionSummary,
    openConflictComparison,
    closeConflictComparison,
    getActiveConflict,
  } = useImportConflictResolution({
    conflicts,
  });

  const unresolvedCount = getUnresolvedCount();
  const summary = getResolutionSummary();
  const activeConflict = getActiveConflict();

  function handleBulkSkip() {
    applyBulkResolution({ type: "skip" });
  }

  function handleBulkImportNew() {
    applyBulkResolution({ type: "import_new" });
  }

  function handleBulkMerge(strategy: MergeStrategy) {
    conflicts.forEach((conflict, index) => {
      if (!resolutions.has(index) && conflict.matches.length > 0) {
        updateResolution(index, {
          type: "merge",
          targetArtistId: conflict.matches[0].id,
          strategy,
        });
      }
    });
  }

  function handleResolve() {
    onResolve(resolutions, candidatesWithoutConflicts);
  }

  return (
    <>
      <Dialog open onOpenChange={onCancel}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resolve Import Conflicts
            </DialogTitle>
            <DialogDescription>
              Review and resolve conflicts before importing artists. Choose how
              to handle each duplicate.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col space-y-4 min-h-0">
            <div className="flex-shrink-0">
              <ConflictSummaryHeader
                conflictCount={conflicts.length}
                candidatesWithoutConflicts={candidatesWithoutConflicts}
                unresolvedCount={unresolvedCount}
                summary={summary}
              />
            </div>

            <div className="flex justify-between items-center flex-shrink-0">
              <h3 className="font-semibold">Conflicts ({conflicts.length})</h3>
              <BulkActions
                unresolvedCount={unresolvedCount}
                onBulkSkip={handleBulkSkip}
                onBulkImportNew={handleBulkImportNew}
                onBulkMerge={handleBulkMerge}
              />
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 border border-border rounded-md">
              <div className="space-y-4 p-4">
                {conflicts.map((conflict, index) => (
                  <ImportConflictItem
                    key={index}
                    conflict={conflict}
                    conflictIndex={index}
                    resolution={resolutions.get(index)}
                    onResolutionChange={(resolution) =>
                      updateResolution(index, resolution)
                    }
                    onViewComparison={openConflictComparison}
                  />
                ))}
              </div>
            </div>
          </div>

          <Separator />

          <ConflictResolutionFooter
            unresolvedCount={unresolvedCount}
            isProcessing={isProcessing}
            onCancel={onCancel}
            onResolve={handleResolve}
          />
        </DialogContent>
      </Dialog>

      {activeConflict && (
        <ArtistComparisonModal
          artists={[
            // Create a temporary artist object from the import candidate
            {
              id: "import-candidate",
              name: activeConflict.candidate.name,
              description: activeConflict.candidate.description || null,
              spotify_url: activeConflict.candidate.spotify_url || null,
              soundcloud_url: activeConflict.candidate.soundcloud_url || null,
              artist_music_genres:
                activeConflict.candidate.genres?.map((genreId) => ({
                  music_genre_id: genreId,
                })) || null,
              // Add required fields with default values
              added_by: "import-system",
              archived: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              slug: "",
              image_url: null,
              estimated_date: null,
              soundcloud_followers: 0,
              stage: null,
              time_end: null,
              time_start: null,
            },
            ...activeConflict.matches,
          ]}
          onClose={closeConflictComparison}
        />
      )}
    </>
  );
}
