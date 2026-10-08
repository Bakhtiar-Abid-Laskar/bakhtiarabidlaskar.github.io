import { chromium } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const reportsDir = path.join(rootDir, 'reports', 'phase4');
const PORT = 4125;

fs.mkdirSync(reportsDir, { recursive: true });

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
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
  console.log(`Server running at http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  try {
    // 1. Desktop 1440
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(reportsDir, 'shell-desktop-1440.png'), fullPage: false });
      
      // Skip link focused screenshot
      await page.keyboard.press('Tab');
      await page.screenshot({ path: path.join(reportsDir, 'shell-skiplink-focused.png') });
      await context.close();
    }

    // 2. Tablet 768
    {
      const context = await browser.newContext({ viewport: { width: 768, height: 1024 } });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(reportsDir, 'shell-tablet-768.png') });
      await context.close();
    }

    // 3. Mobile 390
    {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(reportsDir, 'shell-mobile-390.png') });

      // Open mobile menu
      const toggle = page.locator('button[aria-controls="mobile-nav-dialog"]');
      await toggle.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(reportsDir, 'shell-mobile-menu-open.png') });
      await context.close();
    }

    console.log('All screenshots captured in reports/phase4/');
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

capture().catch(console.error);
