
-- Drop the existing restrictive update policy
DROP POLICY IF EXISTS "Users can update their own artists" ON public.artists;

-- Create a new policy that allows all authenticated users to update any artist
CREATE POLICY "Authenticated users can update artists" 
ON public.artists 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);
