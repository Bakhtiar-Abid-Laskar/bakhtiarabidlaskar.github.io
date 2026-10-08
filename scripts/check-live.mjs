import https from 'node:https';

const liveUrl = 'https://bakhtiar-abid-laskar.github.io/bakhtiarabidlaskar.github.io/';

function fetchLive() {
  return new Promise((resolve) => {
    https.get(liveUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const isV2 = data.includes('__variable_') || data.includes('Avalin Laboratories') || data.includes('Next.js');
        const hasLegacyTitle = data.includes('Personal Portfolio Website');
        resolve({
          statusCode: res.statusCode,
          isV2,
          hasLegacyTitle,
          contentLength: data.length
        });
      });
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function main() {
  console.log(`Checking live URL: ${liveUrl}`);
  const res = await fetchLive();
  console.log('Result:', JSON.stringify(res, null, 2));
}

main();
