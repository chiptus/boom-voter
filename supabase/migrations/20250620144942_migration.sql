
-- Remove the old conflicting constraint that only allows (-1, 1)
ALTER TABLE public.votes 
DROP CONSTRAINT IF EXISTS votes_vote_type_check;

-- The new constraint votes_type_check that allows (-1, 1, 2) should remain active
