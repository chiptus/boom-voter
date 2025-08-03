-- Create stages table
CREATE TABLE public.stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  festival_edition_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view stages" 
ON public.stages 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage stages" 
ON public.stages 
FOR ALL 
USING (is_admin(auth.uid()));

-- Add stage_id to sets table
ALTER TABLE public.sets 
ADD COLUMN stage_id UUID;

-- Get the active festival edition ID
DO $$
DECLARE
    edition_id UUID;
BEGIN
    SELECT id INTO edition_id FROM festival_editions WHERE is_active = true LIMIT 1;
    
    IF edition_id IS NOT NULL THEN
        -- Insert Boom Festival 2025 stages
        INSERT INTO public.stages (name, festival_edition_id) VALUES
        ('Dance Temple', edition_id),
        ('Alchemy Circle', edition_id),
        ('Chill Out Gardens', edition_id),
        ('Liminal Village', edition_id),
        ('Sacred Fire', edition_id),
        ('Ambient Forest', edition_id);
        
        -- Update existing sets to reference stage_id
        UPDATE public.sets 
        SET stage_id = stages.id
        FROM public.stages 
        WHERE sets.stage = stages.name 
        AND stages.festival_edition_id = edition_id;
    END IF;
END $$;

-- Remove the old stage text column
ALTER TABLE public.sets DROP COLUMN stage;

-- Create trigger for timestamps
CREATE TRIGGER update_stages_updated_at
BEFORE UPDATE ON public.stages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();