import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Query key factory
export const profileKeys = {
  all: ["auth", "profile"] as const,
  detail: (userId?: string) => [...profileKeys.all, userId] as const,
};

// Business logic function
async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error("Failed to fetch profile");
  }

  return data;
}

// Hook
export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId,
  });
}
