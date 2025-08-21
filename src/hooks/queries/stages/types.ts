import type { Database } from "@/integrations/supabase/types";

export type Stage = Database["public"]["Tables"]["stages"]["Row"];

// Query key factory
export const stagesKeys = {
  all: ["stages"] as const,
  byEdition: (editionId: string) => ["stages", { editionId }] as const,
};
