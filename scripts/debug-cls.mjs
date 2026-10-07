import { chromium } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const PORT = 4131;

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

async function debugCLS() {
  const server = createServer();
  await new Promise((resolve) => server.listen(PORT, resolve));

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.addInitScript(() => {
      window.__shifts = [];
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // @ts-ignore
          if (!entry.hadRecentInput) {
            // @ts-ignore
            window.__shifts.push({
              // @ts-ignore
              value: entry.value,
              // @ts-ignore
              startTime: entry.startTime,
              // @ts-ignore
              sources: (entry.sources || []).map((s) => ({
                node: s.node ? s.node.nodeName + (s.node.id ? '#' + s.node.id : '') + (s.node.className ? '.' + s.node.className : '') : 'unknown',
              })),
            });
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
    });

    await page.goto(`http://127.0.0.1:${PORT}`);
    await page.waitForTimeout(2000);

    const shifts = await page.evaluate(() => window.__shifts);
    console.log('Layout Shifts with startTime:', JSON.stringify(shifts, null, 2));
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

debugCLS().catch(console.error);
