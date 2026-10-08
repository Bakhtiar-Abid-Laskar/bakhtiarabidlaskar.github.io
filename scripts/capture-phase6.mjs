import { chromium } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const reportsDir = path.join(rootDir, 'reports', 'phase6');
const PORT = 4145;

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
  console.log(`Capture server running at http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  try {
    // 1. Desktop Corridor (1440x900) - Project 1 (Avalin)
    const ctxDesktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pageDesktop = await ctxDesktop.newPage();
    await pageDesktop.goto(`http://127.0.0.1:${PORT}`);
    await pageDesktop.waitForTimeout(1000);

    // Scroll to #projects
    await pageDesktop.evaluate(() => {
      document.querySelector('#projects')?.scrollIntoView();
    });
    await pageDesktop.waitForTimeout(800);

    await pageDesktop.screenshot({
      path: path.join(reportsDir, 'corridor-desktop-1440.png'),
    });
    console.log('Captured corridor-desktop-1440.png');

    // 2. Click button 3 for Project 3 dwell (South City Hospital)
    const btn3 = pageDesktop.locator('nav[class*="navContainer"] button', { hasText: '3' });
    await btn3.click();
    await pageDesktop.waitForTimeout(1200);

    await pageDesktop.screenshot({
      path: path.join(reportsDir, 'corridor-dwell-project3.png'),
    });
    console.log('Captured corridor-dwell-project3.png');

    // 3. Progress navigation close-up
    const navEl = pageDesktop.locator('nav[class*="navContainer"]');
    await navEl.screenshot({
      path: path.join(reportsDir, 'corridor-progress-nav.png'),
    });
    console.log('Captured corridor-progress-nav.png');
    await ctxDesktop.close();

    // 4. Tablet Fallback (768x1024)
    const ctxTablet = await browser.newContext({ viewport: { width: 768, height: 1024 } });
    const pageTablet = await ctxTablet.newPage();
    await pageTablet.goto(`http://127.0.0.1:${PORT}`);
    await pageTablet.waitForTimeout(800);
    await pageTablet.evaluate(() => {
      document.querySelector('#projects')?.scrollIntoView();
    });
    await pageTablet.waitForTimeout(600);

    await pageTablet.screenshot({
      path: path.join(reportsDir, 'projects-fallback-tablet.png'),
    });
    console.log('Captured projects-fallback-tablet.png');
    await ctxTablet.close();

    // 5. Mobile Fallback (375x812)
    const ctxMobile = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const pageMobile = await ctxMobile.newPage();
    await pageMobile.goto(`http://127.0.0.1:${PORT}`);
    await pageMobile.waitForTimeout(800);
    await pageMobile.evaluate(() => {
      document.querySelector('#projects')?.scrollIntoView();
    });
    await pageMobile.waitForTimeout(600);

    await pageMobile.screenshot({
      path: path.join(reportsDir, 'projects-fallback-mobile.png'),
    });
    console.log('Captured projects-fallback-mobile.png');
    await ctxMobile.close();

    // 6. Copy architectural diagram asset for quick reference in reports
    const diagramSrc = path.join(rootDir, 'assets-src', 'digital-solution-ims.svg');
    if (fs.existsSync(diagramSrc)) {
      fs.copyFileSync(diagramSrc, path.join(reportsDir, 'digital-solution-diagram.svg'));
      console.log('Copied digital-solution-diagram.svg');
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
