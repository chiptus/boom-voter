-- Create artist_music_genres junction table for many-to-many relationship
CREATE TABLE public.artist_music_genres (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  music_genre_id UUID NOT NULL REFERENCES public.music_genres(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(artist_id, music_genre_id) -- Prevent duplicate relationships
);

-- Migrate existing genre_id data to the new junction table
INSERT INTO public.artist_music_genres (artist_id, music_genre_id)
SELECT id, genre_id 
FROM public.artists 
WHERE genre_id IS NOT NULL;

-- Remove the genre_id column from artists table
ALTER TABLE public.artists DROP COLUMN genre_id;

-- Enable Row Level Security
ALTER TABLE public.artist_music_genres ENABLE ROW LEVEL SECURITY;

-- RLS Policies for artist_music_genres
CREATE POLICY "Anyone can view artist music genres" ON public.artist_music_genres FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create artist music genres" ON public.artist_music_genres FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update artist music genres" ON public.artist_music_genres FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete artist music genres" ON public.artist_music_genres FOR DELETE TO authenticated USING (true);

-- Enable realtime for live updates
ALTER TABLE public.artist_music_genres REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.artist_music_genres; 