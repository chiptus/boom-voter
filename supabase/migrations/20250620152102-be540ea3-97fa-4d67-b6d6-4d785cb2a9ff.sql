-- Create function to update timestamps (if it doesn't exist)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create groups table
CREATE TABLE public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group_members table for many-to-many relationship
CREATE TABLE public.group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for groups table
-- Users can only see groups they are members of
CREATE POLICY "Users can view groups they belong to" 
ON public.groups 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = groups.id 
    AND user_id = auth.uid()
  )
);

-- Users can create groups
CREATE POLICY "Users can create groups" 
ON public.groups 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- Group creators can update their groups
CREATE POLICY "Group creators can update their groups" 
ON public.groups 
FOR UPDATE 
USING (auth.uid() = created_by);

-- Group creators can delete their groups
CREATE POLICY "Group creators can delete their groups" 
ON public.groups 
FOR DELETE 
USING (auth.uid() = created_by);

-- RLS Policies for group_members table
-- Users can view group members for groups they belong to
CREATE POLICY "Users can view members of their groups" 
ON public.group_members 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.group_members gm2 
    WHERE gm2.group_id = group_members.group_id 
    AND gm2.user_id = auth.uid()
  )
);

-- Group creators and admins can add members
CREATE POLICY "Group creators can manage members" 
ON public.group_members 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.groups 
    WHERE id = group_id 
    AND created_by = auth.uid()
  )
);

-- Users can remove themselves, creators can remove anyone
CREATE POLICY "Users can leave groups and creators can remove members" 
ON public.group_members 
FOR DELETE 
USING (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.groups 
    WHERE id = group_id 
    AND created_by = auth.uid()
  )
);

-- Update trigger for groups
CREATE TRIGGER update_groups_updated_at
BEFORE UPDATE ON public.groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for better performance
CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX idx_groups_created_by ON public.groups(created_by);