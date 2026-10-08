import { chromium } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const PORT = 4129;

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

async function debug() {
  const server = createServer();
  await new Promise((resolve) => server.listen(PORT, resolve));

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${PORT}`);
    await page.waitForTimeout(1000);

    const info = await page.evaluate(() => {
      // @ts-ignore
      const triggers = window.ScrollTrigger ? window.ScrollTrigger.getAll().map(t => ({
        trigger: t.trigger?.id || t.trigger?.className,
        start: t.start,
        end: t.end,
        progress: t.progress,
      })) : 'no ScrollTrigger';

      const h1 = document.getElementById('hero-name');
      const style = h1 ? h1.style.fontVariationSettings : 'no h1';
      const computed = h1 ? window.getComputedStyle(h1).fontVariationSettings : 'no h1';

      return { triggers, style, computed, scrollY: window.scrollY };
    });
    console.log('Initial debug info:', info);

    // Simulate mouse wheel scroll or Lenis scroll
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(500);

    const scrolledInfo = await page.evaluate(() => {
      // @ts-ignore
      const triggers = window.ScrollTrigger ? window.ScrollTrigger.getAll().map(t => ({
        trigger: t.trigger?.id || t.trigger?.className,
        start: t.start,
        end: t.end,
        progress: t.progress,
      })) : 'no ScrollTrigger';

      const h1 = document.getElementById('hero-name');
      const style = h1 ? h1.style.fontVariationSettings : 'no h1';
      const computed = h1 ? window.getComputedStyle(h1).fontVariationSettings : 'no h1';

      return { triggers, style, computed, scrollY: window.scrollY };
    });
    console.log('After mouse.wheel(0, 500):', scrolledInfo);

  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

debug().catch(console.error);
