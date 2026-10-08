import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const mediaDir = path.join(rootDir, 'public', 'media');

if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

// 1. Generate 1200x630 Open Graph SVG & PNG
const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="70%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#0E2D4E" />
      <stop offset="100%" stop-color="#0A2038" />
    </radialGradient>
  </defs>

  <!-- Deep ground -->
  <rect width="1200" height="630" fill="url(#bg)" />

  <!-- Frame border -->
  <rect x="40" y="40" width="1120" height="550" rx="16" fill="none" stroke="rgba(159, 179, 196, 0.25)" stroke-width="2" />

  <!-- Accent dot -->
  <circle cx="100" cy="110" r="10" fill="#2A45F2" />
  <text x="124" y="116" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600" fill="#9FB3C4" letter-spacing="1.5">DEVELOPER PORTFOLIO</text>

  <!-- Name -->
  <text x="100" y="240" font-family="system-ui, -apple-system, sans-serif" font-size="76" font-weight="800" fill="#F3F6F7" letter-spacing="-2">Bakhtiar Abid Laskar</text>

  <!-- Role -->
  <text x="100" y="320" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="500" fill="#9FB3C4">Full-Stack Developer building production web and mobile systems</text>

  <!-- Stack Pills Container -->
  <g transform="translate(100, 390)">
    <!-- Pill 1 -->
    <rect x="0" y="0" width="120" height="48" rx="8" fill="#132B45" stroke="rgba(159, 179, 196, 0.3)" />
    <text x="60" y="30" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#F3F6F7" text-anchor="middle">Next.js</text>

    <!-- Pill 2 -->
    <rect x="136" y="0" width="110" height="48" rx="8" fill="#132B45" stroke="rgba(159, 179, 196, 0.3)" />
    <text x="191" y="30" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#F3F6F7" text-anchor="middle">React</text>

    <!-- Pill 3 -->
    <rect x="262" y="0" width="150" height="48" rx="8" fill="#132B45" stroke="rgba(159, 179, 196, 0.3)" />
    <text x="337" y="30" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#F3F6F7" text-anchor="middle">TypeScript</text>

    <!-- Pill 4 -->
    <rect x="428" y="0" width="140" height="48" rx="8" fill="#132B45" stroke="rgba(159, 179, 196, 0.3)" />
    <text x="498" y="30" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#F3F6F7" text-anchor="middle">Supabase</text>

    <!-- Pill 5 -->
    <rect x="584" y="0" width="110" height="48" rx="8" fill="#132B45" stroke="rgba(159, 179, 196, 0.3)" />
    <text x="639" y="30" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#F3F6F7" text-anchor="middle">Expo</text>

    <!-- Pill 6 -->
    <rect x="710" y="0" width="170" height="48" rx="8" fill="#132B45" stroke="rgba(159, 179, 196, 0.3)" />
    <text x="795" y="30" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#F3F6F7" text-anchor="middle">Power BI</text>
  </g>

  <!-- Footer orientation -->
  <text x="100" y="525" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="500" fill="#5C6C78">B.Tech CSE · University of Science and Technology Meghalaya</text>
  <text x="1100" y="525" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600" fill="#85A3FF" text-anchor="end">bakhtiar-abid-laskar.github.io</text>
</svg>
`;

async function main() {
  const ogPngPath = path.join(mediaDir, 'og-image.png');
  await sharp(Buffer.from(ogSvg))
    .png({ quality: 90, compressionLevel: 8 })
    .toFile(ogPngPath);
  console.log(`Generated ${ogPngPath} (1200x630)`);

  // 2. Generate Apple Touch Icon (180x180)
  const appleSvg = `
<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" rx="36" fill="#0A2038" />
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#F3F6F7" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="96" letter-spacing="-2">B</text>
</svg>
`;

  const applePngPath = path.join(rootDir, 'public', 'apple-touch-icon.png');
  await sharp(Buffer.from(appleSvg))
    .png({ quality: 95 })
    .toFile(applePngPath);
  console.log(`Generated ${applePngPath} (180x180)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
