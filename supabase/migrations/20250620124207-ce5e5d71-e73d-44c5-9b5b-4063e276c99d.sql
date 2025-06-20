-- Create artist_knowledge table to track which artists users know
CREATE TABLE public.artist_knowledge (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, artist_id)
);

-- Enable Row Level Security
ALTER TABLE public.artist_knowledge ENABLE ROW LEVEL SECURITY;

-- Create policies for artist_knowledge table
CREATE POLICY "Users can view their own artist knowledge" 
ON public.artist_knowledge 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own artist knowledge" 
ON public.artist_knowledge 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own artist knowledge" 
ON public.artist_knowledge 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add index for better performance
CREATE INDEX idx_artist_knowledge_user_id ON public.artist_knowledge(user_id);
CREATE INDEX idx_artist_knowledge_artist_id ON public.artist_knowledge(artist_id);