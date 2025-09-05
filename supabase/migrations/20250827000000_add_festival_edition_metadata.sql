-- Create festival_info and custom_links tables for festival metadata
-- Migrate existing festival description and website_url data
-- Remove deprecated columns from festivals table

CREATE TABLE public.festival_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  festival_id UUID NOT NULL REFERENCES public.festivals(id) ON DELETE CASCADE,
  map_image_url TEXT,
  info_text TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(festival_id)
);

-- Create custom_links table for normalized link storage
CREATE TABLE public.custom_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    festival_id UUID NOT NULL REFERENCES public.festivals(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on festival_info table
ALTER TABLE public.festival_info ENABLE ROW LEVEL SECURITY;

-- RLS Policies for festival_info
CREATE POLICY "Anyone can view festival info" ON public.festival_info FOR SELECT USING (true);
CREATE POLICY "Admins can manage festival info" ON public.festival_info FOR ALL USING (is_admin(auth.uid()));

-- Enable RLS on custom_links table
ALTER TABLE public.custom_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for custom_links
CREATE POLICY "custom_links_select_policy" ON public.custom_links
    FOR SELECT USING (true);

CREATE POLICY "custom_links_insert_policy" ON public.custom_links
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.festivals f 
            WHERE f.id = festival_id 
            AND (
                public.is_admin(auth.uid()) 
            )
        )
    );

CREATE POLICY "custom_links_update_policy" ON public.custom_links
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.festivals f 
            WHERE f.id = festival_id 
            AND (
                public.is_admin(auth.uid()) 
            )
        )
    );

CREATE POLICY "custom_links_delete_policy" ON public.custom_links
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.festivals f 
            WHERE f.id = festival_id 
            AND (
                public.is_admin(auth.uid()) 
            )
        )
    );

-- Add trigger for updated_at on festival_info
CREATE TRIGGER update_festival_info_updated_at
  BEFORE UPDATE ON public.festival_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for updated_at on custom_links  
CREATE TRIGGER update_custom_links_updated_at
  BEFORE UPDATE ON public.custom_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments for documentation
COMMENT ON COLUMN public.festival_info.map_image_url IS 'URL to the festival map image uploaded by admins';
COMMENT ON COLUMN public.festival_info.info_text IS 'Rich text content for the festival info tab';
COMMENT ON COLUMN public.festival_info.facebook_url IS 'Facebook page URL for social embed';
COMMENT ON COLUMN public.festival_info.instagram_url IS 'Instagram profile URL for social embed';
COMMENT ON TABLE public.custom_links IS 'Normalized storage for custom festival links with title and URL';
COMMENT ON COLUMN public.custom_links.display_order IS 'Order in which links should be displayed (0 = first)';

-- Create indexes for performance
CREATE INDEX idx_festival_info_festival_id ON public.festival_info(festival_id);
CREATE INDEX idx_custom_links_festival_id ON public.custom_links(festival_id);
CREATE INDEX idx_custom_links_display_order ON public.custom_links(festival_id, display_order);

-- Insert records for all existing festivals
INSERT INTO public.festival_info (festival_id)
SELECT id FROM public.festivals
ON CONFLICT (festival_id) DO NOTHING;

-- Data migration: Move existing festival.website_url to custom_links table
INSERT INTO public.custom_links (festival_id, title, url, display_order, created_at, updated_at)
SELECT 
    f.id,
    'Website',
    f.website_url,
    0,
    NOW(),
    NOW()
FROM public.festivals f 
WHERE f.website_url IS NOT NULL 
    AND f.website_url != '';

-- Remove deprecated website_url column from festivals table
ALTER TABLE public.festivals DROP COLUMN IF EXISTS website_url;

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
