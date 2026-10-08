import { chromium } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const reportsDir = path.join(rootDir, 'reports', 'phase7');
const PORT = 4155;

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
  console.log(`Phase 7 capture server running at http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  try {
    // 1. Desktop (1440x900) - Education and Skills
    const ctxDesktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pageDesktop = await ctxDesktop.newPage();
    await pageDesktop.goto(`http://127.0.0.1:${PORT}`);
    await pageDesktop.waitForTimeout(800);

    const eduEl = pageDesktop.locator('#education-skills');
    await eduEl.scrollIntoViewIfNeeded();
    await pageDesktop.waitForTimeout(600);
    await eduEl.screenshot({
      path: path.join(reportsDir, 'education-skills-desktop-1440.png'),
    });
    console.log('Captured education-skills-desktop-1440.png');

    // 2. Desktop (1440x900) - Contact & Moment E
    const contactEl = pageDesktop.locator('#contact');
    await contactEl.scrollIntoViewIfNeeded();
    await pageDesktop.waitForTimeout(600);
    await contactEl.screenshot({
      path: path.join(reportsDir, 'contact-momentE-desktop-1440.png'),
    });
    console.log('Captured contact-momentE-desktop-1440.png');

    // 3. Desktop (1440x900) - Footer
    const footerEl = pageDesktop.locator('footer');
    await footerEl.scrollIntoViewIfNeeded();
    await pageDesktop.waitForTimeout(400);
    await footerEl.screenshot({
      path: path.join(reportsDir, 'footer-desktop-1440.png'),
    });
    console.log('Captured footer-desktop-1440.png');
    await ctxDesktop.close();

    // 4. Mobile (390x844) - Contact & Moment E
    const ctxMobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const pageMobile = await ctxMobile.newPage();
    await pageMobile.goto(`http://127.0.0.1:${PORT}`);
    await pageMobile.waitForTimeout(800);
    const mobileContact = pageMobile.locator('#contact');
    await mobileContact.scrollIntoViewIfNeeded();
    await pageMobile.waitForTimeout(600);
    await mobileContact.screenshot({
      path: path.join(reportsDir, 'contact-momentE-mobile-390.png'),
    });
    console.log('Captured contact-momentE-mobile-390.png');
    await ctxMobile.close();

    // 5. Reduced Motion variant
    const ctxReduced = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    });
    const pageReduced = await ctxReduced.newPage();
    await pageReduced.goto(`http://127.0.0.1:${PORT}`);
    await pageReduced.waitForTimeout(600);
    const reducedContact = pageReduced.locator('#contact');
    await reducedContact.scrollIntoViewIfNeeded();
    await pageReduced.waitForTimeout(600);
    await reducedContact.screenshot({
      path: path.join(reportsDir, 'reduced-motion-momentE.png'),
    });
    console.log('Captured reduced-motion-momentE.png');
    await ctxReduced.close();
  } finally {
    await browser.close();
    server.close();
  }
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
