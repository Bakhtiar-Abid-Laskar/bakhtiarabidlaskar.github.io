#!/usr/bin/env node

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const projectsFile = path.join(rootDir, 'src', 'content', 'projects.ts');
const originalContent = fs.readFileSync(projectsFile, 'utf8');

const testCases = [
  {
    name: 'Proof 1: Missing source link',
    mutation: (content) =>
      content.replace(
        "source: 'https://github.com/Bakhtiar-Abid-Laskar/AVALIN-LABORTORIES'",
        "source: ''"
      ),
    expectedError: 'Missing or empty links.source',
  },
  {
    name: 'Proof 2: Non-https live URL',
    mutation: (content) =>
      content.replace(
        "live: 'https://www.avalinlaboratories.com/'",
        "live: 'http://www.avalinlaboratories.com/'"
      ),
    expectedError: 'Live link must use https://',
  },
  {
    name: 'Proof 3: Duplicate order',
    mutation: (content) =>
      content.replace(
        "order: 2,",
        "order: 1,"
      ),
    expectedError: 'Project orders must be exactly 1..6 with no gaps or duplicates',
  },
  {
    name: 'Proof 4: Long summary (> 45 words)',
    mutation: (content) => {
      const longWords = Array(46).fill('word').join(' ');
      return content.replace(
        "Corporate website for Avalin Laboratories. A responsive Next.js platform with a consistent design system, structured product-led sections and clear navigation across desktop, tablet and mobile.",
        longWords
      );
    },
    expectedError: 'Summary exceeds 45 words (46 words)',
  },
  {
    name: 'Proof 5: Missing media file',
    mutation: (content) =>
      content.replace(
        "src: '/media/projects/avalin-laboratories.png'",
        "src: '/media/projects/does-not-exist.png'"
      ),
    expectedError: 'Media file not found',
  },
];

console.log('=== RUNNING 5 VALIDATION PROOFS ===\n');

let allPassed = true;

for (const tc of testCases) {
  try {
    const mutated = tc.mutation(originalContent);
    fs.writeFileSync(projectsFile, mutated, 'utf8');

    let output = '';
    let exitedWithError = false;
    try {
      execSync('node --experimental-strip-types scripts/validate-content.mjs', {
        cwd: rootDir,
        encoding: 'utf8',
        stdio: 'pipe',
      });
    } catch (err) {
      exitedWithError = true;
      output = (err.stdout || '') + (err.stderr || '');
    }

    if (!exitedWithError) {
      console.error(`❌ [FAIL] ${tc.name}: Expected validation failure, but script passed!`);
      allPassed = false;
    } else if (!output.includes(tc.expectedError)) {
      console.error(
        `❌ [FAIL] ${tc.name}: Failed as expected, but missing error text "${tc.expectedError}". Output:\n${output}`
      );
      allPassed = false;
    } else {
      console.log(`✅ [PASS] ${tc.name}`);
      console.log(`   Captured Expected Error: "${tc.expectedError}"`);
      const matchedLine = output
        .split('\n')
        .find((l) => l.includes(tc.expectedError));
      if (matchedLine) console.log(`   Output detail: ${matchedLine.trim()}`);
    }
  } finally {
    // Restore original file
    fs.writeFileSync(projectsFile, originalContent, 'utf8');
  }
}

console.log('\nRestoring original projects.ts...');
fs.writeFileSync(projectsFile, originalContent, 'utf8');

// Final sanity check
const finalRun = execSync('node --experimental-strip-types scripts/validate-content.mjs', {
  cwd: rootDir,
  encoding: 'utf8',
});
console.log('Clean sanity check:', finalRun.trim());

if (!allPassed) {
  process.exit(1);
}
console.log('\nAll 5 failure proofs succeeded.');
