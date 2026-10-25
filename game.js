// Gnome Life — game state, rules, timers and save/load. No drawing in here.
// One JSON blob behind Store so it can move from localStorage to a server later.
(function () {
const C = window.CONTENT;
const FAST = /fast/.test(location.hash);          // #fast: minutes become tenths of a second (3h -> 18s)
const MIN = FAST ? 100 : 60000;                   // ms per content "minute"
const SKEW_KEY = 'gnomelife.skew';   // test panel: pretend this many extra days have gone by (whole days, so the time of day stays right)
let SKEW = 0; try { SKEW = Number(localStorage.getItem(SKEW_KEY)) || 0; } catch (e) {}
const now = () => Date.now() + SKEW;
const DAY = () => 1440 * MIN;
const lc = (t) => t[0].toLowerCase() + t.slice(1);   // "Build Mabel a home" -> "build Mabel a home" (keeps names capitalised)                    // a real day (a tenth-second-minute day under #fast)
const dayKey = (t) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; };

// ---------- storage adapter (swap this for a server later) ----------
const Store = {
  key: 'gnomelife.save',
  load() { try { const s = localStorage.getItem(this.key); return s ? JSON.parse(s) : null; } catch (e) { return null; } },
  write(blob) { try { localStorage.setItem(this.key, JSON.stringify(blob)); } catch (e) {} },
  clear() { try { localStorage.removeItem(this.key); } catch (e) {} },
};

// ---------- fresh save ----------
function fresh() {
  const t = now();
  return {
    v: 1, created: t, lastSeen: t, lastOfferAt: t,
    days: [dayKey(t)],                       // distinct calendar days visited (drives magic)
    inv: { twig: 6, moss: 4, stone: 4, acorn: 1, seed: 2, water: 2, light: 0 },   // enough to start a few jobs straight away
    tiles: { '0,0': { state: 'home', green: 0 } },   // "tx,ty" -> { state: home|revealed|regrowing|green, green, task }
    plots: { seedbed: { crop: null, stage: null, readyAt: 0, grown: 0 } },
    tasks: {},                               // id -> { startedAt, endsAt, done }
    offers: [],                              // things lying on the land: { id, kind, tile, gx, gy }
    journal: {},                             // visitorId -> { first, count, fed: [dayKeys], helped }
    arrived: {},                             // visitorId -> dayKey it last turned up (regulars come once a day)
    feeder: { food: null, at: 0 },           // the feeding dish: what is in it (seed / berry), or null
    deeds: { day: '', n: 0 },                // light earned by helping creatures today
    log: [],                                 // recent happenings, newest last
    spellsUsed: {},                          // spell -> dayKey last cast
    flags: {},
    events: { lastAt: t, seen: {} },        // gentle random happenings (CONTENT.events)
    story: { chapter: 0, flags: {}, found: [] },   // hook for the side mystery (the staff); Bryce writes the plot
    village: { traveller: null, nextAt: 0, queue: C.village.order.slice(), folk: {}, favour: null, favourAt: t, finds: [] },
  };
}

// ---------- the game ----------
const G = {
  s: null, listeners: new Set(), dirty: false, away: null,
  onChange(fn) { this.listeners.add(fn); },
  emit(kind, data) { for (const fn of this.listeners) fn(kind, data); this.dirty = true; },
  save() { if (!this.s) return; this.s.lastSeen = now(); Store.write(this.s); this.dirty = false; },
  reset() { Store.clear(); try { localStorage.removeItem(SKEW_KEY); } catch (e) {} this.s = fresh(); this.save(); location.hash = ''; location.reload(); },
  dur(mins) { return mins * MIN * this.taskSpeed(); },
  taskSpeed() { return 1 - 0.08 * (this.magicLevel() - 1); },   // each magic level trims task time 8%

  boot() {
    this.s = Store.load();
    if (!this.s) { this.s = fresh(); this.startingGifts(); }
    for (const [k, v] of Object.entries(fresh())) if (!(k in this.s)) this.s[k] = v;   // older saves gain new fields
    this.away = this.catchUp();
    this.save();
    return this.s;
  },

  // a brand-new garden already has a few things lying about, so the first visit has something to do
  startingGifts() {
    const spots = [[0.50, 0.60], [0.34, 0.54], [0.68, 0.54], [0.50, 0.22], [0.16, 0.26], [0.34, 0.88]];
    ['twig', 'stone', 'moss', 'water', 'seed', 'twig'].forEach((kind, i) =>
      this.s.offers.push({ id: Math.random().toString(36).slice(2, 8), kind, tile: '0,0', gx: spots[i][0], gy: spots[i][1], at: now() }));
  },

  // ---- time passing while away ----
  catchUp() {
    const s = this.s, t = now(), gone = t - s.lastSeen, report = { gone, finished: [], offered: 0, newDay: false };
    const dk = dayKey(t);
    if (!s.days.includes(dk)) { s.days.push(dk); report.newDay = true; }
    // offerings accumulate, but never a backlog beyond the cap
    const every = C.offerEvery * MIN;
    let n = Math.floor((t - s.lastOfferAt) / every);
    if (n > 0) {
      const room = Math.max(0, C.offerCap - s.offers.length);
      const made = Math.min(n, room);
      for (let i = 0; i < made; i++) this.spawnOffer(s.lastOfferAt + (i + 1) * every);
      report.offered = made; s.lastOfferAt = t - ((t - s.lastOfferAt) % every);
    }
    // timers that finished while away are reported (they resolve lazily in tick)
    for (const [id, tk] of Object.entries(s.tasks)) if (!tk.done && tk.endsAt <= t) report.finished.push(this.taskDef(id).name);
    const p = s.plots.seedbed; if (p.stage === 'growing' && p.readyAt <= t) report.finished.push('the sprout is ready');
    if (gone >= 60 * MIN) { const ate = this.awayEater(); if (ate) report.ate = ate; }
    const had = s.village.traveller && s.village.traveller.id;
    this.tick();
    if (s.village.traveller && s.village.traveller.id !== had) report.traveller = s.village.traveller.id;
    if (gone >= 2 * 60 * MIN) { const ev = this.rollEvent(t, true); if (ev) report.event = ev.text; }
    return report;
  },

  // ---- per-frame rules (cheap; call a few times a second) ----
  tick() {
    const s = this.s, t = now();
    // crop
    const p = s.plots.seedbed;
    if (p.stage === 'growing' && p.readyAt <= t) { p.stage = 'ready'; this.note('The sprout is ready to pick.'); this.emit('plot', p); }
    // tasks
    for (const [id, tk] of Object.entries(s.tasks)) {
      if (tk.done || tk.endsAt > t) continue;
      tk.done = true; const d = this.taskDef(id);
      if (d.tile) { const tl = s.tiles[d.tile]; tl.state = 'green'; tl.green = 4; this.reveal(d.tile); this.note(`The land next door has greened.`); }
      else this.addGreen(d.green);
      if (d.folk) this.villageDone(id, d, tk);
      if (id === 'bridge') { for (const k of ['1,-1', '0,-1', '2,-1', '-1,-1']) if (s.tiles[k] && s.tiles[k].state === 'green') this.reveal(k); this.note('The bridge is up. The far side of the stream is reachable at last.'); }
      if (d.give) this.give(d.give);
      this.note(`${C.names[d.who]} finished: ${lc(d.name)}.`);
      this.emit('task', { id, done: true });
    }
    this.villageTick(t);
    const E = C.events; if (E && t - s.events.lastAt >= E.every * MIN) this.rollEvent(t);
    // offerings trickle in during a visit too
    if (t - s.lastOfferAt >= C.offerEvery * MIN) { s.lastOfferAt = t; if (s.offers.length < C.offerCap) { this.spawnOffer(t); this.emit('offer'); } }
  },

  // ---- gentle events (data in CONTENT.events; never a loss) ----
  season(t) { const m = new Date(t).getMonth(); return m >= 8 && m <= 10 ? 'spring' : m === 11 || m <= 1 ? 'summer' : m <= 4 ? 'autumn' : 'winter'; },
  rollEvent(t, quiet) {
    const E = C.events, s = this.s; if (!E) return null; s.events.lastAt = t;
    if (Math.random() > E.chance) return null;
    const h = new Date(t).getHours(), st = this.landStage().key, order = C.landStages.map(x => x.key), se = this.season(t);
    const pool = E.list.filter(e => (!e.hours || (h >= e.hours[0] && h < e.hours[1])) && (!e.stage || order.indexOf(st) >= order.indexOf(e.stage)) &&
      (!e.seasons || e.seasons.includes(se)) && (!e.task || (s.tasks[e.task] && s.tasks[e.task].done)));
    if (!pool.length) return null;
    const w = (e) => e.weight * (s.events.seen[e.id] ? 0.4 : 1);
    let r = Math.random() * pool.reduce((a, e) => a + w(e), 0), ev = pool[0];
    for (const e of pool) { r -= w(e); if (r <= 0) { ev = e; break; } }
    s.events.seen[ev.id] = (s.events.seen[ev.id] || 0) + 1;
    if (ev.give) this.give(ev.give);
    for (const k of ev.offer || []) if (s.offers.length < C.offerCap + 3) { this.spawnOffer(t); s.offers[s.offers.length - 1].kind = k; }
    this.note(ev.text); if (!quiet) this.emit('event', ev); else this.dirty = true;
    return ev;
  },

  // ---- offerings ----
  spawnOffer(t) {
    const s = this.s, h = new Date(t).getHours(), night = h < 6 || h >= 19;
    const pool = C.offers.map(o => ({ kind: o.kind, w: (night ? o.night : o.day) * (o.kind === 'water' && h >= 5 && h < 10 ? 2.5 : 1) })).filter(o => o.w > 0);
    let r = Math.random() * pool.reduce((a, o) => a + o.w, 0), kind = pool[0].kind;
    for (const o of pool) { r -= o.w; if (r <= 0) { kind = o.kind; break; } }
    const tiles = Object.keys(s.tiles).filter(k => s.tiles[k].state !== 'revealed' || Math.random() < 0.3);
    const tile = tiles[(Math.random() * tiles.length) | 0];
    s.offers.push({ id: Math.random().toString(36).slice(2, 8), kind, tile, gx: 0.1 + Math.random() * 0.8, gy: 0.1 + Math.random() * 0.8, at: t });
  },
  gather(id) {
    const s = this.s, i = s.offers.findIndex(o => o.id === id); if (i < 0) return null;
    const [o] = s.offers.splice(i, 1); s.inv[o.kind] = (s.inv[o.kind] || 0) + (o.n || 1);
    this.emit('inv', o.kind); return o;
  },

  // ---- inventory ----
  can(cost) { return Object.entries(cost || {}).every(([k, n]) => (this.s.inv[k] || 0) >= n); },
  missing(cost) { return Object.entries(cost || {}).filter(([k, n]) => (this.s.inv[k] || 0) < n).map(([k, n]) => `${n - (this.s.inv[k] || 0)} ${C.resources[k].name}`); },
  pay(cost) { for (const [k, n] of Object.entries(cost || {})) this.s.inv[k] -= n; this.emit('inv'); },
  give(items) { for (const [k, n] of Object.entries(items || {})) this.s.inv[k] = (this.s.inv[k] || 0) + n; this.emit('inv'); },

  // ---- the seed bed ----
  plot() { return this.s.plots.seedbed; },
  plant(cropId = 'sprout') {
    const p = this.plot(), c = C.crops[cropId]; if (p.stage || !this.can(c.plant)) return false;
    this.pay(c.plant); p.crop = cropId; p.stage = 'planted'; p.plantedAt = now(); p.readyAt = 0;
    this.note('A seed is in the bed. It wants water.'); this.emit('plot', p); return true;
  },
  water() {
    const p = this.plot(); if (p.stage !== 'planted' || !this.can({ water: 1 })) return false;
    this.pay({ water: 1 }); p.stage = 'growing'; p.wateredAt = now(); p.readyAt = now() + this.dur(C.crops[p.crop].grow);
    this.note('Watered. Now it grows.'); this.emit('plot', p); return true;
  },
  harvest() {
    const p = this.plot(); if (p.stage !== 'ready') return false;
    const c = C.crops[p.crop]; this.give(c.harvest); this.addGreen(c.green); p.grown++;
    p.crop = null; p.stage = null; p.readyAt = 0;
    this.note(`Picked ${c.name}. The bed is clear again.`); this.emit('plot', p); return true;
  },

  // ---- tasks ----
  taskDef(id) {
    if (id.startsWith('regrow:')) { const tile = id.slice(7); return Object.assign({ id, tile }, C.regrow, { name: `${C.regrow.name} (${this.tileName(tile)})` }); }
    const [kind, fid, step] = id.split(':'), f = this.folkDef(fid);
    if (f && kind === 'home') return Object.assign({ id, folk: fid, name: `Build ${f.short} a home`, short: 'building a home', green: 2, home: true, act: 'carry' }, f.build);
    if (f && kind === 'trade') return Object.assign({ id, folk: fid, green: 1 }, f.building);
    if (f && kind === 'quest') { const st = f.quest.steps[+step]; return Object.assign({ id, folk: fid, green: 1, blurb: st.say, quest: true }, st.job); }
    return C.tasks.find(t => t.id === id);
  },
  taskList() {   // everything the player could start or is waiting on, in a sensible order
    const s = this.s, out = [];
    for (const d of C.tasks) out.push(this.taskView(d));
    for (const [k, tl] of Object.entries(s.tiles)) if (tl.state === 'revealed' || tl.state === 'regrowing') out.push(this.taskView(this.taskDef('regrow:' + k)));
    const v = s.village;
    if (v.traveller) out.push(this.taskView(this.taskDef('home:' + v.traveller.id)));
    for (const [fid, fs] of Object.entries(v.folk)) {
      out.push(this.taskView(this.taskDef('trade:' + fid)));
      const st = this.questStep(fid); if (st && st.job) out.push(this.taskView(this.taskDef(`quest:${fid}:${fs.q}`)));
    }
    return out.filter(v => v.show).sort((a, b) => (a.rank - b.rank));
  },
  taskView(d) {
    const s = this.s, tk = s.tasks[d.id], t = now();
    const gate = tk ? '' : this.gateWhy(d);
    const locked = (d.needs || []).some(n => !(s.tasks[n] && s.tasks[n].done)) || (d.minLevel && this.magicLevel() < d.minLevel) || !!gate;
    const state = tk ? (tk.done ? 'done' : (tk.endsAt <= t ? 'done' : 'running')) : (locked ? 'locked' : 'ready');
    return { def: d, state, locked, endsAt: tk ? tk.endsAt : 0, startedAt: tk ? tk.startedAt : 0, can: this.can(d.cost), missing: this.missing(d.cost),
             show: (state !== 'done' || (t - (tk.endsAt || 0)) < 60 * MIN) && !(d.needs || []).some(n => n.startsWith('trade:') && !this.folkState(n.slice(6))),   // village jobs stay hidden until that neighbour lives here rank: { running: 0, ready: 1, locked: 2, done: 3 }[state],
             why: gate ? gate : locked ? (d.minLevel && this.magicLevel() < d.minLevel ? `needs magic level ${d.minLevel}` : `after: ${(d.needs || []).map(n => lc(this.taskDef(n).name)).join(', ')}`) : '' };
  },
  startTask(id) {
    const d = this.taskDef(id), v = this.taskView(d); if (v.state !== 'ready' || !v.can) return false;
    this.pay(d.cost); const t = now();
    this.s.tasks[id] = { startedAt: t, endsAt: t + this.dur(d.mins), done: false };
    if (d.home) this.s.tasks[id].tile = this.freeLot();
    if (d.tile) this.s.tiles[d.tile].state = 'regrowing';
    this.note(`${C.names[d.who]} set to work: ${lc(d.name)}.`); this.emit('task', { id }); return true;
  },
  running() { return Object.entries(this.s.tasks).filter(([, tk]) => !tk.done).map(([id, tk]) => Object.assign({ id }, tk, { def: this.taskDef(id) })); },

  // ---- land ----
  tileName(k) { const [x, y] = k.split(',').map(Number); return x > 0 ? 'east' : x < 0 ? 'west' : y > 0 ? 'south' : 'north'; },
  landStage(k = '0,0') { const g = this.s.tiles[k] ? this.s.tiles[k].green : 0; let st = C.landStages[0]; for (const s of C.landStages) if (g >= s.at) st = s; return st; },
  addGreen(n) {
    if (!n) return; const tl = this.s.tiles['0,0'], before = this.landStage().key; tl.green += n;
    const after = this.landStage();
    if (after.key !== before) { this.note(`The home patch is now ${after.name}.`); if (after.key === 'green') this.reveal('0,0'); this.emit('land', after); }
  },
  reveal(k) {   // bare neighbours appear around a greened tile (max 2 at a time so the map grows gently)
    const [x, y] = k.split(',').map(Number); let n = 0;
    for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
      const kk = `${x + dx},${y + dy}`; if (this.s.tiles[kk] || n >= 2 || Math.abs(x + dx) > 2 || Math.abs(y + dy) > 2) continue;
      if (y + dy < -1 && !this.done('bridge')) continue;   // the far side of the stream waits for the bridge
      this.s.tiles[kk] = { state: 'revealed', green: 0 }; n++;
    }
    if (n) this.note('The mist has drawn back from more bare ground.');
  },

  // ---- magic ----
  magicLevel() { const d = this.s.days.length; let L = 1; C.magicLevels.forEach((m, i) => { if (d >= m.days) L = i + 1; }); return L; },
  magicInfo() { const L = this.magicLevel(), m = C.magicLevels[L - 1], next = C.magicLevels[L]; return { level: L, name: m.name, days: this.s.days.length, nextDays: next ? next.days : null, spells: C.magicLevels.slice(0, L).map(x => x.unlock).filter(Boolean) }; },
  canCast(id) {
    const sp = C.spells[id]; if (!this.magicInfo().spells.includes(id)) return { ok: false, why: 'not yet learned' };
    if (!this.can(sp.cost)) return { ok: false, why: `needs ${this.missing(sp.cost).join(', ')}` };
    if (id === 'coax' && this.plot().stage !== 'growing') return { ok: false, why: 'nothing is growing' };
    if (id === 'rain' && this.plot().stage !== 'planted') return { ok: false, why: 'nothing is waiting for water' };
    if (id === 'wake' && !this.running().some(r => r.def.tile)) return { ok: false, why: 'no patch is regrowing' };
    return { ok: true };
  },
  cast(id) {
    if (!this.canCast(id).ok) return false; this.pay(C.spells[id].cost); const t = now();
    if (id === 'coax') { this.plot().readyAt = t; this.note('A warm glow, and the sprout unfurls.'); }
    if (id === 'rain') { const p = this.plot(); p.stage = 'growing'; p.readyAt = t + this.dur(C.crops[p.crop].grow); this.give({ water: 2 }); this.note('Soft rain falls on the bed and beads on the stones.'); }
    if (id === 'wake') { for (const r of this.running()) if (r.def.tile) this.s.tasks[r.id].endsAt = t + (r.endsAt - t) / 2; this.note('The ground stirs under the mist.'); }
    this.s.spellsUsed[id] = dayKey(t); this.emit('spell', id); this.tick(); return true;
  },

  // ---- journal, visitors and the feeding dish ----
  visitorDef(id) { return C.visitors.find(v => v.id === id); },
  pickVisitor(t = now()) {
    const s = this.s, h = new Date(t).getHours(), stage = this.landStage().key, order = C.landStages.map(x => x.key), dk = dayKey(t), food = s.feeder.food;
    const pool = C.visitors.filter(v => ((h >= v.hours[0] && h < v.hours[1]) || (v.alsoHours && h >= v.alsoHours[0] && h < v.alsoHours[1])) && (!v.stage || order.indexOf(stage) >= order.indexOf(v.stage)) && (!v.task || (s.tasks[v.task] && s.tasks[v.task].done)));
    if (!pool.length) return null;
    // a regular that has not been by today comes first; food in the dish draws the creatures that eat it
    const due = pool.filter(v => this.isRegular(v.id) && s.arrived[v.id] !== dk);
    if (due.length) return due[(Math.random() * due.length) | 0];
    const w = v => v.weight * (food && (v.eats || []).includes(food) ? 3 : 1);
    let r = Math.random() * pool.reduce((a, v) => a + w(v), 0);
    for (const v of pool) { r -= w(v); if (r <= 0) return v; } return pool[0];
  },
  arrive(id) { this.s.arrived[id] = dayKey(now()); this.dirty = true; },
  entry(id) { const j = this.s.journal; const e = j[id] || (j[id] = { first: now(), count: 0 }); e.fed = e.fed || []; e.helped = e.helped || 0; return e; },
  noteVisitor(id) {
    const isNew = !this.met(id), e = this.entry(id); if (isNew) e.first = now(); e.count++;
    if (isNew) this.note(`New in the journal: ${this.visitorDef(id).name.toLowerCase()}.`);
    this.emit('journal', { id, isNew }); return isNew;
  },
  met(id) { const e = this.s.journal[id]; return !!(e && e.count); },   // noted in the journal (an entry can exist from feeding before you tap it)
  fedDays(id) { const e = this.s.journal[id]; return e && e.fed ? e.fed.length : 0; },
  isRegular(id) { return this.fedDays(id) >= C.feeding.regularAfter; },
  hasNest(id) { const d = this.visitorDef(id); return !!(d && d.nest) && this.fedDays(id) >= C.feeding.nestAfter; },
  dishBuilt() { const t = this.s.tasks.feeder; return !!(t && t.done); },
  putFood(kind) {
    const f = this.s.feeder; if (!this.dishBuilt() || f.food || !this.can({ [kind]: 1 })) return false;
    this.pay({ [kind]: 1 }); f.food = kind; f.at = now();
    this.note(`${kind === 'seed' ? 'Seed' : 'Berries'} in the feeding dish. Now, who will come?`); this.emit('feeder', f); return true;
  },
  wantsFood(id) { const d = this.visitorDef(id), f = this.s.feeder.food; return !!(f && d && (d.eats || []).includes(f)); },
  feed(id) {   // a visitor empties the dish; returns what changed: 'regular' or 'nest' when it crosses a line, else true
    if (!this.wantsFood(id)) return false;
    const d = this.visitorDef(id), food = this.s.feeder.food, who = this.met(id) ? `The ${d.name.toLowerCase()}` : 'A visitor you have not met yet'; this.s.feeder.food = null;
    const e = this.entry(id), dk = dayKey(now()); let out = true;
    if (!e.fed.includes(dk)) {
      e.fed.push(dk);
      if (e.fed.length === C.feeding.regularAfter) { out = 'regular'; this.note(`The ${d.name.toLowerCase()} is a regular now. It will come by every day.`); }
      else if (d.nest && e.fed.length === C.feeding.nestAfter) { out = 'nest'; this.note(`The ${d.name.toLowerCase()} has made itself a home nearby.`); }
    }
    if (out === true) this.note(`${who} ate the ${food === 'seed' ? 'seed' : 'berries'} in the dish.`);
    this.emit('fed', { id, out }); return out;
  },
  awayEater() {   // while you were away: a creature you have met, that eats what is in the dish, came and emptied it
    const f = this.s.feeder.food; if (!f) return null;
    const pool = C.visitors.filter(v => this.met(v.id) && (v.eats || []).includes(f)); if (!pool.length) return null;
    const v = pool[(Math.random() * pool.length) | 0]; this.feed(v.id); return v.name;
  },
  troubleFor(id) {   // does this visitor arrive with a little trouble to fix? (only after it is in the journal, so the first meeting stays simple)
    const d = this.visitorDef(id), tr = d && d.trouble; if (!tr || !this.met(id)) return null;
    if (tr.task && !(this.s.tasks[tr.task] && this.s.tasks[tr.task].done)) return null;
    return Math.random() < C.troubleChance ? tr : null;
  },
  help(id) {   // a good deed: one light, while today's allowance lasts
    const d = this.visitorDef(id), e = this.entry(id), dk = dayKey(now()), dd = this.s.deeds;
    if (dd.day !== dk) { dd.day = dk; dd.n = 0; }
    e.helped++; const light = dd.n < C.deedsPerDay ? 1 : 0; dd.n += light;
    if (light) this.give({ light: 1 });
    this.note(`You helped the ${d.name.toLowerCase()}. ${d.trouble.thanks}`); this.emit('helped', { id, light }); return light;
  },

  // ---- neighbours and the village ----
  // One traveller at a time camps by the path (village.traveller). A "Build X a home" job settles them on the nearest healed
  // lot; then their trade building job, a daily gift at their door, the odd favour, and one short story quest.
  folkDef(id) { return (C.folk || []).find(f => f.id === id); },
  folkState(id) { return this.s.village.folk[id] || null; },
  settled() { return Object.keys(this.s.village.folk); },
  done(id) { const t = this.s.tasks[id]; return !!(t && t.done); },
  freeLot() {   // the nearest healed plain tile that has no home on it yet (one being built counts as taken)
    const s = this.s, taken = new Set(Object.values(s.village.folk).map(f => f.tile));
    for (const tk of Object.values(s.tasks)) if (tk.tile && !tk.done) taken.add(tk.tile);
    return C.village.lots.find(k => s.tiles[k] && s.tiles[k].state === 'green' && !taken.has(k)) || null;
  },
  gateWhy(d) {   // extra reasons a job cannot start yet, in words ('' = fine)
    if (d.home && !this.freeLot()) return 'needs a healed patch next door for their home';
    if (d.needsTile && !(this.s.tiles[d.needsTile] && this.s.tiles[d.needsTile].state === 'green')) return 'after the stepping-stone patch of the stream heals';
    return '';
  },
  villageTick(t) {
    const s = this.s, v = s.village, V = C.village, dk = dayKey(t), h = new Date(t).getHours();
    // a traveller arrives once the house is finished, when it is time, and someone is still on the road
    if (!v.traveller && v.queue.length && t >= v.nextAt && (this.done(V.firstAfter) || /village|test/.test(location.hash))) {
      v.traveller = { id: v.queue.shift(), at: t };
      const f = this.folkDef(v.traveller.id); this.note(`A traveller has camped by the path: ${f.name}, ${f.trade}.`); this.emit('traveller', v.traveller.id);
    }
    for (const [fid, fs] of Object.entries(v.folk)) {
      const f = this.folkDef(fid), traded = this.done('trade:' + fid);
      // a small daily gift at their door, once their trade building is up (one a day; no backlog)
      if (traded && fs.giftDay !== dk && h >= 6) { fs.giftDay = dk; this.dropGift(fid); }
      // their story begins a while after the trade building is finished
      if (traded && fs.q === -1 && t >= s.tasks['trade:' + fid].endsAt + V.questAfterDays * DAY()) { fs.q = 0; this.enterStep(fid); this.emit('quest', fid); }
      const st = this.questStep(fid);
      if (st && st.wait && fs.waitUntil && t >= fs.waitUntil) this.questNext(fid);
      if (st && st.find && !v.finds.some(x => x.folk === fid) && this.inHours(st.find.hours, h)) this.spawnFind(fid);
    }
    // the odd small favour (one at a time; it lapses at the end of the day)
    if (v.favour && v.favour.day !== dk) v.favour = null;
    if (!v.favour && t >= v.favourAt) {
      v.favourAt = t + V.favourEvery * MIN;
      const known = this.knownKinds(), pool = [];
      for (const fid of this.settled()) this.folkDef(fid).favours.forEach((fv, i) => { if (Object.keys(fv.cost).every(k => known.has(k))) pool.push({ folk: fid, i }); });
      if (pool.length) { v.favour = Object.assign(pool[(Math.random() * pool.length) | 0], { day: dk }); this.emit('favour', v.favour.folk); }
    }
  },
  inHours(hrs, h) { if (!hrs) return true; const [a, b] = hrs; return a < b ? h >= a && h < b : h >= a || h < b; },
  knownKinds() {   // things the player can come by: the land's offerings, plus whatever settled neighbours make
    const k = new Set(C.offers.map(o => o.kind));
    for (const fid of this.settled()) if (this.done('trade:' + fid)) Object.keys(this.folkDef(fid).building.gift).forEach(x => k.add(x));
    return k;
  },
  door(fid) { const fs = this.folkState(fid); return { tile: fs.tile, gx: 0.40, gy: 0.40 }; },   // in front of their home (index.html LOT.home)
  dropGift(fid) {
    const s = this.s, f = this.folkDef(fid), d = this.door(fid); let i = 0;
    for (const [kind, n] of Object.entries(f.building.gift)) { s.offers.push({ id: Math.random().toString(36).slice(2, 8), kind, n, tile: d.tile, gx: d.gx + 0.06 * i, gy: d.gy + 0.05 + 0.04 * i, at: now(), gift: fid }); i++; }
    this.note(f.building.giftText);
  },
  waveOn() {   // send the traveller on their way (they may come back much later); someone else comes soon
    const v = this.s.village, tr = v.traveller; if (!tr || this.s.tasks['home:' + tr.id]) return false;
    v.queue.push(tr.id); v.traveller = null; v.nextAt = now() + C.village.waveGapDays * DAY();
    this.note(`${this.folkDef(tr.id).name} packed up and went on along the road, waving.`); this.emit('traveller', null); return true;
  },
  villageDone(id, d, tk) {   // a village job just finished
    const v = this.s.village, fid = d.folk, f = this.folkDef(fid);
    if (d.home) {
      v.folk[fid] = { tile: tk.tile, since: now(), giftDay: '', q: -1, waitUntil: 0 };
      if (v.traveller && v.traveller.id === fid) v.traveller = null;
      v.nextAt = now() + C.village.gapDays * DAY();
      this.note(`${f.name} has moved in.`); this.emit('story', { folk: fid, kind: 'moved' });
    } else if (id.startsWith('trade:')) { this.note(`${f.short[0].toUpperCase() + f.short.slice(1)}: ${lc(d.name)} is done.`); }
    else if (d.quest) this.questNext(fid);
  },
  questStep(fid) { const fs = this.folkState(fid); return fs && fs.q >= 0 ? this.folkDef(fid).quest.steps[fs.q] || null : null; },
  enterStep(fid) {
    const fs = this.folkState(fid), st = this.questStep(fid); if (!st) return;
    if (st.wait) fs.waitUntil = now() + this.dur(st.wait);
  },
  questNext(fid) {
    const fs = this.folkState(fid), f = this.folkDef(fid); fs.q++; fs.waitUntil = 0;
    if (fs.q >= f.quest.steps.length) {
      fs.q = 'done'; this.give(f.quest.reward); this.note(`A story finished: ${f.quest.name}.`); this.emit('story', { folk: fid, kind: 'quest' }); return;
    }
    this.enterStep(fid); this.emit('quest', fid);
  },
  questGive(fid) {
    const st = this.questStep(fid); if (!st || !st.give || !this.can(st.give)) return false;
    this.pay(st.give); this.questNext(fid); return true;
  },
  spawnFind(fid) {   // something to spot on the land: on a healed tile, not too near the middle of things
    const s = this.s, greens = Object.keys(s.tiles).filter(k => s.tiles[k].state === 'green' || k === '0,0');
    const tile = greens[(Math.random() * greens.length) | 0];
    s.village.finds.push({ id: Math.random().toString(36).slice(2, 8), folk: fid, tile, gx: 0.2 + Math.random() * 0.6, gy: 0.6 + Math.random() * 0.3 });
    this.dirty = true;
  },
  found(id) {
    const v = this.s.village, i = v.finds.findIndex(x => x.id === id); if (i < 0) return null;
    const [x] = v.finds.splice(i, 1); this.questNext(x.folk); return x;
  },
  doFavour() {
    const v = this.s.village, fv = v.favour; if (!fv) return false;
    const f = this.folkDef(fv.folk), ask = f.favours[fv.i]; if (!this.can(ask.cost)) return false;
    this.pay(ask.cost); v.favour = null;
    const dd = this.s.deeds, dk = dayKey(now()); if (dd.day !== dk) { dd.day = dk; dd.n = 0; }
    const light = dd.n < C.deedsPerDay ? 1 : 0; dd.n += light;
    const gift = Object.assign({}, this.done('trade:' + fv.folk) ? f.building.gift : {}); if (light) gift.light = (gift.light || 0) + 1;
    this.give(gift); this.note(`You did ${f.short} a favour. ${ask.thanks}`); this.emit('helped', { folk: fv.folk, light }); return gift;
  },

  // ---- story hook (placeholder; content lives in CONTENT.story once written) ----
  flag(k, v = true) { this.s.story.flags[k] = v; this.emit('story', k); },
  hasFlag(k) { return !!this.s.story.flags[k]; },

  note(text) { const l = this.s.log; l.push({ t: now(), text }); if (l.length > 40) l.shift(); },
  timeLeft(endsAt) { const ms = Math.max(0, endsAt - now()); if (FAST) return `${Math.ceil(ms / 1000)}s`; const m = Math.ceil(ms / 60000); return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`; },
  FAST, now,
  // ---- test panel helpers ----
  skipDays(n) { try { localStorage.setItem(SKEW_KEY, String(SKEW + n * 86400000)); } catch (e) {} this.save(); location.reload(); },
  finishAll() { const t = now(); for (const tk of Object.values(this.s.tasks)) if (!tk.done && tk.endsAt > t) tk.endsAt = t; const p = this.s.plots.seedbed; if (p.stage === 'growing') p.readyAt = t; this.tick(); this.emit('inv'); },
  fillPack() { const o = {}; for (const k of Object.keys(C.resources)) o[k] = 20; this.give(o); },
  callTraveller() { this.s.village.nextAt = 0; this.tick(); },
};

// autosave on a timer and whenever the page is hidden
setInterval(() => { G.tick(); if (G.dirty) G.save(); }, 1000);
document.addEventListener('visibilitychange', () => { if (document.hidden) G.save(); });
window.addEventListener('pagehide', () => G.save());
window.GL = G;   // console: GL.s, GL.reset(), GL.give({seed:5})
})();
