import type { Database } from "@/integrations/supabase/types";

export type Group = Database["public"]["Tables"]["groups"]["Row"] & {
  member_count?: number;
  is_creator?: boolean;
  archived?: boolean;
};

export type GroupMember = Database["public"]["Tables"]["group_members"]["Row"] & {
  profiles?: {
    username?: string;
    email?: string;
  };
};