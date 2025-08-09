-- Add slug columns to artists and sets tables

-- Add slug column to artists table
ALTER TABLE public.artists 
ADD COLUMN slug TEXT;

-- Add slug column to sets table  
ALTER TABLE public.sets 
ADD COLUMN slug TEXT;

-- Generate slugs for existing data
-- For artists, use name only (add uniqueness handling if needed)
UPDATE public.artists 
SET slug = CASE 
  WHEN name IS NULL OR TRIM(name) = '' THEN 'artist-' || SUBSTRING(id::text, 1, 8)
  ELSE LOWER(REGEXP_REPLACE(REGEXP_REPLACE(TRIM(name), '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'))
END
WHERE slug IS NULL;

-- For sets, use name only (add uniqueness handling if needed)
UPDATE public.sets 
SET slug = CASE 
  WHEN name IS NULL OR TRIM(name) = '' THEN 'set-' || SUBSTRING(id::text, 1, 8)
  ELSE LOWER(REGEXP_REPLACE(REGEXP_REPLACE(TRIM(name), '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'))
END
WHERE slug IS NULL;

-- Clean up any consecutive hyphens and trim leading/trailing hyphens
UPDATE public.artists 
SET slug = REGEXP_REPLACE(REGEXP_REPLACE(slug, '-+', '-', 'g'), '^-+|-+$', '', 'g')
WHERE slug IS NOT NULL;

UPDATE public.sets 
SET slug = REGEXP_REPLACE(REGEXP_REPLACE(slug, '-+', '-', 'g'), '^-+|-+$', '', 'g')
WHERE slug IS NOT NULL;

-- Add NOT NULL constraints after populating data
ALTER TABLE public.artists 
ALTER COLUMN slug SET NOT NULL;

ALTER TABLE public.sets 
ALTER COLUMN slug SET NOT NULL;

-- Note: No unique constraints on slugs since names may not be unique
-- If uniqueness is needed, use a combination of slug + festival_id or similar

-- Create indexes for performance
CREATE INDEX idx_artists_slug ON public.artists(slug);
CREATE INDEX idx_sets_slug ON public.sets(slug);

-- Add comments for clarity
COMMENT ON COLUMN public.artists.slug IS 'URL-friendly identifier for the artist (e.g., "shpongle-a1b2c3d4")';
COMMENT ON COLUMN public.sets.slug IS 'URL-friendly identifier for the set (e.g., "shpongle-live-set-a1b2c3d4")';