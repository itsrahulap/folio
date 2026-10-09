import { chromium } from '../toolstack/node_modules/@playwright/test/index.mjs';
const b = await chromium.launch(); const p = await b.newPage();
p.on('requestfinished', async r => { const t = r.timing(); console.log(Math.round(t.responseEnd), r.url().slice(0,90)); });
const t0=Date.now(); await p.goto('http://localhost:4174/', {waitUntil:'commit'});
await p.waitForSelector('.loading-screen'); console.log('loader at', Date.now()-t0);
await p.waitForSelector('.mode-switch'); console.log('content at', Date.now()-t0);
await b.close();
