-- Create soundcloud table to store SoundCloud-specific data
CREATE TABLE public.soundcloud (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    artist_id uuid NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
    soundcloud_id bigint,
    username text,
    display_name text,
    followers_count integer,
    playlist_url text,
    playlist_title text,
    last_sync timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    
    -- Ensure one SoundCloud record per artist
    CONSTRAINT soundcloud_artist_unique UNIQUE(artist_id),
    -- Ensure unique SoundCloud URLs
    CONSTRAINT soundcloud_url_unique UNIQUE(soundcloud_url)
);

-- Enable RLS
ALTER TABLE public.soundcloud ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - read access for everyone, write access only via service role (sync function)
CREATE POLICY "Everyone can view soundcloud data" ON public.soundcloud
    FOR SELECT USING (true);

-- Only service role can insert/update/delete (used by sync function)
-- No user-facing policies for write operations

-- Create indexes for performance
CREATE INDEX soundcloud_artist_id_idx ON public.soundcloud(artist_id);
CREATE INDEX soundcloud_last_sync_idx ON public.soundcloud(last_sync);
CREATE INDEX soundcloud_soundcloud_id_idx ON public.soundcloud(soundcloud_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_soundcloud_updated_at 
    BEFORE UPDATE ON public.soundcloud 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Migrate existing SoundCloud data from artists table
INSERT INTO public.soundcloud (artist_id, soundcloud_url, followers_count, last_sync)
SELECT 
    id as artist_id,
    soundcloud_url,
    soundcloud_followers,
    last_soundcloud_sync
FROM public.artists 
WHERE soundcloud_url IS NOT NULL
ON CONFLICT (artist_id) DO NOTHING;

-- Remove old columns from artists table (commented out for safety - uncomment after migration is verified)
ALTER TABLE public.artists DROP COLUMN IF EXISTS soundcloud_followers;
ALTER TABLE public.artists DROP COLUMN IF EXISTS last_soundcloud_sync;