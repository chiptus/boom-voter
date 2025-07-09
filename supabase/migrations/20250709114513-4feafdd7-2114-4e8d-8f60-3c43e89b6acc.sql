-- Fix search_path security warnings for admin role functions

-- Update has_admin_role function with immutable search_path
CREATE OR REPLACE FUNCTION public.has_admin_role(check_user_id uuid, check_role admin_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = check_user_id AND role = check_role
  );
END;
$function$;

-- Update is_admin function with immutable search_path
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = check_user_id AND role IN ('admin', 'super_admin')
  );
END;
$function$;

-- Update can_edit_artists function with immutable search_path
CREATE OR REPLACE FUNCTION public.can_edit_artists(check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = check_user_id AND role IN ('admin', 'super_admin', 'moderator')
  );
END;
$function$;