import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const styleguidePath = 'file:///' + path.join(rootDir, 'public', 'styleguide.html').replace(/\\/g, '/');
const outDir = path.join(rootDir, 'reports', 'phase2');

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  // 1. Desktop full-page screenshot
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(styleguidePath, { waitUntil: 'load' });
  await desktopPage.screenshot({
    path: path.join(outDir, 'styleguide-desktop.png'),
    fullPage: true,
  });
  console.log('Saved reports/phase2/styleguide-desktop.png');

  // 2. Focus ring verification screenshot
  await desktopPage.focus('#btn-light-primary');
  await desktopPage.screenshot({
    path: path.join(outDir, 'styleguide-focus.png'),
    clip: { x: 100, y: 700, width: 800, height: 400 },
  });
  console.log('Saved reports/phase2/styleguide-focus.png');

  // 3. Mobile screenshot
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(styleguidePath, { waitUntil: 'load' });
  await mobilePage.screenshot({
    path: path.join(outDir, 'styleguide-mobile.png'),
    fullPage: true,
  });
  console.log('Saved reports/phase2/styleguide-mobile.png');

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
