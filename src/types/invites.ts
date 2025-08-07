export interface GroupInvite {
  id: string;
  group_id: string;
  invite_token: string;
  created_by: string;
  created_at: string;
  expires_at?: string;
  max_uses?: number;
  used_count: number;
  is_active: boolean;
}

export interface InviteValidation {
  invite_id: string;
  group_id: string;
  group_name: string;
  is_valid: boolean;
  reason: string;
}

export interface InviteUsageResult {
  success: boolean;
  message: string;
  group_id: string;
}
