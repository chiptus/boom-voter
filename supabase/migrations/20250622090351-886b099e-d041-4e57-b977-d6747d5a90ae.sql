-- Add SoundCloud data columns to artists table
ALTER TABLE public.artists 
ADD COLUMN soundcloud_followers integer,
ADD COLUMN last_soundcloud_sync timestamp with time zone;