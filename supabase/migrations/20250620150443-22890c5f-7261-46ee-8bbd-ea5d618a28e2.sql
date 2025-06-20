
-- Force remove ALL check constraints on the votes table that might be restricting vote_type
-- This includes any old constraints that might still be lingering
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Find and drop all check constraints on the votes table
    FOR constraint_name IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.votes'::regclass 
        AND contype = 'c'
    LOOP
        EXECUTE format('ALTER TABLE public.votes DROP CONSTRAINT IF EXISTS %I', constraint_name);
    END LOOP;
END $$;

-- Now add the correct constraint that allows (-1, 1, 2)
ALTER TABLE public.votes 
ADD CONSTRAINT votes_type_check CHECK (vote_type IN (-1, 1, 2));
