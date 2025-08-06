-- Add archived columns to festival-related tables for soft delete functionality

-- Add archived column to festivals table
ALTER TABLE public.festivals 
ADD COLUMN archived BOOLEAN NOT NULL DEFAULT false;

-- Add archived column to festival_editions table  
ALTER TABLE public.festival_editions 
ADD COLUMN archived BOOLEAN NOT NULL DEFAULT false;

-- Add archived column to stages table
ALTER TABLE public.stages 
ADD COLUMN archived BOOLEAN NOT NULL DEFAULT false;

-- Add archived column to sets table
ALTER TABLE public.sets 
ADD COLUMN archived BOOLEAN NOT NULL DEFAULT false;

-- Create indexes for better query performance on archived columns
CREATE INDEX idx_festivals_archived ON public.festivals(archived);
CREATE INDEX idx_festival_editions_archived ON public.festival_editions(archived);
CREATE INDEX idx_stages_archived ON public.stages(archived);
CREATE INDEX idx_sets_archived ON public.sets(archived);

-- Update RLS policies to exclude archived records by default

-- Update festivals policies
DROP POLICY IF EXISTS "Anyone can view festivals" ON public.festivals;
CREATE POLICY "Anyone can view festivals" 
ON public.festivals 
FOR SELECT 
USING (archived = false);

-- Update festival_editions policies
DROP POLICY IF EXISTS "Anyone can view festival editions" ON public.festival_editions;
CREATE POLICY "Anyone can view festival editions" 
ON public.festival_editions 
FOR SELECT 
USING (archived = false);

-- Update stages policies
DROP POLICY IF EXISTS "Anyone can view stages" ON public.stages;
CREATE POLICY "Anyone can view stages" 
ON public.stages 
FOR SELECT 
USING (archived = false);

-- Update sets policies (assuming they exist)
DROP POLICY IF EXISTS "Anyone can view sets" ON public.sets;
CREATE POLICY "Anyone can view sets" 
ON public.sets 
FOR SELECT 
USING (archived = false);

-- Ensure admin policies still allow full access to archived records
CREATE POLICY "Admins can view all festivals including archived" 
ON public.festivals 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view all festival editions including archived" 
ON public.festival_editions 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view all stages including archived" 
ON public.stages 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view all sets including archived" 
ON public.sets 
FOR SELECT 
USING (is_admin(auth.uid()));