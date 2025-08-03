-- Fix search_path security warnings for all functions

-- Update is_group_member function
CREATE OR REPLACE FUNCTION public.is_group_member(group_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = group_id_param 
    AND user_id = auth.uid()
  );
END;
$function$;

-- Update get_user_id_by_email function
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(user_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = user_email
  LIMIT 1;
  
  RETURN user_id;
END;
$function$;

-- Update is_group_creator function
CREATE OR REPLACE FUNCTION public.is_group_creator(group_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.groups 
    WHERE id = group_id_param 
    AND created_by = auth.uid()
  );
END;
$function$;

-- Update validate_invite_token function
CREATE OR REPLACE FUNCTION public.validate_invite_token(token text)
RETURNS TABLE(invite_id uuid, group_id uuid, group_name text, is_valid boolean, reason text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER SET search_path = ''
AS $function$
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
$function$;

-- Update use_invite_token function
CREATE OR REPLACE FUNCTION public.use_invite_token(token text, user_id uuid)
RETURNS TABLE(success boolean, message text, group_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
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
$function$;

-- Update users_share_group function
CREATE OR REPLACE FUNCTION public.users_share_group(user1_id uuid, user2_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.group_members gm1
    JOIN public.group_members gm2 ON gm1.group_id = gm2.group_id
    WHERE gm1.user_id = user1_id 
    AND gm2.user_id = user2_id
  );
$function$;

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (new.id, new.raw_user_meta_data ->> 'username', new.email);
  RETURN new;
END;
$function$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;