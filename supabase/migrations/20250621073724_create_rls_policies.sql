-- Drop the problematic SELECT policy
DROP POLICY IF EXISTS "Users can view groups they belong to" ON groups;

-- Create a new SELECT policy that allows users to see groups they created OR belong to
CREATE POLICY "Users can view groups they created or belong to" 
ON groups 
FOR SELECT 
USING (
  created_by = auth.uid() 
  OR 
  EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_members.group_id = groups.id 
    AND group_members.user_id = auth.uid()
  )
);

-- Also ensure the INSERT policy is correct
DROP POLICY IF EXISTS "Users can create groups" ON groups;
CREATE POLICY "Authenticated users can create groups" 
ON groups 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND created_by = auth.uid()
);