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
    sheet('m01-month1-makes', [None, 'make-earthbank', 'make-clover'])   # (the mouse door in the fence: dropped, Bryce v80)
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


def hole_box(p):   # the dark hole in a stump piece: the biggest very dark patch, as (middle x, middle y, width) in sheet pixels
    from scipy import ndimage
    lum = p[..., :3].astype(int).sum(2); dark = (lum < 200) & (p[..., 3] > 200); lab, n = ndimage.label(ndimage.binary_closing(dark, iterations=3))
    k = 1 + int(np.argmax(ndimage.sum(dark, lab, range(1, n + 1)))); ys, xs = np.where(lab == k); return (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2, xs.max() - xs.min()


def chopping():   # art day 17 n07 (Bryce: paint it being chopped): the fallen stump cut up in steps, each scaled and lined up on stump-2's hole so they swap in place
    from scipy import ndimage
    HOLES = {'base': (425, 475, 350), 'stump-c1': (640, 760, 615), 'stump-c2': (380, 420, 365), 'stump-c4': (345, 120, 530)}   # each hole's centre and width, read off gridded crops by eye (hole_box was not reliable)
    base = crop_alpha(pieces(key(load('n03-stump-stages')))[1]); bx, by, bw = HOLES['base']; H0, W0 = base.shape[:2]; dx, dy = bx - W0 / 2, by - H0 * 0.82   # stump-2's hole from its anchor (how paintedStump places a stage)
    rgba = key(load('n07-stump-chopping')); solid = rgba[..., 3] > 128
    lab, n = ndimage.label(ndimage.binary_dilation(solid, iterations=6)); objs = ndimage.find_objects(lab)
    big = sorted(range(n), key=lambda i: -(objs[i][0].stop - objs[i][0].start) * (objs[i][1].stop - objs[i][1].start))[:4]; big.sort(key=lambda i: objs[i][1].start)
    for k, out in zip(big, ['stump-c1', 'stump-c2', 'stump-c3', 'stump-c4']):
        if out == 'stump-c3': continue   # a standing stub, which does not follow on from the stump lying on its side
        sl = objs[k]; p = rgba[sl].copy(); p[..., 3] = np.where(lab[sl] == k + 1, p[..., 3], 0); p = crop_alpha(p); hx, hy, hw = HOLES[out]
        sc = bw / hw; im = Image.fromarray(p).resize((round(p.shape[1] * sc), round(p.shape[0] * sc)), Image.LANCZOS); p = np.asarray(im); H, W = p.shape[:2]; hx *= sc; hy *= sc
        x0, y0 = dx - hx, dy - hy   # the piece's top-left from the anchor
        half = max(-x0, x0 + W); top = max(-y0, 1); below = max(y0 + H, 1); Hc = int(max(top / 0.82, below / 0.18)) + 2; Wc = int(half * 2) + 2
        c = np.zeros((Hc, Wc, 4), np.uint8); px, py = int(round(Wc / 2 + x0)), int(round(Hc * 0.82 + y0)); c[py:py + H, px:px + W] = p
        im = Image.fromarray(c).resize((round(Wc * K), round(Hc * K)), Image.LANCZOS); f = os.path.join(SPR, out + '.webp'); im.save(f, quality=88); WROTE.append(f); print(out, im.size, 'scale', round(sc, 2))


def campfire():   # art day 17 n04: the bare campfire (tripod and kettle over a few sticks) and its stone ring, each kept at the old file's width
    ps = pieces(key(load('n04-campfire'))); assert len(ps) == 2
    for p, out in zip(ps, ['campfire-bare', 'make-firering']): save(p, out, w=Image.open(os.path.join(SPR, out + '.webp')).width)


def strip_scaled(frames, who, act, atlas, body):   # like pack_strip, but scaled so the gnome himself (body: a frame's height without extras) is 240 px tall
    ims = [Image.fromarray(crop_alpha(f)) for f in frames]; s = 240 / body
    ims = [i.resize((round(i.width * s), round(i.height * s)), Image.LANCZOS) for i in ims]
    cw = max(i.width for i in ims) + 4; ch = max(i.height for i in ims) + 2
    st = Image.new('RGBA', (cw * len(ims), ch))
    for i, f in enumerate(ims): st.paste(f, (i * cw + (cw - f.width) // 2, ch - f.height), f)
    path = os.path.join(SPR, f'{who}-{act}.webp'); st.save(path, lossless=True, exact=True, method=6); WROTE.append(path)
    atlas[who]['acts'][act] = {'n': len(ims), 'cell': [cw, ch]}; print(who, act, cw, ch)


def chopstrips():   # art day 17 n07-n10: chopping (with the chopping block) and carrying an armful of logs, both gnomes
    atlas = json.load(open(os.path.join(SPR, 'gnomes.json')))
    for name, who, act in (('n07-him-chop', 'him', 'chop'), ('n08-him-carrylogs', 'him', 'carrylogs'), ('n09-her-chop', 'her', 'chop'), ('n10-her-carrylogs', 'her', 'carrylogs')):
        fr = pieces(key(load(name)), grow=0); fr = sorted(sorted(fr, key=lambda p: -p.shape[0] * p.shape[1])[:4], key=lambda p: 0)
        rgba = key(load(name)); cols = (rgba[..., 3] > 128).any(0); runs, st = [], None   # frames left to right by their columns
        for x, v in enumerate(list(cols) + [False]):
            if v and st is None: st = x
            if not v and st is not None: runs.append((st, x)); st = None
        runs = sorted(sorted(runs, key=lambda r: r[0] - r[1])[:4]) if len(runs) >= 4 else [(0, 705), (705, 1366), (1366, 2096), (2096, rgba.shape[1])]
        frames = [rgba[:, a:b] for a, b in runs]
        body = min(crop_alpha(f).shape[0] for f in frames)   # the lowest frame: hatchet down, standing straight
        strip_scaled(frames, who, act, atlas, body)
    json.dump(atlas, open(os.path.join(SPR, 'gnomes.json'), 'w'), indent=1)


GROUPS = dict(repaints=repaints, wishes=wishes, track=track, garlands=garlands, month1=month1, round6=round6, pages=pages, strip=strip, chopping=chopping, campfire=campfire, chopstrips=chopstrips)
if __name__ == '__main__':
    for g in sys.argv[1:] or GROUPS: GROUPS[g]()
    if WROTE: subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'defringe_sprites.py')] + WROTE, check=True)
