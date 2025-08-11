-- Add unique constraint for user votes on sets
ALTER TABLE public.votes 
ADD CONSTRAINT votes_user_set_unique UNIQUE (user_id, set_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_votes_user_set ON public.votes(user_id, set_id);