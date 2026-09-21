import { getSupabase } from "@/services/supabase/client";
import {
  deleteProductImage,
  getPublicUrl,
  uploadProductImage,
} from "@/services/storage/storageService";
import { optimizeImageFile } from "@/lib/imageOptimize";

export async function addImageToProduct(
  productId: string,
  categorySlug: string,
  file: File
): Promise<void> {
  const supabase = getSupabase();
  const optimized = await optimizeImageFile(file);
  const id = crypto.randomUUID();
  const storagePath = `${categorySlug}/${productId}/${id}.webp`;

  const publicUrl = await uploadProductImage(
    storagePath,
    optimized.blob,
    "image/webp"
  );

  const { data: existing } = await supabase
    .from("producto_imagenes")
    .select("orden")
    .eq("producto_id", productId)
    .order("orden", { ascending: false })
    .limit(1);

  const nextOrden = (existing?.[0]?.orden ?? 0) + 1;

  const { error } = await supabase.from("producto_imagenes").insert({
    producto_id: productId,
    storage_path: storagePath,
    public_url: publicUrl,
    orden: nextOrden,
  });

  if (error) {
    await deleteProductImage(storagePath).catch(() => undefined);
    throw new Error(error.message);
  }

  // Compat con schema actual: productos.url_imagen NOT NULL + check URL
  if (nextOrden === 1) {
    await supabase.from("productos").update({ url_imagen: publicUrl }).eq("id", productId);
  }
}

export async function createProductWithImage(
  categoriaId: string,
  categorySlug: string,
  file: File,
  nombre: string
): Promise<void> {
  const supabase = getSupabase();

  const { data: maxOrden } = await supabase
    .from("productos")
    .select("orden")
    .eq("categoria_id", categoriaId)
    .order("orden", { ascending: false })
    .limit(1);

  const orden = (maxOrden?.[0]?.orden ?? 0) + 1;
  const productId = crypto.randomUUID();
  const imageId = crypto.randomUUID();
  const storagePath = `${categorySlug}/${productId}/${imageId}.webp`;
  const publicUrl = getPublicUrl(storagePath);

  const optimized = await optimizeImageFile(file);

  const { data: product, error: prodErr } = await supabase
    .from("productos")
    .insert({
      id: productId,
      categoria_id: categoriaId,
      nombre,
      orden,
      visible: true,
      url_imagen: publicUrl,
    })
    .select("id")
    .single();

  if (prodErr || !product) throw new Error(prodErr?.message ?? "No se creó el producto");

  try {
    await uploadProductImage(storagePath, optimized.blob, "image/webp");
    const { error: imgErr } = await supabase.from("producto_imagenes").insert({
      producto_id: product.id,
      storage_path: storagePath,
      public_url: publicUrl,
      orden: 1,
    });
    if (imgErr) throw new Error(imgErr.message);
  } catch (err) {
    await deleteProductImage(storagePath).catch(() => undefined);
    await supabase.from("productos").delete().eq("id", product.id);
    throw err;
  }
}

/** Short product label shown on the card and in WhatsApp (max ~40 chars). */
export async function renameProduct(
  productId: string,
  nombre: string
): Promise<void> {
  const cleaned = nombre.trim().replace(/\s+/g, " ");
  if (!cleaned) throw new Error("La referencia no puede estar vacía.");
  if (cleaned.length > 40) {
    throw new Error("Máximo 40 caracteres (ej. Camisa oversize talla L).");
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from("productos")
    .update({ nombre: cleaned })
    .eq("id", productId);

  if (error) throw new Error(error.message);
}

export async function removeImage(imageId: string): Promise<void> {
  const supabase = getSupabase();

  const { data: image, error: fetchErr } = await supabase
    .from("producto_imagenes")
    .select("id, storage_path, producto_id")
    .eq("id", imageId)
    .single();

  if (fetchErr || !image) throw new Error(fetchErr?.message ?? "Imagen no encontrada");

  await deleteProductImage(image.storage_path);

  const { error: delErr } = await supabase
    .from("producto_imagenes")
    .delete()
    .eq("id", imageId);

  if (delErr) throw new Error(delErr.message);

  const { data: remaining } = await supabase
    .from("producto_imagenes")
    .select("id, public_url")
    .eq("producto_id", image.producto_id)
    .order("orden", { ascending: true });

  if (!remaining?.length) {
    await supabase.from("productos").delete().eq("id", image.producto_id);
  } else {
    await supabase
      .from("productos")
      .update({ url_imagen: remaining[0].public_url })
      .eq("id", image.producto_id);
  }
}
