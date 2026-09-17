import { getSupabase } from "@/services/supabase/client";

const BUCKET = "product-images";

export { BUCKET as PRODUCT_IMAGES_BUCKET };

export function getPublicUrl(storagePath: string): string {
  const { data } = getSupabase().storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function uploadProductImage(
  storagePath: string,
  file: Blob,
  contentType = "image/webp"
): Promise<string> {
  const supabase = getSupabase();
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, file, {
    contentType,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return getPublicUrl(storagePath);
}

export async function deleteProductImage(storagePath: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);
  if (error) throw new Error(error.message);
}
