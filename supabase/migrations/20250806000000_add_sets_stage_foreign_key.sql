-- Add foreign key constraint between sets and stages tables
-- This establishes the proper relationship that was missing from the original stage migration

ALTER TABLE public.sets 
ADD CONSTRAINT sets_stage_id_fkey 
FOREIGN KEY (stage_id) REFERENCES public.stages(id);

-- Add index on stage_id for better query performance
CREATE INDEX IF NOT EXISTS idx_sets_stage_id ON public.sets(stage_id);