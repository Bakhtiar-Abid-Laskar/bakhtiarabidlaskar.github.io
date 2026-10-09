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
    });
    const page = await desktopContext.newPage();
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    // Hero screenshot
    await page.screenshot({ path: path.join(outDir, 'hero-desktop.png') });
    console.log('Saved hero-desktop.png');

    // Scroll to projects
    await page.evaluate(() => {
      document.getElementById('projects')?.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, 'projects-desktop.png') });
    console.log('Saved projects-desktop.png');

    // Scroll to contact
    await page.evaluate(() => {
      document.getElementById('contact')?.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, 'contact-desktop.png') });
    console.log('Saved contact-desktop.png');

    // Full page desktop
    await page.screenshot({ path: path.join(outDir, 'fullpage-desktop.png'), fullPage: true });
    console.log('Saved fullpage-desktop.png');

    await desktopContext.close();

    // 2. Mobile 390x844
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 30000 });
    await mobilePage.waitForTimeout(1500);
    await mobilePage.screenshot({ path: path.join(outDir, 'hero-mobile.png') });
    await mobilePage.screenshot({ path: path.join(outDir, 'fullpage-mobile.png'), fullPage: true });
    console.log('Saved mobile screenshots');

    await mobileContext.close();
  } finally {
    await browser.close();
  }
}

capture().catch(console.error);
