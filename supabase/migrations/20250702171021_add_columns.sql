-- Add archived column to groups table
ALTER TABLE public.groups ADD COLUMN archived BOOLEAN NOT NULL DEFAULT false;

-- Add RLS policy for group creators to update their groups (for archiving)
CREATE POLICY "Group creators can update their groups" 
ON public.groups 
FOR UPDATE 
USING (created_by = auth.uid());