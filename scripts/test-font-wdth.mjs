import { chromium } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const PORT = 4127;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
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

async function testFont() {
  const server = createServer();
  await new Promise((resolve) => server.listen(PORT, resolve));

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${PORT}`);
    await page.evaluate(() => document.fonts.ready);

    const result = await page.evaluate(() => {
      const h1 = document.getElementById('hero-title');
      if (!h1) return { error: 'No hero-title' };

      // Set display inline-block to measure natural text width
      h1.style.display = 'inline-block';

      // Test wide
      h1.style.fontVariationSettings = "'wdth' 125";
      const wideComputed = window.getComputedStyle(h1).fontVariationSettings;
      const wideWidth = h1.getBoundingClientRect().width;

      // Test condensed
      h1.style.fontVariationSettings = "'wdth' 85";
      const condensedComputed = window.getComputedStyle(h1).fontVariationSettings;
      const condensedWidth = h1.getBoundingClientRect().width;

      return {
        fontFamily: window.getComputedStyle(h1).fontFamily,
        wideComputed,
        wideWidth,
        condensedComputed,
        condensedWidth,
        widthDifference: wideWidth - condensedWidth,
      };
    });

    console.log('Next.js Built Font Axis Verification (inline-block):', result);
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

testFont().catch(console.error);
