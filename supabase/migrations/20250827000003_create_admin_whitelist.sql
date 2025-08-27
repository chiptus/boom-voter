
-- Bootstrap function to create the initial super admin (for local development)
CREATE OR REPLACE FUNCTION public.bootstrap_super_admin(user_email TEXT)
RETURNS boolean AS $$
DECLARE
  target_user_id UUID;
  existing_super_admin_count INTEGER;
BEGIN
  -- Check if any super admin already exists
  SELECT COUNT(*) INTO existing_super_admin_count 
  FROM public.admin_roles 
  WHERE role = 'super_admin';
  
  -- Only allow bootstrapping if no super admin exists yet
  IF existing_super_admin_count > 0 THEN
    RAISE EXCEPTION 'Super admin already exists. Use promote_user_to_admin instead.';
  END IF;
  
  -- Find the target user by email
  SELECT id INTO target_user_id FROM auth.users WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found. Please sign up first.', user_email;
  END IF;
  
  -- Create the initial super admin
  INSERT INTO public.admin_roles (user_id, role, created_by, created_at)
  VALUES (target_user_id, 'super_admin', target_user_id, now())
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;