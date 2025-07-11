-- Create a function to check if two users share any group
CREATE OR REPLACE FUNCTION public.users_share_group(user1_id uuid, user2_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.group_members gm1
    JOIN public.group_members gm2 ON gm1.group_id = gm2.group_id
    WHERE gm1.user_id = user1_id 
    AND gm2.user_id = user2_id
  );
$$;

-- Remove the unique constraint on (artist_id, user_id) since users can now see multiple notes per artist
ALTER TABLE public.artist_notes 
DROP CONSTRAINT IF EXISTS artist_notes_artist_id_user_id_key;

-- Update RLS policies to allow users to see notes from users who share any group with them
DROP POLICY IF EXISTS "Users can view their own notes" ON public.artist_notes;
DROP POLICY IF EXISTS "Users can create their own notes" ON public.artist_notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.artist_notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.artist_notes;

-- New RLS policies for group-shared notes
CREATE POLICY "Users can view notes from group members" 
ON public.artist_notes 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  public.users_share_group(auth.uid(), user_id)
);

CREATE POLICY "Users can create their own notes" 
ON public.artist_notes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
ON public.artist_notes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
ON public.artist_notes 
FOR DELETE 
USING (auth.uid() = user_id);