import type { Set, Artist } from "@/services/queries";

/**
 * Adapter function to convert a Set back to an Artist for backward compatibility.
 * Since each Set currently contains exactly one Artist (from migration), 
 * we can extract the Artist data and merge it with Set properties.
 */
export const setToArtist = (set: Set): Artist => {
  const firstArtist = set.artists?.[0];
  
  if (!firstArtist) {
    throw new Error(`Set ${set.id} has no artists`);
  }

  // Merge Set properties with Artist properties for backward compatibility
  return {
    ...firstArtist,
    // Override with Set-level properties where they exist
    id: set.id,
    name: set.name,
    description: set.description || firstArtist.description,
    stage: set.stages?.name || firstArtist.stage,
    time_start: set.time_start || firstArtist.time_start,
    time_end: set.time_end || firstArtist.time_end,
    created_at: set.created_at,
    updated_at: set.updated_at,
    added_by: set.created_by, // Map created_by to added_by for backward compatibility
    // Use Set votes instead of artist votes
    votes: set.votes || [],
    // Set doesn't have archived field, so derive it (sets are never archived in current system)
    archived: false,
  };
};

/**
 * Convert an array of Sets to an array of Artists for backward compatibility
 */
export const setsToArtists = (sets: Set[]): Artist[] => {
  return sets.map(setToArtist);
};