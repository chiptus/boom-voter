import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadOptions {
  festivalId: string;
  onSuccess?: (url: string) => void;
}

export function useMapUpload({ festivalId, onSuccess }: ImageUploadOptions) {
  return useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${festivalId}-map.${fileExt}`;

      const { error } = await supabase.storage
        .from("festival-assets")
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("festival-assets")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    },
    onSuccess: (url) => {
      onSuccess?.(url);
    },
  });
}
