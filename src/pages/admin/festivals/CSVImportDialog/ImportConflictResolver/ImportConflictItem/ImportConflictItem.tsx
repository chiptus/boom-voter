import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, ArrowRight } from "lucide-react";
import type {
  ImportConflict,
  ConflictResolution,
} from "@/services/csv/conflictDetector";

import { CandidateInfo } from "./CandidateInfo";
import { MatchingArtists } from "./MatchingArtists";
import { ResolutionControls } from "./ResolutionControls";

interface ImportConflictItemProps {
  conflict: ImportConflict;
  conflictIndex: number;
  resolution?: ConflictResolution;
  onResolutionChange: (resolution: ConflictResolution) => void;
  onViewComparison: (conflictIndex: number, targetArtistId?: string) => void;
}

export function ImportConflictItem({
  conflict,
  conflictIndex,
  resolution,
  onResolutionChange,
  onViewComparison,
}: ImportConflictItemProps) {
  return (
    <Card className="border-l-4 border-l-yellow-500">
      <CardContent className="p-4">
        <div className="flex items-start gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-800">
              Potential Duplicate Detected
            </h3>
            <p className="text-sm text-yellow-700">
              Found {conflict.matches.length} existing artist
              {conflict.matches.length !== 1 ? "s" : ""} that may match this
              import
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <CandidateInfo candidate={conflict.candidate} />
          </div>

          <div className="lg:col-span-1 flex items-center justify-center py-2 lg:py-0">
            <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90 lg:rotate-0" />
          </div>

          <div className="lg:col-span-1">
            <MatchingArtists
              matches={conflict.matches}
              conflictIndex={conflictIndex}
              onViewComparison={onViewComparison}
            />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <ResolutionControls
            conflict={conflict}
            conflictIndex={conflictIndex}
            resolution={resolution}
            onResolutionChange={onResolutionChange}
            onViewComparison={onViewComparison}
          />
        </div>
      </CardContent>
    </Card>
  );
}
