import { supabase } from "@/integrations/supabase/client";

export interface UploadResult {
  url: string;
  path: string;
}

const BUCKET_NAME = "festival-assets";

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  folder: string,
  filename?: string,
): Promise<UploadResult> {
  const fileExt = file.name.split(".").pop();
  const fileName =
    filename ||
    `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return {
    url: publicUrl,
    path: filePath,
  };
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Upload a festival logo
 */
export async function uploadFestivalLogo(
  file: File,
  festivalSlug: string,
): Promise<UploadResult> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${festivalSlug}-logo.${fileExt}`;
  const filePath = `festival-logos/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true, // Allow overwriting existing files
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return {
    url: publicUrl,
    path: filePath,
  };
}

/**
 * Delete a festival logo
 */
export async function deleteFestivalLogo(logoUrl: string): Promise<void> {
  // Extract path from URL
  const url = new URL(logoUrl);
  const pathMatch = url.pathname.match(
    /\/storage\/v1\/object\/public\/festival-assets\/(.+)$/,
  );

  if (pathMatch) {
    const path = pathMatch[1];
    await deleteFile(path);
  }
}
