// Re-render app/resources/*.png from TypeMonkey's own monkey() SVG (needs Playwright + Chromium).
//   node scripts/render_resources.js            (from app/, after `python3 build_app.py --no-sync`)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const APP = path.resolve(__dirname, '..');
const OUT = path.join(APP, 'resources');
const ORANGE = '#FF7A1A', LIGHT = '#F2F5F1', DARK = '#111B17', CREAM = '#FFF4E6';

// The monkey's head is centred at y=53 in its viewBox (0 -16 120 136).
function page(svg, size, bg, disc, monkeyW) {
  const mw = size * monkeyW, mh = mw * 136 / 120, top = size / 2 - mh * (69 / 136);
  return `<html><body style="margin:0;width:${size}px;height:${size}px;overflow:hidden;background:${bg || 'transparent'}">
  ${disc ? `<div style="position:absolute;left:${size * (1 - disc) / 2}px;top:${size * (1 - disc) / 2}px;width:${size * disc}px;height:${size * disc}px;border-radius:50%;background:${CREAM}"></div>` : ''}
  ${monkeyW ? `<div style="position:absolute;left:${(size - mw) / 2}px;top:${top}px">${svg.replace('<svg ', `<svg width="${mw}" height="${mh}" `)}</div>` : ''}
  </body></html>`;
}
// [file, size, background (null = transparent), cream disc diameter, monkey width] as fractions of size
const JOBS = [
  ['icon.png', 1024, ORANGE, 0.80, 0.70],
  ['icon-only.png', 1024, ORANGE, 0.80, 0.70],          // name @capacitor/assets looks for
  ['icon-foreground.png', 1024, null, 0.56, 0.48],      // Android adaptive icon: inside the 66/108 safe zone
  ['icon-background.png', 1024, ORANGE, 0, 0],
  ['splash.png', 2732, LIGHT, 0, 0.30],
  ['splash-dark.png', 2732, DARK, 0, 0.30],
];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await p.goto('file://' + path.join(APP, 'www', 'index.html'));
  const svg = (await p.evaluate(() => monkey('happy', DEFAULT_LOOK)))
    .replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ').replace(' class="tm"', '');
  await p.close();
  for (const [name, size, bg, disc, mw] of JOBS) {
    const q = await b.newPage({ viewport: { width: size, height: size } });
    await q.setContent(page(svg, size, bg, disc, mw));
    await q.screenshot({ path: path.join(OUT, name), omitBackground: !bg });
    await q.close();
    console.log('wrote resources/' + name);
  }
  await b.close();
})();
