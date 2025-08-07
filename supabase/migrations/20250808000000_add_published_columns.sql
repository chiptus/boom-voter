-- Add published column to festivals table
ALTER TABLE public.festivals 
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;

-- Add published column to festival_editions table  
ALTER TABLE public.festival_editions 
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_festivals_published ON public.festivals(published);
CREATE INDEX IF NOT EXISTS idx_festival_editions_published ON public.festival_editions(published);

-- Update RLS policies for festivals to include published filter for public users
DROP POLICY IF EXISTS "Anyone can view festivals" ON public.festivals;
CREATE POLICY "Anyone can view published festivals" 
ON public.festivals 
FOR SELECT 
USING (published = true AND archived = false);

-- Update RLS policies for festival_editions to include published filter for public users  
DROP POLICY IF EXISTS "Anyone can view festival editions" ON public.festival_editions;
CREATE POLICY "Anyone can view published festival editions" 
ON public.festival_editions 
FOR SELECT 
USING (published = true AND archived = false);

-- Admin policies remain the same (can see all)
-- These were already created in previous migrations but let's ensure they exist
DROP POLICY IF EXISTS "Admins can view all festivals including unpublished" ON public.festivals;
CREATE POLICY "Admins can view all festivals including unpublished" 
ON public.festivals 
FOR SELECT 
USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all festival editions including unpublished" ON public.festival_editions;
CREATE POLICY "Admins can view all festival editions including unpublished" 
ON public.festival_editions 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Set existing Boom Festival and edition as published for immediate visibility
UPDATE public.festivals 
SET published = true 
WHERE name = 'Boom Festival';

UPDATE public.festival_editions 
SET published = true 
WHERE name = 'Boom Festival 2025';

-- Add comments for clarity
COMMENT ON COLUMN public.festivals.published IS 'Controls public visibility of festival. Only published festivals are shown to non-admin users.';
COMMENT ON COLUMN public.festival_editions.published IS 'Controls public visibility of festival edition. Only published editions are shown to non-admin users.';