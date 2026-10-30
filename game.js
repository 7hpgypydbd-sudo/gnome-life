// Gnome Life — game state, rules, timers and save/load. No drawing in here.
// One JSON blob behind Store so it can move from localStorage to a server later.
(function () {
const C = window.CONTENT;
const FAST = /fast/.test(location.hash);          // #fast: minutes become tenths of a second (3h -> 18s)
const MIN = FAST ? 100 : 60000;                   // ms per content "minute"
const SKEW_KEY = window.SANDBOX ? 'gnomelife.sandbox.skew' : 'gnomelife.skew';   // test panel: pretend this many extra days have gone by (whole days; +30 minutes moves the clock on too)
let SKEW = 0; try { SKEW = Number(localStorage.getItem(SKEW_KEY)) || 0; } catch (e) {}   // whole days, plus any +30 minutes from the test panel
const now = () => Date.now() + SKEW;
const DAY = () => 1440 * MIN;                     // a real day (a tenth-second-minute day under #fast)
const lc = (t) => t[0].toLowerCase() + t.slice(1);   // "Build Mabel a home" -> "build Mabel a home" (keeps names capitalised)
const cap = (t) => t[0].toUpperCase() + t.slice(1);
const dayKey = (t) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; };
const VISIT_GAP = FAST ? 10000 : 10 * 60000;      // away this long (real time) and coming back counts as a new visit

// ---------- storage adapter (swap this for a server later) ----------
const Store = {
  key: window.SANDBOX ? 'gnomelife.sandbox.save' : 'gnomelife.save',   // the sandbox keeps its own garden
  load() { try { const s = localStorage.getItem(this.key); return s ? JSON.parse(s) : null; } catch (e) { return null; } },
  write(blob) { const j = JSON.stringify(blob); try { localStorage.setItem(this.key, j); } catch (e) { if (window.PL) { PL.drop(); try { localStorage.setItem(this.key, j); } catch (e2) {} } } },   // phone storage full: the play log makes room (the save always comes first)
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
    animals: { done: {}, day: '', rabbitFed: [], gifts: {}, giftDue: {} },   // the animals' side stories: beats that have happened (id -> time), the day of the last one, days the rabbit ate at the dish after the fence, keepsakes picked up (id -> time) and ones still to be left (id -> when)
    friends: {},                             // round six: the mouse, robin and rabbit (CONTENT.friends): id -> { seen, trust, friend, asked, nextAsk } times
    offered: {},                             // jobs the story has offered so far (id -> time; see offerTick)
    visits: { n: 0, offer: -1 },             // visits so far, and the visit the last new job was offered in (one new job a visit)
  };
}

// ---------- the game ----------
const G = {
  s: null, listeners: new Set(), dirty: false, away: null,
  onChange(fn) { this.listeners.add(fn); },
  emit(kind, data) { if (kind !== 'inv' && window.PL) PL.add(`ev ${kind} ${PL.short(data)}`); for (const fn of this.listeners) fn(kind, data); this.dirty = true; },
  save() { if (!this.s) return; this.s.lastSeen = now(); Store.write(this.s); this.dirty = false; },
  reset() { if (window.PL) { PL.add('=== the garden was started over ==='); PL.flush(); } Store.clear(); try { localStorage.removeItem(SKEW_KEY); } catch (e) {} this.s = fresh(); this.save(); location.hash = ''; location.reload(); },
  dur(mins) { return mins * MIN * this.taskSpeed(); },
  jobMins(mins) { return mins <= 180 ? mins : 180 + (mins - 180) / 2; },   // build 3 (night rest): a long job counts its first three hours in full and the rest at half, so the gnomes' night off doesn't hold evening players up (6h -> 4h30, 8h -> 5h30)
  // ---- the night rest (Bryce, round six): no gnome work while they sleep (half past ten at night to six in the morning). Job
  // timers stop overnight and carry on when they wake; crops, trees and the land still grow in the dark.
  asleepAt(t) { if (FAST) return false; const d = new Date(t), h = d.getHours() + d.getMinutes() / 60; return h >= C.night.bed || h < C.night.wake; },
  wakeAfter(t) { const d = new Date(t); if (d.getHours() + d.getMinutes() / 60 >= C.night.bed) d.setDate(d.getDate() + 1); d.setHours(C.night.wake, 0, 0, 0); return d.getTime(); },   // the next time they get up (t is in the night)
  bedAfter(t) { const d = new Date(t); d.setHours(Math.floor(C.night.bed), Math.round(C.night.bed % 1 * 60), 0, 0); return d.getTime(); },   // tonight's bedtime (t is in the day)
  workEnd(t, ms) {   // when a job started at t with ms of work in it finishes, skipping the nights
    if (FAST) return t + ms;
    for (let i = 0; i < 60 && ms > 0; i++) { if (this.asleepAt(t)) { t = this.wakeAfter(t); continue; } const step = Math.min(ms, this.bedAfter(t) - t); t += step; ms -= step; }
    return t + Math.max(0, ms);
  },
  workBetween(a, b) {   // awake time between a and b (ms)
    if (FAST || b <= a) return Math.max(0, b - a);
    let n = 0; for (let i = 0; i < 60 && a < b; i++) { if (this.asleepAt(a)) { a = this.wakeAfter(a); continue; } const e = Math.min(b, this.bedAfter(a)); n += e - a; a = e; }
    return n;
  },
  taskFrac(id) {   // 0..1 through a job (its awake time); 1 once done
    const tk = this.s.tasks[id], t = now(); if (!tk) return 0; if (tk.done || tk.endsAt <= t) return 1;
    const all = this.workBetween(tk.startedAt, tk.endsAt); return all > 0 ? Math.min(1, this.workBetween(tk.startedAt, t) / all) : 1;
  },
  jobLeft(endsAt, short) {   // "2h 10m to go", or, when a night's sleep comes first, when they'll finish
    const t = now(); if (FAST || endsAt - t - this.workBetween(t, endsAt) < 60000) return short ? this.timeLeft(endsAt) : `${this.timeLeft(endsAt)} to go`;
    const d = new Date(endsAt), at = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(/\s?([ap])\.?m\.?/i, (m, x) => x.toLowerCase() + 'm'), day = dayKey(endsAt) === dayKey(t) ? '' : ' tomorrow';
    if (this.asleepAt(t) && this.workBetween(this.wakeAfter(t), endsAt) <= 0) return short ? 'asleep' : 'asleep for now';
    return short ? `${this.asleepAt(t) ? 'asleep' : 'sleeps first'}, done ${at}` : `${this.asleepAt(t) ? 'they are asleep, so' : 'with a night\'s sleep first,'} done about ${at}${day}`;
  },
  pace() { const P = C.pace; return P.plans[P.festivalDay] || P.plans[60]; },   // v81: the month-two plan in use (content.js pace)
  gameDay(t = now()) { if (FAST) return Math.floor((t - (this.s.created || t)) / DAY()) + 1; const a = new Date(this.s.created || t), b = new Date(t); a.setHours(12, 0, 0, 0); b.setHours(12, 0, 0, 0); return Math.round((b - a) / DAY()) + 1; },   // the garden's first day is day 1
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
    if (!this.s.flags.r6) { this.s.flags.r6 = true; if (tk.woodpile && !tk.stump) this.s.flags.oldWoodpile = true; }   // round six: firewood now comes from the old stump; a garden that already had its woodpile keeps it
    if (tk.daisypot) { tk.yardbath = tk.daisypot; delete tk.daisypot; }   // round six: the pot of daisies on the old stump became a little bird bath
    this.friendsCatchUp();
    if (this.s.plots.seedbed.grown) this.s.flags.firstpick = true;   // fenced before the rabbit's raid existed
    if (this.s.plots.seedbed.crop === 'sprout') this.s.plots.seedbed.crop = 'carrot';   // the old generic sprouts were always carrots at heart
    for (const [k, tl] of Object.entries(this.s.tiles)) if (k !== '0,0' && !tl.kind && tl.state === 'revealed') tl.kind = this.tileKind(k);   // bare tiles from before the healing chains get theirs; green ones stay as they were
    this.pantryTrim('her', true);   // older gardens with heaps of veg: the spare has quietly gone round the valley
    this.away = this.catchUp();
    if (window.PL) { const a = this.away; PL.add(`=== opened v${typeof BUILD !== 'undefined' ? BUILD : '?'}${window.SANDBOX ? ' sandbox' : ''}, away ${Math.round(a.gone / 60000)} min${a.newDay ? ', a new day' : ''} ===`); if (a.finished.length) PL.add(`while away: ${a.finished.join('; ')}`); PL.add(this.snap()); }
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
    const dk = dayKey(t); this.markVisit(t);
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
    if (gone >= 60 * MIN && !s.flags.rabbit && p.stage === 'growing') { this.rabbitRaid(); report.rabbit = C.rabbit.away; }   // the rabbit came while you were away (it always comes for the first sprouts)
    if (gone >= 2 * MIN) { const ate = this.awayEater(t); if (ate) report.ate = ate; }   // the one it was left for came while you were away
    const had = s.village.traveller && s.village.traveller.id, movedBefore = Object.keys(s.moved);
    this.tick();
    const nowMoved = C.story.moveIns.filter(m => s.moved[m.id] && !movedBefore.includes(m.id)); if (nowMoved.length) report.moved = nowMoved.map(m => m.note);
    if (s.village.traveller && s.village.traveller.id !== had) report.traveller = s.village.traveller.id;
    if (gone >= 2 * 60 * MIN) { const ev = this.rollEvent(t, true); if (ev) report.event = ev.text; }
    return report;
  },

  // ---- per-frame rules (cheap; call a few times a second) ----
  markVisit(t) { if (t - (this.lastActive || 0) >= VISIT_GAP) { this.s.visits.n++; if (window.PL) PL.add(`visit ${this.s.visits.n} begins`); } this.lastActive = t; },   // back after a while: a new visit
  tick() {
    const s = this.s, t = now(); if (!s) return;   // not loaded yet (the first frame can come before the save is read)
    this.markVisit(t);
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
      if (id === 'spring') s.pages.cards.push({ k: 'spring' });   // Bryce: finding the spring is a big moment; it gets its own card before the story page
      if (window.PL) PL.add(`job done [${id}] by ${d.who}`);
      this.note(`${C.names[d.who]} finished: ${lc(d.name)}.`); if (d.doneNote) this.note(d.doneNote);
      if (d.chore) delete s.tasks[id];   // a little chore can be done again
      this.emit('task', { id, done: true, give: d.chore && d.give, who: d.who });
    }
    this.mealTick(t);
    this.dressTick(t);
    if (this.barrelFull()) this.drawBarrel();   // the rain barrel tops up the store by itself (nobody's hands)
    this.storyTick(t); this.mistTick(t);
    this.offerTick(t);
    this.moveInTick(t);
    this.animalTick(t);
    this.healTick(t);
    this.farmTick(t);
    this.villageTick(t);
    this.festivalTick(t);
    this.secretTick(t);
    const E = C.events; if (E && t - s.events.lastAt >= E.every * MIN) this.rollEvent(t);
    // offerings trickle in during a visit too
    if (t - s.lastOfferAt >= C.offerEvery * MIN) { s.lastOfferAt = t; if (s.offers.length < C.offerCap) { this.spawnOffer(t); this.emit('offer'); } }
    { const p = s.plots.seedbed, dug = this.done('bedwater') || p.stage || p.grown, lying = k => s.offers.some(o => o.kind === k && !o.keep);   // never stuck at the seed bed (Bryce): an empty tin or a dry can, and the land leaves one lying about
      const need = !dug ? null : !p.stage && !this.canSow() && (s.inv.seed || 0) < 2 ? 'seed' : p.stage === 'planted' && !this.can(this.waterCost()) ? 'water' : null;
      if (need && !lying(need)) { this.spawnOffer(t, need, true); this.emit('offer'); }
      for (const sp of C.tasks) {   // build 3 (never stuck): a story job that is ready but short of something from the land, and the land leaves one of it lying in the yard
        if (!sp.spine || sp.retired || s.tasks[sp.id] || !this.needsMet(sp) || this.can(sp.cost)) continue;
        for (const k of Object.keys(sp.cost)) if ((s.inv[k] || 0) < sp.cost[k] && C.offers.some(o => o.kind === k && o.kind !== 'light') && !lying(k)) { this.spawnOffer(t, k, true); this.emit('offer'); }
        break;   // only the first waiting story job
      } }
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
    for (const k of ev.offer || []) if (s.offers.length < C.offerCap + 3) this.spawnOffer(t, k);
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
    const greens = Object.keys(s.tiles).filter(k => s.tiles[k].state === 'green' || k === '0,0');
    const anywhere = () => { const tile = greens[(Math.random() * greens.length) | 0]; let gx, gy, n = 0; do { gx = 0.12 + Math.random() * 0.76; gy = 0.12 + Math.random() * 0.76; } while (this.spotTaken && this.spotTaken(tile, gx, gy) && ++n < 12); return [tile, gx, gy]; };
    const can = left.map(d => [d, d.place && d.place !== 'grass' ? (this.findSpot ? this.findSpot(d.place) : null) : anywhere()]).filter(x => x[1]);   // round six: each find turns up in its own sort of place, once that place exists
    if (!can.length) return null;
    const [d, [tile, gx, gy]] = can[(Math.random() * can.length) | 0], o = { id: d.id, tile, gx, gy };
    sc.out.push(o); this.dirty = true; return o;
  },
  findSecret(id) {
    const sc = this.s.secrets, i = sc.out.findIndex(o => o.id === id); if (i < 0) return null;
    sc.out.splice(i, 1); sc.found[id] = now(); const d = C.secrets.find(x => x.id === id);
    this.note(`You found ${d.name}.`); this.emit('secret', d); return d;
  },

  // ---- offerings ----
  spawnOffer(t, want, home) {   // want/home: this kind, in the home yard (the seed bed's safety net)
    const s = this.s, h = new Date(t).getHours(), night = h < 6 || h >= 19;
    const pool = C.offers.map(o => ({ kind: o.kind, w: (night ? o.night : o.day) * (o.kind === 'water' && h >= 5 && h < 10 ? 2.5 : 1) })).filter(o => o.w > 0 && !this.shelfFull(o.kind));   // a full shelf: the land leaves something else
    const soft = C.store.lightSoft && (s.inv.light || 0) >= C.store.lightSoft, wisp = pool.find(o => o.kind === 'light'), dew = pool.find(o => o.kind === 'water');   // v81: plenty of light saved: the wisps come a fifth as often, and the night leaves dew instead
    if (soft && wisp) { if (dew) dew.w += wisp.w * 0.8; wisp.w *= 0.2; }
    if (!pool.length && !want) return;
    let r = Math.random() * pool.reduce((a, o) => a + o.w, 0), kind = pool.length ? pool[0].kind : want;
    for (const o of pool) { r -= o.w; if (r <= 0) { kind = o.kind; break; } }
    if (want) kind = want;
    const tiles = Object.keys(s.tiles).filter(k => s.tiles[k].state !== 'revealed' || Math.random() < 0.3);
    const tile = home ? '0,0' : tiles[(Math.random() * tiles.length) | 0];
    let gx, gy, n = 0; do { gx = 0.1 + Math.random() * 0.8; gy = 0.1 + Math.random() * 0.8; } while (this.spotTaken && this.spotTaken(tile, gx, gy) && ++n < 12);   // not on the dug seed bed
    const o = { id: Math.random().toString(36).slice(2, 8), kind, tile, gx, gy, at: t }; s.offers.push(o); return o;
  },
  gather(id) {
    const s = this.s, i = s.offers.findIndex(o => o.id === id); if (i < 0) return null;
    const [o] = s.offers.splice(i, 1);
    if (o.keep) { s.animals.gifts[o.keep] = now(); this.give(C.animals.gifts[o.keep].give); this.note(`${C.animals.gifts[o.keep].name}, from the ${o.keep === 'rabbit' && this.rabbitName() ? this.rabbitName() : this.visitorDef(o.keep).name.toLowerCase()}.`); return o; }   // an animal's keepsake from the doorstep
    s.inv[o.kind] = (s.inv[o.kind] || 0) + (o.n || 1); this.shelfTrim();
    this.emit('inv', o.kind); return o;
  },

  // ---- inventory ----
  can(cost) { return Object.entries(cost || {}).every(([k, n]) => (this.s.inv[k] || 0) >= n); },
  missing(cost) { return Object.entries(cost || {}).filter(([k, n]) => (this.s.inv[k] || 0) < n).map(([k, n]) => `${n - (this.s.inv[k] || 0)} ${C.resources[k].name}`); },
  pay(cost) { for (const [k, n] of Object.entries(cost || {})) this.s.inv[k] -= n; this.emit('inv'); },
  give(items) { for (const [k, n] of Object.entries(items || {})) this.s.inv[k] = (this.s.inv[k] || 0) + n; this.shelfTrim(); this.emit('inv'); },
  // the store's shelves (v70, C.store): 40 of each land find, 20 of each neighbour's gift; Hazel's seed tin 30; the pantry has its own (pantryTrim); light has no limit
  shelf(k) { const r = C.resources[k] || {}; return k === 'seed' ? C.pantry.seedTin : k === 'light' || r.pantry || !C.store ? Infinity : r.gift ? C.store.giftCap : C.store.cap; },
  shelfFull(k, lying = true) { return (this.s.inv[k] || 0) + (lying ? this.s.offers.filter(o => o.kind === k && !o.keep).reduce((a, o) => a + (o.n || 1), 0) : 0) >= this.shelf(k); },
  shelfTrim() { const inv = this.s.inv; for (const k in inv) { const m = this.shelf(k); if (inv[k] > m) inv[k] = m; } },   // over a full shelf: the spare goes to the birds
  tinFull() { this.shelfTrim(); },

  // ---- the seed bed ----
  plot() { return this.s.plots.seedbed; },
  cropUp() { const p = this.plot(); return p.stage === 'growing' && now() - (p.wateredAt || 0) > 0.3 * Math.max(1, p.readyAt - (p.wateredAt || 0)); },   // up and leafing (weeds only come once there is a crop to weed round)
  cropName(id) { return C.crops[id] ? C.crops[id].name.replace(/^a /, 'the ') : 'the crop'; },
  cropOpen(id) {   // may this crop be sown yet? (needs: flag:x, grown:n harvests, or a finished job)
    const c = C.crops[id], p = this.plot(), F = this.s.flags;
    if (!F.firstpick && id !== 'carrot') return false;   // the very first sowing is carrots (story pages 1.4 and 2.1)
    if (c.once && F['sown:' + id] && !(this.s.festival.stage === 'done' && (F[id + 'Year'] || 0) < new Date(now()).getFullYear())) return false;   // Wendel's pumpkin: one until the festival, then one a year
    return (c.needs || []).every(n => n.startsWith('flag:') ? !!this.s.flags[n.slice(5)] : n.startsWith('grown:') ? p.grown >= +n.slice(6) : this.done(n));
  },
  canSow() { return Object.keys(C.crops).some(id => this.cropOpen(id) && this.can(this.cropCost(id))); },   // something in the tin we could sow right now
  cropCost(id) { const c = C.crops[id]; return c.free && !this.s.flags['sown:' + c.free] ? {} : c.plant; },   // Wendel's pumpkin seed is free the first time
  // The gnomes do the sowing, watering and picking (Bryce's rule: the player is unseen luck, never hands). The player chooses and
  // lends the seed and dew; index.html sends a gnome over to do it (bedErrand), and `who` names them in the log.
  plant(cropId = 'carrot', who = 'her') {
    const p = this.plot(), c = C.crops[cropId], cost = c && this.cropCost(cropId); if (!c || p.stage || !this.cropOpen(cropId) || !this.can(cost)) return false;
    this.pay(cost); if (c.free) this.s.flags['sown:' + c.free] = true; if (c.once) this.s.flags[cropId + 'Year'] = new Date(now()).getFullYear();
    p.crop = cropId; p.stage = 'planted'; p.plantedAt = now(); p.readyAt = 0;
    this.note(cropId === 'pumpkin' && !Object.keys(cost).length ? 'Wendel pressed his one enormous pumpkin seed into the middle of the bed, very solemnly. It wants water.' : `${C.names[who]} sowed ${c.name.replace(/^a /, 'a ')} across the bed. ${c.water > 1 ? 'They want a good drink.' : 'They want water.'}`);
    this.emit('plot', p); return true;
  },
  waterCost() { const p = this.plot(); return { water: (C.crops[p.crop] || {}).water || 1 }; },
  water(who = 'him') {
    const p = this.plot(), cost = this.waterCost(); if (p.stage !== 'planted' || !this.can(cost)) return false;
    this.pay(cost); p.stage = 'growing'; p.wateredAt = now(); p.readyAt = now() + this.dur(this.growMins(p));
    this.note(`${C.names[who]} watered the bed. Now it grows.`); this.emit('plot', p); return true;
  },
  harvest(who = 'her') {   // returns what was picked (for the little float), or false
    const p = this.plot(); if (p.stage !== 'ready') return false;
    if (!this.s.flags.rabbit) this.rabbitRaid();   // the rabbit always gets to the first sprouts (even if a spell hurried them)
    const c = C.crops[p.crop], got = Object.assign({}, c.harvest), nib = !!p.nibbled; let k0 = Object.keys(got)[0];
    if (nib && got[k0] > 1) got[k0]--;   // the rabbit had a few
    if (this.done('compost')) got.seed = (got.seed || 0) + 1;   // the compost heap makes the soil rich: one extra seed every harvest
    this.give(got); this.addGreen(c.green); p.grown++; this.s.flags['picked:' + p.crop] = true; const spare = this.pantryTrim(who);
    const id = p.crop; p.crop = null; p.stage = null; p.readyAt = 0; p.nibbled = false; this.s.flags.firstpick = true;   // the first crop opens up the home jobs
    this.note(id === 'pumpkin' && !this.s.flags.pumpkin ? 'A pumpkin nearly as big as Wendel. He says it is for the festival, and will not hear otherwise. Hazel has saved every seed.'
      : `${C.names[who]} picked ${c.name.replace(/^a /, 'the ')}${nib ? ' (what the rabbit left)' : ''}. Into the pantry they go, and the ground remembers a little more of how to grow.`);
    if (spare) this.note(spare);
    if (id === 'pumpkin') this.s.flags.pumpkin = true;
    this.emit('plot', p); return got;
  },

  // ---- the pantry (fix 3): the shelf holds about a dozen of each; the spare goes over the fence; they eat from it at meals ----
  pantryKinds() { return Object.keys(C.resources).filter(k => C.resources[k].pantry && k !== 'pumpkin'); },
  pantryTrim(who = 'her', quiet) {   // over the shelf's worth: the spare goes to a neighbour, or the compost and the creatures. Returns the line to log, or ''
    const inv = this.s.inv, cap = C.pantry.cap, out = [];
    for (const k of this.pantryKinds()) if ((inv[k] || 0) > cap) { out.push(C.resources[k].name === 'beans' ? 'beans' : C.resources[k].name + 's'); inv[k] = cap; }
    if (!out.length || quiet) return '';
    const what = out.length > 1 ? out.slice(0, -1).join(', ') + ' and ' + out.slice(-1) : out[0], folk = this.settled();
    if (folk.length) return `The pantry shelf was full, so ${C.names[who]} took the spare ${what} over to ${this.folkDef(folk[(Math.random() * folk.length) | 0]).short}.`;
    return `The pantry shelf was full, so the spare ${what} went ${this.done('compost') ? 'on the compost heap, and a few to the rabbit' : 'to the rabbit, who could not believe its luck'}.`;
  },
  dressTick(t) {   // a new season: last year's dressing for this season comes down, so it can be made again (v70)
    const s = this.s, se = this.season(t); if (s.dressed === se) return;
    const first = s.dressed === undefined; s.dressed = se; delete s.tasks['dress_' + se];
    if (!first && this.done('house3')) { this.note(`Hazel: "It's ${se}. Shall we dress the house for it?" (Hazel's list)`); }
  },
  mealTick(t) {   // breakfast and supper: one thing from the pantry each meal (the one they have most of)
    const s = this.s, M = C.pantry.meals; if (!s.meals) s.meals = t; if (t <= s.meals) return;
    let n = 0; const d = new Date(s.meals); d.setMinutes(0, 0, 0);
    let bf = 0; for (let i = 0; i < 24 * 3 && d.getTime() <= t; i++, d.setHours(d.getHours() + 1)) if (d.getTime() > s.meals && M.some(m => m[0] === d.getHours())) { n++; if (d.getHours() === M[0][0]) bf++; }   // meal hours passed since last time (up to three days back); bf: breakfasts
    s.meals = t; if (!n) return;
    let ate = 0; for (let i = 0; i < n; i++) { const k = this.pantryKinds().filter(k => s.inv[k] > 0).sort((a, b) => s.inv[b] - s.inv[a])[0]; if (k) { s.inv[k]--; ate++; } if (s.inv.bread > 0) { s.inv.bread--; ate++; } }   // and a slice of the neighbours' bread, once there is some
    for (let i = 0; i < bf; i++) if (s.inv.honey > 0) { s.inv.honey--; ate++; }   // v70: bread and honey at breakfast, once Clem's bees are making it
    if (ate && n === 1) this.note(`${new Date(t).getHours() < 12 ? 'Breakfast' : 'Supper'} from the pantry.`);
    if (ate) this.emit('inv');
  },

  // ---- tasks ----
  taskDef(id) {
    if (id.startsWith('heal:')) return this.healDef(id);
    if (id.startsWith('farm:')) return this.farmTask(id);
    if (id.startsWith('chore:')) { const c = C.chores.list.find(c => c.id === id); return c && Object.assign({ chore: true, green: 0 }, c, { who: this.eitherWho(c) }); }
    if (id.startsWith('regrow:')) { const tile = id.slice(7); return Object.assign({ id, tile }, C.regrow, { name: `${C.regrow.name} (${this.tileName(tile)})` }); }
    if (id.startsWith('fest:')) { const j = C.festival.jobs.find(j => j.id === id); return j && Object.assign({ festival: true }, j, { cost: this.festCost(j) }); }
    const [kind, fid, step] = id.split(':'), f = this.folkDef(fid);
    if (f && kind === 'home') return Object.assign({ id, folk: fid, name: `Build ${f.short} a home`, short: 'building a home', green: 0, home: true, act: 'carry' }, f.build);
    if (f && kind === 'trade') return Object.assign({ id, folk: fid, green: 0 }, f.building);   // building gives no green (only life does)
    if (f && kind === 'quest') { const st = f.quest.steps[+step]; return Object.assign({ id, folk: fid, green: 0, blurb: st.say, quest: true }, st.job); }
    let d = C.tasks.find(t => t.id === id); if (d && d.alt) d = Object.assign({}, d, { cost: this.festCost(d) });   // alt: what it costs before the village makes that thing
    return d && d.who === 'either' ? Object.assign({}, d, { who: this.eitherWho(d) }) : d;
  },
  eitherWho(d) {   // a job either gnome can do: whoever took it on, else whoever is free (Hazel first if both are, or the one the chore suits)
    const tk = this.s.tasks[d.id]; if (tk && tk.who) return tk.who;
    return ['her', 'him'].sort((a, b) => (b === d.pref) - (a === d.pref)).find(w => !this.isBusy(w, d.id)) || d.pref || 'her';
  },
  isBusy(w, but) { return Object.entries(this.s.tasks).some(([id, k]) => !k.done && k.endsAt > now() && id !== but && (k.who || (C.tasks.find(t => t.id === id) || {}).who) === w); },
  // ---- little chores (build 3, "never stuck"): small jobs for whichever gnome is free, so nobody stands about while the crops
  // grow or a story job waits. Free, short, and each brings in a few things; the ones the story is short of come first.
  choreList() {
    const s = this.s, K = C.chores; if (!K || !this.needsMet({ needs: K.needs })) return [];
    if (!['her', 'him'].some(w => !this.isBusy(w))) return [];   // both busy: nothing to offer
    const want = {};   // what the waiting story job is short of
    for (const sp of C.tasks) if (sp.spine && !sp.retired && !s.tasks[sp.id] && this.needsMet(sp)) for (const [k, n] of Object.entries(sp.cost || {})) if ((s.inv[k] || 0) < n) want[k] = 1;
    const ok = c => !s.tasks[c.id] && this.needsMet(c) && !Object.keys(c.give || {}).some(k => this.shelfFull(k, false)) && (!c.crop || this.cropUp());
    const score = c => (c.crop ? -2 : 0) - (Object.keys(c.give).some(k => want[k]) ? 1 : 0) + Math.min(...Object.keys(c.give).map(k => s.inv[k] || 0)) / 100;
    const all = K.list.filter(ok).sort((a, b) => score(a) - score(b)), out = [];
    for (const w of ['her', 'him'].filter(w => !this.isBusy(w))) { const c = all.find(c => c.pref === w && !out.includes(c)) || all.find(c => !out.includes(c)); if (c) out.push(c); }   // one that suits each free gnome
    for (const c of all) if (out.length < K.show && !out.includes(c)) out.push(c);
    return out.slice(0, K.show);
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
    for (const [id, tk] of Object.entries(s.tasks)) if (id.startsWith('chore:') && !tk.done) out.push(this.taskView(this.taskDef(id)));
    for (const c of this.choreList()) out.push(this.taskView(this.taskDef(c.id)));
    return out.filter(v => v.show).sort((a, b) => (a.rank - b.rank));
  },
  taskView(d) {   // a job as the Jobs list sees it. A job whose needs are not met is not shown at all (no greyed rows); one that
    // can't start for another reason (that gnome is busy, the patch isn't ready) shows with the reason (locked, why)
    const s = this.s, tk = s.tasks[d.id], t = now();
    const gate = tk ? '' : this.gateWhy(d), ready = this.needsMet(d);
    const offered = !!tk || !C.tasks.includes(this.baseDef(d)) || d.spine || !!d.make || d.id in s.offered;   // home jobs are offered a little at a time (offerTick)
    const state = tk ? (tk.done ? 'done' : (tk.endsAt <= t ? 'done' : 'running')) : (ready && !gate ? 'ready' : 'locked');
    return { def: d, state, locked: state === 'locked', endsAt: tk ? tk.endsAt : 0, startedAt: tk ? tk.startedAt : 0, can: this.can(d.cost), missing: this.missing(d.cost),
             show: (state !== 'done' || (t - (tk.endsAt || 0)) < 60 * MIN) && (!!tk || (ready && offered)) && (!d.make || !!tk || this.makeOpen(d)),
             story: !!d.spine, rank: { running: 0, ready: 1, locked: 2, done: 3 }[state], why: gate || (ready ? '' : this.needsWhy(d)) };
  },
  baseDef(d) { return C.tasks.find(x => x.id === d.id) || null; },
  // ---- what the story has offered (docs/PLAN.md "Progression review", fix 1) ----
  needMet(n) {   // one of a job's needs: a finished job, 'page:<id>' (that page has come), 'flag:<x>', 'stage:<key>' (home yard), 'tile:<k>'
    const s = this.s;
    if (n.startsWith('flag:')) return !!s.flags[n.slice(5)];
    if (n.startsWith('page:')) return this.pageHappened(n.slice(5));
    if (n.startsWith('stage:')) return this.stageIndex('0,0') >= C.landStages.findIndex(x => x.key === n.slice(6));
    if (n.startsWith('tile:')) return !!s.tiles[n.slice(5)];
    return this.done(n);
  },
  lineOk(c) { if (!c) return true; if (c.includes('&')) return c.split('&').every(x => this.lineOk(x)); if (c[0] === '!') return !this.lineOk(c.slice(1)); if (c === 'grown') return !!(this.plot().grown || this.plot().stage === 'growing' || this.plot().stage === 'ready'); if (c.startsWith('met:')) return this.met(c.slice(4)); return this.needMet(c); },
  linesFor(list) { const out = list.filter(x => typeof x === 'string' || this.lineOk(x.if)).map(x => typeof x === 'string' ? x : x.t); return out.length ? out : list.filter(x => typeof x === 'string'); },   // a gnome's lines about things that are really there (note 23)
  needsMet(d) { return (d.needs || []).every(n => this.needMet(n)) && (!d.festival || this.festOpen(d.id)); },
  festOpen(id) {   // v81: the festival jobs come one at a time, a day or two apart (content.js pace.jobGap), so the preparing takes a while
    const J = C.festival.jobs, k = J.findIndex(j => j.id === id); if (k <= 0 || this.s.tasks[id]) return true;
    const prev = this.s.tasks[J[k - 1].id]; return !!prev && this.done(J[k - 1].id) && (now() >= prev.startedAt + (this.pace().jobGap || 0) * DAY() || this.gameDay() >= C.pace.festivalDay - 6);   // running late: no waiting (the calendar only ever holds a quick player back)   // counted from when the last one was begun, so a slower player doesn't wait twice
  },
  needHint(n) {   // a need in words, for the one "Next:" line ('' = keep it a surprise)
    if (n.startsWith('page:')) return this.pageHint(n.slice(5));
    if (n.startsWith('stage:')) return `once the yard is ${C.landStages.find(x => x.key === n.slice(6)).name}`;
    if (n.startsWith('flag:') || n.startsWith('tile:') || n.startsWith('trade:')) return '';
    const d = this.taskDef(n); return d ? `after ${d.short}` : '';
  },
  needsWhy(d) { return (d.needs || []).filter(n => !this.needMet(n)).map(n => this.needHint(n)).filter(Boolean).join(', '); },
  pageHint(id) {   // when a page comes, in words
    const i = C.story.pages.findIndex(p => p.id === id), pg = C.story.pages[i]; if (!pg) return ''; const w = pg.when;
    if (w.startsWith('done:')) return `after ${this.taskDef(w.slice(5)).short}`;
    if (w === 'flag:firstpick') return 'after the first harvest';
    if (w === 'week') return 'when their first week is up';
    if (w === 'garden') return 'once the garden opens';
    if (w === 'next' && i > 0) return this.pageHint(C.story.pages[i - 1].id);
    return '';
  },
  offerTick(t) {   // the home jobs that aren't the story's own come a little at a time: at most two waiting, at most one new a visit
    const s = this.s, O = s.offered, V = s.visits, isTask = id => C.tasks.some(x => x.id === id && !x.make && !x.spine);
    for (const d of C.tasks) {   // a job the story is waiting on comes at once (the doorstep before the house)
      if (!d.spine || d.retired || s.tasks[d.id]) continue;
      const own = (d.needs || []).filter(isTask); if (!own.length || !(d.needs || []).every(n => own.includes(n) || this.needMet(n))) continue;
      for (const n of own) if (!(n in O) && !s.tasks[n] && this.needsMet(this.baseDef({ id: n }))) { O[n] = t; this.dirty = true; }
    }
    const waiting = Object.keys(O).filter(id => !s.tasks[id] && isTask(id)).length; if (waiting >= 2) return;
    if (waiting && V.offer === V.n) return;   // one new job a visit (unless there is nothing else waiting)
    const d = C.tasks.find(d => !d.retired && !d.make && !d.spine && !(d.id in O) && !s.tasks[d.id] && this.needsMet(d) && !(d.needs || []).some(n => n.startsWith('trade:') && !this.folkState(n.slice(6))));
    if (!d) return;
    O[d.id] = t; V.offer = V.n; this.dirty = true; this.note(`Something new to do: ${lc(d.name)}.`); this.emit('offered', d.id);
  },
  nextUp() {   // the one "Next:" line in Jobs: the story's next job that isn't open yet, and what it waits for (null: nothing to say)
    for (const d of C.tasks) {
      if (!d.spine || d.retired || this.s.tasks[d.id] || this.needsMet(d)) continue;
      const left = (d.needs || []).filter(n => !this.needMet(n)), why = left.map(n => this.needHint(n));
      if (why.some(w => !w)) continue;   // waits on a surprise (the rabbit): say nothing
      return { name: d.name, why: why.join(' and ') };
    }
    return null;
  },
  startTask(id) {
    const d = this.taskDef(id), v = this.taskView(d); if (v.state !== 'ready' || !v.can) return false;
    this.pay(d.cost); const t = now();
    const from = this.asleepAt(t) ? this.wakeAfter(t) : t;   // started at night: they get going when they wake
    this.s.tasks[id] = { startedAt: from, endsAt: this.workEnd(from, this.dur(this.jobMins(d.mins))), done: false }; if (d.healTile || d.farm || d.chore || C.tasks.some(x => x.id === id && x.who === 'either')) this.s.tasks[id].who = d.who;
    if (d.home || d.claims) this.s.tasks[id].tile = d.home ? this.homeLot(d.folk) : this.freeLot();
    if (d.claims) this.s.festival.tile = this.s.tasks[id].tile;
    if (d.tile) this.s.tiles[d.tile].state = 'regrowing';
    if (window.PL) PL.add(`job start [${id}] by ${d.who}, ${Math.round(this.dur(this.jobMins(d.mins)) / 60000)} min of work, done ${new Date(this.s.tasks[id].endsAt).toTimeString().slice(0, 5)}, paid ${PL.short(d.cost || {})}`);
    this.note(from > t ? `${C.names[d.who]} will start in the morning: ${lc(d.name)}.` : `${C.names[d.who]} set to work: ${lc(d.name)}.`); this.emit('task', { id }); return true;
  },
  running() { return Object.entries(this.s.tasks).filter(([, tk]) => !tk.done).map(([id, tk]) => Object.assign({ id }, tk, { def: this.taskDef(id) })); },

  // ---- land ----
  tileName(k) { const [x, y] = k.split(',').map(Number); return x > 0 ? 'east' : x < 0 ? 'west' : y > 0 ? 'south' : 'north'; },
  landStage(k = '0,0') { const g = this.s.tiles[k] ? this.s.tiles[k].green : 0; let st = C.landStages[0]; for (const s of C.landStages) if (g >= s.at) st = s; return st; },
  // Green the yard earns spreads into the couple's garden once it is open; what is grown in the garden stays in the garden.
  addGreen(n, where = 'yard') {
    if (!n) return;
    if (window.PL) PL.add(`green +${n} (${where})`);
    const bump = k => { const before = this.landStage(k).key; this.s.tiles[k].green += n; const after = this.landStage(k); return after.key !== before ? after : null; };
    if (where !== 'garden') { const st = bump('0,0');
      if (st) { this.note(`The home patch is now ${st.name}.`); this.s.pages.cards.push({ k: 'land', key: st.key }); this.emit('land', st); } }
    if (this.gardenOpen()) { const st = bump('0,1'); if (st) this.note(`The garden is now ${st.name}.`); }
  },
  gardenOpen() { const t = this.s.tiles['0,1']; return !!t && t.state === 'green' && !Object.values(this.s.village.folk).some(f => f.tile === '0,1'); },   // the couple's garden (tile 0,1; an older save may have a neighbour living there)
  stageIndex(k) { return C.landStages.indexOf(this.landStage(k)); },
  // ---- little makes (CONTENT.makes; the makes are tasks with make: yard | garden) ----
  makeTile(d) { return C.makes[d.make].tile; },
  patchOpen(patch) {   // can this patch have little makes yet? the yard after the first harvest; the garden once open; the old track once out of the mist
    if (patch === 'yard') return !!this.s.flags.firstpick;
    if (patch === 'garden') return this.gardenOpen();
    const k = C.makes[patch].tile; return !!this.s.tiles[k] && !Object.values(this.s.village.folk).some(f => f.tile === k);
  },
  makeOpen(d) {   // has this make come up yet? its patch is open and green enough, it's the right season, and anything it needs is there
    const s = this.s, k = this.makeTile(d); if (!this.patchOpen(d.make)) return false;
    if (d.season && d.season !== this.season(now())) return false;
    if (this.stageIndex(k) < C.landStages.findIndex(x => x.key === d.stage)) return false;
    return (d.needs || []).every(n => n.startsWith('flag:') ? !!s.flags[n.slice(5)] : this.done(n));
  },
  makesCount(patch) { const all = C.tasks.filter(d => d.make === patch && !d.season); return { done: all.filter(d => this.done(d.id)).length, total: all.length }; },
  reveal(k) {   // bare neighbours appear around a greened tile (max 2 at a time so the map grows gently); only from chapter four on
    if (!this.pageHappened('3.5')) return;   // before that it's just the yard and the garden (storyTick)
    const F = this.s.flags, gap = this.gameDay() > 30 ? (this.pace().patchGap || 0) * DAY() : 0, max = gap ? 1 : 2;   // v81: from month two, one new patch every few days (the rest wait in F.mist and come later, mistTick)
    if (gap && now() < (F.mistAt || 0) + gap) { F.mist = F.mist || []; if (!F.mist.includes(k)) F.mist.push(k); return; }
    const [x, y] = k.split(',').map(Number); let n = 0;
    for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
      const kk = `${x + dx},${y + dy}`; if (this.s.tiles[kk] || n >= max || Math.abs(x + dx) > 2 || Math.abs(y + dy) > 2) continue;
      if (y + dy < -1 && !this.done('bridge')) continue;   // the far side of the stream waits for the bridge
      this.s.tiles[kk] = { state: 'revealed', green: 0, kind: this.tileKind(kk) }; n++;
    }
    if (n) { F.mistAt = now(); this.note('The mist has drawn back from more bare ground.'); }
    else if (gap && F.mist) F.mist = F.mist.filter(x => x !== k);   // nothing left to show round this one
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
  healClaimed(k) {   // a neighbour's lot, the festival green or the couple's garden: the chain stops once that takes over (neighbours wait for young meadow, see freeLot)
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
    if (!n) return; const tl = this.s.tiles[k], before = this.landStage(k).key; tl.green += n; if (window.PL) PL.add(`green +${n} on ${k} (now ${tl.green})`); const st = this.landStage(k);
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
  farms() { return this.settled().filter(fid => C.farms.list[fid] && this.done('trade:' + fid) && this.s.tiles[this.folkState(fid).tile] && this.farmReady(fid)); },
  farmReady(fid) {   // v81 month two: from the fourth neighbour on, the farm waits until their story is told (the first three, in month one, as before)
    const v = this.s.village.folk, order = Object.keys(v).sort((a, b) => v[a].since - v[b].since);
    return order.indexOf(fid) < 3 || v[fid].q === 'done' || !!this.s.tasks[`farm:${fid}:0`];
  },
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
  costWords(cost) { return Object.entries(cost).map(([k, n]) => { const w = C.resources[k].name; return `${n} ${n > 1 && !/^(moss|dew|light|bread|honey|yarn|beans)$/.test(w) ? w.replace(/y$/, 'ie') + 's' : w}`; }).join(' and '); },   // "3 twigs and 2 berries
  swap(fid, who = 'her') {   // the pantry swap: once a day at each grown farm (a gnome carries the basket over)
    const sw = C.farms.list[fid].swap, fs = this.folkState(fid); if (!this.swapOpen(fid) || !this.can(sw.give)) return false;
    this.pay(sw.give); this.give(sw.get); fs.swapDay = dayKey(now()); this.note(`${C.names[who]} carried the basket over. ${sw.text}`); this.emit('inv'); return true;
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
  magicInfo() { const L = this.magicLevel(), m = C.magicLevels[L - 1], next = C.magicLevels[L]; return { level: L, name: m.name, days: this.s.days.length, nextDays: next ? next.days : null, spells: C.magicLevels.slice(0, L).map(x => x.unlock).filter(id => id && this.spellTaught(id)) }; },
  spellTaught(id) { const n = C.story.lessons.findIndex(l => l.spell === id) + 1; return !n || n in this.s.spirit.taught; },   // first-time review: a spell is yours once the Wood spirit has taught it, not just when the days come round
  canCast(id) {
    const sp = C.spells[id]; if (!(sp.heal ? this.healTaught(sp.heal) : sp.special ? this.gardenOpen() : this.magicInfo().spells.includes(id))) return { ok: false, why: 'not yet learned' };
    if (sp.heal && !this.healSpellFor(sp.heal).length && !(sp.heal === 'nursery' && this.seedlingsWaiting().length)) return { ok: false, why: sp.heal === 'nursery' ? 'no seedlings are waiting to wake' : 'it helps a job that is under way: start it first' };   // special spells come with what they are for, not with days
    if (!this.can(sp.cost)) return { ok: false, why: `needs ${this.missing(sp.cost).join(', ')}` };
    if (id === 'legs' && this.s.flags.toadWalk) return { ok: false, why: 'it has already walked off' };
    if (id === 'coax' && this.plot().stage !== 'growing') return { ok: false, why: this.plot().stage === 'planted' ? 'the bed needs watering first: nothing grows until it has had a drink' : this.plot().stage === 'ready' ? 'the bed is already ready to pick' : 'nothing is growing in the seed bed yet' };
    if (id === 'rain' && this.plot().stage !== 'planted') return { ok: false, why: 'nothing is waiting for water' };
    if (C.spells[id].daily && this.s.spellsUsed[id] === dayKey(now())) return { ok: false, why: 'used today. Magic for the crops comes back each morning' };   // build 3 (Bryce): crop magic is a treat, saved up, not a button
    if (id === 'wake' && !this.running().some(r => r.def.tile || r.def.healTile)) return { ok: false, why: 'no patch is regrowing' };
    return { ok: true };
  },
  cast(id) {
    if (!this.canCast(id).ok) return false; this.pay(C.spells[id].cost); const t = now();
    if (id === 'coax') { this.plot().readyAt = t; this.note(`A warm hush over the bed, and ${this.cropName(this.plot().crop)} fill out all at once.`); }
    if (id === 'rain') { const p = this.plot(); p.stage = 'growing'; p.readyAt = t + this.dur(this.growMins(p)); this.give({ water: 2 }); this.note('Soft rain falls on the bed and beads on the stones.'); }
    if (id === 'legs') { this.s.flags.toadWalk = t; this.note('The big toadstool shivered, sprouted little root legs and walked off to the far corner of the garden.'); }
    if (C.spells[id].heal) this.healCast(id, t);
    if (id === 'wake') { for (const r of this.running()) if (r.def.tile || r.def.healTile) this.s.tasks[r.id].endsAt = t + (r.endsAt - t) / 2; this.note('The ground stirs under the mist.'); }
    this.s.spellsUsed[id] = dayKey(t); this.emit('spell', id); this.tick(); return true;
  },

  // ---- journal, visitors and the feeding dish ----
  visitorDef(id) { return C.visitors.find(v => v.id === id); },
  pickVisitor(t = now()) {
    const s = this.s, h = new Date(t).getHours(), stage = this.landStage().key, order = C.landStages.map(x => x.key), dk = dayKey(t), food = s.feeder.food;
    if (stage === 'barren') return null;   // Bryce: no animals while it is all bare earth (the rabbit's raid on the first sprouts is the story's own)
    const pool = C.visitors.filter(v => ((h >= v.hours[0] && h < v.hours[1]) || (v.alsoHours && h >= v.alsoHours[0] && h < v.alsoHours[1])) && !this.asleep(v.id) && (!v.stage || order.indexOf(stage) >= order.indexOf(v.stage)) && (!v.task || (s.tasks[v.task] && s.tasks[v.task].done)) && (!v.seasons || v.seasons.includes(this.season(t))));
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
  hasNest(id) {
    if (id === 'mouse') return !!this.s.flags.miceIn;   // the mice live in the walked toadstool, not a hole of their own
    if (id === 'rabbit') return !!this.s.moved.burrow;
    const home = { robin: 'nestbox', hedgehog: 'leafpile' }[id]; if (home && this.s.moved[home]) return true;   // moved into the home the gnomes made
    const d = this.visitorDef(id); return !!(d && d.nest) && this.fedDays(id) >= C.feeding.nestAfter;
  },
  asleep(id) { return id === 'hedgehog' && this.beatDone('hogAsleep') && !this.beatDone('hogSpring'); },   // the hedgehog's winter sleep
  dishBuilt() { const t = this.s.tasks.feeder; return !!(t && t.done); },
  putFood(kind, who) {   // round six: food goes out for one animal you have met, and it comes for it a few minutes later
    const f = this.s.feeder; if (!this.dishBuilt() || f.food || !this.can({ [kind]: 1 })) return false;
    who = who || C.friends.roster.find(id => this.seen(id) && C.friends[id].food === kind) || null;
    const [a, b] = C.friends.eatAfter, t = now();
    this.pay({ [kind]: 1 }); f.food = kind; f.at = t; f.who = who; f.comeAt = t + (a + Math.random() * (b - a)) * MIN / (FAST ? 30 : 1);
    this.note(`${cap(this.foodName(kind))} in the feeding dish${who ? ` for ${this.friendName(who)}` : ''}.`); this.emit('feeder', f); return true;
  },
  foodName(k) { return { seed: 'seed', berry: 'berries', carrot: 'a carrot' }[k] || k; },
  // ---- the rain barrel: once scrubbed it fills with rain; tap it to draw the water ----
  barrelFull() { const tk = this.s.tasks.rainbarrel; if (!(tk && this.done('rainbarrel'))) return false; return now() - (this.s.barrelAt || tk.endsAt) >= C.barrel.every * MIN; },
  drawBarrel() { if (!this.barrelFull()) return false; this.s.barrelAt = now(); this.give(C.barrel.give); this.note('The rain barrel filled, and its water went into the store.'); return true; },
  // ---- the rabbit: a cheeky regular, never a real loss ----
  // A rabbit always comes for the first sprouts: if there is food in the dish it eats that first, then nibbles a few sprouts.
  // Only then is "Fence the seed bed" offered. index.html plays the raid when you are watching; catchUp() settles it when you were away.
  growMins(p) { const c = C.crops[p.crop]; return !p.grown && c.first ? c.first : c.grow; },   // v81: the very first carrots come up in minutes, so day one keeps moving
  rabbitDue() {
    const s = this.s, t = now(); if (s.flags.rabbit || !/^(growing|ready)$/.test(this.plot().stage)) { s.rabbitAt = 0; return false; }   // ready too: a spell can hurry the sprouts, and the rabbit still comes
    if (!s.rabbitAt) s.rabbitAt = t + C.rabbit.after * MIN; return t >= s.rabbitAt;
  },
  rabbitName() { return this.isFriend('rabbit') ? C.friends.rabbit.name : null; },   // Hazel names her when she becomes a friend (round six)
  rabbitAte() { this.s.feeder.food = null; this.s.flags.rabbitDish = true; this.note(C.rabbit.dish); this.emit('feeder', this.s.feeder); },
  rabbitRaid() {
    const s = this.s; if (s.flags.rabbit) return; if (s.feeder.food) { s.feeder.food = null; s.flags.rabbitDish = true; }   // it empties the dish first, if there is anything in it (page 1.5 says so)
    if (this.plot().stage === 'growing' || this.plot().stage === 'ready') this.plot().nibbled = true;
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
  awayEater(t) {   // while you were away: the animal the food was left for came and ate it
    const f = this.s.feeder; if (!f.food || !f.who || !f.comeAt || t < f.comeAt) return null;
    const id = f.who; if (!this.friendAwake(id, new Date(f.comeAt).getHours()) && !this.friendAwake(id, new Date(t).getHours())) return null;
    this.friendAte(id); return this.friendName(id, true);
  },
  troubleFor(id) {   // does this visitor arrive with a little trouble to fix? (only after it is in the journal, so the first meeting stays simple)
    const d = this.visitorDef(id), tr = d && d.trouble; if (!tr || !this.met(id)) return null;
    if (tr.task && !(this.s.tasks[tr.task] && this.s.tasks[tr.task].done)) return null;
    return Math.random() < C.troubleChance ? tr : null;
  },
  help(id, thanks) {   // a good deed: one light, while today's allowance lasts (a gnome did it, or a little luck: the thanks line says which)
    const d = this.visitorDef(id), e = this.entry(id), dk = dayKey(now()), dd = this.s.deeds;
    if (dd.day !== dk) { dd.day = dk; dd.n = 0; }
    e.helped++; const light = dd.n < C.deedsPerDay ? 1 : 0; dd.n += light;
    if (light) this.give({ light: 1 });
    this.note(thanks || d.trouble.thanks); this.emit('helped', { id, light }); return light;
  },

  // ---- neighbours and the village ----
  // One traveller at a time camps by the path (village.traveller). A "Build X a home" job settles them on the nearest healed
  // lot; then their trade building job, a daily gift at their door, the odd favour, and one short story quest.
  folkDef(id) { return (C.folk || []).find(f => f.id === id); },
  folkState(id) { return this.s.village.folk[id] || null; },
  settled() { return Object.keys(this.s.village.folk); },
  done(id) { const t = this.s.tasks[id]; return !!(t && t.done); },
  wishOf(fid) { const tr = this.s.village.traveller; return tr && tr.id === fid ? tr.want || null : null; },
  homeLot(fid) {   // where this traveller's home would go now: the patch they asked for once it is young meadow (else, for an older save, any ready lot)
    const k = this.wishOf(fid); if (!k) return this.freeLot();
    const tl = this.s.tiles[k]; return tl && tl.state === 'green' && (!tl.kind || this.stageIndex(k) >= 2) && !this.lotTaken().has(k) ? k : null;
  },
  lotTaken() { const s = this.s, taken = new Set(Object.values(s.village.folk).map(f => f.tile));
    for (const tk of Object.values(s.tasks)) if (tk.tile && !tk.done) taken.add(tk.tile);
    if (s.festival.tile) taken.add(s.festival.tile); return taken; },
  wishLot() {   // the patch a new traveller would like: a lot that is already ready, else the nearest one still healing, else the nearest still dark (it comes out of the mist)
    const s = this.s, taken = this.lotTaken(), L = C.village.lots.filter(k => !taken.has(k));
    const k = this.freeLot() || L.find(k => s.tiles[k] && s.tiles[k].kind) || L.find(k => !s.tiles[k]); if (!k) return null;
    if (!s.tiles[k]) { s.tiles[k] = { state: 'revealed', green: 0, kind: this.tileKind(k) }; this.emit('reveal', k); }
    return k;
  },
  wishText(fid, ready) {   // "Mabel has taken a fancy to the bare plain, to the left..." / "... has grown to young meadow"
    const f = this.folkDef(fid), k = this.wishOf(fid), V = C.village, who = f.short, Who = cap(who);
    return (ready ? V.wishReady : V.wish).replace(/\{who\}/g, who).replace(/\{Who\}/g, Who).replace(/\{patch\}/g, this.patchName(k)).replace(/\{Patch\}/g, cap(this.patchName(k))).replace(/\{where\}/g, this.tileWhere(k));
  },
  freeLot() {   // the nearest healed plain tile that has no home on it yet (one being built counts as taken)
    const s = this.s, taken = new Set(Object.values(s.village.folk).map(f => f.tile));
    for (const tk of Object.values(s.tasks)) if (tk.tile && !tk.done) taken.add(tk.tile);
    if (s.festival.tile) taken.add(s.festival.tile);
    return C.village.lots.find(k => s.tiles[k] && s.tiles[k].state === 'green' && (!s.tiles[k].kind || this.stageIndex(k) >= 2) && !taken.has(k)) || null;   // young meadow (old saves' plain greened tiles still count)
  },
  savingFor(d) {   // the story comes first (fix 3): while a story job waits for things, the extras (Hazel's list, the optional home jobs) don't spend them
    if (d.spine || this.s.tasks[d.id] || !C.tasks.includes(this.baseDef(d))) return '';
    if ((d.cost || {}).seed && (this.s.inv.seed || 0) - d.cost.seed < 1 && this.done('bedwater')) return 'keeping the last seed back for sowing the seed bed';   // the bed always has one to sow
    for (const sp of C.tasks) {
      if (!sp.spine || sp.retired || this.s.tasks[sp.id] || !this.needsMet(sp) || this.can(sp.cost)) continue;
      const short = Object.keys(d.cost || {}).filter(k => (this.s.inv[k] || 0) < (sp.cost[k] || 0) + d.cost[k] && sp.cost[k]);
      if (short.length) return `saving the ${short.map(k => C.resources[k].name === 'twig' ? 'twigs' : C.resources[k].name === 'stone' ? 'stones' : C.resources[k].name).join(' and ')} for ${sp.short}`;
    }
    return '';
  },
  gateWhy(d) {   // extra reasons a job cannot start yet, in words ('' = fine)
    const busy = d.who && Object.entries(this.s.tasks).find(([id, tk]) => !tk.done && tk.endsAt > now() && id !== d.id && (this.taskDef(id) || {}).who === d.who);   // one job at a time for each gnome
    if (busy) return `${C.names[d.who]} is busy with ${lc(this.taskDef(busy[0]).name)}`;
    const save = this.savingFor(d); if (save) return save;
    if (d.home && !this.homeLot(d.folk)) { const k = this.wishOf(d.folk); return k ? `waits for ${this.patchName(k)}, ${this.tileWhere(k)}, to grow to young meadow` : 'needs a patch next door grown to young meadow for their home'; }
    if (d.claims && !this.s.tasks[d.id] && !this.freeLot()) return 'needs a patch grown to young meadow with no home on it';
    if (d.healTile) { const w = this.healWait(d.healTile, d.step); if (w > now()) return `the tree seedlings are still growing (ready in ${this.timeLeft(w)})`;
      if (d.needsFlow && !this.canFlow(d.healTile)) return 'the water cannot reach this stretch yet: clear the creek next to it first'; }
    if (d.farm && d.hours && !this.inHours(d.hours, new Date(now()).getHours())) return d.hoursWhy || 'not at this time of day';
    if (d.needsTile && !(this.s.tiles[d.needsTile] && this.s.tiles[d.needsTile].state === 'green')) return 'after the stepping-stone patch of the stream heals';
    return '';
  },
  villageTick(t) {
    const s = this.s, v = s.village, V = C.village, dk = dayKey(t), h = new Date(t).getHours();
    // a traveller arrives once the house is finished, when it is time, and someone is still on the road
    if (!v.traveller && v.queue.length && t >= v.nextAt && this.gameDay(t) >= (this.pace().arrive[Object.keys(v.folk).length] || 0) && (this.needMet(V.firstAfter) || /village|test/.test(location.hash))) {
      v.traveller = { id: v.queue.shift(), at: t }; v.traveller.want = this.wishLot();   // they name the patch they'd like to live on
      const f = this.folkDef(v.traveller.id); this.note(`A traveller has camped by the path: ${f.name}, ${f.trade}.`); if (v.traveller.want) this.note(this.wishText(f.id)); this.emit('traveller', v.traveller.id);
    }
    const tr = v.traveller;
    if (tr && !tr.want && !s.tasks['home:' + tr.id]) { tr.want = this.wishLot(); if (tr.want) this.note(this.wishText(tr.id)); }   // an older save's traveller names theirs too
    if (tr && tr.want && !tr.told && !s.tasks['home:' + tr.id] && this.homeLot(tr.id)) { tr.told = t; this.note(this.wishText(tr.id, true)); this.emit('wishready', tr.id); }
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
    this.wishTick(t);
    // the odd small favour (one at a time; it lapses at the end of the day)
    if (v.favour && v.favour.day !== dk) v.favour = null;
    if (!v.favour && t >= v.favourAt) {
      v.favourAt = t + V.favourEvery * MIN;
      const known = this.knownKinds(), pool = [];
      for (const fid of this.settled()) this.folkDef(fid).favours.forEach((fv, i) => { if (Object.keys(fv.cost).every(k => known.has(k))) pool.push({ folk: fid, i }); });
      if (pool.length) { v.favour = Object.assign(pool[(Math.random() * pool.length) | 0], { day: dk }); this.emit('favour', v.favour.folk); }
    }
  },
  // ---- neighbours' wishes (v70, C.wishes): a little make for their own home; you send the basket, the neighbour makes it ----
  wishState(fid) { const fs = this.folkState(fid); if (!fs) return null; if (!fs.wishes) fs.wishes = { made: {}, open: null, next: 0 }; return fs.wishes; },
  wishDef(fid, id) { return ((C.wishes || {}).list[fid] || []).find(w => w.id === id) || null; },
  wishOpen(fid) { const w = this.wishState(fid); return w && w.open ? this.wishDef(fid, w.open) : null; },
  wishProg(fid, id) { const m = (this.wishState(fid) || { made: {} }).made[id]; return !m ? 0 : Math.max(0, Math.min(1, (now() - m[0]) / Math.max(1, m[1] - m[0]))); },
  wishMaking(fid) { const w = this.wishState(fid); return w && Object.keys(w.made).find(id => this.wishProg(fid, id) < 1) || null; },
  wishTick(t) {
    const W = C.wishes, v = this.s.village; if (!W) return;
    for (const fid of this.settled()) {
      const w = this.wishState(fid), f = this.folkDef(fid);
      for (const [id, m] of Object.entries(w.made)) if (t >= m[1] && !m[2]) { m[2] = 1; this.note(`${f.short[0].toUpperCase() + f.short.slice(1)} has finished: ${lc(this.wishDef(fid, id).name)}.`); this.emit('wish', fid); }
      if (w.open || !this.done('trade:' + fid) || t < w.next || t < (v.wishNext || 0) || this.wishMaking(fid)) continue;
      if (!w.next) { w.next = this.s.tasks['trade:' + fid].endsAt + W.every * MIN; if (t < w.next) continue; }
      const known = this.knownKinds(), wood = this.stageIndex(this.folkState(fid).tile) >= 3;
      const nx = (W.list[fid] || []).find(x => !w.made[x.id] && (!x.wood || wood) && Object.keys(x.cost).every(k => known.has(k)));
      if (!nx) continue;
      w.open = nx.id; v.wishNext = t + 6 * 60 * MIN;   // at most one new wish in the village every six hours
      this.note(`${f.short[0].toUpperCase() + f.short.slice(1)} has a wish: ${lc(nx.name)}.`); this.emit('wish', fid);
    }
  },
  sendWish(fid, who = 'her') {   // the basket goes over; the neighbour makes it
    const w = this.wishState(fid), d = this.wishOpen(fid); if (!d || !this.can(d.cost)) return false;
    const t = now(), mins = (d.mins || C.wishes.mins) * MIN;
    this.pay(d.cost); w.made[d.id] = [t, t + mins]; w.open = null; w.next = t + mins + C.wishes.every * MIN;
    const f = this.folkDef(fid); this.note(`${C.names[who]} took ${this.costWords(d.cost)} over to ${f.short}, who has started on ${lc(d.name)}.`); this.emit('wish', fid); return true;
  },
  wishesCount() { let done = 0, total = 0; for (const fid of this.settled()) { const l = (C.wishes.list[fid] || []); total += l.length; done += l.filter(x => this.wishProg(fid, x.id) >= 1).length; } return { done, total }; },
  inHours(hrs, h) { if (!hrs) return true; const [a, b] = hrs; return a < b ? h >= a && h < b : h >= a || h < b; },
  knownKinds() {   // things the player can come by: the land's offerings, plus whatever settled neighbours make
    const k = new Set(C.offers.map(o => o.kind));
    for (const fid of this.settled()) if (this.done('trade:' + fid)) Object.keys(this.folkDef(fid).building.gift).forEach(x => k.add(x));
    return k;
  },
  door(fid) { const fs = this.folkState(fid); return { tile: fs.tile, gx: 0.40, gy: 0.40 }; },   // in front of their home (index.html LOT.home)
  dropGift(fid) {
    const s = this.s, f = this.folkDef(fid), d = this.door(fid); let i = 0;
    for (const [kind, n] of Object.entries(f.building.gift)) { if (this.shelfFull(kind)) continue; s.offers.push({ id: Math.random().toString(36).slice(2, 8), kind, n, tile: d.tile, gx: d.gx + 0.06 * i, gy: d.gy + 0.05 + 0.04 * i, at: now(), gift: fid }); i++; }
    if (i) this.note(f.building.giftText);   // a full shelf: the gift waits on their step till there's room
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
  questGive(fid, who = 'her') {
    const st = this.questStep(fid); if (!st || !st.give || !this.can(st.give)) return false;
    this.pay(st.give); this.note(`${C.names[who]} took ${this.costWords(st.give)} over to ${this.folkDef(fid).short}.`); this.questNext(fid); return true;
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
  doFavour(who = 'her') {
    const v = this.s.village, fv = v.favour; if (!fv) return false;
    const f = this.folkDef(fv.folk), ask = f.favours[fv.i]; if (!this.can(ask.cost)) return false;
    this.pay(ask.cost); v.favour = null;
    const dd = this.s.deeds, dk = dayKey(now()); if (dd.day !== dk) { dd.day = dk; dd.n = 0; }
    const light = dd.n < C.deedsPerDay ? 1 : 0; dd.n += light;
    const gift = Object.assign({}, this.done('trade:' + fv.folk) ? f.building.gift : {}); if (light) gift.light = (gift.light || 0) + 1;
    this.give(gift); this.note(`${C.names[who]} took ${this.costWords(ask.cost)} over to ${f.short}. "${ask.thanks}"`); this.emit('helped', { folk: fv.folk, light }); return gift;
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
    if (f.stage === 'waiting' && this.settled().length >= F.needFolk && this.gameDay(t) >= this.pace().idea) { f.stage = 'planning'; this.note(`The neighbours want to hold ${F.name}.`); this.emit('festival', 'idea'); }
    else if (f.stage === 'planning' && F.jobs.every(j => this.done(j.id))) {
      f.stage = 'ready'; const d = new Date(t); d.setHours(F.hours[0], 0, 0, 0); d.setDate(d.getDate() + (this.pace().notice || 0)); if (d.getTime() - t < 60 * MIN && !FAST) d.setDate(d.getDate() + 1);   // v81: a couple of days' notice
      f.at = FAST ? t : d.getTime(); const ahead = Math.round((new Date(f.at).setHours(12) - new Date(t).setHours(12)) / DAY()), when = ahead <= 0 ? 'tonight' : ahead === 1 ? 'tomorrow evening' : ahead === 2 ? 'the evening after tomorrow' : `in ${ahead} days' time`;
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
  // Each page opens once, when its moment comes (storyDue), and never before the page before it (pg.after). Pages, land cards and
  // Hazel's lists wait in pages.cards until index.html can show them (one at a time, never over an open menu), so nothing is lost
  // if the game is closed first. A page that is waiting in pages.cards has happened, as far as the jobs are concerned.
  pageHappened(id) { const P = this.s.pages; return id in P.seen || P.cards.some(c => c.k === 'page' && c.id === id); },
  pageOpensJob(id) { return C.tasks.some(d => !d.retired && !this.s.tasks[d.id] && (d.needs || []).includes('page:' + id)); },   // a job is waiting on this page (so it is never held back for the next visit)
  pageAfter(pg) { const i = C.story.pages.indexOf(pg); return pg.after || (i > 0 ? [C.story.pages[i - 1].id] : []); },
  storyDue(pg, t) {
    const s = this.s, w = pg.when, h = new Date(t).getHours(), p = s.plots.seedbed;
    if (w === 'welcome') return false;   // opened by index.html as the welcome page
    if (w === 'next') return true;   // straight after the page before it
    if (w.startsWith('done:')) return this.done(w.slice(5));
    if (w.startsWith('flag:')) return !!s.flags[w.slice(5)];
    if (w === 'evening:stump') return this.done('stump') && (h >= 17 || h < 5 || this.done('bedwater'));   // the first evening with real firewood, so the stars are out (or, so the book never waits all day, once the bed is watered: the page tells of that evening)
    if (w === 'seedlings') return !!(p.stage === 'growing' || p.stage === 'ready' || p.grown);
    if (w === 'week') return t - s.created >= 7 * DAY();
    if (w === 'garden') return this.gardenOpen();
    if (w === 'toadWalked') return !!s.flags.toadWalk && t - s.flags.toadWalk >= 45000;   // index.html TOAD_WALK
    return false;
  },
  mistTick(t) {   // v81: a patch that was held back in the mist comes out once the gap is up (one at a time)
    const F = this.s.flags; if (!F.mist || !F.mist.length || t < (F.mistAt || 0) + (this.pace().patchGap || 0) * DAY()) return;
    this.reveal(F.mist.shift());   // nothing left round that one: the next one gets its turn on a later tick
  },
  storyTick(t) {
    const s = this.s, P = s.pages, queued = id => P.cards.some(c => c.k === 'page' && c.id === id);
    if (this.gardenOpen() && !s.flags.garden) s.flags.garden = true;   // garden jobs (the pond) wait for this
    for (const pg of C.story.pages) if (!(pg.id in P.seen) && !queued(pg.id) && this.pageAfter(pg).every(id => this.pageHappened(id)) && this.storyDue(pg, t)) { P.cards.push({ k: 'page', id: pg.id }); this.emit('card'); }
    // the land opens with the story: the garden patch beside the yard in chapter three (once the yard has greened), and the
    // old track the night the first traveller's lantern comes up it (page 3.5); after that, each healed patch shows the next
    if (!s.tiles['0,1'] && this.pageHappened('3.0') && this.stageIndex('0,0') >= 1) { s.tiles['0,1'] = { state: 'revealed', green: 0, kind: this.tileKind('0,1') }; this.note('The mist has drawn back from the patch beside the yard.'); this.emit('reveal', '0,1'); }
    if (!s.tiles['1,0'] && this.pageHappened('3.5')) { s.tiles['1,0'] = { state: 'revealed', green: 0, kind: this.tileKind('1,0') }; this.note('The mist has drawn back from the old track. A lantern is bobbing up it.'); this.emit('reveal', '1,0'); }
    for (const [patch, M] of Object.entries(C.makes)) {   // Hazel's list: a patch reached a new stage, so new little makes are ready
      if (!this.patchOpen(patch)) continue;
      const st = this.landStage(M.tile).key, key = `${patch}:${st}`;
      if (!M.lines[st] || P.makes[key]) continue;
      P.makes[key] = t; if (C.tasks.some(d => d.make === patch && d.stage === st && !d.season)) { P.cards.push({ k: 'makes', patch, stage: st }); this.emit('card'); }
    }
  },
  seePage(id) { this.s.pages.seen[id] = now(); this.s.pages.cards = this.s.pages.cards.filter(c => !(c.k === 'page' && c.id === id)); this.dirty = true; },
  pageDef(id) { return C.story.pages.find(p => p.id === id); },
  pageText(pg) {   // the page's paragraphs as they read now (lines about things not done yet are left out)
    const ok = c => c.startsWith('flag:') ? !!this.s.flags[c.slice(5)] : c.startsWith('helped:') ? !!(this.s.journal[c.slice(7)] || {}).helped : c.startsWith('season:') ? c.slice(7).split('|').includes(this.season(now())) : this.done(c);
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
  // ---- the Wood spirit: five lessons in the first month, always in this order (CONTENT.story.lessons) ----
  // 1 coax (the seed bed is dug), 2 rain (the spring is found), 3 the toadstool (the garden opens with it in the way), 4 wake the
  // land, 5 "nothing new today" by the fire, the last of the first month. Magic level only says when it can come. After lesson 5
  // it comes back to teach each new kind of bare patch (never the garden: its chain stops at first green).
  spiritLesson() {   // the lesson it is waiting by now (its number, or 'heal:<kind>'), or 0
    const s = this.s, sp = s.spirit.taught, L = this.magicLevel(), h = new Date(now()).getHours();
    if (Object.values(sp).some(at => at && dayKey(at) === dayKey(now()))) return 0;   // one lesson a day, so each has room to sink in
    for (const [n, ok] of [[1, L >= 2 && this.done('bed')], [2, L >= 3 && this.done('spring')], [3, this.gardenOpen()], [4, L >= 4], [5, L >= 5 && (h >= 17 || h < 5)]]) {
      if (n in sp) continue; if (n === 3 && s.flags.toadWalk) continue;   // an older garden whose toadstool already walked
      return ok ? n : 0;   // in order: a later lesson waits for the one before
    }
    for (const k of this.healTiles()) { if (k === '0,1') continue; const kind = this.s.tiles[k].kind, Ls = C.heal.kinds[kind].lesson; if (Ls && !this.healTaught(kind) && this.healAt(k) < this.healSteps(k).length) return 'heal:' + kind; }   // the first time a kind of bare patch appears, it comes to teach that patch's spell
    return 0;
  },
  teach(n) { const first = !Object.keys(this.s.spirit.taught).length; this.s.spirit.taught[n] = now(); if (!this.met('spirit')) this.noteVisitor('spirit'); this.dirty = true; return first; },
  // ---- creatures moving into homes the gnomes made: +1 green each (the greening rule) ----
  moveInTick(t) {
    const s = this.s;
    for (const m of C.story.moveIns) {
      if (s.moved[m.id]) continue;
      const ready = m.job ? this.done(m.job) && t >= s.tasks[m.job].endsAt + (m.after || C.story.moveInAfter) * MIN : !!s.flags[m.flag];
      if (!ready) continue;
      s.moved[m.id] = t; this.addGreen(1, m.garden ? 'garden' : 'yard'); this.note(m.note); this.emit('movein', m);
    }
  },

  // ---- the animals' side stories (CONTENT.animals; docs/ANIMALS.md) ----
  // At most one beat a day. When a beat's moment comes it is noted (animals.done), flags.<id> is set so the picture and the jobs
  // can follow, and its card or page waits in pages.cards (so a beat that came while you were away opens when you are back).
  // A closing beat leaves a keepsake on the doorstep the next morning.
  beatDef(id) { return C.animals.beats.find(b => b.id === id); },
  beatDone(id) { return id in this.s.animals.done; },
  beatText(b) { const n = C.animals.rabbitName; return b.text.map(x => x.replace(/\{rabbit\}/g, n)); },
  animalDue(b, t) {
    const s = this.s, w = b.when, A = s.animals; if (b.manual) return false;   // a friendship card: it comes when it is earned (friendCard)
    if (this.landStage().key === 'barren') return false;   // no animal stories on bare earth
    if (w.after && !this.beatDone(w.after)) return false;
    if (w.done && !this.done(w.done)) return false;
    if (w.moved && !s.moved[w.moved]) return false;
    if (w.flag && !s.flags[w.flag]) return false;
    if (w.met && !this.met(w.met)) return false;
    if (w.nest && !this.hasNest(w.nest)) return false;
    if (w.rabbitFed && A.rabbitFed.length < w.rabbitFed) return false;
    if (w.season && this.season(t) !== w.season) return false;
    if (w.hours && !this.inHours(w.hours, new Date(t).getHours())) return false;
    if (w.days) { const since = w.moved ? s.moved[w.moved] : w.after ? A.done[w.after] : w.done ? s.tasks[w.done].endsAt : this.entry(w.met).first; if (t - since < w.days * DAY()) return false; }
    return true;
  },
  animalTick(t) {
    const A = this.s.animals;
    for (const [id, at] of Object.entries(A.giftDue)) if (t >= at) { delete A.giftDue[id]; this.leaveKeepsake(id); }
    if (A.day === dayKey(t)) return;   // one beat a day, so there is always a small surprise tomorrow
    const b = C.animals.beats.find(b => !this.beatDone(b.id) && this.animalDue(b, t)); if (b) this.fireBeat(b, t);
  },
  fireBeat(b, t, soon) {
    const A = this.s.animals; A.done[b.id] = t; A.day = dayKey(t); this.s.flags[b.id] = t;
    if (b.gift) { const d = new Date(t); d.setDate(d.getDate() + 1); d.setHours(6, 0, 0, 0); A.giftDue[b.gift] = soon || FAST ? t + 20000 : d.getTime(); }   // the next morning
    this.s.pages.cards.push({ k: 'beat', id: b.id }); this.note(`A new page in the animals' stories: ${b.title}.`); this.emit('card');
  },
  leaveKeepsake(id) {   // an animal's thank-you on the doorstep: one tappable keepsake (an offering with keep: animal)
    const s = this.s, [gx, gy] = C.animals.doorstep, give = C.animals.gifts[id].give, kind = Object.keys(give)[0], n = s.offers.filter(o => o.keep).length;
    s.offers.push({ id: Math.random().toString(36).slice(2, 8), kind, n: give[kind], tile: '0,0', gx: gx + 0.035 * n, gy: gy + 0.02 * n, at: now(), keep: id });
    this.note('Somebody has left something on the doorstep.'); this.emit('offer');
  },
  testBeat() {   // test panel: the next animal beat now, whatever the day, season or hour (the job or home it waits on is made so)
    const s = this.s, t = now(), b = C.animals.beats.find(b => !b.manual && !this.beatDone(b.id) && (!b.when.after || this.beatDone(b.when.after))); if (!b) return null;
    const w = b.when, fin = id => { s.tasks[id] = Object.assign(s.tasks[id] || {}, { startedAt: t - 1, endsAt: t - 1, done: true }); };
    if (w.done) fin(w.done);
    if (w.moved && !s.moved[w.moved]) { const m = C.story.moveIns.find(m => m.id === w.moved); if (m.job) fin(m.job); if (m.flag) s.flags[m.flag] = true; s.moved[w.moved] = t; }
    if (w.met && !this.met(w.met)) this.noteVisitor(w.met);
    this.fireBeat(b, t, true); return b;
  },

  // ---- round six (build 4): the mouse, the robin and the rabbit (CONTENT.friends; docs/ANIMALS.md "The friendship path") ----
  // Only these three come in month one, one at a time, and only once the land has its first green (the rabbit's raid on the
  // first sprouts is the story's own). Before it is a friend an animal turns up only for its first meeting and for food left
  // for it. index.html asks nextAnimal() what to show and plays it; the times live in s.friends.
  fr(id) { const F = this.s.friends; return F[id] || (F[id] = {}); },
  seen(id) { return !!(this.s.friends[id] || {}).seen; },
  isFriend(id) { return !!(this.s.friends[id] || {}).friend; },
  friendName(id, lower) { const d = C.friends[id]; if (d && this.isFriend(id)) return d.name; const n = `the ${this.visitorDef(id).name.toLowerCase()}`; return lower ? n : cap(n); },
  friendAwake(id, h) { const d = C.friends[id]; return !d || this.inHours(d.hours, h); },
  friendsCatchUp() {   // a garden from before round six: who it had met, fed or housed already
    const s = this.s, dk = id => (s.journal[id] || {}).first || now();
    for (const id of C.friends.roster) {
      if (s.friends[id]) continue; const f = {};
      if (id === 'rabbit') { if (this.beatDone('rabbitTruce') || this.beatDone('rabbitHome')) { f.seen = f.trust = f.friend = now(); } }
      else if (this.met(id)) { f.seen = dk(id); if (this.fedDays(id)) f.trust = dk(id); if (this.fedDays(id) >= C.friends.friendAfter || (id === 'mouse' && s.flags.miceIn) || (id === 'robin' && s.moved.nestbox)) f.friend = now(); }
      if (f.seen) s.friends[id] = f;
    }
    if (this.isFriend('robin') || s.tasks.nestbox) s.flags.askRobin = s.flags.askRobin || now();
    if (this.isFriend('rabbit') || s.tasks.earthbank) s.flags.askRabbit = s.flags.askRabbit || now();
  },
  meetDue(id, t) {   // is this animal's first meeting due now? (it waits for you to be watching)
    const s = this.s, h = new Date(t).getHours(); if (this.seen(id) || !this.friendAwake(id, h)) return false;
    if (id === 'rabbit') return !!s.flags.rabbit && this.dishBuilt();   // after its raid, it comes for a look at the new dish
    if (this.landStage().key === 'barren') return false;   // Bryce: no animals on bare earth
    if (id === 'mouse') return true;   // the first to come back: the stuck rescue
    if (id === 'robin') { const m = s.friends.mouse; return !!(m && m.seen && this.dishBuilt() && (dayKey(m.seen) !== dayKey(t) || t - m.seen >= 6 * 60 * MIN)); }   // a day or so after the mouse
    return false;
  },
  meet(id) { const f = this.fr(id); if (f.seen) return; f.seen = now(); if (!this.met(id)) this.noteVisitor(id); else this.entry(id); this.note(`${cap(this.friendName(id, true))} likes ${this.foodName(C.friends[id].food)}. It shows on the feeding dish now.`); this.emit('friend', { id, step: 'seen' }); },
  friendAte(id) {   // it ate what was left for it: a fed day, a trust card the first time, a name on the friendAfter-th day
    const f = this.fr(id), d = C.friends[id], e = this.entry(id), dk = dayKey(now()), food = this.s.feeder.food;
    this.s.feeder.food = null; this.s.feeder.who = null; this.s.feeder.comeAt = 0;
    if (!f.seen) f.seen = now(); if (!this.met(id)) this.noteVisitor(id);
    if (!e.fed.includes(dk)) e.fed.push(dk);
    if (id === 'rabbit' && !this.s.animals.rabbitFed.includes(dk)) this.s.animals.rabbitFed.push(dk);
    this.note(`${this.friendName(id)} ate the ${this.foodName(food).replace(/^a /, '')} in the dish.`);
    let out = 'ate';
    if (!f.trust) { f.trust = now(); this.friendCard(d.trust); out = 'trust'; }
    else if (!f.friend && e.fed.length >= C.friends.friendAfter) { f.friend = now(); this.friendCard(d.friend); out = 'friend'; }
    this.emit('feeder', this.s.feeder); this.emit('fed', { id, out }); return out;
  },
  friendCard(bid) { const A = this.s.animals, b = this.beatDef(bid); if (!b || this.beatDone(bid)) return; A.done[bid] = now(); this.s.flags[bid] = now(); this.s.pages.cards.push({ k: 'beat', id: bid }); this.emit('card'); },
  homeAskDue(id) {   // a friend's first ask: somewhere to live (only when that home can be made now)
    const s = this.s, f = s.friends[id], d = C.friends[id]; if (!f || !f.friend || s.flags[d.home.flag] || now() - f.friend < C.friends.homeAskAfter * MIN / (FAST ? 30 : 1)) return false;
    if (id === 'robin') return this.done('fence');
    if (id === 'rabbit') return !!s.flags.garden && !s.moved.burrow;
    if (id === 'mouse') return !!s.flags.garden && !s.flags.toadWalk && this.spellTaught('legs');
    return false;
  },
  homeAsked(id) { const d = C.friends[id]; this.s.flags[d.home.flag] = now(); this.fr(id).nextAsk = now() + C.friends.askEvery[0] * 60 * MIN; this.dirty = true; },
  smallAsk(id) {   // a small kindness a friend comes to the dish for, now and then (never two days running)
    const f = this.s.friends[id], d = C.friends[id], t = now(); if (!f || !f.friend || (f.nextAsk && t < f.nextAsk)) return null;
    if (!f.nextAsk) { f.nextAsk = t + (C.friends.askEvery[0] / 2) * 60 * MIN; return null; }   // not straight after making friends
    return d.asks[(f.asks || 0) % d.asks.length];
  },
  askDone(id) { const f = this.fr(id), [a, b] = C.friends.askEvery; f.asks = (f.asks || 0) + 1; f.nextAsk = now() + (a + Math.random() * (b - a)) * 60 * MIN; this.dirty = true; },
  nextAnimal(t = now()) {   // what index.html should play next, if anything: { id, kind: meet | eat | home | ask | drop }
    const s = this.s, h = new Date(t).getHours(), R = C.friends.roster, f = s.feeder;
    if (f.food && f.who && t >= f.comeAt && this.friendAwake(f.who, h)) return { id: f.who, kind: 'eat' };
    for (const id of R) if (this.meetDue(id, t)) return { id, kind: 'meet' };
    for (const id of R) if (this.friendAwake(id, h) && this.homeAskDue(id)) return { id, kind: 'home' };
    for (const id of R) if (this.friendAwake(id, h)) { const a = this.smallAsk(id); if (a) return { id, kind: 'ask', ask: a }; }
    const pals = R.filter(id => this.isFriend(id) && this.friendAwake(id, h)); if (pals.length) return { id: pals[(Math.random() * pals.length) | 0], kind: 'drop' };
    return null;
  },

  // ---- story hook for the side mystery (the staff); Bryce writes the plot ----
  flag(k, v = true) { this.s.story.flags[k] = v; this.emit('story', k); },
  hasFlag(k) { return !!this.s.story.flags[k]; },

  snap() {   // the play log's picture of the garden right now, on one line
    const s = this.s, p = s.plots.seedbed, inv = Object.entries(s.inv).filter(([, n]) => n).map(([k, n]) => k + ' ' + n).join(', ');
    const run = this.running().map(r => `${r.id} (${r.def.who}, ${this.timeLeft(r.endsAt)})`).join(', ') || 'none';
    return `state: day ${this.gameDay()}, visit ${s.visits.n}, chapter ${s.story.chapter}, home ${this.landStage().key} (green ${s.tiles['0,0'].green}), bed ${p.crop || '-'} ${p.stage || 'empty'}, jobs running: ${run}, lying about ${s.offers.length}, cards waiting ${s.pages.cards.length}, store: ${inv}`;
  },
  note(text) { if (window.PL) PL.add('journal: ' + text); const l = this.s.log; l.push({ t: now(), text }); if (l.length > 40) l.shift(); },
  timeLeft(endsAt) { const ms = Math.max(0, endsAt - now()); if (FAST) return `${Math.ceil(ms / 1000)}s`; const m = Math.ceil(ms / 60000); return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`; },
  FAST, now,
  // ---- test panel helpers ----
  skipMins(n) { try { localStorage.setItem(SKEW_KEY, String(SKEW + n * 60000)); } catch (e) {} this.save(); location.reload(); },   // test panel: +30 minutes (moves the clock too)
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
document.addEventListener('visibilitychange', () => { if (window.PL && G.s) { if (document.hidden) PL.add('--- put away (phone locked or app closed) ---'); else { PL.add('--- back ---'); PL.add(G.snap()); } } if (document.hidden) { G.save(); if (window.PL) PL.flush(); } });
window.addEventListener('pagehide', () => { G.save(); if (window.PL) PL.flush(); });
if (window.PL) PL.when = () => { if (!G.s) return ''; const d = new Date(now()), z = x => String(x).padStart(2, '0'); return `d${G.gameDay()} ${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`; };
window.GL = G;   // console: GL.s, GL.reset(), GL.give({seed:5})
})();
