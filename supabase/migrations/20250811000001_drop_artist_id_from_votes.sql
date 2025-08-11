-- Drop the old unique constraint on user_id, artist_id
ALTER TABLE public.votes DROP CONSTRAINT IF EXISTS votes_user_artist_unique;

-- Drop the original unique constraint from the table creation (if it exists)
ALTER TABLE public.votes DROP CONSTRAINT IF EXISTS votes_user_id_artist_id_key;

-- Drop the artist_id column from votes table
ALTER TABLE public.votes DROP COLUMN IF EXISTS artist_id;

-- Make set_id NOT NULL since it's now required
ALTER TABLE public.votes ALTER COLUMN set_id SET NOT NULL;