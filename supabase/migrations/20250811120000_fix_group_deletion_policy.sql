-- Fix missing DELETE policy for groups table
-- This policy was dropped in migration 20250623102838_migration.sql but never recreated

CREATE POLICY "Group creators can delete their groups" 
ON public.groups 
FOR DELETE 
USING (created_by = auth.uid());