// Makes showoff.json: the sandbox's "Show-off garden" (v85), a garden about ten days in, for showing people.
// The pretend player plays nine days at three visits a day (Sydney time), leaves the toadstool spell for you to cast,
// then the store is topped up so jobs and spells can be shown live. Usage: node tools/make_showoff.js
const { execFileSync } = require('child_process'), fs = require('fs'), path = require('path');
const REPO = path.join(__dirname, '..'), tmp = path.join(require('os').tmpdir(), 'showoff-store.json');
execFileSync('node', [path.join(__dirname, 'progression_sim.js'), '3', '9'], { env: { ...process.env, TZ: 'Australia/Sydney', START: '2026-10-21T08:00:00', NOLEGS: '1', SAVE: tmp }, stdio: 'ignore' });
const s = JSON.parse(JSON.parse(fs.readFileSync(tmp, 'utf8'))['gnomelife.save']);
const atLeast = { twig: 20, stone: 20, moss: 20, water: 20, seed: 20, acorn: 10, berry: 10, feather: 6, light: 12 };
for (const [k, n] of Object.entries(atLeast)) s.inv[k] = Math.max(s.inv[k] || 0, n);
fs.writeFileSync(path.join(REPO, 'showoff.json'), JSON.stringify(s));
console.log('showoff.json written: day', s.days.length, 'flags', Object.keys(s.flags).join(' '));
