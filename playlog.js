// Gnome Life — the play log (v83; v99 keeps the whole garden). A hidden, plain-text diary of what the player did and what the game
// did back, so play notes can be traced ("why did that window come up?"). Nothing in play reads it. Copied out from the bottom of
// the Magic page (and the test panel).
// v99 (round ten note 55, Bryce: "make sure the log holds everything next time"; the old 400,000-character cap dropped the first
// four hours of a long day): the log now lives in the browser's big store (IndexedDB), in pieces, and NOTHING is ever trimmed from
// the garden being played. Each garden has a number; starting over begins a new one, and only gardens before the previous one are
// cleared out. Lines not yet filed are also kept in the small store (localStorage) for a moment, so closing the app or starting
// over never loses the last few. If the big store can't be opened (some private windows), it falls back to the small store with
// the newest lines kept.
(function () {
const KEY = window.SANDBOX ? 'gnomelife.sandbox.playlog' : 'gnomelife.playlog', GKEY = KEY + '.garden';
const DBN = 'gnomelife-playlog', STORE = window.SANDBOX ? 'sandbox' : 'real';
const FALLBACK_CAP = 1500000;   // characters, only when there is no big store at all
let garden = 1; try { garden = +localStorage.getItem(GKEY) || 1; } catch (e) {}
let filed = '';        // this garden's lines already in the big store (read once at start)
let pend = '';         // lines waiting to be filed; mirrored in the small store until they are
try { pend = localStorage.getItem(KEY) || ''; } catch (e) {}
let db = null, noDb = false, writing = false, last = '', lastAt = 0, n = 0, mirrorDirty = false;
const pad = x => String(x).padStart(2, '0');
function open(cb) {
  if (db || noDb) return cb();
  try {
    const rq = indexedDB.open(DBN, 1);
    rq.onupgradeneeded = () => { for (const s of ['real', 'sandbox']) if (!rq.result.objectStoreNames.contains(s)) rq.result.createObjectStore(s, { autoIncrement: true }); };
    rq.onsuccess = () => { db = rq.result; cb(); }; rq.onerror = rq.onblocked = () => { noDb = true; cb(); };
  } catch (e) { noDb = true; cb(); }
}
function load() {   // read this garden's filed lines; clear out gardens older than the one before this
  open(() => { if (!db) return;
    try { const tx = db.transaction(STORE, 'readwrite'), st = tx.objectStore(STORE), parts = [];
      st.openCursor().onsuccess = e => { const c = e.target.result; if (!c) { filed = parts.join(''); file(); return; }
        const v = c.value || {}; if ((v.g || 1) === garden) parts.push(v.t || ''); else if ((v.g || 1) < garden - 1) c.delete(); c.continue(); };
    } catch (e) { noDb = true; } });
}
function file() {   // move the waiting lines into the big store; the small store's copy goes once they are safely there
  if (!db || writing || !pend) return; const chunk = pend, g = garden; writing = true;
  try { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).add({ g, t: chunk, at: Date.now() });
    tx.oncomplete = () => { writing = false; if (g === garden) filed += chunk; pend = pend.slice(chunk.length); mirror(true); if (pend) file(); };
    tx.onerror = tx.onabort = () => { writing = false; };
  } catch (e) { writing = false; }
}
function mirror(force) {   // the small store's copy of the waiting lines
  if (!force && !mirrorDirty) return; mirrorDirty = false;
  if (noDb && pend.length > FALLBACK_CAP) pend = pend.slice(pend.indexOf('\n', pend.length - FALLBACK_CAP * 0.8) + 1);
  try { if (pend) localStorage.setItem(KEY, pend); else localStorage.removeItem(KEY); }
  catch (e) { if (noDb) { pend = pend.slice(pend.indexOf('\n', pend.length / 2) + 1); try { localStorage.setItem(KEY, pend); } catch (e2) {} } }   // only with no big store: the phone's small store is tight, keep the newer half
}
const PL = {
  when: null,   // set by game.js: "d3 14:05:22" (game day and the garden's clock)
  get n() { return n; },   // lines added since the page opened (the tap logger checks whether a tap did anything)
  add(text) {
    text = String(text).replace(/\s+/g, ' ').trim(); if (!text) return;
    const t = Date.now(); if (text === last && t - lastAt < 3000) return;   // the same line twice in a row: once is enough
    last = text; lastAt = t; n++;
    let w = ''; try { w = PL.when ? PL.when() : ''; } catch (e) {} if (!w) { const d = new Date(); w = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; }
    pend += w + ' ' + text + '\n'; mirrorDirty = true;
  },
  short(x) { if (x == null) return ''; if (typeof x !== 'object') return String(x); try { const s = JSON.stringify(x); return s.length > 140 ? s.slice(0, 140) + '…' : s; } catch (e) { return '?'; } },
  flush() { mirror(); file(); },
  drop() { if (noDb) { pend = pend.slice(pend.indexOf('\n', pend.length / 2) + 1); mirror(true); } else { file(); try { localStorage.removeItem(KEY); } catch (e) {} } },   // the save could not be written: the log gives up its room in the small store (its lines are, or are about to be, in the big one)
  newGarden() { PL.flush(); garden++; filed = ''; try { localStorage.setItem(GKEY, String(garden)); } catch (e) {} },   // the garden was started over: a fresh log (the last garden's is kept until the one after)
  text() { return filed + pend; },   // the whole of this garden, start to now
  size() { return filed.length + pend.length; },
};
load();
setInterval(() => PL.flush(), 20000);
document.addEventListener('visibilitychange', () => { if (document.hidden) PL.flush(); });
window.addEventListener('pagehide', () => PL.flush());
window.PL = PL;
})();
