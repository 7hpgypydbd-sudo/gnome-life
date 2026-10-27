"""Cut art day 14 (art-day-14/painted/*.jpg, raw Gemini pictures on magenta) into the game's files.
usage: python3 tools/cut_day14.py [--only strips|props|sit|makes|pages|kit]
Everything is written under sprites/ (gnome strips also update sprites/gnomes.json: re-paste it into index.html after).
Sizes are chosen to match the game: a gnome strip is scaled so the gnome is 240 sprite px tall like the other acts.
"""
import sys, os, json
import numpy as np
from PIL import Image
from scipy import ndimage
sys.path.insert(0, os.path.dirname(__file__))
from cut_blobs import key_magenta, runs

ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'art-day-14', 'painted')
SPR = os.path.join(ROOT, 'sprites')
TARGET_H = 240


def load(name, half=False):
    im = Image.open(os.path.join(SRC, name + '.jpg')).convert('RGB')
    if half: im = im.resize((im.width // 2, im.height // 2), Image.LANCZOS)
    return im


def key(im, thresh=0.42, soft=0.22):   # keyed with proper un-mixing so there is no pink fringe
    a = np.asarray(im.convert('RGB')).astype(np.float32) / 255
    mag = np.minimum(a[..., 0], a[..., 2]) - a[..., 1]
    alpha = np.clip((thresh - mag) / soft, 0, 1)
    M = np.array([1, 0, 1], np.float32); al = np.maximum(alpha, 0.05)[..., None]
    fg = np.clip((a - (1 - al) * M) / al, 0, 1); fg = np.where(alpha[..., None] < 1, fg, a)
    return (np.dstack([fg, alpha[..., None]]) * 255).astype(np.uint8)


def crop_alpha(rgba, pad=0):
    ys, xs = np.where(rgba[..., 3] > 8)
    return rgba[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def save_webp(arr, path, width=None, k=None, quality=88):
    im = Image.fromarray(crop_alpha(arr))
    if k: im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    elif width: im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(path, quality=quality); print(os.path.relpath(path, ROOT), im.size); return im.size


def single(name, out, width):   # one piece on magenta -> one cropped webp of a given width
    save_webp(key(load(name)), os.path.join(SPR, out + '.webp'), width=width)


def quarters(rgba, n=4):   # split a row of n frames at the emptiest column near each even line
    solid = rgba[..., 3] > 128; prof = solid.sum(0); L = len(prof); cuts = [0]
    for k in range(1, n):
        c = L * k // n; lo, hi = c - L // (n * 4), c + L // (n * 4); cuts.append(lo + int(np.argmin(prof[lo:hi])))
    cuts.append(L); return list(zip(cuts, cuts[1:]))


def pack_strip(frames, who, act, atlas):   # frames: list of RGBA arrays -> sprites/<who>-<act>.webp (4 cells side by side)
    ims = [Image.fromarray(crop_alpha(f)) for f in frames]
    s = TARGET_H / max(i.height for i in ims)
    ims = [i.resize((round(i.width * s), round(i.height * s)), Image.LANCZOS) for i in ims]
    cw = max(i.width for i in ims) + 4; ch = max(i.height for i in ims) + 2
    strip = Image.new('RGBA', (cw * len(ims), ch))
    for i, f in enumerate(ims): strip.paste(f, (i * cw + (cw - f.width) // 2, ch - f.height), f)
    strip.save(os.path.join(SPR, f'{who}-{act}.webp'), lossless=True, exact=True, method=6)
    atlas[who]['acts'][act] = {'n': len(ims), 'cell': [cw, ch]}; print(who, act, cw, ch)


def strips():
    atlas = json.load(open(os.path.join(SPR, 'gnomes.json')))
    # Wendel dowsing: four frames in a row
    rgba = key_magenta(load('b1-01-him-dowse', half=True), 0.42)
    pack_strip([rgba[:, a:b] for a, b in quarters(rgba)], 'him', 'dowse', atlas)
    # Hazel tipping berries into the dish: the painting has its own stump and bowl in each frame. The game has its own dish, so the stump
    # and bowl are taken out and the apron it overlapped is carried on to its own edge.
    rgba = key(load('b1-17-dish-fill', half=True)); frames = []
    for a, b in quarters(rgba):
        f = rgba[:, a:b].copy(); H = f.shape[0]
        cream = (f[..., 0] > 225) & (f[..., 1] > 205) & (f[..., 2] > 160) & (f[..., 0].astype(int) - f[..., 2] < 80) & (f[..., 3] > 200)
        rows = np.arange(int(H * 0.72), int(H * 0.82))   # rows level with the stump's side
        edge = int(np.median([np.where(cream[y])[0].max() for y in rows if cream[y].any()]))   # where the apron meets the stump
        above = np.arange(int(H * 0.50), int(H * 0.58))   # the apron's own front edge, above the stump
        xr = min(int(np.median([np.where(cream[y])[0].max() for y in above if cream[y].any()])), edge + 14)
        top = int(H * 0.60)   # just above the bowl rim: nothing of Hazel is lower than the bowl but her skirt and boots
        hem = max(y for y in range(top, H) if cream[y, edge - 8:edge].any())
        keep = f[..., :3].copy(); f[top:, edge + 2:, 3] = 0
        for y in range(top, hem + 1):   # carry the apron on to its own front edge, with a thin ink line
            x1 = xr - (y - top) // 40; f[y, edge:x1, :3] = keep[y, edge - 4, :]; f[y, edge:x1, 3] = 255; f[y, x1:x1 + 2, :3] = (92, 62, 46); f[y, x1:x1 + 2, 3] = 255
        f[hem:hem + 2, edge:xr, :3] = (92, 62, 46); f[hem:hem + 2, edge:xr, 3] = 255
        f[..., 3] = np.where(f[..., 3] > 0, f[..., 3], 0)
        frames.append(f)
    pack_strip(frames, 'her', 'fill', atlas)
    json.dump(atlas, open(os.path.join(SPR, 'gnomes.json'), 'w'), indent=1)


def sit():
    # the couple on the bench: four small frames (the big middle one is not used); each has its own bench so it replaces the plain bench while they sit
    rgba = key(load('b4-03-couple-sit-loop'), 0.42)
    H, W = rgba.shape[:2]; solid = rgba[..., 3] > 100; ims = []
    # the small frames sit in the corners (pointing, resting, laughing); the big picture between them touches the first (smoke) one, so that one is left out and
    # the loop runs pointing, resting, laughing, resting
    for x0, x1, y0, y1 in [(.69, 1, 0, .5), (0, .25, .5, 1), (.775, 1, .5, 1), (0, .25, .5, 1)]:
        box = np.zeros_like(solid); box[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)] = True
        lab, k = ndimage.label(solid & box); big = 1 + int(np.argmax(ndimage.sum(solid, lab, range(1, k + 1)))); keep = lab == big
        ys, xs = np.where(keep); f = rgba[ys.min():ys.max() + 1, xs.min():xs.max() + 1].copy()
        f[..., 3] = np.where(keep[ys.min():ys.max() + 1, xs.min():xs.max() + 1], f[..., 3], 0); ims.append(f)
    hs = [f.shape[0] for f in ims]; target = int(np.mean(hs))
    out = []
    for f in ims:   # same height, and the bench legs (bottom rows) lined up from frame to frame
        im = Image.fromarray(f); s = target / im.height; im = im.resize((round(im.width * s), target), Image.LANCZOS); a = np.asarray(im)
        low = a[int(target * 0.9):, :, 3] > 100; cx = np.where(low.any(0))[0]; out.append((im, (cx.min() + cx.max()) / 2))
    left = int(max(c for _, c in out)); right = int(max(i.width - c for i, c in out)); cw = left + right + 2
    strip = Image.new('RGBA', (cw * 4, target))
    for n, (im, c) in enumerate(out): strip.paste(im, (n * cw + left - int(c), 0), im)
    strip.save(os.path.join(SPR, 'sit-couple.webp'), lossless=True, exact=True, method=6); print('sit-couple', strip.size, 'frame', cw, target, 'bench centre at', round(left / cw, 3), 'of the frame width')
    # bench width = the plank in the frames (from the legs), measured against the sitting height so the plain bench can match
    im, c = out[0]; low = np.asarray(im)[int(target * 0.55):, :, 3] > 100; cols = np.where(low.any(0))[0]
    print('bench width / frame height ~', (cols.max() - cols.min()) / target)


def props():
    single('b4-01-bench-small', 'yard-bench', 360)
    single('b1-04-wheelbarrow-small', 'wheelbarrow', 261)
    single('b1-05-toad-legs', 'toad-legs', 380)
    single('b1-06-toad-house', 'toad-house', 380)
    single('b1-07-pond', 'pond', 520)
    for num, n in ((8, 'float'), (9, 'point'), (10, 'settle')): single(f'b1-{num:02d}-spirit-{n}', f'spirit-{n}', 220)
    single('b1-13-fix-orchard', 'bld-pebbleworth', 260)
    single('b1-14-fix-stickpile', 'stick-pile', 240)
    # the Barnaby page: a painting, not a cut-out
    im = load('b1-15-fix-barnaby'); im = im.resize((1200, round(im.height * 1200 / im.width)), Image.LANCZOS); im.save(os.path.join(SPR, 'story-barnaby.webp'), quality=84)


def kit():
    # stream banks and path edges replace the old kit strips (same names, the ground bakes them in as stickers)
    import subprocess
    for name, prefix, base in [('b1-11-edges-stream', 'edge', 0), ('b1-12-edges-path', 'edge', 3)]:
        tmp = os.path.join(ROOT, 'art-day-14', '_cut'); os.makedirs(tmp, exist_ok=True)
        subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'cut_kit.py'), os.path.join(SRC, name + '.jpg'), tmp, prefix, '--grow', '4', '--min', '4000', '--w', '700'], check=True)
        for i in range(1, 4):
            im = Image.open(os.path.join(tmp, f'{prefix}-{i:02d}.webp')).convert('RGBA'); a = np.asarray(im).astype(np.int16)
            soft = a[..., 3] < 250   # the thin see-through rim keeps a pink tint from the magenta: pull it back to the colours next to it
            a[..., 0] = np.where(soft, np.minimum(a[..., 0], a[..., 1] + 12), a[..., 0]); a[..., 2] = np.where(soft, np.minimum(a[..., 2], a[..., 1] - 6), a[..., 2])
            Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(os.path.join(SPR, 'kit', f'edge-{base + i:02d}.webp'), quality=88); os.remove(os.path.join(tmp, f'{prefix}-{i:02d}.webp'))
    os.rmdir(os.path.join(ROOT, 'art-day-14', '_cut'))


# the 33 little makes, in the order painted on each sheet (pieces the painter added that were not asked for are skipped by index)
MAKES = {
    'b2-01-yard-1': ['firering', 'potstools', 'spinner', 'scraper', 'doorpots', 'doormat', 'scarecrow', 'pebbles', 'daisypot'],
    'b2-02-yard-2': ['sundial', 'herbpots', 'wreath', None, 'plank', 'chime', 'nameboard', 'cushion', None],
    'b2-03-yard-3': ['swing', 'hammock', 'sign'],
    'b2-04-garden-1': ['gstones', 'wicket', 'mousering', 'sitstone', 'wildflowers'],
    'b2-05-garden-2': ['border', 'arch', None, 'mousetable', 'stonefrog', 'birddish'],
    'b2-06-garden-3': ['logbench', 'ferns', 'willowseat', 'pebblepath'],
}
MAKE_K = 0.3   # sheet pixels -> sprite pixels, the same for every little make so they keep the sizes the painter gave them


def makes():
    import subprocess
    tmp = os.path.join(ROOT, 'art-day-14', '_cut'); os.makedirs(tmp, exist_ok=True)
    sizes = {}
    for sheet, ids in MAKES.items():
        subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'cut_kit.py'), os.path.join(SRC, sheet + '.jpg'), tmp, 'p', '--grow', '14', '--min', '4000', '--w', '4000'], check=True, stdout=subprocess.DEVNULL)
        for i, mid in enumerate(ids, 1):
            f = os.path.join(tmp, f'p-{i:02d}.webp')
            if mid:
                im = Image.open(f).convert('RGBA'); im = im.resize((round(im.width * MAKE_K), round(im.height * MAKE_K)), Image.LANCZOS)
                im.save(os.path.join(SPR, f'make-{mid}.webp'), quality=88); sizes[mid] = im.size
            os.remove(f)
    os.rmdir(tmp); print(json.dumps(sizes))


def pages():
    for fn in sorted(os.listdir(SRC)):
        if not fn.startswith('b3-'): continue
        n = fn[:-4].split('-')[2:]; pid = n[0][1] + '-' + n[1]   # b3-01-p1-1 -> page-1-1
        im = Image.open(os.path.join(SRC, fn)).convert('RGB'); im = im.resize((1200, round(im.height * 1200 / im.width)), Image.LANCZOS)
        im.save(os.path.join(SPR, f'page-{pid}.webp'), quality=82); print('page-' + pid, im.size)


if __name__ == '__main__':
    only = sys.argv[sys.argv.index('--only') + 1] if '--only' in sys.argv else None
    for name, fn in [('strips', strips), ('props', props), ('sit', sit), ('kit', kit), ('makes', makes), ('pages', pages)]:
        if only in (None, name): fn()
