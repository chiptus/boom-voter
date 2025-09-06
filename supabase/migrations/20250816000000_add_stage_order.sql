-- Add order column to stages table
ALTER TABLE public.stages 
ADD COLUMN stage_order INTEGER NOT NULL DEFAULT 0;

-- Update existing stages with default order values
-- This gives each stage a unique order number based on their creation order
DO $$
DECLARE
    stage_record RECORD;
    order_counter INTEGER := 1;
BEGIN
    FOR stage_record IN 
        SELECT id FROM public.stages 
        ORDER BY created_at ASC
    LOOP
        UPDATE public.stages 
        SET stage_order = order_counter 
        WHERE id = stage_record.id;
        
        order_counter := order_counter + 1;
    END LOOP;
END $$;

-- Create index for efficient ordering
CREATE INDEX idx_stages_order ON public.stages (stage_order);

-- Add color column to stages table
ALTER TABLE public.stages 
ADD COLUMN color VARCHAR(7);