#!/usr/bin/env node

/**
 * Build-time content validation script.
 * Section 4.3 specification:
 * Fails the build if:
 * 1. Orders are not exactly 1..6 with no gaps.
 * 2. Any links.source is missing.
 * 3. Any live URL is not https.
 * 4. A summary exceeds 45 words.
 * 5. Any media file is missing.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects } from '../src/content/projects.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const errors = [];

// 1. Verify project count
if (!Array.isArray(projects) || projects.length !== 6) {
  errors.push(`Expected exactly 6 projects, found ${projects?.length ?? 0}.`);
}

// 2. Verify orders are exactly 1..6 with no duplicates or gaps
const orders = projects.map((p) => p.order).sort((a, b) => a - b);
const expectedOrders = [1, 2, 3, 4, 5, 6];
const ordersMatch =
  orders.length === expectedOrders.length &&
  orders.every((val, idx) => val === expectedOrders[idx]);

if (!ordersMatch) {
  errors.push(
    `Project orders must be exactly 1..6 with no gaps or duplicates. Found: [${orders.join(', ')}]`
  );
}

// Check each project
for (const p of projects) {
  const pId = p.id || p.name || 'unnamed';

  // 3. Verify links.source is present and non-empty
  if (!p.links || !p.links.source || typeof p.links.source !== 'string' || !p.links.source.trim()) {
    errors.push(`[${pId}] Missing or empty links.source.`);
  }

  // 4. Verify live URL is HTTPS if present
  if (p.links && p.links.live) {
    if (!p.links.live.startsWith('https://')) {
      errors.push(`[${pId}] Live link must use https://. Found: "${p.links.live}"`);
    }
  }

  // 5. Verify summary <= 45 words
  if (!p.summary || typeof p.summary !== 'string') {
    errors.push(`[${pId}] Missing or invalid summary.`);
  } else {
    const wordCount = p.summary.trim().split(/\s+/).length;
    if (wordCount > 45) {
      errors.push(
        `[${pId}] Summary exceeds 45 words (${wordCount} words): "${p.summary}"`
      );
    }
  }

  // 6. Verify media file exists
  if (!p.media || !p.media.src || typeof p.media.src !== 'string') {
    errors.push(`[${pId}] Missing media.src.`);
  } else {
    // Strip leading slash for relative resolution in public/
    const relPath = p.media.src.startsWith('/') ? p.media.src.slice(1) : p.media.src;
    const mediaFullPath = path.join(publicDir, relPath);
    if (!fs.existsSync(mediaFullPath)) {
      errors.push(
        `[${pId}] Media file not found: "${p.media.src}" (resolved to: ${mediaFullPath})`
      );
    }
  }
}

if (errors.length > 0) {
  console.error('\n❌ Content validation failed with the following errors:');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  console.error('');
  process.exit(1);
}

console.log('✅ Content validation passed: all 6 projects verified successfully.');
process.exit(0);
