import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const reportsDir = path.join(rootDir, 'reports', 'phase10');
const liveUrl = 'https://bakhtiar-abid-laskar.github.io/bakhtiarabidlaskar.github.io/';

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

async function verifyLive() {
  console.log(`Verifying live URL: ${liveUrl}\n`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  try {
    // 1. Desktop Verification & Live Capture
    const ctxDesktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pageDesktop = await ctxDesktop.newPage();
    const consoleErrors = [];
    pageDesktop.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await pageDesktop.goto(liveUrl);
    await pageDesktop.waitForTimeout(1000);

    // Scroll through each section
    const sections = ['#hero', '#about', '#projects', '#education-skills', '#contact'];
    for (const sec of sections) {
      const el = pageDesktop.locator(sec);
      await el.scrollIntoViewIfNeeded();
      await pageDesktop.waitForTimeout(500);
    }

    // Scroll back to top
    await pageDesktop.evaluate(() => window.scrollTo(0, 0));
    await pageDesktop.waitForTimeout(600);

    // Capture desktop live screenshot
    await pageDesktop.screenshot({
      path: path.join(reportsDir, 'live-desktop-1440.png'),
    });
    console.log('✔ Captured live-desktop-1440.png');
    await ctxDesktop.close();

    // 2. Mobile Verification & Live Capture
    const ctxMobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const pageMobile = await ctxMobile.newPage();
    pageMobile.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await pageMobile.goto(liveUrl);
    await pageMobile.waitForTimeout(1000);

    // Test mobile menu
    const menuBtn = pageMobile.locator('button[aria-controls="mobile-nav-dialog"]');
    await menuBtn.click();
    await pageMobile.waitForTimeout(400);

    await pageMobile.screenshot({
      path: path.join(reportsDir, 'live-mobile-menu-open.png'),
    });
    console.log('✔ Captured live-mobile-menu-open.png');

    // Close menu
    await pageMobile.keyboard.press('Escape');
    await pageMobile.waitForTimeout(400);

    // Scroll through sections on mobile
    for (const sec of sections) {
      const el = pageMobile.locator(sec);
      await el.scrollIntoViewIfNeeded();
      await pageMobile.waitForTimeout(400);
    }

    await pageMobile.screenshot({
      path: path.join(reportsDir, 'live-mobile-390.png'),
    });
    console.log('✔ Captured live-mobile-390.png');
    await ctxMobile.close();

    console.log(`\nLive Verification Complete.`);
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.error(consoleErrors);
      process.exit(1);
    } else {
      console.log('✅ ZERO console errors on live production site.');
    }
  } finally {
    await browser.close();
  }
}

verifyLive().catch(err => {
  console.error(err);
  process.exit(1);
});
