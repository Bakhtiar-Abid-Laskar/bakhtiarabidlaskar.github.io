import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';

const html = fs.readFileSync('out/index.html', 'utf-8');
const scriptMatches = html.match(/src="([^"]+\.js)"/g) || [];
const scripts = scriptMatches.map((m) => m.slice(5, -1));

console.log('HOMEPAGE SCRIPTS:');
let totalGzip = 0;
let totalRaw = 0;

for (const s of scripts) {
  const rel = s.startsWith('/') ? s.slice(1) : s;
  const full = path.join('out', rel);
  if (fs.existsSync(full)) {
    const buf = fs.readFileSync(full);
    const gz = zlib.gzipSync(buf).length;
    totalRaw += buf.length;
    totalGzip += gz;
    console.log(`${rel} | raw: ${(buf.length / 1024).toFixed(1)} KB | gzip: ${(gz / 1024).toFixed(1)} KB`);
  }
}

console.log('---');
console.log(`TOTAL FIRST LOAD JS RAW: ${(totalRaw / 1024).toFixed(2)} KB`);
console.log(`TOTAL FIRST LOAD JS GZIPPED: ${(totalGzip / 1024).toFixed(2)} KB`);
