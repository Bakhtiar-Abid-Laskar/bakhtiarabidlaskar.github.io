import https from 'node:https';
import http from 'node:http';

const urls = [
  'https://www.avalinlaboratories.com/',
  'https://github.com/Bakhtiar-Abid-Laskar/AVALIN-LABORTORIES',
  'https://www.nilakshithenterprise.com/',
  'https://github.com/Bakhtiar-Abid-Laskar/Nilakshith-Enterprises',
  'https://southcityhospital.in/',
  'https://github.com/Bakhtiar-Abid-Laskar/SouthCityHospital',
  'https://github.com/Bakhtiar-Abid-Laskar/DIGITAL-SOLUTION-INTERNAL-MANAGEMENT-SYSTEM',
  'https://ustm-academia.vercel.app/',
  'https://github.com/Bakhtiar-Abid-Laskar/USTM_academia',
  'https://github.com/Bakhtiar-Abid-Laskar/Ecommerce-Sales-Analysis-Dashboard-Using-MS-Power-BI',
  'https://github.com/Bakhtiar-Abid-Laskar',
  'https://www.linkedin.com/in/bakhtiar-abid-laskar/',
];

async function checkUrl(targetUrl) {
  return new Promise((resolve) => {
    try {
      const u = new URL(targetUrl);
      const req = https.request(
        u,
        {
          method: 'GET',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          timeout: 10000,
        },
        (res) => {
          resolve({ url: targetUrl, status: res.statusCode });
        }
      );
      req.on('error', (err) => resolve({ url: targetUrl, status: 'ERROR', error: err.message }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ url: targetUrl, status: 'TIMEOUT' });
      });
      req.end();
    } catch (e) {
      resolve({ url: targetUrl, status: 'EXCEPTION', error: e.message });
    }
  });
}

async function main() {
  console.log('Testing all project and profile links...\n');
  const results = [];
  for (const url of urls) {
    const res = await checkUrl(url);
    console.log(`${res.status === 200 || res.status === 301 || res.status === 302 || res.status === 999 ? '✓' : '✗'} ${res.url} -> ${res.status}`);
    results.push(res);
  }
}

main();
