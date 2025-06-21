-- Create artist_notes table for user-specific notes on artists
CREATE TABLE public.artist_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID NOT NULL,
  user_id UUID NOT NULL,
  note_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(artist_id, user_id)
);

-- Enable Row Level Security for artist_notes
ALTER TABLE public.artist_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for artist_notes (users can only see/edit their own notes)
CREATE POLICY "Users can view their own notes" 
ON public.artist_notes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes" 
ON public.artist_notes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
ON public.artist_notes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
ON public.artist_notes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates on artist_notes
CREATE TRIGGER update_artist_notes_updated_at
BEFORE UPDATE ON public.artist_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add Core group restriction policy for artist updates (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'artists' 
    AND policyname = 'Only Core group members can update artists'
  ) THEN
    CREATE POLICY "Only Core group members can update artists" 
    ON public.artists 
    FOR UPDATE 
    USING (
      EXISTS (
        SELECT 1 FROM public.group_members gm
        JOIN public.groups g ON gm.group_id = g.id
        WHERE gm.user_id = auth.uid() 
        AND g.name = 'Core'
      )
    );
  END IF;
END $$;