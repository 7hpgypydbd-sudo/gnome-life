// Walking round things (shared by everyone who moves: gnomes, visitors, the rabbit, and any later animal story).
// Bryce (2026-10-27): animals must not walk through or under fixed things (a mouse went under the stump house, the echidna
// was inside the fenced seed bed). Every fixed thing has a FOOTPRINT on the ground; walkers go round footprints, and a
// creature never steps inside the seed bed (nothing is ever in the dug bed except crops).
//
// How to use it (positions are home-tile grid units, the same gx, gy as everything else; the garden tile is gy 1..2):
//   Walk.route(ax, ay, bx, by, { creature: true })  -> a list of [gx, gy] points to walk through, ending at b (or near b,
//                                                      if b was inside a footprint and creature is set)
//   Walk.go(o, bx, by, opts)                          -> sets o.tx, o.ty and o.path for a walker with gx, gy
//   Walk.step(o, dist)                                -> moves o along its path by dist; true once it has arrived
//   Walk.free(gx, gy, opts)                           -> the nearest open spot (outside every footprint and the bed)
//   Walk.blocked(gx, gy, opts)                        -> the footprint there, or null
//   Walk.edge(nearX, nearY)                           -> a spot just off the yard's wild edge, to arrive at or leave by
//   Walk.add(fn)                                      -> another source of footprints: fn() returns [{ name, gx, gy, r }]
// A footprint is a circle on the ground: { name, gx, gy, r } (r in tile units; 0.1 is about a gnome's width).
// The seed bed is a footprint shaped like the dug oval; index.html hands it over with Walk.use().
const Walk = (() => {
  let footprints = () => [], bed = () => null, open = () => [];
  const extra = [];
  const circle = (o, pad = 0) => ({ name: o.name, gx: o.gx, gy: o.gy, reach: o.r + pad + 0.02, to: (x, y) => [(x - o.gx) / (o.r + pad), (y - o.gy) / (o.r + pad)], from: (u, v) => [o.gx + u * (o.r + pad), o.gy + v * (o.r + pad)] });
  const inside = (o, x, y) => { const [u, v] = o.to(x, y); return u * u + v * v < 1; };
  function obstacles(opts = {}) {   // everything in the way right now, as ring shapes (inside = radius under 1)
    const pad = opts.creature ? 0.01 : 0, list = [];
    for (const f of footprints()) if (f && f.r > 0) list.push(circle(f, pad));
    for (const fn of extra) for (const f of fn() || []) if (f && f.r > 0) list.push(circle(f, pad));
    const b = bed(); if (b) list.push(Object.assign({ hard: !!opts.creature }, b));   // creatures never go in; gnomes may (to work it), in by the gate once it is fenced (bedRoute in index.html)
    return list;
  }
  // The way round: a fine grid over the ground (CELL tile units), each cell blocked if it is inside something; the shortest way
  // through the open cells (A*), then pulled straight wherever a straight line is clear, so the walk is a few natural bends.
  const CELL = 0.02;
  const clear = (a, b, obs) => { const n = Math.max(2, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.008)); for (let i = 1; i < n; i++) { const t = i / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; if (obs.some(o => inside(o, x, y))) return false; } return true; };
  function search(a, b, obs, bounds) {
    const [x0, y0, x1, y1] = bounds, W = Math.ceil((x1 - x0) / CELL) + 1, H = Math.ceil((y1 - y0) / CELL) + 1, N = W * H;
    const cell = (x, y) => Math.max(0, Math.min(W - 1, Math.round((x - x0) / CELL))) + W * Math.max(0, Math.min(H - 1, Math.round((y - y0) / CELL)));
    const pos = i => [x0 + (i % W) * CELL, y0 + Math.floor(i / W) * CELL];
    const shut = new Uint8Array(N);
    for (const o of obs) { const r = o.reach || 0.5, [cx, cy] = [o.gx, o.gy];   // only look at cells near each thing
      const i0 = Math.max(0, Math.floor((cx - r - x0) / CELL)), i1 = Math.min(W - 1, Math.ceil((cx + r - x0) / CELL)), j0 = Math.max(0, Math.floor((cy - r - y0) / CELL)), j1 = Math.min(H - 1, Math.ceil((cy + r - y0) / CELL));
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) if (!shut[i + W * j] && inside(o, x0 + i * CELL, y0 + j * CELL)) shut[i + W * j] = 1; }
    const s = cell(...a), t = cell(...b); shut[s] = 0; shut[t] = 0;
    const g = new Float32Array(N).fill(Infinity), from = new Int32Array(N).fill(-1), done = new Uint8Array(N), heap = [];
    const hx = i => { const [x, y] = pos(i), [tx, ty] = pos(t), dx = Math.abs(x - tx), dy = Math.abs(y - ty); return Math.max(dx, dy) + 0.414 * Math.min(dx, dy); };
    const push = (i, f) => { heap.push([f, i]); let k = heap.length - 1; while (k) { const p = (k - 1) >> 1; if (heap[p][0] <= heap[k][0]) break; [heap[p], heap[k]] = [heap[k], heap[p]]; k = p; } };
    const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let k = 0; for (;;) { const l = 2 * k + 1, r = l + 1; let m = k; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === k) break; [heap[m], heap[k]] = [heap[k], heap[m]]; k = m; } } return top[1]; };
    g[s] = 0; push(s, hx(s));
    while (heap.length) {
      const i = pop(); if (done[i]) continue; done[i] = 1; if (i === t) break;
      const ix = i % W, iy = Math.floor(i / W);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; const nx = ix + dx, ny = iy + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const j = nx + W * ny; if (shut[j] || done[j] || (dx && dy && (shut[ix + dx + W * iy] || shut[ix + W * (iy + dy)]))) continue;
        const c = g[i] + (dx && dy ? 1.414 : 1) * CELL; if (c < g[j]) { g[j] = c; from[j] = i; push(j, c + hx(j)); } }
    }
    if (from[t] < 0 && s !== t) return null;
    const cells = []; for (let i = t; i !== s && i >= 0; i = from[i]) cells.push(pos(i)); cells.reverse();
    cells[cells.length - 1] = b;
    const out = []; let p = a, k = 0;   // pull it straight: from each corner, jump to the furthest point still in plain sight
    while (k < cells.length) { let m = cells.length - 1; while (m > k && !clear(p, cells[m], obs)) m--; out.push(cells[m]); p = cells[m]; k = m + 1; }
    return out;
  }
  function legs(a, b, obs) {
    if (!obs.length || clear(a, b, obs)) return [b];
    const x0 = Math.min(-0.15, a[0], b[0]) - 0.05, y0 = Math.min(-0.15, a[1], b[1]) - 0.05, x1 = Math.max(1.15, a[0], b[0], ...obs.map(o => o.gx)) + 0.1, y1 = Math.max(1.15, a[1], b[1], ...obs.map(o => o.gy)) + 0.15;
    return search(a, b, obs, [x0, y0, x1, y1]) || [b];   // walled in (should not happen): straight there
  }
  function free(gx, gy, opts = {}) {   // push a spot out of anything it is inside (a few rounds, for spots between two things)
    const obs = obstacles(Object.assign({ creature: true }, opts)); let p = [gx, gy];
    for (let n = 0; n < 6; n++) { const o = obs.find(q => inside(q, ...p)); if (!o) break; const [u, v] = o.to(...p), r = Math.hypot(u, v) || 1, ux = r < 0.05 ? 1 : u / r, vy = r < 0.05 ? 0.3 : v / r; p = o.from(ux * 1.15, vy * 1.15); }
    if (obs.some(q => inside(q, ...p))) for (let r = 0.02; r < 0.4; r += 0.02) for (let k = 0; k < 16; k++) { const q = [gx + Math.cos(k * 0.393) * r, gy + Math.sin(k * 0.393) * r]; if (!obs.some(o => inside(o, ...q))) return q; }   // squeezed between things: the nearest gap
    return p;
  }
  function route(ax, ay, bx, by, opts = {}) {
    if (opts.creature && !opts.exact) [bx, by] = free(bx, by, opts);
    if (opts.fly) return [[bx, by]];   // fliers go over everything (but still never land in the bed)
    const all = obstacles(opts).filter(o => !inside(o, ax, ay));   // nobody is trapped where they stand
    const at = all.filter(o => !(opts.creature && o.hard) && inside(o, bx, by)), obs = all.filter(o => !at.includes(o));
    const thing = at.find(o => o.name !== 'seed bed');   // a gnome may work right at a thing (the fire, the woodpile): walk round it to the near side, then step in
    if (!thing) return legs([ax, ay], [bx, by], obs);   // (into the seed bed: index.html brings them in by the gate)
    let [u, v] = thing.to(bx, by), r = Math.hypot(u, v);
    if (r < 0.05) { [u, v] = thing.to(ax, ay); r = Math.hypot(u, v) || 1; }
    const a0 = Math.atan2(v, u); let near = null;   // the open edge point nearest the spot (things set close together share edges)
    for (let k = 0; k < 11 && !near; k++) { const a = a0 + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 0.3, q = thing.from(Math.cos(a) * 1.1, Math.sin(a) * 1.1); if (!obs.some(o => inside(o, ...q))) near = q; }
    if (!near) return legs([ax, ay], [bx, by], obs);
    return [...legs([ax, ay], near, [...obs, thing]), [bx, by]];
  }
  return {
    use(o) { if (o.footprints) footprints = o.footprints; if (o.bed) bed = o.bed; if (o.edges) open = o.edges; },
    add(fn) { extra.push(fn); },
    route, free,
    obstacles,
    blocked(gx, gy, opts) { return obstacles(Object.assign({ creature: true }, opts)).find(o => inside(o, gx, gy)) || null; },
    go(o, bx, by, opts) { const p = route(o.gx, o.gy, bx, by, opts); [o.tx, o.ty] = p.shift(); o.path = p; return o; },
    step(o, dist) {   // move a walker (gx, gy, tx, ty, path) along; true once it has arrived
      for (let k = 0; k < 4; k++) {
        const dx = o.tx - o.gx, dy = o.ty - o.gy, d = Math.hypot(dx, dy);
        if (d > dist) { o.gx += dx / d * dist; o.gy += dy / d * dist; return false; }
        o.gx = o.tx; o.gy = o.ty; dist -= d;
        if (!o.path || !o.path.length) return true;
        [o.tx, o.ty] = o.path.shift();
      }
      return false;
    },
    edge(nx, ny) {   // a spot just off a wild edge of the yard (index.html says which edges are wild), near (nx, ny) if given
      const E = open(); if (!E.length) return [1.06, 0.5];
      let best = null, bd = 1e9;
      for (let n = 0; n < 12; n++) {
        const e = E[(Math.random() * E.length) | 0], t = Math.random(), p = [e[0][0] + (e[1][0] - e[0][0]) * t, e[0][1] + (e[1][1] - e[0][1]) * t];
        const inn = [p[0] + (e[2] || [0, 0])[0], p[1] + (e[2] || [0, 0])[1]];   // a step inside the edge must be open ground (not in a fern or a trunk)
        if (this.blocked(...inn)) continue;
        const d = nx == null ? Math.random() : Math.hypot(p[0] - nx, p[1] - ny); if (d < bd) { bd = d; best = p; }
      }
      return best || E[0][0];
    },
  };
})();
