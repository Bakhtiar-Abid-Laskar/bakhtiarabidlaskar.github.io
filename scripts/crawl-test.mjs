#!/usr/bin/env node

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const BASE_PATH = '/bakhtiarabidlaskar.github.io';
const PORT = 4123;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.woff2': 'font/woff2',
};

// Create a static server simulating GitHub Pages project path
const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  if (!urlPath.startsWith(BASE_PATH)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found (Outside Base Path)');
    return;
  }

  let subPath = urlPath.slice(BASE_PATH.length);
  if (subPath === '' || subPath === '/') {
    subPath = '/index.html';
  } else if (!path.extname(subPath)) {
    // Check if subpath/index.html exists
    if (fs.existsSync(path.join(outDir, subPath, 'index.html'))) {
      subPath = path.join(subPath, 'index.html');
    }
  }

  const filePath = path.join(outDir, subPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(`404 Not Found: ${filePath}`);
  }
});

server.listen(PORT, async () => {
  console.log(`Server listening at http://127.0.0.1:${PORT}${BASE_PATH}/`);

  const visited = new Set();
  const queue = [`http://127.0.0.1:${PORT}${BASE_PATH}/`];
  let failed = [];

  while (queue.length > 0) {
    const currentUrl = queue.shift();
    if (visited.has(currentUrl)) continue;
    visited.add(currentUrl);

    try {
      const resp = await fetch(currentUrl);
      if (resp.status !== 200) {
        console.error(`❌ [${resp.status}] ${currentUrl}`);
        failed.push({ url: currentUrl, status: resp.status });
        continue;
      }
      console.log(`✔ [200 OK] ${currentUrl}`);

      const contentType = resp.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        const text = await resp.text();

        // Extract scripts, stylesheets, images, links
        const assetMatches = text.matchAll(/(?:src|href)=["']([^"']+)["']/g);
        for (const match of assetMatches) {
          const rawUrl = match[1];
          if (
            rawUrl.startsWith('http://') ||
            rawUrl.startsWith('https://') ||
            rawUrl.startsWith('mailto:') ||
            rawUrl.startsWith('tel:') ||
            rawUrl.startsWith('#')
          ) {
            continue;
          }

          let resolved;
          if (rawUrl.startsWith('/')) {
            resolved = `http://127.0.0.1:${PORT}${rawUrl}`;
          } else {
            resolved = new URL(rawUrl, currentUrl).toString();
          }

          if (!visited.has(resolved) && !queue.includes(resolved)) {
            queue.push(resolved);
          }
        }
      }
    } catch (err) {
      console.error(`❌ Fetch error for ${currentUrl}:`, err.message);
      failed.push({ url: currentUrl, error: err.message });
    }
  }

  server.close(() => {
    console.log(`\nCrawl complete. Checked ${visited.size} internal resources.`);
    if (failed.length > 0) {
      console.error(`❌ Failed with ${failed.length} broken links or 404s:`);
      failed.forEach((f) => console.error(JSON.stringify(f)));
      process.exit(1);
    } else {
      console.log('✅ ZERO 404s: Every asset, font, chunk, and link resolved with 200 OK.');
      process.exit(0);
    }
  });
});
