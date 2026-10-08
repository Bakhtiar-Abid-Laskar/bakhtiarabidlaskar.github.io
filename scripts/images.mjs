import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'assets-src');
const outDir = path.join(rootDir, 'public', 'media', 'projects');

fs.mkdirSync(outDir, { recursive: true });

async function processImages() {
  console.log('Running image optimization pipeline via sharp...');

  const manifest = {};
  const files = fs.readdirSync(srcDir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);
    const srcPath = path.join(srcDir, file);

    if (ext === '.svg') {
      // Copy SVG directly to public/media/projects
      const outSvg = path.join(outDir, file);
      fs.copyFileSync(srcPath, outSvg);
      console.log(`Copied vector: ${file} -> ${outSvg}`);

      // Also render WebP and PNG versions from SVG for maximum browser compatibility
      const svgBuffer = fs.readFileSync(srcPath);
      await sharp(svgBuffer)
        .resize(1440, 900)
        .webp({ quality: 90 })
        .toFile(path.join(outDir, `${baseName}.webp`));

      await sharp(svgBuffer)
        .resize(1440, 900)
        .png({ compressionLevel: 8 })
        .toFile(path.join(outDir, `${baseName}.png`));

      manifest[baseName] = {
        width: 1440,
        height: 900,
        formats: ['svg', 'webp', 'png'],
      };
    } else if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      const image = sharp(srcPath);
      const metadata = await image.metadata();

      const width = metadata.width || 1440;
      const height = metadata.height || 900;

      // 1. Output optimized WebP
      const outWebp = path.join(outDir, `${baseName}.webp`);
      await image
        .resize(1440, 900, { fit: 'cover', position: 'top' })
        .webp({ quality: 82 })
        .toFile(outWebp);

      // 2. Output optimized PNG (as fallback)
      const outPng = path.join(outDir, `${baseName}.png`);
      await sharp(srcPath)
        .resize(1440, 900, { fit: 'cover', position: 'top' })
        .png({ compressionLevel: 8, effort: 7 })
        .toFile(outPng);

      const webpStat = fs.statSync(outWebp);
      const pngStat = fs.statSync(outPng);

      console.log(`Optimized ${baseName}: PNG=${(pngStat.size / 1024).toFixed(1)} KB, WebP=${(webpStat.size / 1024).toFixed(1)} KB`);

      manifest[baseName] = {
        width: 1440,
        height: 900,
        formats: ['webp', 'png'],
      };
    }
  }

  const manifestPath = path.join(outDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Wrote image manifest to ${manifestPath}`);
}

processImages().catch((err) => {
  console.error('Image processing failed:', err);
  process.exit(1);
});
