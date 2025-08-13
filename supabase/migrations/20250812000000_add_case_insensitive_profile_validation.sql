-- Add case-insensitive uniqueness validation for profiles
-- This ensures username and email are unique regardless of case

-- Function to check if username exists (case insensitive)
CREATE OR REPLACE FUNCTION public.check_username_exists(check_username TEXT, exclude_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
DECLARE
  exists_count INTEGER;
BEGIN
  -- Count users with same username (case insensitive), excluding current user if provided
  SELECT COUNT(*) INTO exists_count
  FROM public.profiles
  WHERE LOWER(username) = LOWER(check_username)
    AND (exclude_user_id IS NULL OR id != exclude_user_id);
  
  RETURN exists_count > 0;
END;
$function$;

-- Note: Email validation removed as Supabase Auth handles email case-insensitivity

-- Function to validate profile updates (username only)
CREATE OR REPLACE FUNCTION public.validate_profile_update(
  user_id UUID,
  new_username TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  -- Check username uniqueness only if provided and not empty
  IF new_username IS NOT NULL AND TRIM(new_username) != '' AND public.check_username_exists(new_username, user_id) THEN
    RETURN 'Username already exists';
  END IF;
  
  RETURN NULL; -- No conflicts found
END;
$function$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.check_username_exists(TEXT, UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.validate_profile_update(UUID, TEXT) TO authenticated, anon;

-- Update the handle_new_user function to validate username uniqueness only
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  proposed_username TEXT;
BEGIN
  proposed_username := NEW.raw_user_meta_data ->> 'username';
  
  -- Check username uniqueness only if username is provided (not null and not empty)
  IF proposed_username IS NOT NULL AND TRIM(proposed_username) != '' AND public.check_username_exists(proposed_username, NULL::UUID) THEN
    RAISE EXCEPTION 'Username already exists';
  END IF;
  
  -- Insert the profile (username can be null for initial login)
  INSERT INTO public.profiles (id, username, email)
  VALUES (NEW.id, CASE WHEN TRIM(COALESCE(proposed_username, '')) = '' THEN NULL ELSE proposed_username END, NEW.email);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;