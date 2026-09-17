/** Browser-side image optimization before Storage upload (no Supabase transforms). */

export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxInputBytes?: number;
}

const DEFAULTS: Required<OptimizeOptions> = {
  maxWidth: 1200,
  maxHeight: 1500,
  quality: 0.82,
  maxInputBytes: 15 * 1024 * 1024,
};

const ACCEPTED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export async function optimizeImageFile(
  file: File,
  options: OptimizeOptions = {}
): Promise<{ blob: Blob; width: number; height: number }> {
  const opts = { ...DEFAULTS, ...options };

  if (!ACCEPTED.has(file.type) && !/\.(jpe?g|png|webp)$/i.test(file.name)) {
    throw new Error("Formato no aceptado. Usa JPG, PNG o WebP.");
  }
  if (file.size > opts.maxInputBytes) {
    throw new Error(
      `Archivo demasiado grande (máx. ${Math.round(opts.maxInputBytes / (1024 * 1024))} MB).`
    );
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    opts.maxWidth / bitmap.width,
    opts.maxHeight / bitmap.height
  );
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("No se pudo procesar la imagen en este navegador.");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Fallo al convertir a WebP."))),
      "image/webp",
      opts.quality
    );
  });

  return { blob, width, height };
}
