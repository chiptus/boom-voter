
-- Create group_invites table for managing invite links
CREATE TABLE public.group_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  invite_token TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  max_uses INTEGER DEFAULT NULL, -- NULL means unlimited
  used_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Add RLS policies for group_invites
ALTER TABLE public.group_invites ENABLE ROW LEVEL SECURITY;

-- Group creators can view their group's invites
CREATE POLICY "Group creators can view their invites" 
  ON public.group_invites 
  FOR SELECT 
  USING (public.is_group_creator(group_id));

-- Group creators can create invites for their groups
CREATE POLICY "Group creators can create invites" 
  ON public.group_invites 
  FOR INSERT 
  WITH CHECK (public.is_group_creator(group_id));

-- Group creators can update their group's invites
CREATE POLICY "Group creators can update their invites" 
  ON public.group_invites 
  FOR UPDATE 
  USING (public.is_group_creator(group_id));

-- Group creators can delete their group's invites
CREATE POLICY "Group creators can delete their invites" 
  ON public.group_invites 
  FOR DELETE 
  USING (public.is_group_creator(group_id));

-- Anyone can validate invite tokens (needed for signup flow)
CREATE POLICY "Anyone can validate invite tokens" 
  ON public.group_invites 
  FOR SELECT 
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Function to validate invite token
CREATE OR REPLACE FUNCTION public.validate_invite_token(token TEXT)
RETURNS TABLE(
  invite_id UUID,
  group_id UUID,
  group_name TEXT,
  is_valid BOOLEAN,
  reason TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gi.id,
    gi.group_id,
    g.name,
    CASE 
      WHEN NOT gi.is_active THEN false
      WHEN gi.expires_at IS NOT NULL AND gi.expires_at <= now() THEN false
      WHEN gi.max_uses IS NOT NULL AND gi.used_count >= gi.max_uses THEN false
      ELSE true
    END as is_valid,
    CASE 
      WHEN NOT gi.is_active THEN 'invite_deactivated'
      WHEN gi.expires_at IS NOT NULL AND gi.expires_at <= now() THEN 'invite_expired'
      WHEN gi.max_uses IS NOT NULL AND gi.used_count >= gi.max_uses THEN 'invite_overused'
      ELSE 'valid'
    END as reason
  FROM public.group_invites gi
  JOIN public.groups g ON gi.group_id = g.id
  WHERE gi.invite_token = token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to use invite token (increment usage and add user to group)
CREATE OR REPLACE FUNCTION public.use_invite_token(token TEXT, user_id UUID)
RETURNS TABLE(
  success BOOLEAN,
  message TEXT,
  group_id UUID
) AS $$
DECLARE
  invite_record RECORD;
  validation_result RECORD;
BEGIN
  -- Validate the token first
  SELECT * INTO validation_result 
  FROM public.validate_invite_token(token) 
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Invalid invite token', NULL::UUID;
    RETURN;
  END IF;
  
  IF NOT validation_result.is_valid THEN
    RETURN QUERY SELECT false, validation_result.reason, NULL::UUID;
    RETURN;
  END IF;
  
  -- Check if user is already in the group
  IF EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = validation_result.group_id AND user_id = use_invite_token.user_id
  ) THEN
    RETURN QUERY SELECT false, 'User already in group', validation_result.group_id;
    RETURN;
  END IF;
  
  -- Add user to group
  INSERT INTO public.group_members (group_id, user_id)
  VALUES (validation_result.group_id, user_id);
  
  -- Increment usage count
  UPDATE public.group_invites 
  SET used_count = used_count + 1
  WHERE invite_token = token;
  
  RETURN QUERY SELECT true, 'Successfully joined group', validation_result.group_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
