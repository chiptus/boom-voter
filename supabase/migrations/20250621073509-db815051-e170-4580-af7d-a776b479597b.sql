-- First, drop the problematic policies
DROP POLICY IF EXISTS "Users can view members of their groups" ON group_members;
DROP POLICY IF EXISTS "Group creators can manage members" ON group_members;
DROP POLICY IF EXISTS "Users can leave groups and creators can remove members" ON group_members;

-- Create a security definer function to check group membership
CREATE OR REPLACE FUNCTION public.is_group_member(group_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = group_id_param 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create new RLS policies using the function
CREATE POLICY "Users can view members of their groups" 
ON group_members 
FOR SELECT 
USING (public.is_group_member(group_id));

CREATE POLICY "Group creators can add members" 
ON group_members 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM groups 
    WHERE groups.id = group_members.group_id 
    AND groups.created_by = auth.uid()
  )
);

CREATE POLICY "Users can leave their own groups" 
ON group_members 
FOR DELETE 
USING (user_id = auth.uid());

CREATE POLICY "Group creators can remove members" 
ON group_members 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM groups 
    WHERE groups.id = group_members.group_id 
    AND groups.created_by = auth.uid()
  )
);