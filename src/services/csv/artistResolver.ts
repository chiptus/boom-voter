import { supabase } from "@/integrations/supabase/client";
import { generateSlug } from "@/lib/slug";
import type {
  ImportCandidate,
  ConflictResolution,
  ImportConflict,
} from "./conflictDetector";

export async function createArtistFromResolution(
  resolution: ConflictResolution,
  candidate: ImportCandidate,
  userId: string,
): Promise<string | null> {
  if (resolution.type === "skip") {
    return null;
  }

  if (resolution.type === "merge") {
    return resolution.targetArtistId;
  }

  if (resolution.type === "import_new") {
    const artistName = resolution.rename || candidate.name;
    const { data: newArtist, error } = await supabase
      .from("artists")
      .insert({
        name: artistName,
        slug: generateSlug(artistName),
        added_by: userId,
        description: candidate.description || null,
        spotify_url: candidate.spotify_url || null,
        soundcloud_url: candidate.soundcloud_url || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error(`Failed to create artist "${artistName}":`, error);
      return null;
    }

    return newArtist.id;
  }

  return null;
}

export async function createArtistIdMap(
  conflicts: ImportConflict[],
  candidatesWithoutConflicts: ImportCandidate[],
  resolutions: Map<number, ConflictResolution>,
  userId: string,
): Promise<Map<string, string>> {
  const artistIdMap = new Map<string, string>();

  // Process conflict resolutions (index matches conflicts array)
  for (let i = 0; i < conflicts.length; i++) {
    const conflict = conflicts[i];
    const resolution = resolutions.get(i);

    if (resolution) {
      const artistId = await createArtistFromResolution(
        resolution,
        conflict.candidate,
        userId,
      );
      if (artistId) {
        artistIdMap.set(conflict.candidate.name, artistId);
      }
    }
  }

  // Process candidates without conflicts (create new artists)
  for (const candidate of candidatesWithoutConflicts) {
    const artistId = await createArtistFromResolution(
      { type: "import_new" },
      candidate,
      userId,
    );
    if (artistId) {
      artistIdMap.set(candidate.name, artistId);
    }
  }

  console.log("Artist ID mapping:", Object.fromEntries(artistIdMap));
  return artistIdMap;
}
