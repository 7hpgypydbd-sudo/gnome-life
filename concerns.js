// Gnome Life — the concern button (v84), a testing aid. Off unless switched on from the bottom of the Magic page (each garden
// remembers its own switch). When on, a small round "!" sits top right. Tapping it takes a picture of the screen (the painted
// garden, plus a drawn copy of any open window: its words, pictures and buttons, not its parchment texture or twig dividers),
// then a little box takes an optional note (typed, or the keyboard's microphone). Each concern is kept on the phone with the
// game day and clock, which window was open, and a matching line in the play log. "send my concerns" shares them all
// (pictures, notes.txt and the play log) through the iPhone share sheet. Nothing in play reads any of it.
(function () {
const ON_KEY = window.SANDBOX ? 'gnomelife.sandbox.concerns' : 'gnomelife.concerns';
const DB_NAME = window.SANDBOX ? 'gnomelife-sandbox-concerns' : 'gnomelife-concerns';
let on = false; try { on = localStorage.getItem(ON_KEY) === 'on'; } catch (e) {}
let count = 0, hooks = { info: () => ({}), logText: () => '', toast: () => {} };
const $ = id => document.getElementById(id), pad = x => String(x).padStart(2, '0');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- storage: one IndexedDB store per garden (room for hundreds of pictures; localStorage would fill after a few) ----------
let dbp = null;
function db() {
  return dbp || (dbp = new Promise((ok, no) => {
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = () => r.result.createObjectStore('c', { keyPath: 'id', autoIncrement: true });
    r.onsuccess = () => ok(r.result); r.onerror = () => { dbp = null; no(r.error); };
  }));
}
const req = r => new Promise((ok, no) => { r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); });
const store = mode => db().then(d => d.transaction('c', mode).objectStore('c'));
const all = () => store('readonly').then(s => req(s.getAll()));
const recount = () => store('readonly').then(s => req(s.count())).then(n => { count = n; }).catch(() => {});

// ---------- the picture: the garden canvas, then every visible piece of the page drawn on top in its place ----------
function shot() {
  const W = innerWidth, H = innerHeight, S = Math.min(window.devicePixelRatio || 1, 1300 / Math.max(W, H));
  const c = Object.assign(document.createElement('canvas'), { width: Math.round(W * S), height: Math.round(H * S) }), x = c.getContext('2d');
  x.fillStyle = '#1c2418'; x.fillRect(0, 0, c.width, c.height);
  try { x.drawImage($('c'), 0, 0, c.width, c.height); } catch (e) {}
  const garden = () => { try { x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage($('c'), 0, 0, c.width, c.height); } catch (e) {} };
  x.setTransform(S, 0, 0, S, 0, 0);
  try { for (const el of document.body.children) if (!/^(c|load|cBtn|cBox|cList)$/.test(el.id) && el.tagName !== 'SCRIPT') drawEl(x, el, 1, W, H); }
  catch (e) { garden(); }
  try { c.toDataURL('image/jpeg', 0.1); } catch (e) { x.clearRect(0, 0, c.width, c.height); garden(); }   // a picture the page may not read back: keep just the garden
  return c;
}
function drawEl(x, el, a, W, H) {
  const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return;
  a *= +cs.opacity; if (a < 0.03) return;
  const r = el.getBoundingClientRect(), seen = r.width > 0 && r.height > 0 && r.right > 0 && r.bottom > 0 && r.left < W && r.top < H;
  x.globalAlpha = a;
  if (seen) {
    const bg = cs.backgroundColor; if (bg && !/rgba\(.*,\s*0\)$|transparent/.test(bg)) { x.fillStyle = bg; x.beginPath(); const rad = Math.min(parseFloat(cs.borderTopLeftRadius) || 0, r.width / 2, r.height / 2); x.roundRect ? x.roundRect(r.left, r.top, r.width, r.height, rad) : x.rect(r.left, r.top, r.width, r.height); x.fill(); }
    if ((el.tagName === 'IMG' && el.complete && el.naturalWidth) || el.tagName === 'CANVAS') { try { x.drawImage(el, r.left, r.top, r.width, r.height); } catch (e) {} }
  }
  const clip = cs.overflowY !== 'visible' || cs.overflowX !== 'visible';
  if (clip) { if (!seen) return; x.save(); x.beginPath(); x.rect(r.left, r.top, r.width, r.height); x.clip(); }
  for (const n of el.childNodes) {
    if (n.nodeType === 1) drawEl(x, n, a, W, H);
    else if (n.nodeType === 3 && /\S/.test(n.data)) drawText(x, n, cs, a, H);
  }
  if (clip) x.restore();
}
function drawText(x, node, cs, a, H) {
  x.globalAlpha = a; x.fillStyle = cs.color; x.textBaseline = 'middle';
  x.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const up = cs.textTransform === 'uppercase', rg = document.createRange(), re = /\S+/g; let m;
  while ((m = re.exec(node.data))) {
    rg.setStart(node, m.index); rg.setEnd(node, m.index + m[0].length);
    const b = rg.getClientRects()[0]; if (!b || b.bottom < 0 || b.top > H) continue;
    x.fillText(up ? m[0].toUpperCase() : m[0], b.left, b.top + b.height / 2, b.width + 2);
  }
}
const blobOf = c => new Promise(ok => { try { c.toBlob(b => ok(b), 'image/jpeg', 0.72); } catch (e) { ok(null); } });

// ---------- the button and the note box ----------
const css = document.createElement('style');
css.textContent = `
  #cBtn { position:fixed; top:calc(env(safe-area-inset-top) + 12px); right:12px; width:38px; height:38px; border-radius:50%; border:1.5px solid rgba(51,37,26,.45); background:rgba(241,229,198,.9); color:var(--ink); font:bold 21px/34px var(--fell, Georgia, serif); padding:0; box-shadow:0 2px 6px rgba(0,0,0,.35); z-index:30; display:none; }
  #cBtn.on { display:block; }
  #cBox, #cList { position:fixed; inset:0; z-index:31; background:rgba(10,12,8,.62); display:none; justify-content:center; align-items:flex-start; padding:calc(env(safe-area-inset-top) + 40px) 12px 20px; box-sizing:border-box; overflow-y:auto; }
  #cBox.on, #cList.on { display:flex; }
  #cBox .card, #cList .card { width:min(100%, 460px); box-sizing:border-box; background:var(--paper); color:var(--ink); padding:14px 16px 16px; box-shadow:0 6px 24px rgba(0,0,0,.5); font-family:var(--body, Georgia, serif); }
  #cBox h2, #cList h2 { margin:0 0 2px; font-family:var(--fell, Georgia, serif); font-weight:400; font-size:24px; }
  #cBox .when, #cList .meta { margin:0 0 8px; font-size:14px; font-style:italic; color:var(--ink2); }
  #cBox img { display:block; max-width:100%; max-height:26vh; margin:0 auto 8px; border:1px solid rgba(51,37,26,.3); }
  #cBox textarea { width:100%; box-sizing:border-box; min-height:96px; font:17px/1.35 var(--body, Georgia, serif); color:var(--ink); background:rgba(255,250,235,.7); border:1.5px solid rgba(51,37,26,.35); border-radius:6px; padding:8px; }
  #cBox .hint { margin:4px 0 10px; font-size:14px; color:var(--ink2); }
  #cBox .row2, #cList .row2 { display:flex; gap:8px; flex-wrap:wrap; margin-top:8px; }
  #cList .item { display:flex; gap:10px; align-items:flex-start; padding:8px 0; border-top:1px solid rgba(51,37,26,.18); font-size:15px; }
  #cList .item img { width:64px; flex:none; border:1px solid rgba(51,37,26,.3); }
  #cList .item b { display:block; font-size:14px; color:var(--ink2); font-weight:600; }
  #cList .items { max-height:42vh; overflow-y:auto; margin:6px 0; }
`;
document.head.appendChild(css);
const btn = Object.assign(document.createElement('button'), { id: 'cBtn', textContent: '!', title: 'Note a concern' });
const box = Object.assign(document.createElement('div'), { id: 'cBox' });
const list = Object.assign(document.createElement('div'), { id: 'cList' });
document.body.append(btn, box, list);
for (const el of [btn, box, list]) for (const ev of ['pointerdown', 'touchstart']) el.addEventListener(ev, e => e.stopPropagation(), { passive: true });
const show = () => btn.classList.toggle('on', on);

let pending = null;
btn.addEventListener('click', () => {
  const info = hooks.info() || {}; let when = ''; try { when = PL.when ? PL.when() : ''; } catch (e) {}
  const c = shot(), at = Date.now();
  pending = { at, when, win: info.win || '', blob: blobOf(c) };
  box.innerHTML = `<div class="card"><h2>A concern</h2><p class="when">${esc(when ? 'Day ' + when.replace(/^d/, '').replace(' ', ', ') : '')}${info.win ? ' · ' + esc(info.win) : ''}</p>
    <img src="${c.toDataURL('image/jpeg', 0.6)}" alt="">
    <textarea id="cNote" placeholder="What's the worry? (you can leave this empty)"></textarea>
    <p class="hint">Type it, or tap the little microphone on the keyboard and say it.</p>
    <div class="row2"><button class="act" data-c="keep">Keep it</button><button class="act quiet" data-c="cancel">Never mind</button></div></div>`;
  box.classList.add('on'); const t = $('cNote'); try { t.focus(); } catch (e) {}
});
box.addEventListener('click', async e => {
  const b = e.target.closest('[data-c]'); if (!b || !pending) return;
  if (b.dataset.c === 'cancel') { pending = null; box.classList.remove('on'); return; }
  const note = ($('cNote').value || '').trim(), p = pending; pending = null; b.disabled = true;
  try {
    const blob = await p.blob, buf = blob ? await blob.arrayBuffer() : null;
    const s = await store('readwrite'), id = await req(s.add({ at: p.at, when: p.when, win: p.win, note, img: buf, v: typeof BUILD !== 'undefined' ? BUILD : '' }));
    PL.add(`CONCERN ${id}${p.win ? ' (' + p.win + ')' : ''}: "${note || '(no words)'}"`); PL.flush();
    count++; relabel(); box.classList.remove('on'); hooks.toast(`Concern ${id} kept.`);
  } catch (err) { box.classList.remove('on'); hooks.toast("That one couldn't be kept: the phone may be short of room. Send and clear the others first."); }
});

// ---------- sending them: the share sheet, with the notes copied as a fallback ----------
const stamp = ms => { const d = new Date(ms); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const fname = r => `concern-${pad(r.id)}${r.when ? '-' + r.when.replace(' ', '-').replace(/:/g, '') : ''}.jpg`;   // concern-03-d3-140522.jpg
function notesText(rows) {
  return `Gnome Life concerns · ${window.SANDBOX ? 'sandbox' : 'real garden'} · ${rows.length} kept · sent ${stamp(Date.now())}\n` +
    `Each one has a matching "CONCERN n" line in the play log.\n\n` +
    rows.map(r => `#${r.id} · ${stamp(r.at)} · game ${r.when || '?'}${r.win ? ' · window: ' + r.win : ''}${r.img ? ' · picture ' + fname(r) : ''}\n${r.note || '(no words)'}\n`).join('\n');
}
let files = null, rowsCache = [], urls = [];
function openList() {
  files = null; urls.forEach(u => URL.revokeObjectURL(u)); urls = [];
  list.innerHTML = `<div class="card"><h2>My concerns</h2><p class="meta">Getting them ready…</p></div>`; list.classList.add('on');
  all().then(rows => {
    rowsCache = rows;
    const day = new Date().toISOString().slice(0, 10), pre = window.SANDBOX ? 'sandbox-' : '';
    const imgs = rows.filter(r => r.img).map(r => new File([r.img], fname(r), { type: 'image/jpeg' }));
    files = [new File([notesText(rows)], `gnome-concerns-${pre}${day}.txt`, { type: 'text/plain' }), new File([hooks.logText()], `gnome-play-log-${pre}${day}.txt`, { type: 'text/plain' }), ...imgs];
    let canShare = false; try { canShare = !!(navigator.canShare && navigator.canShare({ files })); } catch (e) {}
    const items = rows.slice().reverse().map(r => { const u = r.img ? URL.createObjectURL(new Blob([r.img], { type: 'image/jpeg' })) : ''; if (u) urls.push(u); return `<div class="item">${u ? `<img src="${u}" alt="">` : ''}<div><b>#${r.id} · ${esc(stamp(r.at))} · game ${esc(r.when || '?')}${r.win ? ' · ' + esc(r.win) : ''}</b>${esc(r.note || '(no words)')}</div></div>`; }).join('');
    list.innerHTML = `<div class="card"><h2>My concerns</h2><p class="meta">${rows.length ? `${rows.length} kept on this phone, in this garden.` : 'None kept yet. Tap the round ! button to note one.'}</p>
      <div class="items">${items}</div>
      ${rows.length ? (canShare ? `<p class="meta">"Send them" opens the share sheet with the pictures, a notes file and the play log. Pick Messages, Mail, or Save to Files.</p>` : `<p class="meta">This phone can't share files from here, so "Copy the notes" copies the words, and you can press and hold a picture to save it.</p>`) : ''}
      <div class="row2">${rows.length && canShare ? `<button class="act" data-c="share">Send them</button>` : ''}${rows.length ? `<button class="act quiet" data-c="copy">Copy the notes</button><button class="act quiet" data-c="clear">Clear them all</button>` : ''}<button class="act quiet" data-c="close">Close</button></div></div>`;
  }).catch(() => { list.innerHTML = `<div class="card"><h2>My concerns</h2><p class="meta">They couldn't be opened just now.</p><div class="row2"><button class="act quiet" data-c="close">Close</button></div></div>`; });
}
list.addEventListener('click', e => {
  if (e.target === list) return closeList();
  const b = e.target.closest('[data-c]'); if (!b) return; const k = b.dataset.c;
  if (k === 'close') return closeList();
  if (k === 'share' && files) { PL.add(`concerns sent (${rowsCache.length})`); navigator.share({ files }).then(() => { b.textContent = 'Sent ✓'; }).catch(() => {}); return; }
  if (k === 'copy') { const t = notesText(rowsCache), done = () => { b.textContent = 'Copied ✓'; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, () => {}); return; }
  if (k === 'clear') { if (!confirm(`Clear all ${rowsCache.length} concerns from this phone? Send them first if you haven't.`)) return;
    store('readwrite').then(s => req(s.clear())).then(() => { PL.add('concerns cleared'); count = 0; relabel(); openList(); }).catch(() => {}); }
});
const relabel = () => document.querySelectorAll('[data-a="csend"]').forEach(a => { a.textContent = `send my concerns (${count})`; });
function closeList() { list.classList.remove('on'); urls.forEach(u => URL.revokeObjectURL(u)); urls = []; files = null; }

window.CONCERNS = {
  hook(h) { Object.assign(hooks, h); },
  get on() { return on; },
  toggle() { on = !on; try { localStorage.setItem(ON_KEY, on ? 'on' : 'off'); } catch (e) {} PL.add(`testing: concern button ${on ? 'on' : 'off'}`); show(); },
  open: openList,
  links() {   // the tiny line at the bottom of the Magic page and the test panel
    return `<p style="margin-top:6px;font-size:12px">testing: concern button ${on ? 'on' : 'off'} · <a href="#" data-a="ctoggle" style="color:var(--ink2)">turn ${on ? 'off' : 'on'}</a>${on || count ? ` · <a href="#" data-a="csend" style="color:var(--ink2)">send my concerns (${count})</a>` : ''}</p>`;
  },
};
show(); recount();
})();
