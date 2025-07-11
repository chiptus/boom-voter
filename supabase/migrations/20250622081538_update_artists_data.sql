-- Add archived column to artists table
ALTER TABLE public.artists 
ADD COLUMN archived BOOLEAN NOT NULL DEFAULT false;

-- Create index for better query performance
CREATE INDEX idx_artists_archived ON public.artists(archived);

-- Update existing queries to filter out archived artists by default
-- This will be handled in the application code