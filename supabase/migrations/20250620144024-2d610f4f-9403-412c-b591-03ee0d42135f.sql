-- Add check constraint for vote types
ALTER TABLE public.votes 
ADD CONSTRAINT votes_type_check CHECK (vote_type IN (-1, 1, 2));

-- Add unique constraint to prevent duplicate votes per user per artist
ALTER TABLE public.votes 
ADD CONSTRAINT votes_user_artist_unique UNIQUE (user_id, artist_id);