
-- Add stage and estimated_date columns to the artists table
ALTER TABLE public.artists 
ADD COLUMN stage TEXT,
ADD COLUMN estimated_date DATE;
