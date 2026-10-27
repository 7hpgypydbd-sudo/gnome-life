// Gnome Life — game state, rules, timers and save/load. No drawing in here.
// One JSON blob behind Store so it can move from localStorage to a server later.
(function () {
const C = window.CONTENT;
const FAST = /fast/.test(location.hash);          // #fast: minutes become tenths of a second (3h -> 18s)
const MIN = FAST ? 100 : 60000;                   // ms per content "minute"
const SKEW_KEY = 'gnomelife.skew';   // test panel: pretend this many extra days have gone by (whole days, so the time of day stays right)
let SKEW = 0; try { SKEW = Number(localStorage.getItem(SKEW_KEY)) || 0; } catch (e) {}
const now = () => Date.now() + SKEW;
const DAY = () => 1440 * MIN;                     // a real day (a tenth-second-minute day under #fast)
const lc = (t) => t[0].toLowerCase() + t.slice(1);   // "Build Mabel a home" -> "build Mabel a home" (keeps names capitalised)
const cap = (t) => t[0].toUpperCase() + t.slice(1);
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
    secrets: { found: {}, out: [], nextAt: t + 30 * MIN },   // little finds (CONTENT.secrets): found id -> time, out = tucked in the land now
    season: '',                              // the season last seen (a new one gets a line in "While you were away")
    festival: { stage: 'waiting', tile: null, at: 0, day: '', years: [] },   // waiting | planning | ready | on | done (see festivalTick)
    pages: { seen: {}, cards: [], makes: {} },   // story pages read (id -> time; 0 = it had already happened before pages existed), cards waiting to open, Hazel's lists shown ('yard:green')
    spirit: { taught: {} },                  // the Wood spirit's lessons: number -> time taught
    moved: {},                               // creatures that moved into a home the gnomes made (CONTENT.story.moveIns): id -> time
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
    const before = !('pages' in this.s) && this.s.flags && this.s.flags.welcomed;   // a garden begun before the story was in the game
    for (const [k, v] of Object.entries(fresh())) if (!(k in this.s)) this.s[k] = v;   // older saves gain new fields
    if (before) this.storyCatchUp();
    const gully = this.s.tasks.ruts; if (gully && !gully.done) gully.endsAt = Math.min(gully.endsAt, now());   // the gully job is retired: one still running just finishes
    const tk = this.s.tasks; if (tk.bedwater && !tk.spring) tk.spring = { startedAt: tk.bedwater.startedAt, endsAt: tk.bedwater.startedAt, done: true };   // watered before the spring job existed: the spring counts as found
    if (tk.fence) this.s.flags.rabbit = true;
    if (this.s.plots.seedbed.grown) this.s.flags.firstpick = true;   // fenced before the rabbit's raid existed
    if (this.s.plots.seedbed.crop === 'sprout') this.s.plots.seedbed.crop = 'carrot';   // the old generic sprouts were always carrots at heart
    for (const [k, tl] of Object.entries(this.s.tiles)) if (k !== '0,0' && !tl.kind && tl.state === 'revealed') tl.kind = this.tileKind(k);   // bare tiles from before the healing chains get theirs; green ones stay as they were
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
    const se = this.season(t); if (s.season !== se) { if (s.season) report.season = se; s.season = se; }
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
    const p = s.plots.seedbed; if (p.stage === 'growing' && p.readyAt <= t) report.finished.push(`${this.cropName(p.crop)} ${p.crop === 'pumpkin' ? 'is' : 'are'} ready`);
    if (gone >= 60 * MIN && !s.flags.rabbit && s.feeder.food && p.stage === 'growing') { this.rabbitRaid(); report.rabbit = C.rabbit.away; }   // the rabbit came while you were away
    if (gone >= 60 * MIN) { const ate = this.awayEater(); if (ate) report.ate = ate; }
    const had = s.village.traveller && s.village.traveller.id, movedBefore = Object.keys(s.moved);
    this.tick();
    const nowMoved = C.story.moveIns.filter(m => s.moved[m.id] && !movedBefore.includes(m.id)); if (nowMoved.length) report.moved = nowMoved.map(m => m.note);
    if (s.village.traveller && s.village.traveller.id !== had) report.traveller = s.village.traveller.id;
    if (gone >= 2 * 60 * MIN) { const ev = this.rollEvent(t, true); if (ev) report.event = ev.text; }
    return report;
  },

  // ---- per-frame rules (cheap; call a few times a second) ----
  tick() {
    const s = this.s, t = now(); if (!s) return;   // not loaded yet (the first frame can come before the save is read)
    // crop
    const p = s.plots.seedbed;
    if (p.stage === 'growing' && p.readyAt <= t) { p.stage = 'ready'; this.note(`${cap(this.cropName(p.crop))} ${p.crop === 'pumpkin' ? 'is' : 'are'} ready to pick.`); this.emit('plot', p); }
    // tasks
    for (const [id, tk] of Object.entries(s.tasks)) {
      if (tk.done || tk.endsAt > t) continue;
      tk.done = true; const d = this.taskDef(id);
      if (d.healTile) this.healDone(d);
      else if (d.farm) this.farmDone(d, tk);
      else if (d.tile) { const tl = s.tiles[d.tile]; tl.state = 'green'; tl.green = 4; this.reveal(d.tile); this.note(`The land next door has greened.`); }
      else this.addGreen(d.green, d.make === 'garden' ? 'garden' : 'yard');
      if (d.folk) this.villageDone(id, d, tk);
      if (id === 'bridge') { for (const k of ['1,-1', '0,-1', '2,-1', '-1,-1']) if (s.tiles[k] && s.tiles[k].state === 'green') this.reveal(k); this.note('The bridge is up. The far side of the stream is reachable at last.'); }
      if (d.give) this.give(d.give);
      this.note(`${C.names[d.who]} finished: ${lc(d.name)}.`); if (d.doneNote) this.note(d.doneNote);
      this.emit('task', { id, done: true });
    }
    this.storyTick(t);
    this.moveInTick(t);
    this.healTick(t);
    this.farmTick(t);
    this.villageTick(t);
    this.festivalTick(t);
    this.secretTick(t);
    const E = C.events; if (E && t - s.events.lastAt >= E.every * MIN) this.rollEvent(t);
    // offerings trickle in during a visit too
    if (t - s.lastOfferAt >= C.offerEvery * MIN) { s.lastOfferAt = t; if (s.offers.length < C.offerCap) { this.spawnOffer(t); this.emit('offer'); } }
  },

  // ---- gentle events (data in CONTENT.events; never a loss) ----
  season(t) { const o = /(spring|summer|autumn|winter)/.exec(location.hash); if (o) return o[1];   // #autumn etc. to try a season
    const m = new Date(t).getMonth(); return m >= 8 && m <= 10 ? 'spring' : m === 11 || m <= 1 ? 'summer' : m <= 4 ? 'autumn' : 'winter'; },
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

  // ---- little finds: one tiny painted secret now and then on healed ground, at most two out, until all are found ----
  secretTick(t) {
    const sc = this.s.secrets; if (t < sc.nextAt || sc.out.length >= 2 || this.landStage().key === C.landStages[0].key) return;
    const [lo, hi] = C.secretEvery; sc.nextAt = t + (lo + Math.random() * (hi - lo)) * MIN;
    this.spawnSecret();
  },
  spawnSecret() {
    const s = this.s, sc = s.secrets, left = C.secrets.filter(x => !sc.found[x.id] && !sc.out.some(o => o.id === x.id)); if (!left.length) return null;
    const greens = Object.keys(s.tiles).filter(k => s.tiles[k].state === 'green' || k === '0,0'), tile = greens[(Math.random() * greens.length) | 0];
    let gx, gy, n = 0; do { gx = 0.12 + Math.random() * 0.76; gy = 0.12 + Math.random() * 0.76; } while (this.spotTaken && this.spotTaken(tile, gx, gy) && ++n < 12);
    const o = { id: left[(Math.random() * left.length) | 0].id, tile, gx, gy };
    sc.out.push(o); this.dirty = true; return o;
  },
  findSecret(id) {
    const sc = this.s.secrets, i = sc.out.findIndex(o => o.id === id); if (i < 0) return null;
    sc.out.splice(i, 1); sc.found[id] = now(); const d = C.secrets.find(x => x.id === id);
    this.note(`You found ${d.name}.`); this.emit('secret', d); return d;
  },

  // ---- offerings ----
  spawnOffer(t) {
    const s = this.s, h = new Date(t).getHours(), night = h < 6 || h >= 19;
    const pool = C.offers.map(o => ({ kind: o.kind, w: (night ? o.night : o.day) * (o.kind === 'water' && h >= 5 && h < 10 ? 2.5 : 1) })).filter(o => o.w > 0);
    let r = Math.random() * pool.reduce((a, o) => a + o.w, 0), kind = pool[0].kind;
    for (const o of pool) { r -= o.w; if (r <= 0) { kind = o.kind; break; } }
    const tiles = Object.keys(s.tiles).filter(k => s.tiles[k].state !== 'revealed' || Math.random() < 0.3);
    const tile = tiles[(Math.random() * tiles.length) | 0];
    let gx, gy, n = 0; do { gx = 0.1 + Math.random() * 0.8; gy = 0.1 + Math.random() * 0.8; } while (this.spotTaken && this.spotTaken(tile, gx, gy) && ++n < 12);   // not on the dug seed bed
    s.offers.push({ id: Math.random().toString(36).slice(2, 8), kind, tile, gx, gy, at: t });
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
  cropName(id) { return C.crops[id] ? C.crops[id].name.replace(/^a /, 'the ') : 'the crop'; },
  cropOpen(id) {   // may this crop be sown yet? (needs: flag:x, grown:n harvests, or a finished job)
    const c = C.crops[id], p = this.plot();
    if (!this.s.flags.firstpick && id !== 'carrot') return false;   // the very first sowing is carrots (story pages 1.4 and 2.1)
    return (c.needs || []).every(n => n.startsWith('flag:') ? !!this.s.flags[n.slice(5)] : n.startsWith('grown:') ? p.grown >= +n.slice(6) : this.done(n));
  },
  canSow() { return Object.keys(C.crops).some(id => this.cropOpen(id) && this.can(this.cropCost(id))); },   // something in the tin we could sow right now
  cropCost(id) { const c = C.crops[id]; return c.free && !this.s.flags['sown:' + c.free] ? {} : c.plant; },   // Wendel's pumpkin seed is free the first time
  plant(cropId = 'carrot') {
    const p = this.plot(), c = C.crops[cropId], cost = c && this.cropCost(cropId); if (!c || p.stage || !this.cropOpen(cropId) || !this.can(cost)) return false;
    this.pay(cost); if (c.free) this.s.flags['sown:' + c.free] = true;
    p.crop = cropId; p.stage = 'planted'; p.plantedAt = now(); p.readyAt = 0;
    this.note(cropId === 'pumpkin' && !Object.keys(cost).length ? 'Wendel pressed his one enormous pumpkin seed into the middle of the bed, very solemnly. It wants water.' : `${cap(c.name.replace(/^a /, ''))} sown across the bed. ${c.water > 1 ? 'They want a good drink.' : 'They want water.'}`);
    this.emit('plot', p); return true;
  },
  waterCost() { const p = this.plot(); return { water: (C.crops[p.crop] || {}).water || 1 }; },
  water() {
    const p = this.plot(), cost = this.waterCost(); if (p.stage !== 'planted' || !this.can(cost)) return false;
    this.pay(cost); p.stage = 'growing'; p.wateredAt = now(); p.readyAt = now() + this.dur(C.crops[p.crop].grow);
    this.note('Watered. Now it grows.'); this.emit('plot', p); return true;
  },
  harvest() {   // returns what was picked (for the little float), or false
    const p = this.plot(); if (p.stage !== 'ready') return false;
    const c = C.crops[p.crop], got = Object.assign({}, c.harvest), nib = !!p.nibbled; let k0 = Object.keys(got)[0];
    if (nib && got[k0] > 1) got[k0]--;   // the rabbit had a few
    if (this.done('compost')) got.seed = (got.seed || 0) + 1;   // the compost heap makes the soil rich: one extra seed every harvest
    this.give(got); this.addGreen(c.green); p.grown++; this.s.flags['picked:' + p.crop] = true;
    const id = p.crop; p.crop = null; p.stage = null; p.readyAt = 0; p.nibbled = false; this.s.flags.firstpick = true;   // the first crop opens up the home jobs
    this.note(id === 'pumpkin' && !this.s.flags.pumpkin ? 'A pumpkin nearly as big as Wendel. He says it is for the festival, and will not hear otherwise. Hazel has saved every seed.'
      : `Picked ${c.name.replace(/^a /, 'the ')}${nib ? ' (what the rabbit left)' : ''}. Into the pantry they go, and the ground remembers a little more of how to grow.`);
    if (id === 'pumpkin') this.s.flags.pumpkin = true;
    this.emit('plot', p); return got;
  },

  // ---- tasks ----
  taskDef(id) {
    if (id.startsWith('heal:')) return this.healDef(id);
    if (id.startsWith('farm:')) return this.farmTask(id);
    if (id.startsWith('regrow:')) { const tile = id.slice(7); return Object.assign({ id, tile }, C.regrow, { name: `${C.regrow.name} (${this.tileName(tile)})` }); }
    if (id.startsWith('fest:')) { const j = C.festival.jobs.find(j => j.id === id); return j && Object.assign({ festival: true }, j, { cost: this.festCost(j) }); }
    const [kind, fid, step] = id.split(':'), f = this.folkDef(fid);
    if (f && kind === 'home') return Object.assign({ id, folk: fid, name: `Build ${f.short} a home`, short: 'building a home', green: 2, home: true, act: 'carry' }, f.build);
    if (f && kind === 'trade') return Object.assign({ id, folk: fid, green: 1 }, f.building);
    if (f && kind === 'quest') { const st = f.quest.steps[+step]; return Object.assign({ id, folk: fid, green: 1, blurb: st.say, quest: true }, st.job); }
    const d = C.tasks.find(t => t.id === id);
    return d && d.who === 'either' ? Object.assign({}, d, { who: this.eitherWho(d) }) : d;
  },
  eitherWho(d) {   // a job either gnome can do: whoever took it on, else whoever is free (Hazel first if both are)
    const tk = this.s.tasks[d.id]; if (tk && tk.who) return tk.who;
    const busy = w => Object.entries(this.s.tasks).some(([id, k]) => !k.done && k.endsAt > now() && id !== d.id && (k.who || (C.tasks.find(t => t.id === id) || {}).who) === w);
    return ['her', 'him'].find(w => !busy(w)) || 'her';
  },
  taskList() {   // everything the player could start or is waiting on, in a sensible order
    const s = this.s, out = [];
    for (const d of C.tasks) if (!d.retired) out.push(this.taskView(this.taskDef(d.id)));
    for (const [k, tl] of Object.entries(s.tiles)) if (!tl.kind && (tl.state === 'revealed' || tl.state === 'regrowing')) out.push(this.taskView(this.taskDef('regrow:' + k)));   // an older garden half-way through the old job
    for (const k of this.healTiles()) { const i = this.healAt(k); if (i > 0) out.push(this.taskView(this.taskDef(`heal:${k}:${i - 1}`))); if (this.healOpen(k)) out.push(this.taskView(this.taskDef(`heal:${k}:${i}`))); }   // one job at a time on each patch: the next one, and the one just finished
    for (const fid of this.farms()) { const n = this.farmSteps(fid).length, i = this.farmAt(fid);   // a farm, like a patch: the next job and the one just finished, then picking once it has grown
      if (i > 0) out.push(this.taskView(this.taskDef(`farm:${fid}:${i - 1}`))); if (i < n) out.push(this.taskView(this.taskDef(`farm:${fid}:${i}`)));
      if (this.farmGrown(fid)) out.push(this.taskView(this.taskDef(`farm:${fid}:pick`))); }
    const v = s.village;
    if (v.traveller) out.push(this.taskView(this.taskDef('home:' + v.traveller.id)));
    for (const [fid, fs] of Object.entries(v.folk)) {
      out.push(this.taskView(this.taskDef('trade:' + fid)));
      const st = this.questStep(fid); if (st && st.job) out.push(this.taskView(this.taskDef(`quest:${fid}:${fs.q}`)));
    }
    if (s.festival.stage !== 'waiting') for (const j of C.festival.jobs) out.push(this.taskView(this.taskDef(j.id)));
    return out.filter(v => v.show).sort((a, b) => (a.rank - b.rank));
  },
  taskView(d) {
    const s = this.s, tk = s.tasks[d.id], t = now();
    const gate = tk ? '' : this.gateWhy(d);
    const met = n => n.startsWith('flag:') ? !!s.flags[n.slice(5)] : n.startsWith('tile:') ? !!s.tiles[n.slice(5)] : !!(s.tasks[n] && s.tasks[n].done);   // 'flag:x' = after something happened (e.g. the rabbit's raid)
    const locked = (d.needs || []).some(n => !met(n)) || (d.minLevel && this.magicLevel() < d.minLevel) || !!gate;
    const state = tk ? (tk.done ? 'done' : (tk.endsAt <= t ? 'done' : 'running')) : (locked ? 'locked' : 'ready');
    return { def: d, state, locked, endsAt: tk ? tk.endsAt : 0, startedAt: tk ? tk.startedAt : 0, can: this.can(d.cost), missing: this.missing(d.cost),
             show: (state !== 'done' || (t - (tk.endsAt || 0)) < 60 * MIN) && (!d.make || !!tk || this.makeOpen(d)) && !(d.needs || []).some(n => (n.startsWith('trade:') && !this.folkState(n.slice(6))) || ((n.startsWith('flag:') || n.startsWith('tile:')) && !met(n))),   // village jobs stay hidden until that neighbour lives here
             rank: { running: 0, ready: 1, locked: 2, done: 3 }[state],
             why: gate ? gate : locked ? (d.minLevel && this.magicLevel() < d.minLevel ? `needs magic level ${d.minLevel}` : `after: ${(d.needs || []).filter(n => !n.startsWith('flag:') && !n.startsWith('tile:')).map(n => lc(this.taskDef(n).name)).join(', ')}`) : '' };
  },
  startTask(id) {
    const d = this.taskDef(id), v = this.taskView(d); if (v.state !== 'ready' || !v.can) return false;
    this.pay(d.cost); const t = now();
    this.s.tasks[id] = { startedAt: t, endsAt: t + this.dur(d.mins), done: false }; if (d.healTile || d.farm || C.tasks.some(x => x.id === id && x.who === 'either')) this.s.tasks[id].who = d.who;
    if (d.home || d.claims) this.s.tasks[id].tile = this.freeLot();
    if (d.claims) this.s.festival.tile = this.s.tasks[id].tile;
    if (d.tile) this.s.tiles[d.tile].state = 'regrowing';
    this.note(`${C.names[d.who]} set to work: ${lc(d.name)}.`); this.emit('task', { id }); return true;
  },
  running() { return Object.entries(this.s.tasks).filter(([, tk]) => !tk.done).map(([id, tk]) => Object.assign({ id }, tk, { def: this.taskDef(id) })); },

  // ---- land ----
  tileName(k) { const [x, y] = k.split(',').map(Number); return x > 0 ? 'east' : x < 0 ? 'west' : y > 0 ? 'south' : 'north'; },
  landStage(k = '0,0') { const g = this.s.tiles[k] ? this.s.tiles[k].green : 0; let st = C.landStages[0]; for (const s of C.landStages) if (g >= s.at) st = s; return st; },
  // Green the yard earns spreads into the couple's garden once it is open; what is grown in the garden stays in the garden.
  addGreen(n, where = 'yard') {
    if (!n) return;
    const bump = k => { const before = this.landStage(k).key; this.s.tiles[k].green += n; const after = this.landStage(k); return after.key !== before ? after : null; };
    if (where !== 'garden') { const st = bump('0,0');
      if (st) { this.note(`The home patch is now ${st.name}.`); if (st.key === 'green') this.reveal('0,0'); this.s.pages.cards.push({ k: 'land', key: st.key }); this.emit('land', st); } }
    if (this.gardenOpen()) { const st = bump('0,1'); if (st) this.note(`The garden is now ${st.name}.`); }
  },
  gardenOpen() { const t = this.s.tiles['0,1']; return !!t && t.state === 'green' && !Object.values(this.s.village.folk).some(f => f.tile === '0,1'); },   // the couple's garden (tile 0,1; an older save may have a neighbour living there)
  stageIndex(k) { return C.landStages.indexOf(this.landStage(k)); },
  // ---- little makes (CONTENT.makes; the makes are tasks with make: yard | garden) ----
  makeTile(d) { return C.makes[d.make].tile; },
  makeOpen(d) {   // has this make come up yet? its patch is open and green enough, and anything it needs is there
    const s = this.s, k = this.makeTile(d); if (k !== '0,0' && !this.gardenOpen()) return false;
    if (d.make === 'yard' && !s.flags.firstpick) return false;   // the first makes come after the first harvest (Hazel's list)
    if (this.stageIndex(k) < C.landStages.findIndex(x => x.key === d.stage)) return false;
    return (d.needs || []).every(n => n.startsWith('flag:') ? !!s.flags[n.slice(5)] : this.done(n));
  },
  makesCount(patch) { const all = C.tasks.filter(d => d.make === patch); return { done: all.filter(d => this.done(d.id)).length, total: all.length }; },
  reveal(k) {   // bare neighbours appear around a greened tile (max 2 at a time so the map grows gently)
    const [x, y] = k.split(',').map(Number); let n = 0;
    for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
      const kk = `${x + dx},${y + dy}`; if (this.s.tiles[kk] || n >= 2 || Math.abs(x + dx) > 2 || Math.abs(y + dy) > 2) continue;
      if (y + dy < -1 && !this.done('bridge')) continue;   // the far side of the stream waits for the bridge
      this.s.tiles[kk] = { state: 'revealed', green: 0, kind: this.tileKind(kk) }; n++;
    }
    if (n) this.note('The mist has drawn back from more bare ground.');
  },

  // ---- healing the bare tiles (CONTENT.heal; docs/PLAN.md "Healing the bare tiles") ----
  // Each bare tile has a kind and a chain of jobs that unlock one after another. Jobs are 'heal:<tile>:<step>'. A tile keeps its
  // own green points (tiles[k].green) and moves through the same land stages as home; at first green it counts as healed
  // ('green': neighbours can settle, more bare land appears). Life gives the green, often a while after the job (step.later).
  tileKind(k) {   // fixed per tile: the stream row is the dry creek, the column east of home the old track; the rest from the old bare-tile art
    const [x, y] = k.split(',').map(Number); if (k === '0,1') return 'meadow';   // the couple's garden-to-be
    if (y === -1) return 'creek'; if (x === 1) return 'verge';
    return ['nursery', 'creature', 'meadow', 'creature', 'nursery'][Math.abs(x * 7 + y * 13 + x * y * 3) % 5];   // index.html BARREN: plain, stumps, fence, dead tree, plain
  },
  healTiles() { return Object.keys(this.s.tiles).filter(k => this.s.tiles[k].kind); },
  healSteps(k) { return C.heal.kinds[this.s.tiles[k].kind].steps; },
  healDef(id) {
    const [, k, i] = id.split(':'), tl = this.s.tiles[k], st = tl && tl.kind && C.heal.kinds[tl.kind].steps[+i]; if (!st) return null;
    const d = Object.assign({}, st, { id, healTile: k, heal: tl.kind, step: +i, stepId: st.id, green: st.green || 0, who: 'either', where: `${cap(C.heal.kinds[tl.kind].patch)}, ${this.tileWhere(k)}` });
    d.who = this.eitherWho(d); if (typeof st.act === 'object') d.act = st.act[d.who];
    return d;
  },
  tileWhere(k) { const [x, y] = k.split(',').map(Number); const ns = y < 0 ? 'behind the house' : y > 0 ? 'in front' : '', ew = x < 0 ? 'to the left' : x > 0 ? 'to the right' : '';
    return [ns, ew].filter(Boolean).join(' and ') + (Math.abs(x) + Math.abs(y) > 1 ? ', further out' : ''); },
  healStepDone(k, i) { const st = this.healSteps(k)[i], tk = this.s.tasks[`heal:${k}:${i}`]; return !!(tk && tk.done) || (!!st.once && !tk && !!this.s.flags[st.once]); },
  healAt(k) { const n = this.healSteps(k).length; let i = 0; while (i < n && this.healStepDone(k, i)) i++; return i; },   // the first job not done yet (n: all done)
  healClaimed(k) {   // a neighbour's lot, the festival green or the couple's garden: the chain stops at first green and that takes over
    const s = this.s; if (k === '0,1' || s.festival.tile === k || Object.values(s.village.folk).some(f => f.tile === k)) return true;
    return Object.entries(s.tasks).some(([id, tk]) => id.startsWith('home:') && tk.tile === k);
  },
  healOpen(k) {   // is there a next job to offer on this patch?
    const i = this.healAt(k); if (i >= this.healSteps(k).length) return false;
    return !!this.s.tasks[`heal:${k}:${i}`] || !this.healClaimed(k) || this.landStage(k).key === 'barren';
  },
  healWait(k, i) {   // the time the job before this one asks it to wait until (seedlings growing in their pots), or 0
    if (i < 1) return 0; const pr = this.healSteps(k)[i - 1]; if (!pr.wait) return 0;
    const tl = this.s.tiles[k]; if (tl.woke) return 0;
    const tk = this.s.tasks[`heal:${k}:${i - 1}`] || Object.entries(this.s.tasks).filter(([id, t]) => id.endsWith(':' + (i - 1)) && id.startsWith('heal:') && t.done && this.healDef(id) && this.healDef(id).stepId === pr.id).map(([, t]) => t)[0];
    return tk ? tk.endsAt + pr.wait * MIN : 0;
  },
  flowing(k) { const tl = this.s.tiles[k]; if (!tl || tl.kind !== 'creek') return false; const i = this.healSteps(k).findIndex(st => st.id === 'stones'); return this.healStepDone(k, i); },
  canFlow(k) { const [x, y] = k.split(',').map(Number); return ['0,-1', '1,-1', '-2,-1'].includes(k) || this.flowing(`${x - 1},${y}`) || this.flowing(`${x + 1},${y}`); },   // fed by the spring at home, the old spring at the west end, or a flowing stretch next door
  tileGreen(k, n) {   // green points on one bare tile; a new stage gets its own land card
    if (!n) return; const tl = this.s.tiles[k], before = this.landStage(k).key; tl.green += n; const st = this.landStage(k);
    if (st.key === before) return;
    if (tl.state !== 'green') { tl.state = 'green'; this.reveal(k); }
    this.note(`${cap(this.patchName(k))} is now ${st.name}.`); this.s.pages.cards.push({ k: 'tland', tile: k, key: st.key }); this.emit('land', st);
  },
  patchName(k) { const fid = this.farmOn(k); if (fid) return C.farms.list[fid].patch; const tl = this.s.tiles[k]; return tl && tl.kind ? C.heal.kinds[tl.kind].patch : 'the patch next door'; },
  healDone(d) {
    if (d.once) this.s.flags[d.once] = true;
    this.tileGreen(d.healTile, d.green);
  },
  healTick(t) {   // life coming back after a job: sprouts, creatures moving in, saplings growing (each fires once)
    for (const k of this.healTiles()) {
      const tl = this.s.tiles[k], ev = tl.ev || (tl.ev = {});
      this.healSteps(k).forEach((st, i) => {
        const tk = this.s.tasks[`heal:${k}:${i}`]; if (!st.later || !tk || !tk.done) return;
        st.later.forEach((l, j) => { const key = `${i}.${j}`; if (key in ev || t < tk.endsAt + l.after * MIN) return;
          ev[key] = t; if (l.note) this.note(l.note); this.tileGreen(k, l.green); this.emit('healev', { tile: k, ev: l.ev }); });
      });
    }
  },
  healEv(k, i, j) { const tl = this.s.tiles[k]; return tl && tl.ev ? tl.ev[`${i}.${j}`] || 0 : 0; },   // when that happened (0: not yet)
  healTaught(kind) { return ('heal:' + kind) in this.s.spirit.taught; },
  healSpellFor(kind) { return this.running().filter(r => r.def.healTile && r.def.heal === kind && r.def.spell && r.endsAt > now()); },
  seedlingsWaiting() { return this.healTiles().filter(k => { const i = this.healAt(k), w = this.healWait(k, i); return w > now(); }); },
  healCast(id, t) {
    const kind = C.spells[id].heal;
    for (const r of this.healSpellFor(kind)) this.s.tasks[r.id].endsAt = t + (r.endsAt - t) / 2;
    if (kind === 'nursery') for (const k of this.seedlingsWaiting()) this.s.tiles[k].woke = true;
    this.note({ wind: 'The wind lifted the seed balls and carried them into the far corners.', cloud: 'A small grey cloud stopped over the cracked earth and rained there, and only there.', seedwake: 'The seedlings in their pots stretched, as if somebody had opened the curtains.', sing: 'The trickle found its way round the stones, humming.' }[id]);
  },
  treeNames(k) {   // the names Wendel has given the trees on this patch
    const tl = this.s.tiles[k]; if (!tl.kind) return []; const [x, y] = k.split(',').map(Number), N = C.heal.treeNames, out = [];
    this.healSteps(k).forEach((st, i) => { if (st.tree && this.healStepDone(k, i)) for (let n = 0; n < (st.green >= 4 ? 2 : 1); n++) out.push(N[Math.abs(x * 5 + y * 11 + i * 3 + n * 7) % N.length]); });
    return out;
  },

  // ---- the neighbours' farms (CONTENT.farms; docs/PLAN.md "Neighbour farms") ----
  // A neighbour's farm opens on their lot once their trade building is up. Jobs are 'farm:<id>:<step>' and 'farm:<id>:pick'.
  // Its green goes onto that lot's own tile (tileGreen), so the lot keeps going through the land stages after first green.
  // Life events (step.later) are kept in village.folk[id].ev; the picking comes back pickEvery minutes after the last one.
  farms() { return this.settled().filter(fid => C.farms.list[fid] && this.done('trade:' + fid) && this.s.tiles[this.folkState(fid).tile]); },
  farmOn(k) { return this.farms().find(fid => this.folkState(fid).tile === k) || null; },
  farmSteps(fid) { return C.farms.list[fid].steps; },
  farmAt(fid) { const n = this.farmSteps(fid).length; let i = 0; while (i < n && this.done(`farm:${fid}:${i}`)) i++; return i; },
  farmEv(fid, name) { const fs = this.folkState(fid); return fs && fs.ev ? fs.ev[name] || 0 : 0; },   // when that bit of growing happened (0: not yet)
  farmGrown(fid) { return !!this.farmEv(fid, 'grown'); },
  farmTask(id) {
    const [, fid, i] = id.split(':'), F = C.farms.list[fid], fs = this.folkState(fid); if (!F || !fs) return null;
    const st = i === 'pick' ? F.pick : F.steps[+i]; if (!st) return null;
    const d = Object.assign({}, st, { id, farm: fid, farmTile: fs.tile, step: i === 'pick' ? 'pick' : +i, stepId: i === 'pick' ? 'pick' : st.id, green: st.green || 0, who: 'either', where: cap(F.patch) });
    d.who = this.eitherWho(d); return d;
  },
  farmDone(d, tk) {
    const fs = this.folkState(d.farm), F = C.farms.list[d.farm];
    if (d.stepId === 'pick') { fs.picked = tk.endsAt; fs.picks = (fs.picks || 0) + 1; this.note(F.pick.thanks); return; }
    this.tileGreen(d.farmTile, d.green);
  },
  farmTick(t) {
    for (const fid of this.farms()) {
      const fs = this.folkState(fid), ev = fs.ev || (fs.ev = {});
      this.farmSteps(fid).forEach((st, i) => { const tk = this.s.tasks[`farm:${fid}:${i}`]; if (!st.later || !tk || !tk.done) return;
        for (const l of st.later) { if (l.ev in ev || t < tk.endsAt + l.after * MIN) continue; ev[l.ev] = t; if (l.note) this.note(l.note); this.tileGreen(fs.tile, l.green); this.emit('farmev', { folk: fid, ev: l.ev }); } });
      const pid = `farm:${fid}:pick`, pk = this.s.tasks[pid];   // picked: it can be picked again a day later
      if (pk && pk.done && t >= pk.endsAt + C.farms.pickEvery * MIN) { delete this.s.tasks[pid]; this.note(`${cap(C.farms.list[fid].patch)} is ready to pick again.`); this.dirty = true; }
    }
  },
  farmRipe(fid) {   // 0..1: how far the farm has grown back since the last picking (1: ready, or never picked)
    const fs = this.folkState(fid), tk = this.s.tasks[`farm:${fid}:pick`];
    if (tk && !tk.done && tk.endsAt > now()) return 1 - (now() - tk.startedAt) / (tk.endsAt - tk.startedAt);
    if (!tk) return 1; return Math.min(1, (now() - tk.endsAt) / (C.farms.pickEvery * MIN));
  },
  swapOpen(fid) { const fs = this.folkState(fid); return this.farmGrown(fid) && fs.swapDay !== dayKey(now()); },
  swap(fid) {   // the pantry swap: once a day at each grown farm
    const sw = C.farms.list[fid].swap, fs = this.folkState(fid); if (!this.swapOpen(fid) || !this.can(sw.give)) return false;
    this.pay(sw.give); this.give(sw.get); fs.swapDay = dayKey(now()); this.note(sw.text); this.emit('inv'); return true;
  },
  // ---- the platypus (docs/ANIMALS.md section 8): it glides past at dawn on the last stretch of the creek to heal, once every
  // stretch is healed. Never moves in. The first dawn after, it always comes; after that about one dawn in four.
  creekTiles() { return [-2, -1, 0, 1, 2].map(x => `${x},-1`); },
  creekHealed() { return this.creekTiles().every(k => { const tl = this.s.tiles[k]; return tl && tl.kind === 'creek' && this.healAt(k) >= this.healSteps(k).length; }); },
  platypusTile() {   // the stretch that finished healing last
    let best = null, at = -1; for (const k of this.creekTiles()) { if (!this.s.tiles[k] || !this.s.tiles[k].kind) continue; const n = this.healSteps(k).length, tk = this.s.tasks[`heal:${k}:${n - 1}`], e = tk ? tk.endsAt : 0; if (e > at) { at = e; best = k; } }
    return best;
  },
  platypusDay(t = now()) {   // is this a dawn the platypus might come? (the first after the creek healed, then about one in four)
    if (!this.creekHealed() && !/platypus/.test(location.hash)) return false;
    const f = this.s.flags, dk = dayKey(t), h = new Date(t).getHours(); if (/platypus/.test(location.hash)) return true;
    if (!f.platypusFirst && h >= 4 && h < 9) { f.platypusFirst = dk; this.dirty = true; } if (f.platypusFirst === dk) return true;
    let hsh = 7; for (const ch of dk) hsh = (hsh * 31 + ch.charCodeAt(0)) % 1000003; return hsh % 4 === 0;
  },

  // ---- magic ----
  magicLevel() { const d = this.s.days.length; let L = 1; C.magicLevels.forEach((m, i) => { if (d >= m.days) L = i + 1; }); return L; },
  magicInfo() { const L = this.magicLevel(), m = C.magicLevels[L - 1], next = C.magicLevels[L]; return { level: L, name: m.name, days: this.s.days.length, nextDays: next ? next.days : null, spells: C.magicLevels.slice(0, L).map(x => x.unlock).filter(Boolean) }; },
  canCast(id) {
    const sp = C.spells[id]; if (!(sp.heal ? this.healTaught(sp.heal) : sp.special ? this.gardenOpen() : this.magicInfo().spells.includes(id))) return { ok: false, why: 'not yet learned' };
    if (sp.heal && !this.healSpellFor(sp.heal).length && !(sp.heal === 'nursery' && this.seedlingsWaiting().length)) return { ok: false, why: sp.heal === 'nursery' ? 'no seedlings are waiting to wake' : 'it helps a job that is under way: start it first' };   // special spells come with what they are for, not with days
    if (!this.can(sp.cost)) return { ok: false, why: `needs ${this.missing(sp.cost).join(', ')}` };
    if (id === 'legs' && this.s.flags.toadWalk) return { ok: false, why: 'it has already walked off' };
    if (id === 'coax' && this.plot().stage !== 'growing') return { ok: false, why: 'nothing is growing' };
    if (id === 'rain' && this.plot().stage !== 'planted') return { ok: false, why: 'nothing is waiting for water' };
    if (id === 'wake' && !this.running().some(r => r.def.tile || r.def.healTile)) return { ok: false, why: 'no patch is regrowing' };
    return { ok: true };
  },
  cast(id) {
    if (!this.canCast(id).ok) return false; this.pay(C.spells[id].cost); const t = now();
    if (id === 'coax') { this.plot().readyAt = t; this.note(`A warm hush over the bed, and ${this.cropName(this.plot().crop)} fill out all at once.`); }
    if (id === 'rain') { const p = this.plot(); p.stage = 'growing'; p.readyAt = t + this.dur(C.crops[p.crop].grow); this.give({ water: 2 }); this.note('Soft rain falls on the bed and beads on the stones.'); }
    if (id === 'legs') { this.s.flags.toadWalk = t; this.note('The big toadstool shivered, sprouted little root legs and walked off to the far corner of the garden.'); }
    if (C.spells[id].heal) this.healCast(id, t);
    if (id === 'wake') { for (const r of this.running()) if (r.def.tile || r.def.healTile) this.s.tasks[r.id].endsAt = t + (r.endsAt - t) / 2; this.note('The ground stirs under the mist.'); }
    this.s.spellsUsed[id] = dayKey(t); this.emit('spell', id); this.tick(); return true;
  },

  // ---- journal, visitors and the feeding dish ----
  visitorDef(id) { return C.visitors.find(v => v.id === id); },
  pickVisitor(t = now()) {
    const s = this.s, h = new Date(t).getHours(), stage = this.landStage().key, order = C.landStages.map(x => x.key), dk = dayKey(t), food = s.feeder.food;
    const pool = C.visitors.filter(v => ((h >= v.hours[0] && h < v.hours[1]) || (v.alsoHours && h >= v.alsoHours[0] && h < v.alsoHours[1])) && (!v.stage || order.indexOf(stage) >= order.indexOf(v.stage)) && (!v.task || (s.tasks[v.task] && s.tasks[v.task].done)) && (!v.seasons || v.seasons.includes(this.season(t))));
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
  // ---- the rain barrel: once scrubbed it fills with rain; tap it to draw the water ----
  barrelFull() { const tk = this.s.tasks.rainbarrel; if (!(tk && this.done('rainbarrel'))) return false; return now() - (this.s.barrelAt || tk.endsAt) >= C.barrel.every * MIN; },
  drawBarrel() { if (!this.barrelFull()) return false; this.s.barrelAt = now(); this.give(C.barrel.give); this.note('Fresh rainwater from the barrel.'); return true; },
  // ---- the rabbit: a cheeky regular, never a real loss ----
  // The first time there is food in the dish while the seedlings are up, a rabbit eats the lot and then nibbles a few sprouts.
  // Only then is "Fence the seed bed" offered. index.html plays the raid when you are watching; catchUp() settles it when you were away.
  rabbitDue() {
    const s = this.s, t = now(); if (s.flags.rabbit || !s.feeder.food || this.plot().stage !== 'growing') { s.rabbitAt = 0; return false; }
    if (!s.rabbitAt) s.rabbitAt = t + C.rabbit.after * MIN; return t >= s.rabbitAt;
  },
  rabbitAte() { this.s.feeder.food = null; this.note(C.rabbit.dish); this.emit('feeder', this.s.feeder); },
  rabbitRaid() {
    const s = this.s; if (s.flags.rabbit) return; if (s.feeder.food) s.feeder.food = null;
    if (this.plot().stage === 'growing') this.plot().nibbled = true;
    s.flags.rabbit = true; this.note(C.rabbit.raid); this.emit('rabbit'); this.emit('plot', this.plot());
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
    if (s.festival.tile) taken.add(s.festival.tile);
    return C.village.lots.find(k => s.tiles[k] && s.tiles[k].state === 'green' && !taken.has(k)) || null;
  },
  gateWhy(d) {   // extra reasons a job cannot start yet, in words ('' = fine)
    const busy = d.who && Object.entries(this.s.tasks).find(([id, tk]) => !tk.done && tk.endsAt > now() && id !== d.id && (this.taskDef(id) || {}).who === d.who);   // one job at a time for each gnome
    if (busy) return `${C.names[d.who]} is busy with ${lc(this.taskDef(busy[0]).name)}`;
    if (d.home && !this.freeLot()) return 'needs a healed patch next door for their home';
    if (d.claims && !this.s.tasks[d.id] && !this.freeLot()) return 'needs a healed patch with no home on it';
    if (d.healTile) { const w = this.healWait(d.healTile, d.step); if (w > now()) return `the tree seedlings are still growing (ready in ${this.timeLeft(w)})`;
      if (d.needsFlow && !this.canFlow(d.healTile)) return 'the water cannot reach this stretch yet: clear the creek next to it first'; }
    if (d.farm && d.hours && !this.inHours(d.hours, new Date(now()).getHours())) return d.hoursWhy || 'not at this time of day';
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

  // ---- the festival: the soft ending (content in CONTENT.festival) ----
  // waiting -> planning (enough neighbours: the idea and the secret story pages; festival jobs appear in Jobs) -> ready (every
  // job done; the night is set for the next festival evening) -> on (the evening has come: index.html plays the night pages)
  // -> done. Then it comes back on the same date each year (years: the years it has been held again).
  festCost(j) { const k = this.knownKinds(); return j.alt && Object.keys(j.cost).some(x => !k.has(x)) ? j.alt : j.cost; },
  festWhoId() { const v = this.s.village.folk; return Object.keys(v).sort((a, b) => v[a].since - v[b].since)[0] || null; },   // the neighbour who has lived here longest says the festival's lines
  festWho() { const id = this.festWhoId(); return id ? this.folkDef(id).short : 'the oldest neighbour'; },
  festText(t) { const F = this.s.festival, n = Math.max(1, F.years.length); return t.replace(/\{who\}/g, this.festWho()).replace(/\{years\}/g, ['One year', 'Two years', 'Three years', 'Four years', 'Five years'][n - 1] || `${n} years`); },
  festivalTick(t) {
    const F = C.festival, f = this.s.festival, h = new Date(t).getHours(); if (!F) return;
    if (f.stage === 'waiting' && this.settled().length >= F.needFolk) { f.stage = 'planning'; this.note(`The neighbours want to hold ${F.name}.`); this.emit('festival', 'idea'); }
    else if (f.stage === 'planning' && F.jobs.every(j => this.done(j.id))) {
      f.stage = 'ready'; const d = new Date(t); d.setHours(F.hours[0], 0, 0, 0); if (d.getTime() - t < 60 * MIN && !FAST) d.setDate(d.getDate() + 1);
      f.at = FAST ? t : d.getTime(); const when = dayKey(f.at) === dayKey(t) ? 'tonight' : 'tomorrow evening';
      this.note(F.ready.replace('{when}', when)); this.emit('festival', 'ready');
    }
    else if (f.stage === 'ready' && t >= f.at && (this.inHours(F.hours, h) || t >= f.at + DAY())) { f.stage = 'on'; f.day = dayKey(t); this.emit('festival', 'night'); }
    else if (f.stage === 'done' && f.day) {   // the same date in a later year: the festival comes back
      const a = new Date(t), b = new Date(f.doneAt || t), yr = a.getFullYear();
      if (a.getMonth() === b.getMonth() && a.getDate() === b.getDate() && yr > b.getFullYear() && !f.years.includes(yr)) { f.years.push(yr); this.note('The festival is back on the green tonight.'); this.emit('festival', 'yearly'); }
    }
  },
  festivalOn(t = now()) {   // is there a festival on the green right now? (festival night, or its date in a later year, in the evening)
    const f = this.s.festival, d = new Date(t), h = d.getHours(); if (f.stage === 'on') return true;
    if (f.stage !== 'done' || !this.inHours(C.festival.hours, h)) return false;
    return f.day === dayKey(t) || f.years.includes(d.getFullYear()) && new Date(f.doneAt).getMonth() === d.getMonth() && new Date(f.doneAt).getDate() === d.getDate();
  },
  finishFestival() {   // the night's pages have been read: the main story is complete
    const f = this.s.festival; if (f.stage !== 'on') return false;
    f.stage = 'done'; f.doneAt = now(); this.give(C.festival.reward); this.note(`${C.festival.name} was held on the green.`); this.emit('festival', 'done'); return true;
  },
  festStats() {
    const s = this.s; return { days: s.days.length, green: Object.values(s.tiles).filter(t => t.state === 'green' || t.state === 'home').length, met: C.visitors.filter(v => this.met(v.id)).length,
      folk: this.settled().length, stories: Object.values(s.village.folk).filter(f => f.q === 'done').length };
  },

  // ---- the first month's story (CONTENT.story; words from docs/STORY.md) ----
  // Each page opens once, when its moment comes (storyDue). Pages, land cards and Hazel's lists wait in pages.cards until index.html
  // can show them (one at a time, never over an open menu), so nothing is lost if the game is closed first.
  storyDue(pg, t) {
    const s = this.s, w = pg.when, h = new Date(t).getHours(), p = s.plots.seedbed;
    if (w === 'welcome') return false;   // opened by index.html as the welcome page
    if (w.startsWith('done:')) return this.done(w.slice(5));
    if (w.startsWith('flag:')) return !!s.flags[w.slice(5)];
    if (w === 'evening:woodpile') return this.done('woodpile') && (h >= 17 || h < 5);   // the first evening, so the stars are out
    if (w === 'seedlings') return !!(p.stage === 'growing' || p.stage === 'ready' || p.grown);
    if (w === 'week') return t - s.created >= 7 * DAY();
    if (w === 'startable:house1') { const d = this.taskDef('house1'); return !!s.tasks.house1 || ((d.needs || []).every(n => this.done(n)) && this.magicLevel() >= (d.minLevel || 1)); }
    if (w === 'garden') return this.gardenOpen();
    if (w === 'toadWalked') return !!s.flags.toadWalk && t - s.flags.toadWalk >= 45000;   // index.html TOAD_WALK
    return false;
  },
  storyTick(t) {
    const s = this.s, P = s.pages, queued = id => P.cards.some(c => c.k === 'page' && c.id === id);
    if (this.gardenOpen() && !s.flags.garden) s.flags.garden = true;   // garden jobs (the pond) wait for this
    for (const pg of C.story.pages) if (!(pg.id in P.seen) && !queued(pg.id) && this.storyDue(pg, t)) { P.cards.push({ k: 'page', id: pg.id }); this.emit('card'); }
    for (const [patch, M] of Object.entries(C.makes)) {   // Hazel's list: a patch reached a new stage, so new little makes are ready
      if (M.tile !== '0,0' && !this.gardenOpen()) continue;
      if (patch === 'yard' && !s.flags.firstpick) continue;
      const st = this.landStage(M.tile).key, key = `${patch}:${st}`;
      if (!M.lines[st] || P.makes[key]) continue;
      P.makes[key] = t; if (C.tasks.some(d => d.make === patch && d.stage === st)) { P.cards.push({ k: 'makes', patch, stage: st }); this.emit('card'); }
    }
  },
  seePage(id) { this.s.pages.seen[id] = now(); this.s.pages.cards = this.s.pages.cards.filter(c => !(c.k === 'page' && c.id === id)); this.dirty = true; },
  pageDef(id) { return C.story.pages.find(p => p.id === id); },
  pageText(pg) {   // the page's paragraphs as they read now (lines about things not done yet are left out)
    const ok = c => c.startsWith('flag:') ? !!this.s.flags[c.slice(5)] : c.startsWith('helped:') ? !!(this.s.journal[c.slice(7)] || {}).helped : this.done(c);
    const one = x => typeof x === 'string' ? x : x.if ? (ok(x.if) ? x.text : x.else || '') : x.text;
    return pg.text.map(x => Array.isArray(x) ? x.map(one).filter(Boolean).join(' ') : x.margin ? { margin: true, text: x.text } : one(x)).filter(Boolean);
  },
  questSteps() { return C.story.quest.steps.map(([k, name]) => ({ name, done: k.startsWith('page:') ? k.slice(5) in this.s.pages.seen : this.done(k) })); },
  storyCatchUp() {   // an older garden: everything that has already happened counts as read (it is all in the Journal under "Our story"); Hazel's list for now still comes
    const s = this.s, t = now();
    for (const pg of C.story.pages) if (pg.when === 'welcome' || this.storyDue(pg, t)) s.pages.seen[pg.id] = 0;
    if (s.flags.toadWalk) s.spirit.taught[3] = 0;
    for (const [patch, M] of Object.entries(C.makes)) { if (!s.tiles[M.tile]) continue; const cur = this.stageIndex(M.tile);
      C.landStages.forEach((st, i) => { if (i < cur) s.pages.makes[`${patch}:${st.key}`] = 0; }); }
  },
  // ---- the Wood spirit: five lessons, one each time the magic grows (CONTENT.story.lessons) ----
  spiritLesson() {   // the lesson it is waiting by now (its number), or 0
    const s = this.s, sp = s.spirit.taught, L = this.magicLevel(), h = new Date(now()).getHours();
    if (!(3 in sp) && this.gardenOpen() && !s.flags.toadWalk) return 3;   // when the garden opens and the toadstool is in the way
    for (const k of this.healTiles()) { const kind = this.s.tiles[k].kind, L = C.heal.kinds[kind].lesson; if (L && !this.healTaught(kind) && this.healAt(k) < this.healSteps(k).length) return 'heal:' + kind; }   // the first time a kind of bare tile appears, it comes to teach that tile's spell
    for (const [n, ok] of [[1, L >= 2 && this.done('bed')], [2, L >= 3 && this.done('spring')], [4, L >= 4], [5, L >= 5 && (h >= 17 || h < 5)]]) {
      if (n in sp) continue; return ok ? n : 0;   // in order: a later lesson waits for the one before
    }
    return 0;
  },
  teach(n) { const first = !Object.keys(this.s.spirit.taught).length; this.s.spirit.taught[n] = now(); if (!this.met('spirit')) this.noteVisitor('spirit'); this.dirty = true; return first; },
  // ---- creatures moving into homes the gnomes made: +1 green each (the greening rule) ----
  moveInTick(t) {
    const s = this.s;
    for (const m of C.story.moveIns) {
      if (s.moved[m.id]) continue;
      const ready = m.job ? this.done(m.job) && t >= s.tasks[m.job].endsAt + C.story.moveInAfter * MIN : !!s.flags[m.flag];
      if (!ready) continue;
      s.moved[m.id] = t; this.addGreen(1, m.garden ? 'garden' : 'yard'); this.note(m.note); this.emit('movein', m);
    }
  },

  // ---- story hook for the side mystery (the staff); Bryce writes the plot ----
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
  testFestival(night) {   // test panel: start the festival plans now (ignoring the neighbour count), or jump straight to festival night
    const f = this.s.festival, t = now();
    if (f.stage === 'waiting') { f.stage = 'planning'; this.emit('festival', 'idea'); if (!night) return; }
    if (!f.tile) { f.tile = this.freeLot() || ['-1,0', '2,0', '-1,1'].find(k => !Object.values(this.s.village.folk).some(x => x.tile === k)); if (!this.s.tiles[f.tile] || this.s.tiles[f.tile].state !== 'green') this.s.tiles[f.tile] = { state: 'green', green: 4 }; }
    if (!night) return;
    for (const j of C.festival.jobs) this.s.tasks[j.id] = Object.assign(this.s.tasks[j.id] || {}, { startedAt: t - 1, endsAt: t - 1, done: true }, j.claims ? { tile: f.tile } : {});
    f.stage = 'on'; f.day = dayKey(t); this.emit('festival', 'night');
  },
};

// autosave on a timer and whenever the page is hidden
setInterval(() => { G.tick(); if (G.dirty) G.save(); }, 1000);
document.addEventListener('visibilitychange', () => { if (document.hidden) G.save(); });
window.addEventListener('pagehide', () => G.save());
window.GL = G;   // console: GL.s, GL.reset(), GL.give({seed:5})
})();
