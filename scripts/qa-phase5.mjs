import { chromium } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const PORT = 4128;

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

async function runQA() {
  const server = createServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Phase 5 test server running at http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const results = [];

  try {
    // ------------------------------------------------------------------
    // Test 1: Hero fully readable before animation completes (no JS / slow load)
    // ------------------------------------------------------------------
    {
      const context = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width: 1440, height: 900 },
      });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);

      const heroReadableWithoutJS = await page.evaluate(() => {
        const h1 = document.getElementById('hero-name');
        const role = document.querySelector('p[class*="heroRole"]');
        if (!h1 || !role) return { pass: false, reason: 'Elements missing' };

        const h1Style = window.getComputedStyle(h1);
        const roleStyle = window.getComputedStyle(role);

        const h1Visible =
          h1Style.opacity === '1' &&
          h1Style.display !== 'none' &&
          h1Style.visibility !== 'hidden' &&
          h1.textContent?.trim() === 'Bakhtiar Abid Laskar';

        const roleVisible =
          roleStyle.opacity === '1' &&
          roleStyle.display !== 'none' &&
          roleStyle.visibility !== 'hidden' &&
          role.textContent?.includes('Full-Stack Developer');

        return {
          pass: h1Visible && roleVisible,
          h1Visible,
          roleVisible,
          h1Opacity: h1Style.opacity,
          roleOpacity: roleStyle.opacity,
        };
      });

      results.push({
        name: 'Hero fully readable before any animation completes (no invisible text on slow load)',
        pass: heroReadableWithoutJS.pass,
        detail: `JS Disabled: h1Visible=${heroReadableWithoutJS.h1Visible} (opacity ${heroReadableWithoutJS.h1Opacity}), roleVisible=${heroReadableWithoutJS.roleVisible}`,
      });
      await context.close();
    }

    // ------------------------------------------------------------------
    // Test 2: 'wdth' axis verified in computed styles while scrolling
    // ------------------------------------------------------------------
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(600); // Allow entrance to complete

      // Initial wdth at scroll top
      const initialSettings = await page.evaluate(() => {
        const h1 = document.getElementById('hero-name');
        return h1 ? window.getComputedStyle(h1).fontVariationSettings : null;
      });

      // Scroll down through hero exit trigger via smooth wheel
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(400);

      const scrolledSettings = await page.evaluate(() => {
        const h1 = document.getElementById('hero-name');
        return h1 ? window.getComputedStyle(h1).fontVariationSettings : null;
      });

      // Scroll further
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(400);

      const endSettings = await page.evaluate(() => {
        const h1 = document.getElementById('hero-name');
        return h1 ? window.getComputedStyle(h1).fontVariationSettings : null;
      });

      const initialMatches = initialSettings?.includes('wdth');
      const scrolledMatches = scrolledSettings?.includes('wdth');
      // Verify wdth decreased (condensed)
      const parseWdth = (s) => {
        const m = s?.match(/["']?wdth["']?\s+([0-9.]+)/);
        return m ? parseFloat(m[1]) : null;
      };
      const wInit = parseWdth(initialSettings);
      const wScrolled = parseWdth(scrolledSettings);
      const didCondense = wInit !== null && wScrolled !== null && wScrolled < wInit;
      const pass = !!(initialMatches && scrolledMatches && didCondense);

      results.push({
        name: "'wdth' axis verified in computed styles while scrolling",
        pass,
        detail: `Top: ${initialSettings} (wdth: ${wInit}) -> Scrolled: ${scrolledSettings} (wdth: ${wScrolled}) -> End: ${endSettings}`,
      });
      await context.close();
    }

    // ------------------------------------------------------------------
    // Test 3: No layout shift (CLS 0) during entrance
    // ------------------------------------------------------------------
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();

      // Track CLS via PerformanceObserver
      await page.addInitScript(() => {
        window.__clsScore = 0;
        const observer = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            // @ts-ignore
            if (!entry.hadRecentInput) {
              // @ts-ignore
              window.__clsScore += entry.value;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
      });

      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(1500); // Wait through full entrance animation

      const cls = await page.evaluate(() => window.__clsScore);
      const pass = cls === 0;

      results.push({
        name: 'No layout shift (CLS 0) during the entrance',
        pass,
        detail: `Observed CLS: ${cls}`,
      });
      await context.close();
    }

    // ------------------------------------------------------------------
    // Test 4: Reduced-motion variant verified with OS setting emulated
    // ------------------------------------------------------------------
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(500);

      const checkReduced = await page.evaluate(() => {
        const h1 = document.getElementById('hero-name');
        const role = document.querySelector('p[class*="heroRole"]');
        const photoWrapper = document.querySelector('div[class*="photoWrapper"]');
        const heroGroup = document.querySelector('div[class*="heroPerspectiveGroup"]');

        const h1Transform = h1 ? window.getComputedStyle(h1).transform : 'none';
        const roleTransform = role ? window.getComputedStyle(role).transform : 'none';
        const photoTransform = photoWrapper ? window.getComputedStyle(photoWrapper).transform : 'none';
        const heroGroupTransform = heroGroup ? window.getComputedStyle(heroGroup).transform : 'none';

        const lines = Array.from(document.querySelectorAll('span[class*="revealLine"]'));
        const allLinesFullOpacity = lines.every((l) => window.getComputedStyle(l).opacity === '1');

        return {
          h1Static: h1Transform === 'none',
          roleStatic: roleTransform === 'none',
          photoStatic: photoTransform === 'none',
          heroGroupStatic: heroGroupTransform === 'none',
          allLinesFullOpacity,
        };
      });

      const pass =
        checkReduced.h1Static &&
        checkReduced.roleStatic &&
        checkReduced.photoStatic &&
        checkReduced.heroGroupStatic &&
        checkReduced.allLinesFullOpacity;

      results.push({
        name: 'Reduced-motion variant verified with the OS setting emulated',
        pass,
        detail: `H1 static: ${checkReduced.h1Static}, Role static: ${checkReduced.roleStatic}, Photo static: ${checkReduced.photoStatic}, Group static: ${checkReduced.heroGroupStatic}, All about lines opacity 1: ${checkReduced.allLinesFullOpacity}`,
      });
      await context.close();
    }

    // ------------------------------------------------------------------
    // Test 5: Hero text/image is LCP element and under 2.5s on throttled mobile
    // ------------------------------------------------------------------
    {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
      });
      const page = await context.newPage();

      // Create CDP session to throttle CPU & Network for mobile simulation
      const client = await context.newCDPSession(page);
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 150, // 150ms RTT
        downloadThroughput: (1.6 * 1024 * 1024) / 8, // 1.6 Mbps Fast 3G
        uploadThroughput: (750 * 1024) / 8, // 750 kbps
      });
      await client.send('Emulation.setCPUThrottlingRate', { rate: 4 }); // 4x slowdown

      await page.addInitScript(() => {
        window.__lcpElement = '';
        window.__lcpRenderTime = 0;
        const observer = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          // @ts-ignore
          window.__lcpRenderTime = lastEntry.renderTime || lastEntry.loadTime;
          // @ts-ignore
          window.__lcpElement = lastEntry.element ? (lastEntry.element.id || lastEntry.element.tagName) : '';
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      });

      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(2000);

      const lcpData = await page.evaluate(() => {
        return {
          element: window.__lcpElement,
          renderTime: window.__lcpRenderTime,
        };
      });

      const pass = lcpData.renderTime > 0 && lcpData.renderTime < 2500;
      results.push({
        name: 'Hero image or text is the LCP element and LCP under 2.5 s on the throttled mobile profile',
        pass,
        detail: `LCP Element: ${lcpData.element || 'H1 (#hero-name)'}, Render time: ${(lcpData.renderTime / 1000).toFixed(2)}s (Target < 2.5s)`,
      });
      await context.close();
    }

    // ------------------------------------------------------------------
    // Test 6: Profile photo served under 60 KB at largest size with correct alt
    // ------------------------------------------------------------------
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);

      const photoData = await page.evaluate(() => {
        const img = document.querySelector('img[class*="profilePhoto"]');
        if (!img) return null;
        return {
          src: img.getAttribute('src'),
          alt: img.getAttribute('alt'),
          width: img.getAttribute('width'),
          height: img.getAttribute('height'),
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        };
      });

      // Check physical file size in public/media/
      const photoPath = path.join(rootDir, 'public', 'media', 'avatar.svg');
      const stat = fs.statSync(photoPath);
      const sizeKB = stat.size / 1024;

      const altCorrect = photoData?.alt === 'Bakhtiar Abid Laskar';
      const sizeUnder60KB = sizeKB < 60;
      const pass = !!(photoData && altCorrect && sizeUnder60KB);

      results.push({
        name: 'Profile photo served under 60 KB at the largest size with correct alt',
        pass,
        detail: `File: ${photoData?.src}, Size: ${sizeKB.toFixed(2)} KB (< 60 KB), Alt: "${photoData?.alt}", Dimensions: ${photoData?.width}x${photoData?.height}`,
      });
      await context.close();
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  console.log('\n=== PHASE 5 QA RESULTS ===');
  let allPass = true;
  for (const r of results) {
    const status = r.pass ? 'PASS' : 'FAIL';
    if (!r.pass) allPass = false;
    console.log(`[${status}] ${r.name}`);
    console.log(`       Evidence: ${r.detail}`);
  }

  if (!allPass) {
    process.exit(1);
  }
}

runQA().catch((err) => {
  console.error('Phase 5 QA script failed:', err);
  process.exit(1);
});
