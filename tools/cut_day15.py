"""Cut art day 15 (art-day-15/painted/*.jpg, raw Gemini pictures on magenta) into the game's files.
usage: python3 tools/cut_day15.py [--only <group>] [--peek out_dir]
Needs the painted/ folder from branch art-day-15-pictures (git-ignored on main).
--peek writes a numbered contact picture of every sheet's pieces (to choose the piece numbers below).
Gnome strips also update sprites/gnomes.json: re-paste it into index.html after.
"""
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'art-day-15', 'painted')
SPR = os.path.join(ROOT, 'sprites')
TARGET_H = 240


def load(name):
    p = os.path.join(SRC, name + '.jpg')
    return Image.open(p).convert('RGB')


def key(im, thresh=0.42, soft=0.22):   # keyed with proper un-mixing so there is no pink fringe
    a = np.asarray(im.convert('RGB')).astype(np.float32) / 255
    mag = np.minimum(a[..., 0], a[..., 2]) - a[..., 1]
    alpha = np.clip((thresh - mag) / soft, 0, 1)
    M = np.array([1, 0, 1], np.float32); al = np.maximum(alpha, 0.05)[..., None]
    fg = np.clip((a - (1 - al) * M) / al, 0, 1); fg = np.where(alpha[..., None] < 1, fg, a)
    return (np.dstack([fg, alpha[..., None]]) * 255).astype(np.uint8)


def crop_alpha(rgba):
    ys, xs = np.where(rgba[..., 3] > 8)
    return rgba[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def pieces(rgba, grow=14, minpx=4000, boxes=False):   # connected blobs (merged when closer than grow px), ordered in rows then left to right
    solid = rgba[..., 3] > 128
    lab, n = ndimage.label(ndimage.binary_dilation(solid, iterations=grow) if grow else solid)
    out = []
    for k, sl in enumerate(ndimage.find_objects(lab), 1):
        own = (lab[sl] == k) & (rgba[sl][..., 3] > 0)
        if own.sum() < minpx: continue
        p = rgba[sl].copy(); p[..., 3] = np.where(own, p[..., 3], 0)
        out.append((sl[0].stop, (sl[1].start + sl[1].stop) / 2, (crop_alpha(p), sl) if boxes else crop_alpha(p)))   # rows by their feet (pieces in a row stand on one line)
    out.sort(key=lambda b: b[0]); rows, cur = [], []
    for b in out:
        if cur and b[0] - np.mean([c[0] for c in cur]) > 0.2 * rgba.shape[0]: rows.append(cur); cur = []
        cur.append(b)
    if cur: rows.append(cur)
    return [b[2] for r in rows for b in sorted(r, key=lambda b: b[1])]


def save(arr, name, w=None, h=None, k=None, quality=88):
    im = Image.fromarray(crop_alpha(arr))
    if k: im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    elif w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    elif h: im = im.resize((round(im.width * h / im.height), h), Image.LANCZOS)
    im.save(os.path.join(SPR, name + '.webp'), quality=quality); print(name, im.size); return im.size


def peek(out):
    os.makedirs(out, exist_ok=True)
    for fn in sorted(os.listdir(SRC)):
        if not fn.endswith('.jpg') or '-page-' in fn or '-portrait-' in fn: continue
        name = fn[:-4]; th = 0.36 if name in PINK else 0.42
        ps = pieces(key(load(name), th))
        tiles = []
        for i, p in enumerate(ps, 1):
            im = Image.fromarray(p); im.thumbnail((240, 240)); t = Image.new('RGB', (250, 270), (60, 60, 60)); t.paste(im, (5, 25), im)
            ImageDraw.Draw(t).text((6, 4), f'{i}  {p.shape[1]}x{p.shape[0]}', fill=(255, 255, 0)); tiles.append(t)
        cols = 8; sheet = Image.new('RGB', (250 * cols, 270 * ((len(tiles) + cols - 1) // cols)), (30, 30, 30))
        for i, t in enumerate(tiles): sheet.paste(t, ((i % cols) * 250, (i // cols) * 270))
        sheet.save(os.path.join(out, name + '.jpg'), quality=80); print(name, len(ps))


PINK = {'c04-bean-poles', 'h01-heal-saplings', 'h06-heal-nursery', 'f04-farm-orchard', 'f05-farm-lavender'}


def sheet(name, ids, k=None, w=None, h=None, cut=None):   # one sheet of separate pieces -> one webp per id (None: skip that piece)
    rgba = key(load(name), 0.36 if name in PINK else 0.42)
    if cut: rgba = rgba[int(rgba.shape[0] * cut):]
    ps = pieces(rgba); assert len(ps) == len(ids), (name, len(ps))
    for p, i in zip(ps, ids):
        if i: save(p, i, w=w, h=h, k=k)


def card(name, out, size=360):   # a square painting -> a rounded journal card
    from PIL import ImageDraw
    p = load(name).resize((size, size), Image.LANCZOS).convert('RGBA')
    m = Image.new('L', (size * 4, size * 4), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, size * 4 - 1, size * 4 - 1], radius=int(size * 0.09) * 4, fill=255)
    p.putalpha(m.resize(p.size, Image.LANCZOS)); p.save(os.path.join(SPR, out + '.webp'), quality=86); print(out, p.size)


def page(name, out):
    im = load(name); im = im.resize((1200, round(im.height * 1200 / im.width)), Image.LANCZOS); im.save(os.path.join(SPR, out + '.webp'), quality=82); print(out, im.size)


def pack_strip(frames, who, act, atlas):   # frames: list of RGBA arrays -> sprites/<who>-<act>.png (4 cells side by side), each gnome 240 px tall
    ims = [Image.fromarray(crop_alpha(f)) for f in frames]
    s = TARGET_H / max(i.height for i in ims)
    ims = [i.resize((round(i.width * s), round(i.height * s)), Image.LANCZOS) for i in ims]
    cw = max(i.width for i in ims) + 4; ch = max(i.height for i in ims) + 2
    strip = Image.new('RGBA', (cw * len(ims), ch))
    for i, f in enumerate(ims): strip.paste(f, (i * cw + (cw - f.width) // 2, ch - f.height), f)
    strip.save(os.path.join(SPR, f'{who}-{act}.png'), optimize=True)
    atlas[who]['acts'][act] = {'n': len(ims), 'cell': [cw, ch]}; print(who, act, cw, ch)


def sit_strip(frames, out, h=240):   # a sitting loop: equal cells, feet on the bottom line, the gnome's middle at each cell's middle
    ims = [Image.fromarray(crop_alpha(f)) for f in frames]; s = h / max(i.height for i in ims)
    ims = [i.resize((round(i.width * s), round(i.height * s)), Image.LANCZOS) for i in ims]
    cw = max(i.width for i in ims) + 4; strip = Image.new('RGBA', (cw * len(ims), h))
    for i, f in enumerate(ims): strip.paste(f, (i * cw + (cw - f.width) // 2, h - f.height), f)
    strip.save(os.path.join(SPR, out + '.png'), optimize=True); print(out, strip.size)


def unstump(f):   # Wendel's dish-fill frames come with their own stump and bowl: keep only him (the game has its own dish)
    f = f.copy(); H, W = f.shape[:2]; a = f[..., :3].astype(int); solid = f[..., 3] > 100
    cream = solid & (a[..., 0] > 200) & (a[..., 1] > 185) & (a[..., 2] > 150) & (a[..., 0] - a[..., 2] < 70)
    low = cream.copy(); low[: int(H * 0.7)] = False; lab, n = ndimage.label(low)   # his two boots are the two biggest cream patches low down
    if n > 2: keep = 1 + np.argsort(ndimage.sum(low, lab, range(1, n + 1)))[-2:]; low = np.isin(lab, keep)
    cream = np.where(np.arange(H)[:, None] >= int(H * 0.7), low, cream)
    yb = int(H * 0.68); rows = [y for y in range(int(H * 0.7), H) if cream[y].any()]
    btop, bbot = min(rows), max(rows); toe = max(np.where(cream[y])[0].max() for y in rows)
    for y in range(yb, H):
        if btop <= y <= bbot and cream[y].any(): xc = np.where(cream[y])[0].max() + 3
        elif y < btop: xc = toe
        else: xc = 0
        f[y, xc:, 3] = 0
    lab, n = ndimage.label(f[..., 3] > 60); big = 1 + int(np.argmax(ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))))
    f[..., 3] = np.where(lab == big, f[..., 3], 0); return f


def gnome_cols(rgba, n=4):   # column spans of n gnomes standing in a row, from the top part of the picture (stumps below join them)
    prof = (rgba[: int(rgba.shape[0] * 0.6), :, 3] > 128).sum(0) > 0
    spans, st = [], None
    for x, v in enumerate(prof):
        if v and st is None: st = x
        if not v and st is not None: spans.append((st, x)); st = None
    if st is not None: spans.append((st, len(prof)))
    spans = sorted(spans, key=lambda s: s[1] - s[0])[-n:]; return sorted(spans)


def strips():
    atlas = json.load(open(os.path.join(SPR, 'gnomes.json')))
    for name, who in (('h07-her-toss', 'her'), ('h08-him-toss', 'him')): pack_strip(pieces(key(load(name))), who, 'toss', atlas)
    # Wendel filling the dish: frames 1-3 from the first try, frame 4 from the second (neither try has all four right)
    t1 = key(Image.open(os.path.join(SRC, 'tries', 'x01-him-fill-090330.jpg')).convert('RGB')); t2 = key(load('x01-him-fill'))
    fr = []
    for rgba, picks in ((t1, (0, 1, 2)), (t2, (3,))):
        sp = gnome_cols(rgba)
        for i in picks: a, b = sp[i]; pad = (b - a) // 3; fr.append(unstump(rgba[:, max(0, a - pad):b + pad]))
    pack_strip(fr, 'him', 'fill', atlas)
    # Hazel carrying the potted oak (the four frames barely differ: a gentle bob, see RESULTS.md)
    pack_strip(pieces(key(load('x07-her-potwalk'))), 'her', 'potwalk', atlas)
    json.dump(atlas, open(os.path.join(SPR, 'gnomes.json'), 'w'), indent=1)
    sit_strip(pieces(key(load('x05-sit-him'))), 'sit-him'); sit_strip(pieces(key(load('x06-sit-her'))), 'sit-her')


K = 0.3   # sheet pixels -> sprite pixels for the cut-out pieces (the game draws them by height, so this only sets their sharpness)


def crops():
    sheet('c01-crop-carrot', ['crop-carrot-1', 'crop-carrot-2', 'crop-carrot-3', 'crop-carrot-4', 'carrot-legs'], k=K)
    sheet('c02-crop-lettuce', ['crop-lettuce-1', 'crop-lettuce-2', 'crop-lettuce-3', 'crop-lettuce-4'], k=K)
    sheet('c03-crop-bean', ['crop-bean-1', 'crop-bean-2', 'crop-bean-3', 'crop-bean-4'], k=K)
    sheet('c04-bean-poles', ['beanpoles', 'beanpoles-grown'], k=K)
    sheet('c05-crop-pumpkin', ['pumpkin-leaf-1', 'pumpkin-leaf-2', 'pumpkin-leaf-3', 'pumpkin-1', 'pumpkin-2', 'pumpkin-3'], k=K)
    sheet('c06-icons-pantry', ['icon-carrot', 'icon-lettuce', 'icon-bean', 'icon-pumpkin'], h=160)


def healing():
    sheet('h01-heal-saplings', ['heal-gum-1', 'heal-gum-2', 'heal-gum-3', 'heal-wattle-1', 'heal-wattle-2', 'heal-wattle-3', 'heal-guard'], k=K)
    sheet('h02-heal-deadtree', ['heal-deadtree', 'heal-deadtree-home'], k=K)
    sheet('h03-heal-critters', ['vis-wombat', 'vis-wombat-sleep', 'vis-heron', 'vis-platypus'], k=K)
    im = Image.open(os.path.join(SPR, 'vis-platypus.webp')).convert('RGBA'); a = np.asarray(im).astype(int)   # a pink smear in the water under its tail
    pink = (a[..., 0] - a[..., 1] > 30) & (a[..., 2] - a[..., 1] > 30); a[..., 3] = np.where(pink, 0, a[..., 3]); Image.fromarray(a.astype(np.uint8)).save(os.path.join(SPR, 'vis-platypus.webp'), quality=88)
    sheet('h04-heal-homes', ['heal-beestone', 'heal-birdbath', 'heal-birdbox', 'heal-perch', 'heal-seeddish', 'heal-wall'], k=K)
    sheet('h05-heal-junk', ['heal-fence-1', 'heal-fence-2', 'heal-wheel', 'heal-bucket', 'heal-slump'], k=K)
    sheet('h06-heal-nursery', ['heal-shelf-1', 'heal-shelf-2', 'heal-shelf-3'], k=K)
    # the Wood spirit's lesson poses: the seed ball it blows along sits apart from the first pose, so it is put back with it
    rgba = key(load('h09-spirit-lessons')); ps = pieces(rgba, boxes=True)
    (_, s0), (_, s1) = ps[0], ps[1]; y0, y1 = min(s0[0].start, s1[0].start), max(s0[0].stop, s1[0].stop); x0, x1 = min(s0[1].start, s1[1].start), max(s0[1].stop, s1[1].stop)
    save(rgba[y0:y1, x0:x1], 'spirit-wind', h=320)
    for (p, _), n in zip(ps[2:], ('cloud', 'seed', 'sing')): save(p, 'spirit-' + n, h=320)


def animals():
    sheet('a01-rabbit-gate', ['rabbit-gate', 'burrow-mound'], k=K)
    sheet('a02-rabbit-babies', ['baby-1', 'baby-2', 'baby-3', 'baby-4'], k=K)
    sheet('a04-mouse-bits', [None, 'sock-hammock', None, 'sign-noknock'], k=K)   # the door in a wattle fence and the toadstool cluster do not fit the game
    sheet('a06-owl-box', ['owlbox', 'owlbox-owl', 'owl-stake', 'owlbox-snow'], k=K)
    sheet('a07-frogmouth-branch', ['frogmouth-branch'], k=0.2)
    sheet('a09-hog-coat-sign', ['vis-hedgehog-coat', 'nest-leafpile-asleep', 'vis-hedgehog-thin'], k=K, cut=0.35)   # the top third has ghost half-copies
    sheet('a12-gift-icons', ['gift-rabbit', 'gift-mouse', 'gift-owl', 'gift-hedgehog', 'gift-robin', 'gift-wren', 'gift-frog', 'gift-bluetongue'], h=160)
    sheet('a13-lyrebird', ['vis-lyrebird', 'lyre-dance'], k=0.2)
    for n, v in (('a14', 'lyrebird'), ('a16', 'robin'), ('a17', 'wren'), ('a18', 'frog'), ('a19', 'platypus')): card(f'{n}-portrait-{v}', 'portrait-' + v)
    for n, b in (('a03', 'rabbitBabies'), ('a05', 'mouseWinter'), ('a08', 'owlHoo'), ('a10', 'hogShopping'), ('a11', 'hogSpring')): page(f'{n}-page-{b}', 'page-a-' + b)


def farms():
    sheet('f01-farm-herbs', [f'farm-herb-{i}' for i in range(1, 5)] + [f'farm-rhubarb-{i}' for i in range(1, 5)], k=K)
    sheet('f02-farm-willow', [f'farm-willow-{i}' for i in range(1, 5)] + ['farm-willow-cut'], k=K)
    sheet('f03-farm-veg', ['farm-cabbage-1', 'farm-cabbage-2', 'farm-cabbage-3', 'farm-peas-1', 'farm-peas-2', 'farm-straw-1', 'farm-straw-2', 'farm-radish', 'farm-scarecrow', None], k=K)
    sheet('f04-farm-orchard', [f'farm-fruit-{i}' for i in range(1, 5)] + ['farm-ladder'], k=K)
    sheet('f05-farm-lavender', [f'farm-lavender-{i}' for i in range(1, 5)] + ['farm-bottlebrush'], k=K)
    sheet('f06-farm-wheat', [f'farm-wheat-{i}' for i in range(1, 5)] + ['farm-wheat-cut'], k=K)
    sheet('f07-farm-flax', ['farm-flax-1', 'farm-flax-2', 'farm-flax-3', 'farm-woad-1', 'farm-woad-2', 'farm-weld', 'farm-indigo'], k=K)
    sheet('f08-farm-moon', ['farm-trellis', 'farm-moon-1', 'farm-moon-2', 'farm-moon-open', 'farm-primrose', 'farm-moon-closed'], k=K)


def extras():
    sheet('x02-nameboard', ['make-nameboard'], w=240)
    sheet('x03-oak-young', ['oak-young'], h=520)
    sheet('x04-oak-grown', ['oak-grown'], h=640)
    # and each oak without its swing, for before the swing is made (the swing hangs in open air, so it is a box to clear)
    for n, (x0, x1, y0, y1) in (('oak-young', (90, 169, 222, 370)), ('oak-grown', (540, 642, 386, 539))):
        im = Image.open(os.path.join(SPR, n + '.webp')).convert('RGBA'); a = np.asarray(im).copy(); a[y0:y1, x0:x1, 3] = 0
        Image.fromarray(a).save(os.path.join(SPR, n + '-plain.webp'), quality=88); print(n + '-plain')


if __name__ == '__main__':
    if '--peek' in sys.argv: peek(sys.argv[sys.argv.index('--peek') + 1]); sys.exit()
    only = sys.argv[sys.argv.index('--only') + 1] if '--only' in sys.argv else None
    for name, fn in [('strips', strips), ('crops', crops), ('healing', healing), ('animals', animals), ('farms', farms), ('extras', extras)]:
        if only in (None, name): fn()
