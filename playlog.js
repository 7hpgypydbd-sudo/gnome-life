// Gnome Life — the play log (v83). A hidden, plain-text diary of what the player did and what the game did back, so play notes
// can be traced ("why did that window come up?"). Nothing in play reads it. Each garden keeps its own, on the phone only, and the
// oldest lines drop off once it is full, so it never crowds the save. Copied out from the bottom of the Magic page (and the test panel).
(function () {
const KEY = window.SANDBOX ? 'gnomelife.sandbox.playlog' : 'gnomelife.playlog';
const CAP = 400000, KEEP = 300000;   // characters: past CAP the oldest lines go, down to KEEP (about two to three weeks of play)
let buf = ''; try { buf = localStorage.getItem(KEY) || ''; } catch (e) {}
let dirty = false, last = '', lastAt = 0, n = 0;
const pad = x => String(x).padStart(2, '0');
const PL = {
  when: null,   // set by game.js: "d3 14:05:22" (game day and the garden's clock)
  get n() { return n; },   // lines added since the page opened (the tap logger checks whether a tap did anything)
  add(text) {
    text = String(text).replace(/\s+/g, ' ').trim(); if (!text) return;
    const t = Date.now(); if (text === last && t - lastAt < 3000) return;   // the same line twice in a row: once is enough
    last = text; lastAt = t; n++;
    let w = ''; try { w = PL.when ? PL.when() : ''; } catch (e) {} if (!w) { const d = new Date(); w = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; }
    buf += w + ' ' + text + '\n'; dirty = true;
    if (buf.length > CAP) { const cut = buf.indexOf('\n', buf.length - KEEP); buf = buf.slice(cut + 1); }
  },
  short(x) { if (x == null) return ''; if (typeof x !== 'object') return String(x); try { const s = JSON.stringify(x); return s.length > 140 ? s.slice(0, 140) + '…' : s; } catch (e) { return '?'; } },
  flush() {
    if (!dirty) return; dirty = false;
    try { localStorage.setItem(KEY, buf); }
    catch (e) { buf = buf.slice(buf.indexOf('\n', buf.length / 2) + 1); try { localStorage.setItem(KEY, buf); } catch (e2) {} }   // phone storage tight: keep the newer half
  },
  drop() { buf = buf.slice(buf.indexOf('\n', buf.length / 2) + 1); try { localStorage.setItem(KEY, buf); } catch (e) { try { localStorage.removeItem(KEY); } catch (e2) {} } },   // the save could not be written: make room for it
  text() { return buf; },
};
setInterval(() => PL.flush(), 20000);
document.addEventListener('visibilitychange', () => { if (document.hidden) PL.flush(); });
window.addEventListener('pagehide', () => PL.flush());
window.PL = PL;
})();
