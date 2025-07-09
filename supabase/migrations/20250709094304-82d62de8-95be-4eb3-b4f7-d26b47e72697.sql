-- Create enum for admin roles
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'admin', 'moderator');

-- Create admin_roles table
CREATE TABLE public.admin_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role admin_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS on admin_roles
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_roles
CREATE POLICY "Super admins can view all admin roles" 
ON public.admin_roles 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles ar 
  WHERE ar.user_id = auth.uid() AND ar.role = 'super_admin'
));

CREATE POLICY "Super admins can manage all admin roles" 
ON public.admin_roles 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles ar 
  WHERE ar.user_id = auth.uid() AND ar.role = 'super_admin'
));

-- Create security definer functions for checking admin permissions
CREATE OR REPLACE FUNCTION public.has_admin_role(check_user_id UUID, check_role admin_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = check_user_id AND role = check_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = check_user_id AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.can_edit_artists(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = check_user_id AND role IN ('admin', 'super_admin', 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Migrate existing Core group members to admin roles
DO $$
DECLARE
    core_group_id UUID;
    member_record RECORD;
    current_user_id UUID := '3083571a-84f8-4b74-bcc6-9a6f72cfe03c'; -- The authenticated user
BEGIN
    -- Get Core group ID
    SELECT id INTO core_group_id FROM public.groups WHERE name = 'Core' LIMIT 1;
    
    IF core_group_id IS NOT NULL THEN
        -- Migrate Core group members to admin roles
        FOR member_record IN 
            SELECT gm.user_id, g.created_by
            FROM public.group_members gm
            JOIN public.groups g ON gm.group_id = g.id
            WHERE gm.group_id = core_group_id
        LOOP
            -- Assign role based on whether they're the group creator or current user
            IF member_record.user_id = member_record.created_by OR member_record.user_id = current_user_id THEN
                -- Group creator or current user gets super_admin
                INSERT INTO public.admin_roles (user_id, role, created_by)
                VALUES (member_record.user_id, 'super_admin', current_user_id)
                ON CONFLICT (user_id, role) DO NOTHING;
            ELSE
                -- Other members get admin role
                INSERT INTO public.admin_roles (user_id, role, created_by)
                VALUES (member_record.user_id, 'admin', current_user_id)
                ON CONFLICT (user_id, role) DO NOTHING;
            END IF;
        END LOOP;
    END IF;
    
    -- Ensure current user has super_admin role even if not in Core group
    INSERT INTO public.admin_roles (user_id, role, created_by)
    VALUES (current_user_id, 'super_admin', current_user_id)
    ON CONFLICT (user_id, role) DO NOTHING;
END $$;

-- Update RLS policies on artists table to use new admin system
DROP POLICY IF EXISTS "Only Core group members can update artists" ON public.artists;

CREATE POLICY "Admins can update artists" 
ON public.artists 
FOR UPDATE 
USING (public.can_edit_artists(auth.uid()));

-- Update RLS policies on music_genres table
CREATE POLICY "Admins can update music genres" 
ON public.music_genres 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete music genres" 
ON public.music_genres 
FOR DELETE 
USING (public.is_admin(auth.uid()));