/**
 * Standalone image optimizer (batch) — used for inspection / pre-import.
 * Production upload path uses this same Sharp pipeline inside import-images.
 *
 *   npm run optimize:images
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(process.env.IMPORT_ROOT ?? "images");
const OUT = path.resolve(process.env.OPTIMIZE_OUT ?? "scripts/optimize-images/.cache");
const MAX_W = Number(process.env.IMPORT_MAX_WIDTH ?? 1200);
const MAX_H = Number(process.env.IMPORT_MAX_HEIGHT ?? 1500);
const QUALITY = Number(process.env.IMPORT_QUALITY ?? 82);

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (/\.(jpe?g|png|webp)$/i.test(e.name)) out.push(full);
  }
  return out;
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const files = await walk(ROOT);
  let totalIn = 0;
  let totalOut = 0;
  let n = 0;

  for (const file of files) {
    const buf = await fs.readFile(file);
    totalIn += buf.length;
    const outBuf = await sharp(buf)
      .rotate()
      .resize({ width: MAX_W, height: MAX_H, fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();
    totalOut += outBuf.length;
    n++;
  }

  console.log(`Archivos: ${n}`);
  console.log(`Entrada:  ${(totalIn / (1024 * 1024)).toFixed(1)} MB`);
  console.log(`Salida:   ${(totalOut / (1024 * 1024)).toFixed(1)} MB (estimado WebP)`);
  console.log(`Ahorro:   ${(((totalIn - totalOut) / totalIn) * 100).toFixed(1)}%`);
  console.log(`Promedio entrada: ${Math.round(totalIn / Math.max(n, 1) / 1024)} KB`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
