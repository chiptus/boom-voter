-- Remove duplicate unique constraint (keep the newer one)
ALTER TABLE public.votes DROP CONSTRAINT IF EXISTS votes_user_artist_unique;