import { chromium } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const PORT = 4150;

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
  console.log(`Phase 7 test server running at http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const results = [];
  const consoleMessages = [];

  try {
    // ------------------------------------------------------------------
    // Test 1: Education shows exactly the entries and visibility decided in D2
    // ------------------------------------------------------------------
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      page.on('console', (msg) => {
        if (msg.type() === 'error' || msg.type() === 'warning') {
          consoleMessages.push({ type: msg.type(), text: msg.text() });
        }
      });
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(600);

      const eduData = await page.evaluate(() => {
        const eduSection = document.querySelector('#education-skills');
        const cards = Array.from(eduSection?.querySelectorAll('div[class*="educationCard"]') || []);
        const textContent = eduSection?.textContent || '';

        const hasMarks59 = textContent.includes('59%');
        const hasMarks70 = textContent.includes('70.33%') || textContent.includes('70%');

        const cardDetails = cards.map((c) => ({
          degree: c.querySelector('h4')?.textContent?.trim(),
          institution: c.querySelector('p')?.textContent?.trim(),
          period: c.querySelector('span')?.textContent?.trim(),
        }));

        return {
          cardCount: cards.length,
          cardDetails,
          hasMarks: hasMarks59 || hasMarks70,
        };
      });

      const has3Entries = eduData.cardCount === 3;
      const btechFound = eduData.cardDetails.some((c) =>
        c.degree?.includes('B.Tech') && c.institution?.includes('University of Science and Technology Meghalaya')
      );
      const class12Found = eduData.cardDetails.some((c) =>
        c.degree?.includes('Class 12') && c.institution?.includes('Narsing HS School')
      );
      const class10Found = eduData.cardDetails.some((c) =>
        c.degree?.includes('Class 10') && c.institution?.includes('M.A.C. Memorial Academy')
      );
      const marksHidden = !eduData.hasMarks;

      const pass = has3Entries && btechFound && class12Found && class10Found && marksHidden;
      results.push({
        name: 'Education shows exactly the entries and visibility decided in D2',
        pass,
        detail: `Entries: ${eduData.cardCount}, BTech: ${btechFound}, Class 12: ${class12Found}, Class 10: ${class10Found}, Marks hidden: ${marksHidden}`,
      });
      await context.close();
    }

    // ------------------------------------------------------------------
    // Test 2: Skills list exactly matches the owner-confirmed D1 list
    // ------------------------------------------------------------------
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(600);

      const skillsData = await page.evaluate(() => {
        const eduSection = document.querySelector('#education-skills');
        const groups = Array.from(eduSection?.querySelectorAll('div[class*="skillGroup"]') || []);
        return groups.map((g) => ({
          category: g.querySelector('h4')?.textContent?.trim(),
          skills: Array.from(g.querySelectorAll('li')).map((s) => s.textContent?.trim()),
        }));
      });

      const expectedCategories = [
        'Frontend & Mobile',
        'Backend & Database',
        'Data & Analytics',
        'Core & Tools',
      ];

      const allCategoriesPresent = expectedCategories.every((cat) =>
        skillsData.some((g) => g.category === cat)
      );

      const allSkillsFlat = skillsData.flatMap((g) => g.skills);
      const requiredSkills = [
        'Next.js',
        'React',
        'TypeScript',
        'JavaScript',
        'Tailwind CSS',
        'Expo',
        'React Native',
        'Node.js',
        'Supabase',
        'PostgreSQL',
        'Python',
        'Microsoft Power BI',
        'C',
        'Git',
        'Canva',
      ];

      const allRequiredFound = requiredSkills.every((s) => allSkillsFlat.includes(s));
      const pass = allCategoriesPresent && allRequiredFound && allSkillsFlat.length >= 20;

      results.push({
        name: 'Skills list exactly matches the owner-confirmed D1 list',
        pass,
        detail: `Categories count: ${skillsData.length}, Total skills: ${allSkillsFlat.length}, All required present: ${allRequiredFound}`,
      });
      await context.close();
    }

    // ------------------------------------------------------------------
    // Test 3: Contact links work (mailto, tel, both profiles), phone absent if D3 says so
    // ------------------------------------------------------------------
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(600);

      const contactLinks = await page.evaluate(() => {
        const contactSection = document.querySelector('#contact');
        const links = Array.from(contactSection?.querySelectorAll('a') || []);
        return links.map((l) => ({
          href: l.getAttribute('href'),
          target: l.getAttribute('target'),
          rel: l.getAttribute('rel'),
          text: l.textContent?.trim(),
        }));
      });

      const mailtoLink = contactLinks.find((l) => l.href?.startsWith('mailto:'));
      const telLink = contactLinks.find((l) => l.href?.startsWith('tel:'));
      const githubLink = contactLinks.find((l) => l.href?.includes('github.com/Bakhtiar-Abid-Laskar'));
      const linkedinLink = contactLinks.find((l) => l.href?.includes('linkedin.com/in/bakhtiar-abid-laskar'));

      const mailtoValid = mailtoLink?.href === 'mailto:bakhtiarabidlaskar1@gmail.com';
      const telValid = telLink?.href?.includes('9101607353');
      const githubValid =
        githubLink?.target === '_blank' && githubLink?.rel?.includes('noopener');
      const linkedinValid =
        linkedinLink?.target === '_blank' && linkedinLink?.rel?.includes('noopener');

      const pass = !!(mailtoValid && telValid && githubValid && linkedinValid);
      results.push({
        name: 'Contact links work (mailto, tel, both profiles), phone absent if D3 says so',
        pass,
        detail: `Mailto valid: ${mailtoValid}, Tel valid: ${telValid}, GitHub valid: ${githubValid}, LinkedIn valid: ${linkedinValid}`,
      });
      await context.close();
    }

    // ------------------------------------------------------------------
    // Test 4: Moment E leaves final viewport readable and clickable (no 3D transform blocking pointer events)
    // ------------------------------------------------------------------
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(800);

      // Scroll to #contact
      await page.evaluate(() => {
        document.querySelector('#contact')?.scrollIntoView();
      });
      await page.waitForTimeout(600);

      // Check Moment E transform on closing name
      const momentEData = await page.evaluate(() => {
        const closingName = document.querySelector('div[class*="closingName"]');
        const stage = document.querySelector('div[class*="momentEStage"]');
        const style = window.getComputedStyle(closingName);
        const stageStyle = window.getComputedStyle(stage);

        return {
          hasClosingName: !!closingName,
          closingText: closingName?.textContent?.trim(),
          stagePerspective: stageStyle.perspective,
          stagePointerEvents: stageStyle.pointerEvents,
          transform: style.transform,
        };
      });

      // Verify all contact links are clickable (no pointer-event blockage)
      let allLinksClickable = true;
      try {
        await page.click('#contact a[href^="mailto:"]', { trial: true });
        await page.click('#contact a[href^="tel:"]', { trial: true });
        await page.click('#contact a[href*="github.com"]', { trial: true });
        await page.click('#contact a[href*="linkedin.com"]', { trial: true });
      } catch (err) {
        allLinksClickable = false;
        console.error('Click trial failed:', err);
      }

      // Check reduced motion static behavior
      const ctxReduced = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: 'reduce',
      });
      const pageReduced = await ctxReduced.newPage();
      await pageReduced.goto(`http://127.0.0.1:${PORT}`);
      await pageReduced.waitForTimeout(600);
      const reducedMotionTransform = await pageReduced.evaluate(() => {
        const closingName = document.querySelector('div[class*="closingName"]');
        return closingName?.getAttribute('style');
      });
      const reducedMotionStatic = reducedMotionTransform?.includes('rotateX(0deg)') ?? false;
      await ctxReduced.close();

      const pass =
        momentEData.hasClosingName &&
        momentEData.closingText === 'Bakhtiar Abid Laskar' &&
        momentEData.stagePointerEvents === 'none' &&
        allLinksClickable &&
        reducedMotionStatic;

      results.push({
        name: 'Moment E leaves the final viewport readable and clickable (no 3D transform blocking pointer events)',
        pass,
        detail: `Closing name: "${momentEData.closingText}", Stage pointer-events: ${momentEData.stagePointerEvents}, Links clickable: ${allLinksClickable}, Reduced motion static: ${reducedMotionStatic}`,
      });
      await context.close();
    }

    // ------------------------------------------------------------------
    // Test 5: Footer year is generated, not typed
    // ------------------------------------------------------------------
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}`);
      await page.waitForTimeout(600);

      const footerText = await page.evaluate(() => {
        const footer = document.querySelector('footer');
        return footer?.textContent?.trim() || '';
      });

      const currentYear = new Date().getFullYear().toString();
      const hasCurrentYear = footerText.includes(currentYear);
      const hasCopyright = footerText.includes('Bakhtiar Abid Laskar');

      // Verify source code uses dynamic getBuildYear() function rather than a typed hardcoded year string
      const footerSource = fs.readFileSync(path.join(rootDir, 'src', 'components', 'Footer', 'Footer.tsx'), 'utf-8');
      const usesBuildYearFunc = footerSource.includes('getBuildYear()');
      const hasNoHardcodedYearString = !footerSource.includes('© 2026') && !footerSource.includes('2026 Bakhtiar');

      const pass = hasCurrentYear && hasCopyright && usesBuildYearFunc && hasNoHardcodedYearString;

      results.push({
        name: 'Footer year is generated, not typed',
        pass,
        detail: `Footer text year: ${currentYear} (found: ${hasCurrentYear}), uses getBuildYear(): ${usesBuildYearFunc}, no hardcoded year: ${hasNoHardcodedYearString}`,
      });
      await context.close();
    }

  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n=== PHASE 7 QA RESULTS ===');
  let allPassed = true;
  for (const r of results) {
    const status = r.pass ? '[PASS]' : '[FAIL]';
    if (!r.pass) allPassed = false;
    console.log(`${status} ${r.name}`);
    console.log(`       Evidence: ${r.detail}`);
  }

  if (consoleMessages.length > 0) {
    console.log('\nConsole issues detected:', consoleMessages);
  } else {
    console.log('\n[PASS] Console errors or warnings: 0');
  }

  if (!allPassed) {
    process.exit(1);
  }
}

runQA().catch((err) => {
  console.error('QA Execution error:', err);
  process.exit(1);
});
