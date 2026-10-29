"""Cut art days 16 and 17 (raw Gemini pictures on magenta) into the game's files.
usage: python3 tools/cut_day16_17.py [group ...]   groups: repaints wishes track garlands month1 round6 pages strip (default all)
Needs art-day-16/painted/ and art-day-17/painted/ from branch art-day-17 (git-ignored on main):
  git checkout origin/art-day-17 -- art-day-16 art-day-17 && git reset -q
The piece order of each sheet follows its prompt (docs/ART-DAY-16.md, docs/ART-DAY-17.md). Repaints keep the height of the file
they replace, so the game draws them the same size. Runs tools/defringe_sprites.py on what it writes (not the lavender, whose
violet is meant). The pot-walk strip updates sprites/gnomes.json: re-paste it into index.html (const GNOMES) after.
"""
import sys, os, json, subprocess
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from cut_day15 import key, crop_alpha, pieces, pack_strip, SPR

ROOT = os.path.join(os.path.dirname(__file__), '..')
D16 = os.path.join(ROOT, 'art-day-16', 'painted'); D17 = os.path.join(ROOT, 'art-day-17', 'painted')
K = 0.3
WROTE = []


def load(name):
    for d in (D16, D17):
        p = os.path.join(d, name + '.jpg')
        if os.path.exists(p): return Image.open(p).convert('RGB')
    raise FileNotFoundError(name)


def save(arr, name, k=K, h=None, w=None):
    im = Image.fromarray(crop_alpha(arr))
    if h: im = im.resize((round(im.width * h / im.height), h), Image.LANCZOS)
    elif w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    else: im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    p = os.path.join(SPR, name + '.webp'); im.save(p, quality=88); WROTE.append(p); print(name, im.size)


def old_h(name):
    return Image.open(os.path.join(SPR, name + '.webp')).height


def sheet(name, ids, keep_h=False, k=K, **kw):   # one piece per id, in the prompt's order (None: skip)
    ps = pieces(key(load(name)), **kw); assert len(ps) == len(ids), (name, len(ps))
    for p, i in zip(ps, ids):
        if i: save(p, i, h=old_h(i) if keep_h else None, k=k)
    return ps


def joined(rgba_pieces):   # several pieces of one thing (the yarn posts) side by side again, feet on one line
    ims = [crop_alpha(p) for p in rgba_pieces]; H = max(p.shape[0] for p in ims); gap = 6
    out = np.zeros((H, sum(p.shape[1] for p in ims) + gap * (len(ims) - 1), 4), np.uint8); x = 0
    for p in ims: out[H - p.shape[0]:, x:x + p.shape[1]] = p; x += p.shape[1] + gap
    return out


def repaints():
    sheet('r01-yard-repaints', ['glow-jar', 'worm-lantern', 'make-stonefrog', 'make-sitstone', 'make-scarecrow'], keep_h=True)
    sheet('r04-heal-trees', ['heal-gum-1', 'heal-gum-2', 'heal-gum-3', 'heal-deadtree', 'heal-deadtree-home'], keep_h=True)
    sheet('r05-wisp', ['vis-wisp'], keep_h=True)
    sheet('r06-juniper-home', ['home-juniper'], keep_h=True)
    sheet('r07-mabel-bakehouse', ['bld-mabel'], keep_h=True)
    sheet('r08-festival', ['fest-lantern', 'pumpkin-3'], keep_h=True)
    n = len(WROTE); sheet('r09-lavender', ['farm-lavender-1', 'farm-lavender-2', 'farm-lavender-3', 'farm-lavender-4'], keep_h=True); del WROTE[n:]   # violet is meant


WISHES = [['pieshelf', 'herbwreath', 'flourbunting', 'sawhorse', 'carvedowl', 'clonks'],
          ['twinswing', 'puddle', 'heightchart', 'birdtable', 'climbrose', 'kneerug'],
          ['honeystall', 'beebath', 'paintedbee', 'sackbarrow', 'vane', 'mmbench'],
          ['postyarn', 'dyepot', 'ragrug', 'moonflowers', 'starchart', 'mothpot']]


def wishes():
    for name, ids in zip(['d01-wishes-mabel-tobias', 'd02-wishes-fernsby-pebbleworth', 'd03-wishes-clem-barnaby'], WISHES):
        sheet(name, ['wish-' + i for i in ids])
    ps = pieces(key(load('d04-wishes-nettle-juniper'))); assert len(ps) == 8, len(ps)   # the four yarn posts come out as 3 pieces
    save(joined(ps[:3]), 'wish-postyarn')
    for p, i in zip(ps[3:], WISHES[3][1:]): save(p, 'wish-' + i)


def track():
    sheet('d05-track-makes', ['make-' + i for i in ('signpost', 'milestone', 'trackbench', 'letterbox', 'noticeboard', 'trough')])


def garlands():
    sheet('d06-garlands', ['make-dress_' + s for s in ('spring', 'summer', 'autumn', 'winter')], k=0.2)


def month1():
    ps = sheet('m01-month1-makes', [None, 'make-earthbank', 'make-clover'])
    door = crop_alpha(ps[0]).copy()   # the mouse door alone (the game has its own fence): its arch, twig frame and pebble step
    hole = door[495:705, 425:515]; see = hole[..., 3] < 200   # the arch is painted see-through: a dark way in instead
    hole[see] = [42, 28, 18, 255]
    out = door[470:850, 320:600].copy(); H, W = out.shape[:2]; ys, xs = np.mgrid[:H, :W]
    d = np.hypot((xs - W * 0.52) / (W * 0.5), (ys - H * 0.55) / (H * 0.5)); fade = np.clip((1.0 - d) / 0.25, 0, 1)   # feathered into the game's fence
    out[..., 3] = (out[..., 3] * np.maximum(fade, (ys > H * 0.68) & (xs > W * 0.2))).astype(np.uint8)   # (the pebble step stays whole)
    save(out, 'make-mousedoor')
    ps = pieces(key(load('r02-pebble-line')))   # three copies of one line of pebbles: keep the first
    save(ps[0], 'make-pebbleline', k=0.4)


def round6():
    ps = pieces(key(load('n01-mouse-bottle'))); assert len(ps) == 2
    mouse, neck = sorted(ps, key=lambda p: -p.shape[0])   # the mouse is the taller piece
    save(mouse, 'vis-mouse-stuck'); save(neck, 'mouse-bottle')
    sheet('n02-bug-bath', ['make-yardbath'], k=0.2)
    sheet('n03-stump-stages', ['stump-1', 'stump-2', 'stump-3', 'stump-4'])


def pages():   # story pages 1.1 and 1.2, once painted (art day 17, n05/n06)
    for n, out in (('n05-page-1-1', 'page-1-1'), ('n06-page-1-2', 'page-1-2')):
        try: im = load(n)
        except FileNotFoundError: print('not painted yet:', n); continue
        im = im.resize((1200, round(im.height * 1200 / im.width)), Image.LANCZOS); im.save(os.path.join(SPR, out + '.webp'), quality=82); print(out, im.size)


def strip():
    atlas = json.load(open(os.path.join(SPR, 'gnomes.json')))
    pack_strip(pieces(key(load('r03-her-potwalk'))), 'her', 'potwalk', atlas)
    json.dump(atlas, open(os.path.join(SPR, 'gnomes.json'), 'w'), indent=1)
    WROTE.append(os.path.join(SPR, 'her-potwalk.webp'))


GROUPS = dict(repaints=repaints, wishes=wishes, track=track, garlands=garlands, month1=month1, round6=round6, pages=pages, strip=strip)
if __name__ == '__main__':
    for g in sys.argv[1:] or GROUPS: GROUPS[g]()
    if WROTE: subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'defringe_sprites.py')] + WROTE, check=True)
