-- Update get_user_id_by_email function to be case insensitive
-- This ensures consistent behavior across the entire user lookup system

CREATE OR REPLACE FUNCTION public.get_user_id_by_email(user_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
DECLARE
  user_id UUID;
BEGIN
  -- Use ILIKE for case insensitive email matching
  -- Email standards specify that the local part can be case sensitive,
  -- but most providers treat it as case insensitive, so we follow that convention
  SELECT id INTO user_id
  FROM auth.users
  WHERE email ILIKE user_email
  LIMIT 1;
  
  RETURN user_id;
END;
$function$;