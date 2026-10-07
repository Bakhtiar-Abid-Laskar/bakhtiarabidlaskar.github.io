import { chromium } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const reportsDir = path.join(rootDir, 'reports', 'phase5');
const PORT = 4132;

fs.mkdirSync(reportsDir, { recursive: true });

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
  console.log(`Screenshot server running at http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  try {
    // 1. Desktop 1440 - Hero
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(reportsDir, 'hero-desktop-1440.png') });

      // Scroll down to scrub hero exit (Moment A)
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(reportsDir, 'hero-scrolled-wdth.png') });

      // Scroll to About section (Moment D)
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(reportsDir, 'about-desktop-1440.png') });

      await context.close();
    }

    // 2. Mobile 390 - Hero & About
    {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(reportsDir, 'hero-mobile-390.png') });

      // Scroll to about on mobile
      await page.mouse.wheel(0, 700);
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(reportsDir, 'about-mobile-390.png') });

      await context.close();
    }

    // 3. Reduced Motion
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(reportsDir, 'reduced-motion-hero-about.png') });
      await context.close();
    }

    console.log('All Phase 5 screenshots captured in reports/phase5/');
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

capture().catch(console.error);
