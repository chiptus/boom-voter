-- Create festival_info table for Map, Info, and Social tab data

CREATE TABLE public.festival_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  festival_id UUID NOT NULL REFERENCES public.festivals(id) ON DELETE CASCADE,
  map_image_url TEXT,
  info_text TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  custom_links JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(festival_id)
);

-- Enable RLS on festival_info table
ALTER TABLE public.festival_info ENABLE ROW LEVEL SECURITY;

-- RLS Policies for festival_info
CREATE POLICY "Anyone can view festival info" ON public.festival_info FOR SELECT USING (true);
CREATE POLICY "Admins can manage festival info" ON public.festival_info FOR ALL USING (is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_festival_info_updated_at
  BEFORE UPDATE ON public.festival_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments for documentation
COMMENT ON COLUMN public.festival_info.map_image_url IS 'URL to the festival map image uploaded by admins';
COMMENT ON COLUMN public.festival_info.info_text IS 'Rich text content for the festival info tab';
COMMENT ON COLUMN public.festival_info.facebook_url IS 'Facebook page URL for social embed';
COMMENT ON COLUMN public.festival_info.instagram_url IS 'Instagram profile URL for social embed';
COMMENT ON COLUMN public.festival_info.custom_links IS 'Array of custom links with title and url properties: [{"title": "Tickets", "url": "https://..."}]';

-- Create index for performance
CREATE INDEX idx_festival_info_festival_id ON public.festival_info(festival_id);

-- Insert records for all existing festivals
INSERT INTO public.festival_info (festival_id)
SELECT id FROM public.festivals
ON CONFLICT (festival_id) DO NOTHING;

-- Create function to automatically create festival_info when a festival is created
CREATE OR REPLACE FUNCTION create_festival_info()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.festival_info (festival_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create festival_info for new festivals
CREATE TRIGGER create_festival_info_trigger
  AFTER INSERT ON public.festivals
  FOR EACH ROW
  EXECUTE FUNCTION create_festival_info();

-- Create storage bucket for festival assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('festival-assets', 'festival-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for festival assets
CREATE POLICY "Anyone can view festival assets" ON storage.objects FOR SELECT USING (bucket_id = 'festival-assets');
CREATE POLICY "Admins can upload festival assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'festival-assets' AND is_admin(auth.uid()));
CREATE POLICY "Admins can update festival assets" ON storage.objects FOR UPDATE USING (bucket_id = 'festival-assets' AND is_admin(auth.uid()));
CREATE POLICY "Admins can delete festival assets" ON storage.objects FOR DELETE USING (bucket_id = 'festival-assets' AND is_admin(auth.uid()));
