-- Add slug columns to groups and stages tables

-- Add slug column to groups table
ALTER TABLE public.groups 
ADD COLUMN slug TEXT;

-- Add slug column to stages table  
ALTER TABLE public.stages 
ADD COLUMN slug TEXT;

-- Generate slugs for existing data
-- Handle groups with empty/null names by providing a default
UPDATE public.groups 
SET slug = CASE 
  WHEN TRIM(name) = '' OR name IS NULL THEN 'group-' || id
  ELSE LOWER(REPLACE(TRIM(name), ' ', '-'))
END
WHERE slug IS NULL;

-- Handle stages with empty/null names by providing a default  
UPDATE public.stages 
SET slug = CASE
  WHEN TRIM(name) = '' OR name IS NULL THEN 'stage-' || id
  ELSE LOWER(REPLACE(TRIM(name), ' ', '-'))
END
WHERE slug IS NULL;

-- Add NOT NULL constraints after populating data
ALTER TABLE public.groups 
ALTER COLUMN slug SET NOT NULL;

ALTER TABLE public.stages 
ALTER COLUMN slug SET NOT NULL;

-- Add unique constraints
ALTER TABLE public.groups 
ADD CONSTRAINT groups_slug_created_by_unique UNIQUE (created_by, slug);

ALTER TABLE public.stages 
ADD CONSTRAINT stages_slug_festival_edition_unique UNIQUE (festival_edition_id, slug);

-- Create indexes for performance
CREATE INDEX idx_groups_slug ON public.groups(slug);
CREATE INDEX idx_stages_slug ON public.stages(festival_edition_id, slug);

-- Add comments for clarity
COMMENT ON COLUMN public.groups.slug IS 'URL-friendly identifier for the group (e.g., "my-crew-2025")';
COMMENT ON COLUMN public.stages.slug IS 'URL-friendly identifier for the stage within a festival edition (e.g., "main-stage")';