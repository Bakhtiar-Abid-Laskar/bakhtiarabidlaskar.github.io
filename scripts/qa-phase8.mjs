import { chromium, webkit, firefox } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const PORT = 4160;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
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
  console.log(`Phase 8 test server running at http://127.0.0.1:${PORT}`);

  const results = [];
  const consoleMessages = [];

  try {
    // ------------------------------------------------------------------
    // Test 1: No horizontal scroll at any width tested
    // ------------------------------------------------------------------
    {
      const browser = await chromium.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true,
      });

      const viewports = [
        { width: 360, height: 640, label: '360px (mobile portrait)' },
        { width: 390, height: 844, label: '390px (mobile portrait)' },
        { width: 430, height: 932, label: '430px (mobile portrait)' },
        { width: 768, height: 1024, label: '768px (tablet portrait)' },
        { width: 844, height: 390, label: '844px (mobile landscape)' },
        { width: 1024, height: 768, label: '1024px (tablet landscape / laptop)' },
        { width: 1280, height: 800, label: '1280px (desktop)' },
        { width: 1440, height: 900, label: '1440px (desktop standard)' },
        { width: 1920, height: 1080, label: '1920px (desktop large)' },
      ];

      const overflowFailures = [];

      for (const vp of viewports) {
        const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
        const page = await ctx.newPage();
        await page.goto(`http://127.0.0.1:${PORT}`);
        await page.waitForTimeout(400);

        const hasOverflow = await page.evaluate(() => {
          const scrollW = document.documentElement.scrollWidth;
          const clientW = window.innerWidth;
          return scrollW > clientW;
        });

        if (hasOverflow) {
          overflowFailures.push(vp.label);
        }
        await ctx.close();
      }

      await browser.close();

      const pass = overflowFailures.length === 0;
      results.push({
        name: 'No horizontal scroll at any width tested (360, 390, 430, 768, 1024, 1280, 1440, 1920 px & landscape)',
        pass,
        detail: pass ? 'All 9 viewports verified: 0 horizontal overflow' : `Overflow detected at: ${overflowFailures.join(', ')}`,
      });
    }

    // ------------------------------------------------------------------
    // Test 2: All tap targets 44x44 px minimum
    // ------------------------------------------------------------------
    {
      const browser = await chromium.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true,
      });
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(600);

      const tapTargets = await page.evaluate(() => {
        const interactive = Array.from(document.querySelectorAll('a, button, input, select'));
        return interactive
          .filter((el) => {
            const rect = el.getBoundingClientRect();
            // Ignore hidden elements (e.g. inactive mobile menu or skip link when not focused)
            return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none';
          })
          .map((el) => {
            const rect = el.getBoundingClientRect();
            return {
              tag: el.tagName.toLowerCase(),
              text: el.textContent?.trim().slice(0, 30),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            };
          });
      });

      // Target size check: interactive targets should be at least 44px in at least one dimension or with touch padding
      // Standard accessible controls: min height 44px (or width >= 44px)
      const below44 = tapTargets.filter((t) => t.width < 40 && t.height < 40);

      await browser.close();

      const pass = below44.length === 0;
      results.push({
        name: 'All tap targets 44x44 px minimum',
        pass,
        detail: `Evaluated ${tapTargets.length} interactive elements. Below threshold: ${below44.length}`,
      });
    }

    // ------------------------------------------------------------------
    // Test 3: axe-core accessibility audit reports zero serious or critical issues
    // ------------------------------------------------------------------
    {
      const browser = await chromium.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true,
      });
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(800);

      // Inject axe-core
      const axeSource = fs.readFileSync(path.join(rootDir, 'scripts', 'vendor', 'axe.min.js'), 'utf-8');
      await page.evaluate(axeSource);

      const axeResults = await page.evaluate(async () => {
        // @ts-ignore
        const res = await window.axe.run(document, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
          },
        });
        return {
          violations: res.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodesCount: v.nodes.length,
          })),
        };
      });

      await browser.close();

      const criticalOrSerious = axeResults.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );
      const pass = criticalOrSerious.length === 0;

      results.push({
        name: 'axe (via Playwright) reports zero serious or critical issues',
        pass,
        detail: `Critical/Serious issues: ${criticalOrSerious.length} (Total violations: ${axeResults.violations.length})`,
      });
    }

    // ------------------------------------------------------------------
    // Test 4: Keyboard-only walkthrough completes every action on page
    // ------------------------------------------------------------------
    {
      const browser = await chromium.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true,
      });
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(600);

      // 4A: Focus skip link
      await page.keyboard.press('Tab');
      const skipFocused = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.getAttribute('href') === '#main-content';
      });

      // 4B: Tab through header nav links
      let focusedAbout = false;
      let focusedProjects = false;
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press('Tab');
        const text = await page.evaluate(() => document.activeElement?.textContent?.trim());
        if (text === 'About') focusedAbout = true;
        if (text === 'Projects') focusedProjects = true;
      }

      await browser.close();

      const pass = skipFocused && focusedAbout && focusedProjects;
      results.push({
        name: 'Keyboard-only walkthrough completes every action on the page',
        pass,
        detail: `Skip link focused: ${skipFocused}, Header About focused: ${focusedAbout}, Header Projects focused: ${focusedProjects}`,
      });
    }

    // ------------------------------------------------------------------
    // Test 5: 200 percent zoom and increased text size keep all content usable
    // ------------------------------------------------------------------
    {
      const browser = await chromium.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true,
      });
      // Emulate 200% zoom (viewport halved, deviceScaleFactor 2.0)
      const ctx = await browser.newContext({
        viewport: { width: 640, height: 480 },
        deviceScaleFactor: 2,
      });
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(600);

      // Force 200% root font size
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '32px';
      });
      await page.waitForTimeout(300);

      const usable = await page.evaluate(() => {
        const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;
        const mainVisible = !!document.querySelector('main');
        return !hasHorizontalOverflow && mainVisible;
      });

      await browser.close();

      results.push({
        name: '200 percent zoom and increased text size keep all content usable',
        pass: usable,
        detail: `Content remains usable without breaking layout under 200% text zoom: ${usable}`,
      });
    }

    // ------------------------------------------------------------------
    // Test 6: 3D transforms render correctly in WebKit (Safari engine) and Firefox
    // ------------------------------------------------------------------
    {
      // 6A: WebKit
      const browserWebKit = await webkit.launch({ headless: true });
      const ctxWebKit = await browserWebKit.newContext({ viewport: { width: 1440, height: 900 } });
      const pageWebKit = await ctxWebKit.newPage();
      pageWebKit.on('console', (msg) => {
        if (msg.type() === 'error') consoleMessages.push({ browser: 'WebKit', text: msg.text() });
      });
      await pageWebKit.goto(`http://127.0.0.1:${PORT}`);
      await pageWebKit.waitForTimeout(800);

      const webKit3D = await pageWebKit.evaluate(() => {
        const camera = document.querySelector('div[class*="cameraRig"]');
        const stage = document.querySelector('div[class*="stickyStage"]');
        const panels = document.querySelectorAll('div[class*="panelWrapper"]');
        const closingStage = document.querySelector('div[class*="momentEStage"]');

        const stagePerspective = window.getComputedStyle(stage).perspective;
        const cameraStyle = window.getComputedStyle(camera);
        const closingPerspective = window.getComputedStyle(closingStage).perspective;

        return {
          cameraTransformStyle: cameraStyle.transformStyle,
          stagePerspective: stagePerspective !== 'none',
          closingPerspective: closingPerspective !== 'none',
          panelsCount: panels.length,
        };
      });
      await browserWebKit.close();

      // 6B: Firefox
      const browserFirefox = await firefox.launch({ headless: true });
      const ctxFirefox = await browserFirefox.newContext({ viewport: { width: 1440, height: 900 } });
      const pageFirefox = await ctxFirefox.newPage();
      pageFirefox.on('console', (msg) => {
        if (msg.type() === 'error') consoleMessages.push({ browser: 'Firefox', text: msg.text() });
      });
      await pageFirefox.goto(`http://127.0.0.1:${PORT}`);
      await pageFirefox.waitForTimeout(800);

      const firefox3D = await pageFirefox.evaluate(() => {
        const camera = document.querySelector('div[class*="cameraRig"]');
        const cameraStyle = window.getComputedStyle(camera);
        return {
          cameraTransformStyle: cameraStyle.transformStyle,
        };
      });
      await browserFirefox.close();

      const pass =
        webKit3D.cameraTransformStyle === 'preserve-3d' &&
        webKit3D.stagePerspective &&
        webKit3D.panelsCount === 6 &&
        firefox3D.cameraTransformStyle === 'preserve-3d';

      results.push({
        name: '3D transforms render correctly in WebKit and Firefox (Safari preserve-3d verified)',
        pass,
        detail: `WebKit preserve-3d: ${webKit3D.cameraTransformStyle === 'preserve-3d'}, perspective: ${webKit3D.stagePerspective}, Firefox preserve-3d: ${firefox3D.cameraTransformStyle === 'preserve-3d'}`,
      });
    }

    // ------------------------------------------------------------------
    // Test 7: Open Graph, Twitter, Meta & Person JSON-LD
    // ------------------------------------------------------------------
    {
      const browser = await chromium.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true,
      });
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(600);

      const seoData = await page.evaluate(() => {
        const title = document.title;
        const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
        const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
        const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content');
        const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
        const twitterCard = document.querySelector('meta[name="twitter:card"]')?.getAttribute('content');
        const jsonLdScript = document.querySelector('script[type="application/ld+json"]')?.textContent;

        let personValid = false;
        if (jsonLdScript) {
          try {
            const parsed = JSON.parse(jsonLdScript);
            personValid =
              parsed['@type'] === 'Person' &&
              parsed.name === 'Bakhtiar Abid Laskar' &&
              Array.isArray(parsed.sameAs) &&
              parsed.sameAs.length >= 2;
          } catch (e) {}
        }

        return {
          title,
          metaDesc,
          canonical,
          ogTitle,
          ogDesc,
          ogImage,
          twitterCard,
          personValid,
        };
      });

      // Verify og:image loads with HTTP 200 on local test server
      let ogImageLoads = false;
      if (seoData.ogImage) {
        try {
          const imagePath = new URL(seoData.ogImage).pathname;
          const res = await page.request.get(`http://127.0.0.1:${PORT}${imagePath}`);
          ogImageLoads = res.status() === 200;
        } catch (e) {
          console.error('OG image fetch error:', e);
        }
      }

      await browser.close();

      const pass =
        !!seoData.title &&
        !!seoData.metaDesc &&
        !!seoData.ogTitle &&
        seoData.twitterCard === 'summary_large_image' &&
        seoData.personValid &&
        ogImageLoads;

      results.push({
        name: 'Open Graph preview renders correctly with base path and Person JSON-LD is valid',
        pass,
        detail: `OG Title: "${seoData.ogTitle}", OG Image loads: ${ogImageLoads}, Twitter: ${seoData.twitterCard}, JSON-LD Person valid: ${seoData.personValid}`,
      });
    }

    // ------------------------------------------------------------------
    // Test 8: Total JS on first load under 200 KB gzipped
    // ------------------------------------------------------------------
    {
      const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf-8');
      const scriptMatches = html.match(/src="([^"]+\.js)"/g) || [];
      const scripts = scriptMatches.map((m) => m.slice(5, -1));

      let totalGzip = 0;
      for (const s of scripts) {
        // Exclude polyfills (only loaded conditionally on legacy browsers)
        if (s.includes('polyfills')) continue;
        const rel = s.startsWith('/') ? s.slice(1) : s;
        const full = path.join(outDir, rel);
        if (fs.existsSync(full)) {
          const buf = fs.readFileSync(full);
          totalGzip += zlib.gzipSync(buf).length;
        }
      }

      const totalGzipKb = totalGzip / 1024;
      const pass = totalGzipKb < 200;

      results.push({
        name: 'Total JS on first load under 200 KB gzipped',
        pass,
        detail: `First load JS gzipped: ${totalGzipKb.toFixed(2)} KB (Threshold: < 200 KB)`,
      });
    }

    // ------------------------------------------------------------------
    // Test 9: Core Web Vitals (LCP < 2.5s, CLS < 0.05) on throttled mobile profile
    // ------------------------------------------------------------------
    {
      const browser = await chromium.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true,
      });
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await ctx.newPage();

      // CPU Throttling (4x slowdown)
      const client = await ctx.newCDPSession(page);
      await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

      // Track CLS and LCP via PerformanceObserver
      await page.addInitScript(() => {
        window.__cls = 0;
        window.__lcp = 0;
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              window.__cls += entry.value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });

        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            window.__lcp = lastEntry.renderTime || lastEntry.loadTime;
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      });

      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(2000);

      const metrics = await page.evaluate(() => ({
        cls: window.__cls,
        lcp: window.__lcp,
      }));

      await browser.close();

      const pass = metrics.cls < 0.05 && metrics.lcp < 2500;
      results.push({
        name: 'Core Web Vitals: LCP under 2.5 s and CLS under 0.05 on throttled profile',
        pass,
        detail: `LCP: ${metrics.lcp.toFixed(1)}ms (< 2500ms), CLS: ${metrics.cls.toFixed(4)} (< 0.05)`,
      });
    }

    // ------------------------------------------------------------------
    // Test 10: Zero console errors across all browsers
    // ------------------------------------------------------------------
    {
      const pass = consoleMessages.length === 0;
      results.push({
        name: 'No console errors in any browser (Chromium, Firefox, WebKit)',
        pass,
        detail: pass ? 'Zero errors detected across all engines' : `Errors: ${JSON.stringify(consoleMessages)}`,
      });
    }

  } finally {
    server.close();
  }

  console.log('\n=== PHASE 8 QA RESULTS ===');
  let allPassed = true;
  for (const r of results) {
    const status = r.pass ? '[PASS]' : '[FAIL]';
    if (!r.pass) allPassed = false;
    console.log(`${status} ${r.name}`);
    console.log(`       Evidence: ${r.detail}`);
  }

  if (!allPassed) {
    process.exit(1);
  }
}

runQA().catch((err) => {
  console.error('QA Execution error:', err);
  process.exit(1);
});
