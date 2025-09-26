import type { Artist } from "@/hooks/queries/artists/useArtists";

export interface ImportCandidate {
  name: string;
  description?: string;
  spotify_url?: string;
  soundcloud_url?: string;
  genres?: string[];
}

export interface ImportConflict {
  candidate: ImportCandidate;
  matches: Artist[];
  resolution?: ConflictResolution;
}

export type ConflictResolution =
  | { type: "skip" }
  | { type: "import_new"; rename?: string }
  | { type: "merge"; targetArtistId: string; strategy?: string };

export function detectImportConflicts(
  candidates: ImportCandidate[],
  existingArtists: Artist[],
): ImportConflict[] {
  const conflicts: ImportConflict[] = [];

  for (const candidate of candidates) {
    const matches = findPotentialMatches(candidate, existingArtists);
    if (matches.length > 0) {
      conflicts.push({
        candidate,
        matches,
      });
    }
  }

  return conflicts;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  const len1 = str1.length;
  const len2 = str2.length;

  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }

  return matrix[len2][len1];
}

function calculateSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1;

  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - distance / maxLength;
}

function findPotentialMatches(
  candidate: ImportCandidate,
  existingArtists: Artist[],
): Artist[] {
  const matches: Artist[] = [];

  for (const artist of existingArtists) {
    let isMatch = false;

    // Exact name match (case-insensitive)
    if (artist.name.toLowerCase() === candidate.name.toLowerCase()) {
      isMatch = true;
    }

    // Name similarity > 85%
    else if (calculateSimilarity(artist.name, candidate.name) > 0.85) {
      isMatch = true;
    }

    // URL matches
    if (candidate.spotify_url && artist.spotify_url === candidate.spotify_url) {
      isMatch = true;
    }

    if (
      candidate.soundcloud_url &&
      artist.soundcloud_url === candidate.soundcloud_url
    ) {
      isMatch = true;
    }

    if (isMatch) {
      matches.push(artist);
    }
  }

  return matches;
}
