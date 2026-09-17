#!/usr/bin/env node
/**
 * Optimize public/images → WebP; stash originals under public/images/_originals/
 * Hero: max 1920w · cards/services/news/visa/partners: max 1200w · quality ~80
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IMAGES = path.join(ROOT, "public", "images");
const ORIGINALS = path.join(IMAGES, "_originals");

const QUALITY = 80;
const SKIP_NAMES = new Set([
  "icon-192.png",
  "apple-touch-icon.png",
  "ATTRIBUTION.txt",
]);

function maxWidthFor(relPosix) {
  if (relPosix.startsWith("hero/")) return 1920;
  if (relPosix === "og.jpg" || relPosix === "og.jpeg") return 1200;
  if (relPosix.startsWith("brand/")) return 360; // logo
  return 1200; // services, news, visa, partners
}

async function walk(dir, base = IMAGES) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "_originals") continue;
      out.push(...(await walk(abs, base)));
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase();
      if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;
      if (SKIP_NAMES.has(ent.name)) continue;
      out.push(abs);
    }
  }
  return out;
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function main() {
  const files = await walk(IMAGES);
  const report = [];
  let before = 0;
  let after = 0;

  for (const abs of files) {
    const rel = path.relative(IMAGES, abs);
    const relPosix = rel.split(path.sep).join("/");
    const ext = path.extname(abs).toLowerCase();
    const baseName = path.basename(abs, ext);
    const dir = path.dirname(abs);
    const webpPath = path.join(dir, `${baseName}.webp`);
    const origDest = path.join(ORIGINALS, rel);

    const st = await fs.stat(abs);
    before += st.size;

    await ensureDir(path.dirname(origDest));
    // Move original aside (overwrite if re-run)
    try {
      await fs.access(origDest);
      // already have original backup — remove current source after convert
    } catch {
      await fs.copyFile(abs, origDest);
    }

    const mw = maxWidthFor(relPosix);
    const pipeline = sharp(abs).rotate();
    const meta = await pipeline.metadata();
    let img = sharp(abs).rotate();
    if (meta.width && meta.width > mw) {
      img = img.resize({ width: mw, withoutEnlargement: true });
    }

    await img.webp({ quality: QUALITY, effort: 4 }).toFile(webpPath);
    const wst = await fs.stat(webpPath);
    after += wst.size;

    // Remove original from public tree (kept in _originals)
    if (path.resolve(abs) !== path.resolve(webpPath)) {
      await fs.unlink(abs);
    }

    report.push({
      from: relPosix,
      to: relPosix.replace(/\.(jpe?g|png)$/i, ".webp"),
      before: st.size,
      after: wst.size,
      maxW: mw,
    });
    console.log(
      `${relPosix} → ${baseName}.webp  ${(st.size / 1024).toFixed(1)}KB → ${(wst.size / 1024).toFixed(1)}KB (maxW=${mw})`,
    );
  }

  console.log("\n--- summary ---");
  console.log(`files: ${report.length}`);
  console.log(
    `converted bytes (sum of sources → webps): ${(before / 1024 / 1024).toFixed(2)}MB → ${(after / 1024 / 1024).toFixed(2)}MB`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
