-- Phase 1: Create Festival/Edition/Set System

-- Create festivals table
CREATE TABLE public.festivals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create festival_editions table
CREATE TABLE public.festival_editions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  festival_id UUID NOT NULL REFERENCES public.festivals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  start_date DATE,
  end_date DATE,
  location TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sets table
CREATE TABLE public.sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  festival_edition_id UUID NOT NULL REFERENCES public.festival_editions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  stage TEXT,
  time_start TIMESTAMP WITH TIME ZONE,
  time_end TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create set_artists junction table
CREATE TABLE public.set_artists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  set_id UUID NOT NULL REFERENCES public.sets(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'performer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(set_id, artist_id)
);

-- Add set_id column to votes table
ALTER TABLE public.votes ADD COLUMN set_id UUID REFERENCES public.sets(id) ON DELETE CASCADE;

-- Enable RLS on new tables
ALTER TABLE public.festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.festival_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.set_artists ENABLE ROW LEVEL SECURITY;

-- RLS Policies for festivals
CREATE POLICY "Anyone can view festivals" ON public.festivals FOR SELECT USING (true);
CREATE POLICY "Admins can manage festivals" ON public.festivals FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for festival_editions  
CREATE POLICY "Anyone can view festival editions" ON public.festival_editions FOR SELECT USING (true);
CREATE POLICY "Admins can manage festival editions" ON public.festival_editions FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for sets
CREATE POLICY "Anyone can view sets" ON public.sets FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create sets" ON public.sets FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own sets" ON public.sets FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Admins can update sets" ON public.sets FOR UPDATE USING (can_edit_artists(auth.uid()));
CREATE POLICY "Users can delete their own sets" ON public.sets FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for set_artists
CREATE POLICY "Anyone can view set artists" ON public.set_artists FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage set artists" ON public.set_artists FOR ALL USING (auth.uid() IS NOT NULL);

-- Create Boom Festival and 2025 Edition
INSERT INTO public.festivals (name, description, website_url) 
VALUES ('Boom Festival', 'A transformational festival celebrating conscious electronic music and culture', 'https://boomfestival.org');

INSERT INTO public.festival_editions (festival_id, name, year, start_date, end_date, location, description)
SELECT 
  f.id,
  'Boom 2025',
  2025,
  '2025-07-17'::date,
  '2025-07-24'::date,
  'Idanha-a-Nova, Portugal',
  'The 2025 edition of Boom Festival'
FROM public.festivals f WHERE f.name = 'Boom Festival';

-- Migrate existing artists to sets
INSERT INTO public.sets (festival_edition_id, name, description, stage, time_start, time_end, created_by)
SELECT 
  fe.id as festival_edition_id,
  a.name,
  a.description,
  a.stage,
  a.time_start,
  a.time_end,
  a.added_by as created_by
FROM public.artists a
CROSS JOIN public.festival_editions fe 
WHERE fe.name = 'Boom 2025' AND a.archived = false;

-- Link artists to their sets
INSERT INTO public.set_artists (set_id, artist_id)
SELECT 
  s.id as set_id,
  a.id as artist_id
FROM public.artists a
JOIN public.sets s ON s.name = a.name AND s.created_by = a.added_by
WHERE a.archived = false;

-- Migrate votes from artists to sets
UPDATE public.votes 
SET set_id = s.id
FROM public.artists a
JOIN public.sets s ON s.name = a.name AND s.created_by = a.added_by
WHERE votes.artist_id = a.id;

-- Add triggers for updated_at
CREATE TRIGGER update_festivals_updated_at
  BEFORE UPDATE ON public.festivals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_festival_editions_updated_at
  BEFORE UPDATE ON public.festival_editions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sets_updated_at
  BEFORE UPDATE ON public.sets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_festival_editions_festival_id ON public.festival_editions(festival_id);
CREATE INDEX idx_sets_festival_edition_id ON public.sets(festival_edition_id);
CREATE INDEX idx_set_artists_set_id ON public.set_artists(set_id);
CREATE INDEX idx_set_artists_artist_id ON public.set_artists(artist_id);
CREATE INDEX idx_votes_set_id ON public.votes(set_id);