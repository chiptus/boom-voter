-- Add slug columns to festivals and festival_editions tables

-- Add slug column to festivals table
ALTER TABLE public.festivals 
ADD COLUMN slug TEXT;

-- Add slug column to festival_editions table  
ALTER TABLE public.festival_editions 
ADD COLUMN slug TEXT;

-- Generate slugs for existing data
UPDATE public.festivals 
SET slug = LOWER(REPLACE(TRIM(name), ' ', '-'))
WHERE slug IS NULL;

UPDATE public.festival_editions 
SET slug = LOWER(REPLACE(TRIM(name), ' ', '-'))
WHERE slug IS NULL;

-- Add NOT NULL constraints after populating data
ALTER TABLE public.festivals 
ALTER COLUMN slug SET NOT NULL;

ALTER TABLE public.festival_editions 
ALTER COLUMN slug SET NOT NULL;

-- Add unique constraints
ALTER TABLE public.festivals 
ADD CONSTRAINT festivals_slug_unique UNIQUE (slug);

ALTER TABLE public.festival_editions 
ADD CONSTRAINT festival_editions_slug_festival_unique UNIQUE (festival_id, slug);

-- Create indexes for performance
CREATE INDEX idx_festivals_slug ON public.festivals(slug);
CREATE INDEX idx_festival_editions_slug ON public.festival_editions(festival_id, slug);

-- Add comments for clarity
COMMENT ON COLUMN public.festivals.slug IS 'URL-friendly identifier for the festival (e.g., "boom-festival")';
COMMENT ON COLUMN public.festival_editions.slug IS 'URL-friendly identifier for the festival edition (e.g., "boom-2025")';