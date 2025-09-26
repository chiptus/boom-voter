import { useState, useCallback } from "react";
import type {
  ImportConflict,
  ConflictResolution,
} from "@/services/csv/conflictDetector";

interface UseImportConflictResolutionProps {
  conflicts: ImportConflict[];
  onResolutionsChange?: (resolutions: Map<number, ConflictResolution>) => void;
}

export function useImportConflictResolution({
  conflicts,
  onResolutionsChange,
}: UseImportConflictResolutionProps) {
  const [resolutions, setResolutions] = useState<
    Map<number, ConflictResolution>
  >(new Map());
  const [activeConflictIndex, setActiveConflictIndex] = useState<number | null>(
    null,
  );

  const updateResolution = useCallback(
    (conflictIndex: number, resolution: ConflictResolution) => {
      setResolutions((prev) => {
        const newResolutions = new Map(prev);
        newResolutions.set(conflictIndex, resolution);
        onResolutionsChange?.(newResolutions);
        return newResolutions;
      });
    },
    [onResolutionsChange],
  );

  const applyBulkResolution = useCallback(
    (resolution: ConflictResolution) => {
      setResolutions((prev) => {
        const newResolutions = new Map(prev);
        conflicts.forEach((_, index) => {
          if (!newResolutions.has(index)) {
            newResolutions.set(index, resolution);
          }
        });
        onResolutionsChange?.(newResolutions);
        return newResolutions;
      });
    },
    [conflicts, onResolutionsChange],
  );

  const getUnresolvedCount = useCallback(() => {
    return conflicts.length - resolutions.size;
  }, [conflicts.length, resolutions.size]);

  const getResolutionSummary = useCallback(() => {
    const summary = {
      skip: 0,
      import_new: 0,
      merge: 0,
    };

    resolutions.forEach((resolution) => {
      summary[resolution.type]++;
    });

    return summary;
  }, [resolutions]);

  const openConflictComparison = useCallback(
    (conflictIndex: number, _targetArtistId?: string) => {
      setActiveConflictIndex(conflictIndex);
    },
    [],
  );

  const closeConflictComparison = useCallback(() => {
    setActiveConflictIndex(null);
  }, []);

  const getActiveConflict = useCallback(() => {
    if (activeConflictIndex === null) return null;
    return conflicts[activeConflictIndex] || null;
  }, [conflicts, activeConflictIndex]);

  return {
    resolutions,
    activeConflictIndex,
    updateResolution,
    applyBulkResolution,
    getUnresolvedCount,
    getResolutionSummary,
    openConflictComparison,
    closeConflictComparison,
    getActiveConflict,
  };
}
