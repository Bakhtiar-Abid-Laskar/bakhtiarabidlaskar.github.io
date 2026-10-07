#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

const hexRegex = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
let foundErrors = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile()) {
      // tokens.css is the ONLY authorized file to declare hex color tokens
      if (entry.name === 'tokens.css') continue;
      if (entry.name.endsWith('.css') || entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const matches = content.match(hexRegex);
        if (matches) {
          foundErrors.push({
            file: path.relative(rootDir, fullPath),
            matches,
          });
        }
      }
    }
  }
}

walk(srcDir);

if (foundErrors.length > 0) {
  console.error('\n❌ Raw hex color literals detected outside tokens.css:');
  for (const err of foundErrors) {
    console.error(`  - ${err.file}: ${err.matches.join(', ')}`);
  }
  process.exit(1);
}

console.log('✅ Color token check passed: Zero raw hex literals found outside tokens.css.');
process.exit(0);
