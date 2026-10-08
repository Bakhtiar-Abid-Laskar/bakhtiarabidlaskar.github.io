import { chromium } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const reportsDir = path.join(rootDir, 'reports', 'phase9');
const PORT = 4158;

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
  console.log(`Phase 9 capture server running at http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  try {
    const viewports = [
      { width: 390, height: 844, filename: 'fullpage-mobile-390.png' },
      { width: 768, height: 1024, filename: 'fullpage-tablet-768.png' },
      { width: 1440, height: 900, filename: 'fullpage-desktop-1440.png' },
    ];

    for (const vp of viewports) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(800);

      // Smoothly scroll down to bottom and back up to trigger lazy-loaded assets and layout completion
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 300;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              window.scrollTo(0, 0);
              resolve();
            }
          }, 50);
        });
      });

      await page.waitForTimeout(500);

      await page.screenshot({
        path: path.join(reportsDir, vp.filename),
        fullPage: true,
      });
      console.log(`Captured ${vp.filename} (fullPage)`);
      await ctx.close();
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
