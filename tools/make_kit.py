"""Cut the art-day ground kit (docs/ART-DAY-PLAN.md days 1-3) into the pieces the blended ground uses.
usage: python3 tools/make_kit.py <folder with the finished sw-*.jpg, st-*.jpg, marks.jpg ...> [--sheet out.jpg]
  swatches  sw-<name>.jpg   -> sprites/ground/<name>.webp: shrunk, squashed to the game's 2:1 slant, made to repeat without a seam
  stickers  st-<sheet>.jpg  -> sprites/ground/<sheet>-NN.webp (01..12 in reading order), magenta keyed out, edges softened
  kit       marks, stumps-rocks, leftovers, secrets-*  -> sprites/kit/<sheet>-NN.webp, for the clearing and little-finds jobs later
"""
import os, sys
import numpy as np
from PIL import Image, ImageFilter
sys.path.insert(0, os.path.dirname(__file__))
from cut_blobs import key_magenta
from pieces import pieces

ROOT = os.path.join(os.path.dirname(__file__), '..')
GROUND, KIT = os.path.join(ROOT, 'sprites/ground'), os.path.join(ROOT, 'sprites/kit')
SW = 280          # swatch width in world px: a square of ground about two and a half gnomes wide
SWATCHES = ('dirt', 'drygrass', 'grass', 'meadow', 'moss', 'path', 'pebbles', 'water', 'soil')
# sticker sheets are about 3200 px wide; about one fifth makes a tuft a third of a gnome. Woodland bits were painted big, so they shrink more.
STICKERS = {'st-bare': 0.2, 'st-grass': 0.17, 'st-flowers': 0.17, 'st-woodland': 0.12, 'st-water': 0.18, 'st-path': 0.2, 'st-seasons': 0.17}
KITS = {'marks': (8, 2, 0.4), 'stumps-rocks': (12, 2, 0.35), 'leftovers': (12, 3, 0.25), 'secrets-nature': (12, 3, 0.15), 'secrets-treasures': (12, 3, 0.15)}

def swatch(path, name):
    im = Image.open(path).convert('RGB')
    m = 40; w = SW + m; h = SW // 2 + m // 2
    a = np.asarray(im.resize((w, h * 2), Image.LANCZOS).resize((w, h), Image.LANCZOS)).astype(np.float32)   # shrink, then squash to the slant
    a = np.dstack([a, np.full(a.shape[:2], 255, np.float32)])
    s = seamless_xy(a, m, m // 2)
    Image.fromarray(s.clip(0, 255).astype(np.uint8)).save(os.path.join(GROUND, name + '.webp'), quality=90)
    return s

def seamless_xy(a, mx, my):   # like make_ground.seamless, with a different cross-fade width across and down
    h, w = a.shape[0] - my, a.shape[1] - mx
    tx = np.linspace(0, 1, mx, endpoint=False); ty = np.linspace(0, 1, my, endpoint=False)
    b = a[:, :w].copy(); b[:, :mx] = b[:, :mx] * tx[None, :, None] + a[:, w:w + mx] * (1 - tx[None, :, None])
    c = b[:h].copy();    c[:my] = c[:my] * ty[:, None, None] + b[h:h + my] * (1 - ty[:, None, None])
    return c

def soften(rgba):   # a one-pixel feather so stickers melt into the ground instead of looking cut out
    al = Image.fromarray(rgba[..., 3]).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    out = rgba.copy(); out[..., 3] = np.asarray(al); return out

def sheet(path, prefix, n, rows, scale, out_dir):
    got = pieces(key_magenta(Image.open(path)), n, rows=rows)
    if not got or len(got) < n: print(f'  {prefix}: found {len(got or [])} of {n}; skipped'); return []
    made = []
    for i, p in enumerate(got, 1):
        im = Image.fromarray(p); w, h = max(2, round(im.width * scale)), max(2, round(im.height * scale))
        im = Image.fromarray(soften(np.asarray(im.resize((w, h), Image.LANCZOS))))
        f = os.path.join(out_dir, f'{prefix}-{i:02d}.webp'); im.save(f, quality=90); made.append((f'{prefix}-{i:02d}', im))
    print(f'  {prefix}: {len(made)} pieces'); return made

def main():
    folder = sys.argv[1]; os.makedirs(GROUND, exist_ok=True); os.makedirs(KIT, exist_ok=True); made = []
    for n in SWATCHES:
        p = os.path.join(folder, f'sw-{n}.jpg')
        if os.path.exists(p): s = swatch(p, n); made.append((n, Image.fromarray(s.clip(0, 255).astype(np.uint8)), True)); print(f'  {n}.webp')
    for s, sc in STICKERS.items():
        p = os.path.join(folder, s + '.jpg')
        if os.path.exists(p): made += [(a, b, False) for a, b in sheet(p, s[3:], 12, 3, sc, GROUND)]
    for s, (n, rows, sc) in KITS.items():
        p = os.path.join(folder, s + '.jpg')
        if os.path.exists(p): made += [(a, b, False) for a, b in sheet(p, s, n, rows, sc, KIT)]
    if '--sheet' in sys.argv:   # contact sheet: swatches tiled 3x3 so a seam would show, pieces on a mid green
        tiles = []
        for name, im, sw in made:
            if sw:
                big = Image.new('RGBA', (im.width * 3, im.height * 3))
                for i in range(3):
                    for j in range(3): big.paste(im, (i * im.width, j * im.height))
                im = big
            bg = Image.new('RGBA', (max(im.width, 120) + 8, im.height + 20), (90, 105, 70, 255)); bg.alpha_composite(im.convert('RGBA'), (4, 16))
            from PIL import ImageDraw; ImageDraw.Draw(bg).text((4, 2), name, fill='white'); tiles.append(bg)
        W = 1600; x = y = rowh = 0; pos = []
        for t in tiles:
            if x + t.width > W: x = 0; y += rowh + 4; rowh = 0
            pos.append((x, y)); x += t.width + 4; rowh = max(rowh, t.height)
        out = Image.new('RGB', (W, y + rowh), (40, 40, 40))
        for t, p in zip(tiles, pos): out.paste(t.convert('RGB'), p)
        out.save(sys.argv[sys.argv.index('--sheet') + 1], quality=85)

main()
