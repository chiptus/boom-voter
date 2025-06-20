
-- Create artists table
CREATE TABLE public.artists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  added_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE NOT NULL,
  vote_type SMALLINT NOT NULL CHECK (vote_type IN (-1, 1)), -- -1 for downvote, 1 for upvote
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, artist_id) -- One vote per user per artist
);

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create music_genres table
CREATE TABLE public.music_genres (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial/seeded genre values
INSERT INTO public.music_genres (name, created_by) VALUES 
  ('Electronic', NULL),
  ('Psytrance', NULL),
  ('Techno', NULL),
  ('House', NULL),
  ('Ambient', NULL),
  ('Dub', NULL),
  ('Reggae', NULL),
  ('World Music', NULL),
  ('Folk', NULL),
  ('Rock', NULL),
  ('Experimental', NULL),
  ('Downtempo', NULL),
  ('Progressive', NULL),
  ('Drum & Bass', NULL),
  ('Trance', NULL),
  ('Chillout', NULL),
  ('Other', NULL);

-- Add genre_id column to artists table
ALTER TABLE public.artists ADD COLUMN genre_id UUID REFERENCES public.music_genres(id) NOT NULL;

-- Enable Row Level Security
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_genres ENABLE ROW LEVEL SECURITY;

-- RLS Policies for artists (everyone can read, authenticated users can create)
CREATE POLICY "Anyone can view artists" ON public.artists FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create artists" ON public.artists FOR INSERT TO authenticated WITH CHECK (auth.uid() = added_by);
CREATE POLICY "Users can update their own artists" ON public.artists FOR UPDATE TO authenticated USING (auth.uid() = added_by);
CREATE POLICY "Users can delete their own artists" ON public.artists FOR DELETE TO authenticated USING (auth.uid() = added_by);

-- RLS Policies for votes (everyone can read, authenticated users can vote)
CREATE POLICY "Anyone can view votes" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create votes" ON public.votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own votes" ON public.votes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own votes" ON public.votes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- RLS Policies for music_genres
CREATE POLICY "Anyone can view music genres" ON public.music_genres FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create music genres" ON public.music_genres FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data ->> 'username');
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable realtime for live voting updates
ALTER TABLE public.votes REPLICA IDENTITY FULL;
ALTER TABLE public.artists REPLICA IDENTITY FULL;
ALTER TABLE public.music_genres REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.artists;
ALTER PUBLICATION supabase_realtime ADD TABLE public.music_genres;
