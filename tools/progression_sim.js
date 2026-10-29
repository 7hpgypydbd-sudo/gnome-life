// Headless "pretend player" for checking the order things unlock in (docs/PLAN.md "Progression review"). Runs the real content.js + game.js with a fake clock.
// Usage: node tools/progression_sim.js [visitsPerDay 1-4] [days] [eager|relaxed]. Prints story pages, lessons, land stages, jobs, animals and village in the order they happen.
const fs = require('fs'), path = require('path'), vm = require('vm');
const REPO = path.join(__dirname, '..');
const VPD = +(process.argv[2] || 3), DAYS = +(process.argv[3] || 60), MODE = process.argv[4] || 'eager';
let clock = new Date('2026-11-02T08:00:00').getTime();   // a Monday in spring (southern)
const RealDate = Date;
class FakeDate extends RealDate { constructor(...a) { if (a.length) super(...a); else super(clock); } static now() { return clock; } }
const store = {};
const ctx = { window: {}, localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => store[k] = String(v), removeItem: k => delete store[k] },
  location: { hash: '', reload() {} }, document: { addEventListener() {}, hidden: false }, setInterval() {}, console, Date: FakeDate, Math, JSON, Object, Array, Set, Number, String };
ctx.window.addEventListener = () => {}; ctx.addEventListener = () => {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(REPO, 'content.js'), 'utf8').replace('window.CONTENT', 'var CONTENT = window.CONTENT'), ctx);
vm.runInContext(fs.readFileSync(path.join(REPO, 'game.js'), 'utf8'), ctx);
const G = ctx.window.GL, C = ctx.window.CONTENT;
G.boot(); G.s.flags.welcomed = true; G.seePage('1.1');   // index.html opens the welcome page on the first visit
const income = {}, spent = {};
const _give = G.give.bind(G), _pay = G.pay.bind(G);
G.give = items => { for (const [k,n] of Object.entries(items||{})) income[k]=(income[k]||0)+n; return _give(items); };
G.pay = cost => { for (const [k,n] of Object.entries(cost||{})) spent[k]=(spent[k]||0)+n; return _pay(cost); };
const _gather = G.gather.bind(G); G.gather = id => { const o = G.s.offers.find(x=>x.id===id); if (o) income[o.kind]=(income[o.kind]||0)+(o.n||1); return _gather(id); };
const invLog = [];
const t0 = clock; const log = [];
const stamp = () => { const d = Math.floor((clock - t0) / 864e5) + 1, h = new RealDate(clock).getHours(), m = new RealDate(clock).getMinutes(); return `D${String(d).padStart(2)} ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`; };
const ev = (kind, txt) => log.push(`${stamp()}  ${kind.padEnd(8)} ${txt}`);
// watch pages/cards
const seenCards = new Set();
function drainCards() {
  for (const c of G.s.pages.cards) {
    const key = JSON.stringify(c); if (seenCards.has(key)) continue; seenCards.add(key);
    if (c.k === 'page') { const pg = G.pageDef(c.id); ev('PAGE', `${c.id} ${pg.title}`); G.seePage(c.id); }
    else if (c.k === 'land') ev('LAND', `home yard -> ${c.key}`);
    else if (c.k === 'tland') ev('LAND', `${c.tile} (${G.s.tiles[c.tile].kind}) -> ${c.key}`);
    else if (c.k === 'makes') ev('MAKES', `Hazel's list: ${c.patch} ${c.stage}`);
    else if (c.k === 'beat') ev('ANIMAL', `${c.id}`);
  }
  G.s.pages.cards = [];
}
let lastFolk = 0, lastTrav = null, festStage = 'waiting', lastTiles = new Set(Object.keys(G.s.tiles)), gardenWas = false, magicWas = 1;
function watch() {
  drainCards();
  for (const k of Object.keys(G.s.tiles)) if (!lastTiles.has(k)) { lastTiles.add(k); ev('REVEAL', `${k} ${G.s.tiles[k].kind || ''}`); }
  const tr = G.s.village.traveller && G.s.village.traveller.id; if (tr !== lastTrav) { if (tr) ev('VILLAGE', `traveller arrives: ${tr}`); lastTrav = tr; }
  const n = G.settled().length; if (n !== lastFolk) { ev('VILLAGE', `moved in: ${G.settled().slice(-1)[0]} (${n} neighbours)`); lastFolk = n; }
  if (G.s.festival.stage !== festStage) { festStage = G.s.festival.stage; ev('FEST', festStage); }
  if (G.gardenOpen() !== gardenWas) { gardenWas = G.gardenOpen(); ev('GARDEN', 'garden open'); }
  const L = G.magicLevel(); if (L !== magicWas) { magicWas = L; ev('MAGIC', `level ${L}`); }
}
const started = new Set();
let maxList = 0, maxAt = "", listLog = [];
function visit() {
  G.catchUp(); watch();
  // test panel would show festival night; just finish it
  if (G.s.festival.stage === 'on') { G.finishFestival(); ev('FEST', 'festival night done'); }
  // the toadstool's mice: 24h after the walk (index.html MOUSE_IN)
  if (G.s.flags.toadWalk && !G.s.flags.miceIn && clock - G.s.flags.toadWalk >= 864e5) G.s.flags.miceIn = true;
  for (let pass = 0; pass < 3; pass++) {
    for (const o of [...G.s.offers]) G.gather(o.id);
    const n = G.spiritLesson(); if (n) { G.teach(n); ev('SPIRIT', `lesson ${n}`); }
    const p = G.plot();
    if (p.stage === 'ready') { G.harvest(); }
    if (!p.stage && (G.done('bedwater') || p.grown)) { const order = (!G.s.flags['sown:pumpkin'] && G.cropOpen('pumpkin')) ? ['pumpkin'] : [['carrot','lettuce','bean'][p.grown % 3], 'carrot', 'lettuce']; for (const id of order) if (G.cropOpen(id) && G.can(G.cropCost(id))) { G.plant(id); break; } }
    if (p.stage === 'planted') G.water();
    if (MODE === 'eager' && p.stage === 'growing' && G.canCast('coax').ok && (G.s.inv.light||0) >= 4) G.cast('coax');
    if (G.canCast('legs').ok) { G.cast('legs'); ev('SPELL', 'toadstool legs'); }
    for (const sp of ['wind', 'cloud', 'seedwake', 'sing']) if (G.canCast(sp).ok && (G.s.inv.light||0) >= 3) { G.cast(sp); }
    if (G.dishBuilt() && !G.s.feeder.food) { if ((G.s.inv.berry||0) > 1) G.putFood('berry'); else if ((G.s.inv.seed||0) > 4) G.putFood('seed'); }
    if (!G.s.flags.rabbit && G.s.feeder.food && p.stage === 'growing') { G.rabbitAte(); G.rabbitRaid(); }
    if (G.done('fence') && G.s.feeder.food && !G.beatDone('rabbitTruce') && G.rabbitEats) G.rabbitEats();   // (v78 folded this into the friendship path)
    // quests: give / find
    for (const fid of G.settled()) { const st = G.questStep(fid); if (st && st.give) G.questGive(fid); }
    for (const f of [...G.s.village.finds]) G.found(f.id);
    if (G.s.village.favour) G.doFavour();
    for (const fid of G.settled()) { const w = G.wishOpen(fid); if (w && G.can(w.cost)) { G.sendWish(fid); ev('WISH', `${fid}: ${w.name}`); } }   // neighbours' wishes (v70): send the basket when the store has it
    // jobs
    const list = G.taskList();
    let pn = 0; const vis = list.filter(v => v.state !== 'done' && !v.def.make && !(v.def.healTile && v.state !== 'running' && ++pn > 3));   // the Jobs tab as drawn (Hazel's list is its own tab; at most three waiting patch jobs, the rest are on each patch's card)
    if (vis.length > maxList) { maxList = vis.length; maxAt = stamp() + ": " + vis.map(v => v.def.healTile ? "patch" : v.def.farm ? "farm" : v.def.folk ? "village" : v.def.festival ? "fest" : "home:" + v.def.id).join(", "); }
    const ready = list.filter(v => v.state === 'ready' && v.can);
    const pri = v => v.def.chore ? 9 : v.def.home ? 0 : v.def.folk ? 1 : v.def.festival ? 1 : (!v.def.make && !v.def.healTile && !v.def.farm) ? 2 : v.def.healTile ? 3 : v.def.farm ? 4 : 5;
    ready.sort((a, b) => pri(a) - pri(b));
    for (const v of ready) { if (G.startTask(v.def.id)) { if (!started.has(v.def.id)) { started.add(v.def.id); if (!v.def.healTile && !v.def.farm) ev(v.def.make ? 'MAKE' : 'JOB', `${v.def.id} (${v.def.name}) by ${v.def.who}`); } } }
    G.tick(); watch();
    clock += 2 * 60000; G.tick(); watch();
  }
}
function snapshotList(label) {
  const list = G.taskList().filter(v => !v.def.make), by = {}; for (const v of list) (by[v.state] = by[v.state] || []).push(v.def.name);
  const mk = G.taskList().filter(v => v.def.make && v.state !== 'done').length, nx = G.nextUp();
  listLog.push(`${label}: Jobs tab: ready ${(by.ready||[]).length}, waiting (gnome busy etc.) ${(by.locked||[]).length}, running ${(by.running||[]).length}; Hazel's list ${mk}${nx ? `; Next: ${nx.name}, ${nx.why}` : ''}\n   ready: ${(by.ready||[]).join(' | ')}\n   waiting: ${(by.locked||[]).join(' | ')}`);
}
const hours = process.env.HOURS ? process.env.HOURS.split(',').map(Number) : { 1: [8], 2: [8, 19], 3: [8, 13, 19], 4: [7, 11, 15, 20] }[VPD];   // HOURS=21 for an evening-only player
snapshotList('Very first visit');
for (let d = 0; d < DAYS; d++) {
  for (const h of hours) { const day = new RealDate(t0 + d * 864e5); day.setHours(h, 0, 0, 0); clock = day.getTime(); visit(); }
  if (d === 0 || d === 1 || d === 2 || d === 6 || d === 13) snapshotList(`End of day ${d + 1}`);
  if ([0,2,6,13,20,29,44,59,74,89].includes(d)) invLog.push(`D${d+1} pack: ` + Object.entries(G.s.inv).filter(([k,n])=>n).map(([k,n])=>k+' '+n).join(', '));
}
console.log(log.join('\n'));
console.log("\nMost rows in the Jobs tab (not done) at once:", maxList, "\n   at", maxAt);
console.log(listLog.join('\n'));
console.log('\nIncome:', JSON.stringify(income)); console.log('Spent:', JSON.stringify(spent)); console.log(invLog.join('\n'));
console.log('Wishes made:', JSON.stringify(G.wishesCount()), ' little makes:', Object.keys(C.makes).map(k => k + ' ' + G.makesCount(k).done + '/' + G.makesCount(k).total).join(', '));
console.log('\nFinal: green home', G.s.tiles['0,0'].green, 'tiles', Object.keys(G.s.tiles).length, 'neighbours', G.settled().length, 'festival', G.s.festival.stage);
