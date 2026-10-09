import { chromium } from '../toolstack/node_modules/@playwright/test/index.mjs';
const out = process.argv[2], tag = process.argv[3];
const b = await chromium.launch();
for (const [name, vp] of [['desk', {width:1440,height:900}], ['mob', {width:390,height:844}]]) {
  const p = await b.newPage({ viewport: vp });
  const errs = []; p.on('console', m => m.type()==='error' && errs.push(m.text()));
  const t0 = Date.now();
  await p.goto('http://localhost:4174/');
  await p.getByRole('tab', { name: 'Terminal' }).waitFor({ timeout: 10000 });
  console.log(name, 'interactive after ms', Date.now()-t0, 'errors', errs);
  await p.screenshot({ path: `${out}/${tag}-${name}-term.png` });
  await p.keyboard.type('help'); await p.keyboard.press('Enter');
  await p.screenshot({ path: `${out}/${tag}-${name}-help.png` });
  await p.getByRole('tab', { name: 'Website' }).click();
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${out}/${tag}-${name}-gui.png` });
  const h = await p.evaluate(() => document.querySelector('.portfolio')?.scrollHeight);
  await p.setViewportSize({ width: vp.width, height: h || vp.height });
  await p.screenshot({ path: `${out}/${tag}-${name}-gui-full.png` });
}
await b.close();
