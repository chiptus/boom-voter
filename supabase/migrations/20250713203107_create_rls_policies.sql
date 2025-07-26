-- Add RLS policy to allow super admins to view all groups for analytics
CREATE POLICY "Super admins can view all groups" 
ON public.groups 
FOR SELECT 
USING (has_admin_role(auth.uid(), 'super_admin'::admin_role));