// Gnome Life: the layout tool (tile roadmap step 2, docs/TILE-ROADMAP.md). Sandbox only: open index.html?sandbox#layout on a computer.
// Bryce picks a patch and a stage, drags things about, makes them bigger or smaller, flips or hides them, and drops in any painting.
// Every change shows at once and is kept in the sandbox's own storage (gnomelife.sandbox.layout); "Save to a file" downloads
// gnome-layout.json, which a chat copies into layout.js. The garden here is a copy in memory: nothing is ever saved to the sandbox
// garden while the tool is open. Loaded by index.html, which also holds applyLayout() and the small hooks the tool uses.
(function () {
  const KEY = 'gnomelife.sandbox.layout';
  const PATCHES = [   // [what the tool calls it, kind (null: the home yard), the tile it is shown on]
    ['Home yard', null, '0,0'], ['Garden', 'garden', '0,1'], ["Loggers' old camp", 'camp', '1,0'], ['Old track', 'verge', '1,1'],
    ['Cracked earth', 'creature', '0,2'], ['Bare plain', 'nursery', '2,0'], ['Dry creek', 'creek', '1,-1'], ['Rubbish-heap meadow', 'meadow', '-1,0'],
  ];
  const r3 = v => Math.round(v * 1000) / 1000;
  const L = JSON.parse(JSON.stringify(LAY.data || {})); for (const k of ['heal', 'extra', 'makes', 'props']) L[k] = L[k] || {};
  const T = { patch: 0, stage: {}, sel: null, drag: null };
  const kindOf = () => PATCHES[T.patch][1], tileOf = () => PATCHES[T.patch][2];
  const steps = kind => C.heal.kinds[kind].steps;
  const stageOf = kind => kind in T.stage ? T.stage[kind] : steps(kind).length;   // all jobs done, unless the slider says otherwise

  // ---- a garden in memory, with every patch awake and every wish-list make done, so everything can be placed ----
  G.save = () => {}; if (sheetKind) closeSheet();   // no story card over the tool
  const S = G.s, t0 = G.now();
  for (let y = -2; y <= 2; y++) for (let x = -2; x <= 2; x++) { const k = `${x},${y}`; if (k === '0,0') continue; S.tiles[k] = Object.assign(S.tiles[k] || { green: 0 }, { state: 'green', kind: G.tileKind(k) }); }
  S.village.folk = {}; S.village.traveller = null; if (S.festival) S.festival.tile = null; if (typeof folkOnLand !== 'undefined') folkOnLand.length = 0;
  for (const id of Object.keys(S.tasks)) if (/^(heal|home|trade|quest|farm|fest):/.test(id)) delete S.tasks[id];
  for (const d of C.tasks) if (d.make && !d.retired && !d.season) S.tasks[d.id] = Object.assign(S.tasks[d.id] || {}, { startedAt: t0 - 2e7, endsAt: t0 - 1e7, done: true });
  G.healStepDone = (k, i) => { const tl = S.tiles[k]; return !!(tl && tl.kind && i < stageOf(tl.kind)); };
  G.healEv = (k, i) => { const tl = S.tiles[k]; return tl && tl.kind && i < stageOf(tl.kind) ? t0 - 864e5 : 0; };
  const greens = () => { for (const [k, tl] of Object.entries(S.tiles)) if (tl.kind) { const n = steps(tl.kind).length; tl.green = Math.round(26 * stageOf(tl.kind) / n); } };
  greens(); setInterval(greens, 700);
  tod = 'day'; if (sheetKind) closeSheet();

  // ---- the things that can be picked on the patch being laid out ----
  function pieceBox(im, h, flat, x, y) { const w = im && im.width ? im.width * h / im.height : h; return flat ? [x - w / 2, y - h / 2, w, h] : [x - w / 2, y - h * 0.92, w, h]; }
  function handles() {
    const out = [], kind = kindOf(), k = tileOf();
    if (kind) healPieces(k).forEach((q, n) => {
      if (q.a <= 0.01 && !q.hide) return; const [x, y] = toWorld(q.G[0], q.G[1]), sc = q.sc || 1;
      let box; if (q.pic) box = pieceBox(q.ring ? ringStone(q) : healPic(q.pic), q.h * sc, q.flat, x, y);
      else { const f = HEAL_PAINT[q.draw], pk = f && f(q), im = pk && art(pk[0]); box = im ? pieceBox(im, pk[1] * sc, false, x, y) : [x - 24 * sc, y - 40 * sc, 48 * sc, 48 * sc]; }
      out.push(q.lay ? { type: 'extra', kind, i: q.layI, x, y, box, label: cap1(trayLabel(q.pic)) + ' · added by you', hide: false } : { type: 'heal', kind, n, x, y, box, label: cap1(NAMES[q.pic || q.draw] || trayLabel(q.pic || q.draw)) + (q.s ? ` · ${q.go ? 'goes with' : 'comes with'} "${jobName(kind, q.s)}"` : q.ev ? ' · grows in later' : ''), hide: !!q.hide });
    });
    for (const d of C.tasks) {
      if (!d.make || !d.at || d.retired || d.season || G.makeTile(d) !== k || d.id === 'barrow' || d.id === 'bed2') continue;
      const [hx, hy] = makeAt(d), [x, y] = toWorld(hx, hy), sc = d.lsc || 1, im = art('make-' + d.id), sz = im ? slotSize('make-' + d.id, im) : [50, 50];
      out.push({ type: 'make', id: d.id, x, y, box: [x - sz[0] * sc / 2, y - sz[1] * sc * 0.92, sz[0] * sc, sz[1] * sc], label: d.name, hide: !!d.hide });
    }
    if (!kind) {
      for (const p of PROPS) { if (!LAY_PROPS.includes(p.name)) continue; const im = p.name === 'firewood' ? IM['woodpile-' + Math.max(1, woodStage())] : IM[p.name], [x, y] = toWorld(p.gx, p.gy), s = SPR * p.s;
        if (im && im.width) out.push({ type: 'prop', name: p.name, x, y, box: [x - im.width * s / 2, y - im.height * s, im.width * s, im.height * s], label: nice(p.name), hide: !!p.hide, noFlip: true }); }
      (L.extra.yard || []).forEach((e, i) => { const [x, y] = toWorld(e.at[0], e.at[1]); out.push({ type: 'yard', i, x, y, box: pieceBox(healPic(e.pic), e.h, e.flat, x, y), label: cap1(trayLabel(e.pic)) + ' · added by you' }); });
    }
    return out;
  }
  const NAMES = { tree: 'a young tree', flatstones: 'flat stones', pond: 'the frog pond', lily: 'a lily pad', perch: 'the perching stick', heron: 'the heron', dragonflies: 'dragonflies', bees: 'bees', butterflies: 'butterflies',
    step: 'a stepping stone', dots: 'seed balls', balls: 'seed balls', sprout: 'sprouts', grass: 'grass', flowersv: 'verge flowers', wattlebush: 'a wattle bush', birdbox: 'the bird box', birdbath: 'the bird bath', wall: 'stone wall',
    peg: 'a peg', hole: 'a planting hole', deadtree: 'the dead tree', seeddish: 'the seed dish', wombat: 'the wombat', cracks: 'cracks', clods: 'clods of earth', beestone: 'the bee stone', oldfence: 'an old fence', wheel: 'an old wheel',
    slump: 'the fallen bank', wet: 'wet ground', gardenmid: 'the heap and pond', wildpatch: 'a wildflower patch', ashbed: 'the ash bed', rakedbed: 'the raked bed', campsprout: 'wattle sprouts', campbush: 'a wattle bush',
    'kit-wood-05': 'reeds', 'kit-wood-01': 'a fern', 'kit-wood-02': 'a fern', 'kit-wood-10': 'moss', 'kit-wood-13': 'a log pile', 'kit-wood-14': 'a hollow log', 'kit-wood-09': 'wildflowers', 'kit-wood-04': 'wildflowers',
    'kit-stumps-rocks-03': 'a rock', 'kit-stumps-rocks-02': 'the rotten stump', 'kit-stumps-rocks-01': 'a low stump', 'stick-pile': 'the stick pile', 'nest-stones': 'the rock pile', 'nest-burrow': 'the burrow', 'fence-fallen': 'the fallen fence' };
  const nice = s => String(s || 'a piece').replace(/^(kit|heal|make|vis|g-st|camp|garden|yard)-/, '').replace(/[-_]/g, ' ').replace(/\d+$/, n => ' ' + n).trim();
  const cap1 = t => t.charAt(0).toUpperCase() + t.slice(1);
  const jobName = (kind, id) => { const st = steps(kind).find(s => s.id === id); return st ? st.name.toLowerCase() : id; };
  const same = (a, b) => a && b && a.type === b.type && a.kind === b.kind && a.n === b.n && a.i === b.i && a.id === b.id && a.name === b.name;
  const find = (h0) => h0 && handles().find(h => same(h, h0));

  function pick(wx, wy) {   // the smallest thing under the finger (so a flower on a big rock can be picked), else the nearest dot close by
    const m = 18 / cam.z; let best = null, ba = 1e12;
    for (const h of handles()) { const [x, y, w, hh] = h.box; if (wx < x - m || wx > x + w + m || wy < y - m || wy > y + hh + m) continue; const a = Math.max(w, 30 / cam.z) * Math.max(hh, 30 / cam.z) + Math.hypot(wx - h.x, wy - h.y) * 0.01; if (a < ba) { ba = a; best = h; } }
    return best;
  }

  // ---- changing the layout ----
  function entry(h, make) {
    if (h.type === 'heal') { const K = L.heal[h.kind] || (L.heal[h.kind] = {}); if (!K[h.n] && make) K[h.n] = { w: layWhat(HEAL_LOOK[h.kind][h.n]) }; return K[h.n]; }
    if (h.type === 'extra') return (L.extra[h.kind] || [])[h.i];
    if (h.type === 'yard') return (L.extra.yard || [])[h.i];
    if (h.type === 'make') { if (!L.makes[h.id] && make) L.makes[h.id] = {}; return L.makes[h.id]; }
    if (h.type === 'prop') { if (!L.props[h.name] && make) L.props[h.name] = {}; return L.props[h.name]; }
  }
  function changed() { applyLayout(L); try { localStorage.setItem(KEY, JSON.stringify(L)); } catch (e) {} liveUntil = performance.now() + 1500; render(); }
  function moveTo(h, wx, wy) {
    const f = fromWorld(wx, wy), [u, v] = [Number(f.tile.split(',')[0]) + f.gx, Number(f.tile.split(',')[1]) + f.gy], e = entry(h, true);
    if (h.type === 'heal' || h.type === 'extra') {
      const k = tileOf(), [tx, ty] = k.split(',').map(Number), loc = [u - tx, v - ty], q = HEAL_LOOK[h.kind][h.type === 'heal' ? h.n : HEAL_LOOK[h.kind].findIndex(p => p.lay && p.layI === h.i)];
      if (h.type === 'extra') { e.at = (healSwap(k) ? [loc[1], loc[0]] : loc).map(r3); }
      else { const b = healLocal0(k, q), d = [loc[0] - b[0], loc[1] - b[1]]; e.d = (healSwap(k) && !q.c && !q.v ? [d[1], d[0]] : d).map(r3); }
    } else if (h.type === 'make') { const d = C.tasks.find(x => x.id === h.id), [mx, my] = G.makeTile(d).split(',').map(Number); e.at = [r3(u - mx), r3(v - my)]; }
    else e.at = [r3(u), r3(v)];
    changed();
  }
  function act(a) {
    const h = find(T.sel); if (!h) return; const e = entry(h, true);
    if (a === 'big' || a === 'small') { const f = a === 'big' ? 1.1 : 1 / 1.1; if (h.type === 'extra' || h.type === 'yard') e.h = r3(e.h * f); else e.s = r3((e.s || 1) * f); }
    if (a === 'flip') e.flip = !e.flip;
    if (a === 'hide') { if (h.type === 'extra' || h.type === 'yard') { (h.type === 'yard' ? L.extra.yard : L.extra[h.kind]).splice(h.i, 1); T.sel = null; } else e.hide = !e.hide; }
    if (a === 'back') { if (h.type === 'heal') delete L.heal[h.kind][h.n]; else if (h.type === 'make') delete L.makes[h.id]; else if (h.type === 'prop') delete L.props[h.name]; else { (h.type === 'yard' ? L.extra.yard : L.extra[h.kind]).splice(h.i, 1); T.sel = null; } }
    changed();
  }
  function addPainting(name) {
    const kind = kindOf(), k = tileOf(), f = fromWorld(cam.x, cam.y + 40), [tx, ty] = k.split(',').map(Number);
    let loc = [Number(f.tile.split(',')[0]) + f.gx - tx, Number(f.tile.split(',')[1]) + f.gy - ty]; if (loc.some(v => v < 0.05 || v > 0.95)) loc = [0.5, 0.5];
    const flat = /patch|marks|ground|path/.test(name), item = { pic: name, h: flat ? 60 : 50 }; if (flat) item.flat = 1;
    if (!kind) { L.extra.yard = L.extra.yard || []; item.at = loc.map(r3); L.extra.yard.push(item); T.sel = { type: 'yard', i: L.extra.yard.length - 1 }; }
    else { const st = stageOf(kind); item.at = (healSwap(k) ? [loc[1], loc[0]] : loc).map(r3); if (st > 0) item.from = steps(kind)[st - 1].id; L.extra[kind] = L.extra[kind] || []; L.extra[kind].push(item); T.sel = { type: 'extra', kind, i: L.extra[kind].length - 1 }; }
    changed();
  }

  // ---- the panel ----
  const css = document.createElement('style');
  css.textContent = `#lay{position:fixed;z-index:60;background:#f3e9d2;color:#2b2418;font:15px/1.35 'EB Garamond',Georgia,serif;border:1px solid #8a7656;box-shadow:0 4px 18px rgba(0,0,0,.25);overflow:auto;padding:12px 14px;display:flex;flex-direction:column;gap:10px;box-sizing:border-box}
  @media (min-width:700px){#lay{top:10px;right:10px;bottom:10px;width:310px;border-radius:8px}}
  @media (max-width:699px){#lay{left:0;right:0;bottom:0;max-height:46vh;border-radius:12px 12px 0 0}}
  #lay h2{font:22px 'IM Fell English',Georgia,serif;margin:0}#lay h3{font:17px 'IM Fell English',Georgia,serif;margin:0}
  #lay select,#lay input{font:inherit;padding:4px 6px;border:1px solid #8a7656;border-radius:5px;background:#fbf5e6;color:#2b2418;width:100%;box-sizing:border-box}
  #lay .row{display:flex;flex-wrap:wrap;gap:6px;align-items:center}#lay button{font:inherit;border:1px solid #8a7656;background:#fbf5e6;color:#2b2418;border-radius:5px;padding:3px 10px;cursor:pointer}
  #lay button.go{background:#5b6b2d;color:#f7f0dd;border-color:#4d5c27}#lay button:disabled{opacity:.45;cursor:default}#lay .meta{font-size:13.5px;color:#6a5a44;font-style:italic}
  #lay .stage{display:grid;grid-template-columns:auto 1fr auto;gap:6px;align-items:center}#lay .stage span{text-align:center;font-size:14px}
  #lay .tray{display:grid;grid-template-columns:repeat(auto-fill,minmax(62px,1fr));gap:6px;max-height:230px;overflow:auto;padding:2px}
  #lay .tray button{padding:3px;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:11px;line-height:1.1;background:#efe3c6}
  #lay .tray img{width:48px;height:48px;object-fit:contain}#bar{display:none!important}`;
  document.head.appendChild(css);
  const P = document.createElement('div'); P.id = 'lay'; document.body.appendChild(P);
  ['pointerdown', 'pointermove', 'pointerup', 'wheel', 'touchstart', 'touchmove'].forEach(ev => P.addEventListener(ev, e => e.stopPropagation(), { passive: true }));
  const TRAY = { 'wood-01': 'fern', 'wood-02': 'curly fern', 'wood-03': 'foxglove flower', 'wood-04': 'bluebell flowers', 'wood-05': 'reeds grass', 'wood-06': 'wild strawberry', 'wood-07': 'big leaves', 'wood-08': 'wattle flowers', 'wood-09': 'daisy flowers', 'wood-10': 'moss mound',
    'wood-11': 'pale stump', 'wood-12': 'tree stump', 'wood-13': 'mossy log', 'wood-14': 'hollow log', 'wood-15': 'toadstools', 'wood-16': 'fungus stump', 'wood-17': 'tree roots', 'wood-18': 'mossy rock',
    'stumps-rocks-01': 'cut stump', 'stumps-rocks-02': 'rotten stump', 'stumps-rocks-03': 'rocks', 'stumps-rocks-04': 'dead branch', 'stumps-rocks-05': 'twigs', 'stumps-rocks-06': 'small log', 'stumps-rocks-07': 'sprouting stump', 'stumps-rocks-08': 'mossy stump', 'stumps-rocks-09': 'lichen rock', 'stumps-rocks-10': 'mossy branch', 'stumps-rocks-11': 'bramble', 'stumps-rocks-12': 'long mossy log',
    'leftovers-01': 'rusty tin rubbish', 'leftovers-02': 'bottle cap rubbish', 'leftovers-03': 'glass bottle rubbish', 'leftovers-04': 'wire rubbish', 'leftovers-05': 'broken pot rubbish', 'leftovers-06': 'pot pieces rubbish', 'leftovers-07': 'marble treasure', 'leftovers-08': 'button treasure', 'leftovers-09': 'old key treasure', 'leftovers-10': 'spoon and string', 'leftovers-11': 'teacup rubbish', 'leftovers-12': 'matchbox rubbish',
    'marks-01': 'wheel ruts', 'marks-02': 'wheel ruts 2', 'marks-03': 'gravel ruts', 'marks-04': 'pebbly ruts', 'marks-05': 'bare dirt patch', 'marks-06': 'dirt pile', 'marks-07': 'burnt patch', 'marks-08': 'wood shavings',
    'patch-01': 'moss patch', 'patch-02': 'clover moss patch', 'patch-03': 'leaf litter', 'patch-04': 'buttercup grass flowers', 'patch-05': 'pine needles', 'patch-06': 'violets flowers', 'patch-07': 'bare earth patch', 'patch-08': 'grass patch',
    'season-01': 'grass tuft', 'season-02': 'spider web', 'season-03': 'bare bush', 'season-04': 'snowy rock', 'season-05': 'autumn leaves', 'season-06': 'dry leaf', 'season-07': 'blossom flowers', 'season-08': 'dandelion flower' };
  const trayLabel = k => k.startsWith('kit-') && TRAY[k.slice(4)] ? TRAY[k.slice(4)] : nice(k);
  let trayList = null, trayFilter = '', clearAsk = false, savedNote = '';
  function trayNames() {
    if (trayList) return trayList; const skip = /^(btn|face|page|story|portrait|room|card|plot|tile|icon-|folk-|him|her|walk|ui|frame|paper|ground|ribbon|g-|kit-edge|kit-ribbon)/;
    const all = new Map(); for (const [k, src] of Object.entries(ASSETS)) if (typeof src === 'string' && /\.webp$/.test(src) && !skip.test(k)) all.set(k, src);
    for (const k of Object.keys(ART_SLOTS)) if (art(k) && !skip.test(k) && !all.has(k)) all.set(k, `sprites/${k}.webp`);
    return (trayList = [...all.entries()].sort((a, b) => a[0].localeCompare(b[0])));
  }
  function render() {
    const kind = kindOf(), h = find(T.sel), e = h && entry(h), st = kind ? stageOf(kind) : 0, n = kind ? steps(kind).length : 0;
    const stLabel = !kind ? '' : st === 0 ? 'Bare, before any job' : st === n ? `All jobs done (last: ${steps(kind)[n - 1].name.toLowerCase()})` : `After: ${steps(kind)[st - 1].name.toLowerCase()}`;
    const want = trayFilter.toLowerCase().trim().replace(/s$/, ''), list = trayNames().filter(([k]) => !want || trayLabel(k).includes(want) || k.includes(want)).slice(0, 160);
    P.innerHTML = `<h2>Layout</h2>
      <select id="layPatch">${PATCHES.map((p, i) => `<option value="${i}"${i === T.patch ? ' selected' : ''}>${p[0]}</option>`).join('')}</select>
      ${kind ? `<div class="stage"><button data-l="prev"${st <= 0 ? ' disabled' : ''}>‹</button><span>${stLabel}</span><button data-l="next"${st >= n ? ' disabled' : ''}>›</button></div>` : `<p class="meta" style="margin:0">Every wish-list make is shown made, so everything can be placed. The rest of the yard is as your sandbox garden has it.</p>`}
      <div><h3>${h ? h.label : 'Nothing picked'}</h3><p class="meta" style="margin:2px 0 6px">${h ? 'Drag it to move it.' : 'Tap or drag a dot on the map. Drag the empty map to look around; scroll or pinch to zoom.'}</p>
      <div class="row"><button data-l="big"${h ? '' : ' disabled'}>Bigger</button><button data-l="small"${h ? '' : ' disabled'}>Smaller</button><button data-l="flip"${h && !h.noFlip ? '' : ' disabled'}>Flip</button>
      <button data-l="hide"${h ? '' : ' disabled'}>${h && (h.type === 'extra' || h.type === 'yard') ? 'Remove' : h && h.hide ? 'Show' : 'Hide'}</button><button data-l="back"${e ? '' : ' disabled'}>Put back</button></div></div>
      <div><h3>Add a painting</h3><p class="meta" style="margin:2px 0 6px">Tap one to drop it in the middle of the view, then drag it into place.${kind && st > 0 ? ` It appears with "${steps(kind)[st - 1].name.toLowerCase()}".` : kind ? ' It is there from the start.' : ''}</p>
      <input id="layFind" placeholder="Find a painting (flower, fern, rock...)" value="${trayFilter.replace(/"/g, '')}">
      <div class="tray" style="margin-top:6px">${list.map(([k, src]) => `<button data-add="${k}" title="${k}"><img src="${src}" loading="lazy" alt=""><span>${trayLabel(k)}</span></button>`).join('')}</div></div>
      <div class="row"><button class="go" data-l="save">Save to a file</button><button data-l="clear">${clearAsk ? 'Tap again to clear it all' : 'Start again'}</button><button data-l="exit">Back to the game</button></div>
      <p class="meta" style="margin:0">${savedNote || 'Your changes are kept on this computer as you go. Save to a file when you want them put into the game.'}</p>`;
    P.querySelector('#layPatch').onchange = ev => { T.patch = +ev.target.value; T.sel = null; look(); render(); };
    const fi = P.querySelector('#layFind'); fi.oninput = ev => { trayFilter = ev.target.value; const pos = ev.target.selectionStart; render(); const f2 = P.querySelector('#layFind'); f2.focus(); f2.setSelectionRange(pos, pos); };
    P.querySelectorAll('[data-add]').forEach(b => b.onclick = () => addPainting(b.dataset.add));
    P.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const a = b.dataset.l; if (a !== 'clear') clearAsk = false;
      if (a === 'prev' || a === 'next') { T.stage[kind] = Math.max(0, Math.min(n, st + (a === 'next' ? 1 : -1))); T.sel = null; greens(); liveUntil = performance.now() + 4000; return render(); }
      if (a === 'save') return saveFile();
      if (a === 'clear') { if (!clearAsk) { clearAsk = true; return render(); } clearAsk = false; try { localStorage.removeItem(KEY); } catch (e) {} for (const k of ['heal', 'extra', 'makes', 'props']) L[k] = JSON.parse(JSON.stringify((window.LAYOUT || {})[k] || {})); T.sel = null; savedNote = 'Back to the game\'s own layout.'; return changed(); }
      if (a === 'exit') { location.href = location.pathname + '?sandbox'; return; }
      act(a);
    });
  }
  function saveFile() {
    const txt = JSON.stringify(Object.assign({ v: 1, saved: new Date().toISOString() }, L), null, 1);
    try { const url = URL.createObjectURL(new Blob([txt], { type: 'application/json' })), a = document.createElement('a'); a.href = url; a.download = 'gnome-layout.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
      savedNote = 'Saved to your Downloads as gnome-layout.json. Tell the project chat "I made a layout" and it will be put into the game.'; }
    catch (e) { savedNote = 'The file could not be saved here. Your changes are still kept on this computer.'; }
    render();
  }
  function look() { const [x, y] = toWorld(0.5, 0.5, tileOf()), z = clampZ(1.05), wide = innerWidth >= 700; ALLDONE.ease = { t: 0, d: 0.5, z0: cam.z, x0: cam.x, y0: cam.y, z1: z, x1: x + (wide ? 165 / z : 0), y1: y + 20 + (wide ? 0 : H * 0.22 / z) }; liveUntil = performance.now() + 2000; }   // the patch sits in the part of the screen the panel leaves free

  // ---- picking and dragging on the map (before the game's own panning) ----
  const toW = e => [(e.clientX - W / 2) / cam.z + cam.x, (e.clientY - H / 2) / cam.z + cam.y];
  cv.addEventListener('pointerdown', e => {
    if (ptrs.size) return; const [wx, wy] = toW(e), h = pick(wx, wy); if (!h) return;
    e.stopImmediatePropagation(); e.preventDefault(); cv.setPointerCapture(e.pointerId);
    T.sel = h; T.drag = { id: e.pointerId, gx: h.x - wx, gy: h.y - wy, moved: false }; render(); liveUntil = performance.now() + 1500;
  }, true);
  cv.addEventListener('pointermove', e => {
    const D = T.drag; if (!D || D.id !== e.pointerId) return; e.stopImmediatePropagation();
    const [wx, wy] = toW(e), h = find(T.sel); if (!h) return; D.moved = true; moveTo(h, wx + D.gx, wy + D.gy);
  }, true);
  const end = e => { if (T.drag && T.drag.id === e.pointerId) { e.stopImmediatePropagation(); T.drag = null; liveUntil = performance.now() + 800; } };
  cv.addEventListener('pointerup', end, true); cv.addEventListener('pointercancel', end, true);

  window.LAYMODE = {
    tap(wx, wy) { const h = pick(wx, wy); T.sel = h || null; render(); liveUntil = performance.now() + 800; },
    overlay() {   // drawn in the world, after everything else: a dot on every thing that can be picked, a frame round the picked one
      const hs = handles(), r = 5 / cam.z, sel = T.sel;
      for (const h of hs) { ctx.beginPath(); ctx.arc(h.x, h.y, r, 0, 7); ctx.fillStyle = h.hide ? 'rgba(243,233,210,.25)' : '#f7f0dd'; ctx.fill(); ctx.lineWidth = 1.6 / cam.z; ctx.strokeStyle = '#2b2418'; ctx.stroke(); }
      const h = sel && hs.find(x => same(x, sel)); if (!h) return; const [x, y, w, hh] = h.box;
      ctx.save(); ctx.setLineDash([6 / cam.z, 4 / cam.z]); ctx.lineWidth = 2 / cam.z; ctx.strokeStyle = '#f7f0dd'; ctx.strokeRect(x, y, w, hh); ctx.lineDashOffset = 5 / cam.z; ctx.strokeStyle = '#2b2418'; ctx.strokeRect(x, y, w, hh); ctx.restore();
    },
    ready: () => !NEWGROUND || !groundMissing(), data: () => L, handles, screen: h => [(h.x - cam.x) * cam.z + W / 2, (h.y - cam.y) * cam.z + H / 2], pick: (wx, wy) => pick(wx, wy), select: h => { T.sel = h; render(); }, patch: i => { T.patch = i; T.sel = null; look(); render(); }, stage: (kind, s) => { T.stage[kind] = s; greens(); render(); }, moveTo, act, addPainting,
  };
  render(); look();
})();
