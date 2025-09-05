import { supabase } from "@/integrations/supabase/client";
import { generateSlug } from "@/lib/slug";

export interface StageImportData {
  name: string;
}

export interface SetImportData {
  name?: string;
  stage_name: string;
  artist_names: string;
  time_start?: string;
  time_end?: string;
  description?: string;
}

export interface ImportResult {
  success: boolean;
  message: string;
  inserted?: number;
  updated?: number;
  errors?: string[];
}

export function parseCSV(csvContent: string): string[][] {
  const lines = csvContent.trim().split("\n");
  return lines.map((line) => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result.map((field) => field.replace(/^"|"$/g, ""));
  });
}

export function parseStagesCSV(csvContent: string): StageImportData[] {
  const lines = parseCSV(csvContent);
  const headers = lines[0] as Array<keyof StageImportData>;

  return lines.slice(1).map((line) => {
    const stage: Partial<StageImportData> = {};
    headers.forEach((header, index) => {
      stage[header] = line[index] || "";
    });
    return stage as StageImportData;
  });
}

export function parseSetsCSV(csvContent: string): SetImportData[] {
  const lines = parseCSV(csvContent);
  const headers = lines[0];

  return lines.slice(1).map((line) => {
    const set: Partial<SetImportData> = {};
    headers.forEach((header, index) => {
      const value = line[index] || "";
      if (header === "time_start" || header === "time_end") {
        set[header as keyof SetImportData] = value || undefined;
      } else if (header === "name") {
        // Optional name - only set if not empty
        set[header as keyof SetImportData] = value || undefined;
      } else {
        set[header as keyof SetImportData] = value;
      }
    });
    return set as SetImportData;
  });
}

function generateSetNameFromArtists(artistNames: string[]): string {
  if (artistNames.length === 0) return "Unnamed Set";
  if (artistNames.length === 1) return artistNames[0];
  if (artistNames.length === 2) return `${artistNames[0]} & ${artistNames[1]}`;
  return `${artistNames[0]} & ${artistNames.length - 1} others`;
}

export async function importStages(
  stages: StageImportData[],
  editionId: string,
  onProgress?: (completed: number, total: number) => void,
): Promise<ImportResult> {
  try {
    const stageInserts = stages.map((stage) => ({
      name: stage.name,
      slug: generateSlug(stage.name),
      festival_edition_id: editionId,
      archived: false,
    }));

    const { data, error } = await supabase
      .from("stages")
      .upsert(stageInserts, {
        onConflict: "name,festival_edition_id",
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      return {
        success: false,
        message: `Failed to import stages: ${error.message}`,
        errors: [error.message],
      };
    }

    // Report completion
    onProgress?.(stages.length, stages.length);

    return {
      success: true,
      message: `Successfully imported ${data?.length || 0} stages`,
      inserted: data?.length || 0,
    };
  } catch (error) {
    return {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      errors: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}

export async function importSets(
  sets: SetImportData[],
  editionId: string,
  onProgress?: (completed: number, total: number) => void,
): Promise<ImportResult> {
  try {
    const currentUser = await supabase.auth.getUser();
    const userId = currentUser.data.user?.id || "";

    const results = [];
    const errors = [];
    const total = sets.length;

    for (let i = 0; i < sets.length; i++) {
      const set = sets[i];
      try {
        // Parse artist names
        const artistNames = set.artist_names
          .split(",")
          .map((name) => name.trim())
          .filter((name) => name.length > 0);

        if (artistNames.length === 0) {
          errors.push(
            `Set "${set.name || "Unnamed"}" has no artists specified`,
          );
          continue;
        }

        // Find or create artists
        const artistIds: string[] = [];
        for (const artistName of artistNames) {
          // Try to find existing artist
          const { data: existingArtist } = await supabase
            .from("artists")
            .select("id")
            .eq("name", artistName)
            .limit(1);

          let artistId = "";
          if (!existingArtist || existingArtist.length === 0) {
            // Create new artist if not found
            const { data: newArtist, error: createError } = await supabase
              .from("artists")
              .insert({
                name: artistName,
                slug: generateSlug(artistName),
                added_by: userId,
              })
              .select("id")
              .single();

            if (createError) {
              errors.push(
                `Failed to create artist "${artistName}": ${createError.message}`,
              );
              continue;
            }
            artistId = newArtist.id;
          } else {
            artistId = existingArtist[0].id;
          }

          artistIds.push(artistId);
        }

        // Generate set name if not provided
        const setName = set.name || generateSetNameFromArtists(artistNames);

        // Find stage
        const { data: stage, error: stageError } = await supabase
          .from("stages")
          .select("id")
          .eq("name", set.stage_name)
          .eq("festival_edition_id", editionId)
          .single();

        if (stageError || !stage) {
          errors.push(
            `Stage "${set.stage_name}" not found for set "${setName}"`,
          );
          continue;
        }

        // Check if set already exists
        const { data: existingSet } = await supabase
          .from("sets")
          .select("id")
          .eq("name", setName)
          .eq("stage_id", stage.id)
          .eq("festival_edition_id", editionId)
          .limit(1);

        let createdSetId = "";
        let setError;

        if (existingSet && existingSet.length === 1) {
          createdSetId = existingSet[0].id;
          // Update existing set
          const { error } = await supabase
            .from("sets")
            .update({
              time_start: set.time_start || null,
              time_end: set.time_end || null,
              description: set.description || null,
              archived: false,
            })
            .eq("id", createdSetId)
            .select("id")
            .single();

          setError = error;
        } else {
          // Create new set
          const { data, error } = await supabase
            .from("sets")
            .insert({
              name: setName,
              slug: generateSlug(setName),
              stage_id: stage.id,
              festival_edition_id: editionId,
              time_start: set.time_start || null,
              time_end: set.time_end || null,
              description: set.description || null,
              archived: false,
              created_by: userId,
            })
            .select("id")
            .single();

          createdSetId = data?.id || "";
          setError = error;
        }

        if (setError) {
          errors.push(`Failed to create set "${setName}": ${setError.message}`);
          continue;
        }

        if (!createdSetId) {
          errors.push(`Failed to create set "${setName}": No Id`);
          continue;
        }

        // Link artists to set
        for (const artistId of artistIds) {
          await supabase.from("set_artists").upsert(
            {
              set_id: createdSetId,
              artist_id: artistId,
            },
            {
              onConflict: "set_id,artist_id",
              ignoreDuplicates: true,
            },
          );
        }

        results.push(setName);
      } catch (error) {
        errors.push(
          `Error processing set: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }

      // Report progress
      onProgress?.(i + 1, total);
    }

    if (errors.length > 0 && results.length === 0) {
      return {
        success: false,
        message: `Failed to import sets`,
        errors,
      };
    }

    return {
      success: true,
      message: `Successfully imported ${results.length} sets${errors.length > 0 ? ` (${errors.length} errors)` : ""}`,
      inserted: results.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    return {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      errors: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}
