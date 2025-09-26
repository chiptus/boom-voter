import { supabase } from "@/integrations/supabase/client";
import { generateSlug } from "@/lib/slug";
import type { StageImportData } from "./csvParser";
import type { ImportResult } from "./types";

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
