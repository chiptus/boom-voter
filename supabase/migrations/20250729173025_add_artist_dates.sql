-- Add time_start and time_end columns to artists table (for performance scheduling)
ALTER TABLE public.artists 
ADD COLUMN time_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN time_end TIMESTAMP WITH TIME ZONE;

-- Create index for better query performance on time ranges
CREATE INDEX idx_artists_time_start ON public.artists(time_start);
CREATE INDEX idx_artists_time_end ON public.artists(time_end);

-- Add constraint to ensure time_end is after time_start when both are set
ALTER TABLE public.artists 
ADD CONSTRAINT check_artist_time_order 
CHECK (time_start IS NULL OR time_end IS NULL OR time_start <= time_end);