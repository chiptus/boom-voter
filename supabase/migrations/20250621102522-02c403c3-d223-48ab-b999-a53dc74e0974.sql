-- Fix ambiguous column references in use_invite_token function
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
  
  -- Check if user is already in the group (fix ambiguous column references)
  IF EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = validation_result.group_id AND gm.user_id = use_invite_token.user_id
  ) THEN
    RETURN QUERY SELECT false, 'User already in group', validation_result.group_id;
    RETURN;
  END IF;
  
  -- Add user to group
  INSERT INTO public.group_members (group_id, user_id)
  VALUES (validation_result.group_id, use_invite_token.user_id);
  
  -- Increment usage count
  UPDATE public.group_invites 
  SET used_count = used_count + 1
  WHERE invite_token = token;
  
  RETURN QUERY SELECT true, 'Successfully joined group', validation_result.group_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;