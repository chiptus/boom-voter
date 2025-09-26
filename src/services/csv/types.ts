export interface ImportResult {
  success: boolean;
  message: string;
  inserted?: number;
  updated?: number;
  errors?: string[];
}

import type { ImportConflict } from "./conflictDetector";

export interface ConflictAwareImportResult extends ImportResult {
  conflicts?: ImportConflict[];
  requiresConflictResolution?: boolean;
}
