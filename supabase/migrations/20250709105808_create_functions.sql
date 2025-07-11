-- Fix infinite recursion in admin_roles RLS policies
-- Drop the problematic policies that cause recursion
DROP POLICY IF EXISTS "Super admins can view all admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Super admins can manage all admin roles" ON public.admin_roles;

-- Create new policies using security definer functions to avoid recursion
CREATE POLICY "Super admins can view all admin roles" 
ON public.admin_roles 
FOR SELECT 
USING (public.has_admin_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can insert admin roles" 
ON public.admin_roles 
FOR INSERT 
WITH CHECK (public.has_admin_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can update admin roles" 
ON public.admin_roles 
FOR UPDATE 
USING (public.has_admin_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can delete admin roles" 
ON public.admin_roles 
FOR DELETE 
USING (public.has_admin_role(auth.uid(), 'super_admin'));