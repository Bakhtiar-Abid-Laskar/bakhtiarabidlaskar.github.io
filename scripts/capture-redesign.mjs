import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'reports', 'redesign');

fs.mkdirSync(outDir, { recursive: true });

async function capture() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  try {
    // 1. Desktop 1440x900
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      hasTouch: false,
    });
    const page = await desktopContext.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    // Hero screenshot
    await page.screenshot({ path: path.join(outDir, 'hero-desktop.png') });
    console.log('Saved hero-desktop.png');

    await desktopContext.close();

    // 2. Responsive Mobile Suite: 320px, 360px, 390px, 430px
    const mobileWidths = [
      { name: '320px', width: 320, height: 640 },
      { name: '360px', width: 360, height: 740 },
      { name: '390px', width: 390, height: 844 },
      { name: '430px', width: 430, height: 932 },
    ];

    for (const item of mobileWidths) {
      const mobileContext = await browser.newContext({
        viewport: { width: item.width, height: item.height },
        isMobile: true,
        hasTouch: true,
      });
      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
      await mobilePage.waitForTimeout(1200);

      // Verify no horizontal overflow
      const overflow = await mobilePage.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          cursorCount: document.querySelectorAll('[class*="dot"], [class*="ring"], [class*="mobileAura"]').length,
        };
      });

      console.log(`[${item.name}] Overflow: ${overflow.hasOverflow ? 'FAIL' : 'PASS'} (scrollWidth: ${overflow.scrollWidth}, clientWidth: ${overflow.clientWidth}), Custom cursor elements mounted: ${overflow.cursorCount}`);

      if (item.width === 390) {
        await mobilePage.screenshot({ path: path.join(outDir, 'hero-mobile.png') });
        await mobilePage.screenshot({ path: path.join(outDir, 'fullpage-mobile.png'), fullPage: true });
      }

      await mobileContext.close();
    }
  } finally {
    await browser.close();
  }
}

capture().catch(console.error);
