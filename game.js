// Gnome Life — game state, rules, timers and save/load. No drawing in here.
// One JSON blob behind Store so it can move from localStorage to a server later.
(function () {
const C = window.CONTENT;
const FAST = /fast/.test(location.hash);          // #fast: minutes become tenths of a second (3h -> 18s)
const MIN = FAST ? 100 : 60000;                   // ms per content "minute"
const now = () => Date.now();
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
    journal: {},                             // visitorId -> { first, count }
    log: [],                                 // recent happenings, newest last
    spellsUsed: {},                          // spell -> dayKey last cast
    flags: {},
    events: { lastAt: t, seen: {} },        // gentle random happenings (CONTENT.events)
    story: { chapter: 0, flags: {}, found: [] },   // hook for the side mystery (the staff); Bryce writes the plot
  };
}

// ---------- the game ----------
const G = {
  s: null, listeners: new Set(), dirty: false, away: null,
  onChange(fn) { this.listeners.add(fn); },
  emit(kind, data) { for (const fn of this.listeners) fn(kind, data); this.dirty = true; },
  save() { if (!this.s) return; this.s.lastSeen = now(); Store.write(this.s); this.dirty = false; },
  reset() { Store.clear(); this.s = fresh(); this.save(); location.hash = ''; location.reload(); },
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
    this.tick();
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
      this.note(`${C.names[d.who]} finished: ${d.name.toLowerCase()}.`);
      this.emit('task', { id, done: true });
    }
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
    const [o] = s.offers.splice(i, 1); s.inv[o.kind] = (s.inv[o.kind] || 0) + 1;
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
    return C.tasks.find(t => t.id === id);
  },
  taskList() {   // everything the player could start or is waiting on, in a sensible order
    const s = this.s, out = [];
    for (const d of C.tasks) out.push(this.taskView(d));
    for (const [k, tl] of Object.entries(s.tiles)) if (tl.state === 'revealed' || tl.state === 'regrowing') out.push(this.taskView(this.taskDef('regrow:' + k)));
    return out.filter(v => v.show).sort((a, b) => (a.rank - b.rank));
  },
  taskView(d) {
    const s = this.s, tk = s.tasks[d.id], t = now();
    const locked = (d.needs || []).some(n => !(s.tasks[n] && s.tasks[n].done)) || (d.minLevel && this.magicLevel() < d.minLevel);
    const state = tk ? (tk.done ? 'done' : (tk.endsAt <= t ? 'done' : 'running')) : (locked ? 'locked' : 'ready');
    return { def: d, state, locked, endsAt: tk ? tk.endsAt : 0, startedAt: tk ? tk.startedAt : 0, can: this.can(d.cost), missing: this.missing(d.cost),
             show: state !== 'done' || (t - (tk.endsAt || 0)) < 60 * MIN, rank: { running: 0, ready: 1, locked: 2, done: 3 }[state],
             why: locked ? (d.minLevel && this.magicLevel() < d.minLevel ? `needs magic level ${d.minLevel}` : `after: ${(d.needs || []).map(n => this.taskDef(n).name.toLowerCase()).join(', ')}`) : '' };
  },
  startTask(id) {
    const d = this.taskDef(id), v = this.taskView(d); if (v.state !== 'ready' || !v.can) return false;
    this.pay(d.cost); const t = now();
    this.s.tasks[id] = { startedAt: t, endsAt: t + this.dur(d.mins), done: false };
    if (d.tile) this.s.tiles[d.tile].state = 'regrowing';
    this.note(`${C.names[d.who]} set to work: ${d.name.toLowerCase()}.`); this.emit('task', { id }); return true;
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

  // ---- journal ----
  pickVisitor(t = now()) {
    const h = new Date(t).getHours(), stage = this.landStage().key, order = C.landStages.map(s => s.key);
    const pool = C.visitors.filter(v => ((h >= v.hours[0] && h < v.hours[1]) || (v.alsoHours && h >= v.alsoHours[0] && h < v.alsoHours[1])) && (!v.stage || order.indexOf(stage) >= order.indexOf(v.stage)) && (!v.task || (this.s.tasks[v.task] && this.s.tasks[v.task].done)));
    if (!pool.length) return null; let r = Math.random() * pool.reduce((a, v) => a + v.weight, 0);
    for (const v of pool) { r -= v.weight; if (r <= 0) return v; } return pool[0];
  },
  noteVisitor(id) {
    const j = this.s.journal, isNew = !j[id]; j[id] = j[id] || { first: now(), count: 0 }; j[id].count++;
    if (isNew) this.note(`New in the journal: ${C.visitors.find(v => v.id === id).name.toLowerCase()}.`);
    this.emit('journal', { id, isNew }); return isNew;
  },

  // ---- story hook (placeholder; content lives in CONTENT.story once written) ----
  flag(k, v = true) { this.s.story.flags[k] = v; this.emit('story', k); },
  hasFlag(k) { return !!this.s.story.flags[k]; },

  note(text) { const l = this.s.log; l.push({ t: now(), text }); if (l.length > 40) l.shift(); },
  timeLeft(endsAt) { const ms = Math.max(0, endsAt - now()); if (FAST) return `${Math.ceil(ms / 1000)}s`; const m = Math.ceil(ms / 60000); return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`; },
  FAST,
};

// autosave on a timer and whenever the page is hidden
setInterval(() => { G.tick(); if (G.dirty) G.save(); }, 1000);
document.addEventListener('visibilitychange', () => { if (document.hidden) G.save(); });
window.addEventListener('pagehide', () => G.save());
window.GL = G;   // console: GL.s, GL.reset(), GL.give({seed:5})
})();
