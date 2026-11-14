// Stand-in check: lists every picture slot the game has with no painting yet, so stand-ins can't hide.
// Run from the repo root before every art day and every release:   node tools/standin_check.js
// It serves the repo itself on a spare port and opens the sandbox in headless Chromium (Playwright).
// Code-drawn stand-ins that are not slots (e.g. the spring-ring stones) are listed by hand in docs/PLAN.md section 4.
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.txt': 'text/plain' };
const server = http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
server.listen(0, async () => {
  const port = server.address().port, browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`http://localhost:${port}/index.html?sandbox#test`);
    await page.waitForFunction(() => window.DBG, null, { timeout: 30000 }); await page.waitForTimeout(5000);   // slots load in the background after start
    const r = await page.evaluate(() => DBG.ev(`({ total: Object.keys(ART_SLOTS).length, missing: Object.keys(ART_SLOTS).filter(k => !ART[k]) })`));
    console.log(`${r.total} picture slots, ${r.missing.length} with no painting:`);
    for (const k of r.missing) console.log('  ' + k);
  } finally { await browser.close(); server.close(); }
});
