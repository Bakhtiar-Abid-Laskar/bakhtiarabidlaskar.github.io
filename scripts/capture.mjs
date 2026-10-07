import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const assetsSrcDir = path.join(rootDir, 'assets-src');

fs.mkdirSync(assetsSrcDir, { recursive: true });

const liveProjects = [
  {
    id: 'avalin-laboratories',
    url: 'https://www.avalinlaboratories.com/',
  },
  {
    id: 'nilakshith-enterprises',
    url: 'https://www.nilakshithenterprise.com/',
  },
  {
    id: 'southcity-hospital',
    url: 'https://southcityhospital.in/',
  },
  {
    id: 'ustm-academia',
    url: 'https://ustm-academia.vercel.app/',
  },
];

async function captureLiveSites() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  try {
    for (const proj of liveProjects) {
      console.log(`Capturing ${proj.id} from ${proj.url}...`);
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      });
      const page = await context.newPage();

      try {
        await page.goto(proj.url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch (err) {
        console.warn(`Networkidle timed out for ${proj.url}, waiting for domcontentloaded...`);
        try {
          await page.goto(proj.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        } catch (e2) {
          console.error(`Failed navigation for ${proj.url}:`, e2);
        }
      }

      await page.waitForTimeout(2000);

      const targetPath = path.join(assetsSrcDir, `${proj.id}.png`);
      await page.screenshot({ path: targetPath, fullPage: false });
      console.log(`Saved capture to ${targetPath} (${fs.statSync(targetPath).size} bytes)`);

      await context.close();
    }
  } finally {
    await browser.close();
  }
}

captureLiveSites().catch(console.error);
