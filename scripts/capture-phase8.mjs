import { chromium } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const reportsDir = path.join(rootDir, 'reports', 'phase8');
const PORT = 4156;

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

function createServer() {
  return http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
    else if (!path.extname(urlPath)) {
      if (fs.existsSync(path.join(outDir, urlPath, 'index.html'))) {
        urlPath = path.join(urlPath, 'index.html');
      }
    }

    const filePath = path.join(outDir, urlPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });
}

async function capture() {
  const server = createServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Phase 8 capture server running at http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  try {
    const viewports = [
      { width: 360, height: 640, filename: 'responsive-360.png' },
      { width: 390, height: 844, filename: 'responsive-390.png' },
      { width: 768, height: 1024, filename: 'responsive-768.png' },
      { width: 1024, height: 768, filename: 'responsive-1024.png' },
      { width: 1440, height: 900, filename: 'responsive-1440.png' },
      { width: 1920, height: 1080, filename: 'responsive-1920.png' },
    ];

    for (const vp of viewports) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(reportsDir, vp.filename),
      });
      console.log(`Captured ${vp.filename}`);
      await ctx.close();
    }

    // 200% Zoom capture
    {
      const ctxZoom = await browser.newContext({
        viewport: { width: 640, height: 480 },
        deviceScaleFactor: 2,
      });
      const pageZoom = await ctxZoom.newPage();
      await pageZoom.goto(`http://127.0.0.1:${PORT}`);
      await pageZoom.waitForTimeout(500);
      await pageZoom.evaluate(() => {
        document.documentElement.style.fontSize = '32px';
      });
      await pageZoom.waitForTimeout(300);
      await pageZoom.screenshot({
        path: path.join(reportsDir, 'text-zoom-200.png'),
      });
      console.log('Captured text-zoom-200.png');
      await ctxZoom.close();
    }

    // OpenGraph preview image copy
    const ogSrc = path.join(rootDir, 'public', 'media', 'og-image.png');
    const ogDest = path.join(reportsDir, 'og-preview.png');
    if (fs.existsSync(ogSrc)) {
      fs.copyFileSync(ogSrc, ogDest);
      console.log('Copied og-preview.png');
    }
  } finally {
    await browser.close();
    server.close();
  }
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
