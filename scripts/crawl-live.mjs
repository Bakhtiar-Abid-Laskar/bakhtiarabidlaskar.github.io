#!/usr/bin/env node

const LIVE_ROOT = 'https://bakhtiar-abid-laskar.github.io/bakhtiarabidlaskar.github.io/';

async function crawlLive() {
  console.log(`Starting live production crawl of ${LIVE_ROOT}...\n`);

  const visited = new Set();
  const queue = [LIVE_ROOT];
  const failed = [];
  const passed = [];

  while (queue.length > 0) {
    const currentUrl = queue.shift();
    if (visited.has(currentUrl)) continue;
    visited.add(currentUrl);

    try {
      const resp = await fetch(currentUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
      });

      if (resp.status !== 200) {
        console.error(`❌ [${resp.status}] ${currentUrl}`);
        failed.push({ url: currentUrl, status: resp.status });
        continue;
      }

      console.log(`✔ [200 OK] ${currentUrl}`);
      passed.push(currentUrl);

      const contentType = resp.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        const text = await resp.text();

        // Extract scripts, stylesheets, images, links
        const assetMatches = text.matchAll(/(?:src|href)=["']([^"']+)["']/g);
        for (const match of assetMatches) {
          const rawUrl = match[1];
          if (
            rawUrl.startsWith('mailto:') ||
            rawUrl.startsWith('tel:') ||
            rawUrl.startsWith('#')
          ) {
            continue;
          }

          let resolved;
          if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
            // Only crawl internal assets under the live root or same domain
            if (rawUrl.startsWith('https://bakhtiar-abid-laskar.github.io/bakhtiarabidlaskar.github.io/')) {
              resolved = rawUrl;
            } else {
              continue;
            }
          } else if (rawUrl.startsWith('/bakhtiarabidlaskar.github.io/')) {
            resolved = `https://bakhtiar-abid-laskar.github.io${rawUrl}`;
          } else if (rawUrl.startsWith('/')) {
            resolved = `https://bakhtiar-abid-laskar.github.io/bakhtiarabidlaskar.github.io${rawUrl}`;
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

  console.log(`\nLive crawl finished. Checked ${visited.size} internal resources.`);
  if (failed.length > 0) {
    console.error(`❌ Detected ${failed.length} broken links or 404s:`);
    failed.forEach((f) => console.error(JSON.stringify(f)));
    process.exit(1);
  } else {
    console.log('✅ ZERO 404s: Every live asset, chunk, stylesheet, icon, and image returned HTTP 200 OK.');
    process.exit(0);
  }
}

crawlLive();
