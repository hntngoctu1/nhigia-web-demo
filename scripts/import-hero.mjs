import sharp from "sharp";
import fs from "fs";
import path from "path";

const src =
  "C:\\Users\\Admin\\.grok\\sessions\\c%3A%5Cdev\\01a0a998-b004-7dd1-9f46-cb7b22394516\\images";
const dest = "c:\\dev\\nhigia-web-demo\\public\\images\\hero";
const orig = "c:\\dev\\nhigia-web-demo\\public\\images\\_originals\\hero";
fs.mkdirSync(orig, { recursive: true });
fs.mkdirSync(dest, { recursive: true });

const files = [
  ["4.jpg", "hero-consult"],
  ["3.jpg", "hero-skyline"],
  ["1.jpg", "hero-passport"],
  ["2.jpg", "hero-boardroom"],
  ["7.jpg", "mood-reception"],
  ["6.jpg", "mood-dossier"],
  ["8.jpg", "mood-residence"],
  ["5.jpg", "mood-lounge"],
  ["13.jpg", "svc-visa"],
  ["14.jpg", "svc-work"],
  ["9.jpg", "svc-invite"],
  ["12.jpg", "svc-apec"],
  ["11.jpg", "svc-records"],
  ["10.jpg", "svc-homecoming"],
];

for (const [from, name] of files) {
  const inp = path.join(src, from);
  fs.copyFileSync(inp, path.join(orig, `${name}.jpg`));
  const out = path.join(dest, `${name}.webp`);
  await sharp(inp)
    .rotate()
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out);
  const kb = Math.round(fs.statSync(out).size / 1024);
  console.log(name, `${kb}KB`);
}
