function lum(hex) {
  const rgb = hex.replace('#', '').match(/.{2}/g).map((x) => parseInt(x, 16) / 255);
  const a = rgb.map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function ratio(hex1, hex2) {
  const l1 = lum(hex1);
  const l2 = lum(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const colors = {
  fog: '#DCE3E7',
  paper: '#F3F6F7',
  ink: '#0F1C26',
  deep: '#0A2038',
  cobalt: '#2A45F2',
  mist: '#5C6C78',
  haze: '#9FB3C4',
  white: '#FFFFFF',
};

const pairs = [
  ['ink', 'fog'],
  ['ink', 'paper'],
  ['mist', 'fog'],
  ['mist', 'paper'],
  ['cobalt', 'fog'],
  ['cobalt', 'paper'],
  ['paper', 'deep'],
  ['haze', 'deep'],
  ['fog', 'deep'],
  ['white', 'cobalt'],
  ['cobalt', 'deep'],
];

console.log('--- WCAG CONTRAST AUDIT ---');
for (const [f, b] of pairs) {
  const r = ratio(colors[f], colors[b]);
  const status =
    r >= 7.0
      ? 'PASS (AAA)'
      : r >= 4.5
      ? 'PASS (AA Normal)'
      : r >= 3.0
      ? 'PASS (AA Large / UI component)'
      : 'FAIL (<3.0:1)';
  console.log(
    `${f} (${colors[f]}) on ${b} (${colors[b]}): ${r.toFixed(2)}:1 -> ${status}`
  );
}
