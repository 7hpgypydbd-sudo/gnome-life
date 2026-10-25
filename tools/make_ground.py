"""Cut the small ground pieces for the blended ground out of the painted tiles we already have (no new paintings).
usage: python3 tools/make_ground.py            -> writes sprites/ground/*.webp (+ a contact sheet with --sheet out.jpg)

Three kinds of piece:
  swatch  - a plain patch of ground, made to repeat seamlessly (its edges cross-fade into each other)
  strip   - a long band unrolled along a painted stream / path / creek bed, repeating along its length.
            "along" follows one of the map's two diagonal directions and "across" follows the other, so the game can
            lay it back down the same way without shearing the painting
  sticker - a small piece (tuft, pebbles, reeds) with a soft round edge, laid over ground of the same colour
Coordinates are pixels in the 1225x728 tiles in sprites/.
"""
import os, sys
import numpy as np
from PIL import Image, ImageFilter

SRC, OUT = 'sprites', 'sprites/ground'
EX = np.array([609.0, 346.0]); EY = np.array([-609.0, 345.0])   # one tile east / south on screen (as PLOT in index.html)
EXh, EYh = EX / np.hypot(*EX), EY / np.hypot(*EY)

SWATCHES = {   # name: (tile, x0, y0, x1, y1). The crop is a little bigger than the swatch; the extra is used for the cross-fade
  'dirt':     ('tile-barren-plain', 690, 410, 890, 512),
  'drygrass': ('tile-barren-plain', 880, 262, 1084, 342),
  'grass':    ('tile-meadow',       430, 150, 612, 238),
  'meadow':   ('tile-meadow',       690, 370, 990, 520),
  'moss':     ('tile-woodland',     620, 255, 820, 345),
}
STRIPS = {     # name: (tile, start, end, along-axis, half width). The band is unrolled between start and end
  'water':    ('tile-stream',       (452, 264), (626, 362), 'EX', 12),
  'creekbed': ('tile-barren-creek', (300, 460), (900, 200), '-EY', 50),
  'path':     ('tile-path',         (400, 190), (880, 530), 'EX', 38),
}
STICKERS = {   # name: (tile, cx, cy, rx, ry)
  'tuft-dry-1':  ('tile-barren-plain', 560, 92, 26, 16),
  'tuft-dry-2':  ('tile-barren-plain', 940, 330, 30, 18),
  'tuft-dry-3':  ('tile-barren-creek', 690, 70, 26, 16),
  'pebbles-1':   ('tile-barren-plain', 830, 400, 22, 14),
  'pebbles-2':   ('tile-barren-plain', 520, 214, 34, 20),
  'reeds':       ('tile-barren-creek', 668, 228, 40, 50),
  'clover':      ('tile-meadow',       530, 125, 40, 30),
  'daisy':       ('tile-meadow',       540, 478, 26, 26),
  'buttercup':   ('tile-meadow',       800, 470, 40, 34),
  'rock-moss':   ('tile-stream',       530, 225, 54, 36),
  'leaf':        ('tile-woodland',     478, 128, 34, 22),
  'mushrooms':   ('tile-woodland',     392, 410, 50, 58),
  'fern':        ('tile-woodland',     880, 425, 80, 60),
  'tuft-big':    ('tile-meadow',       345, 410, 95, 95),
  'boulder':     ('tile-meadow',       775, 290, 140, 95),
}

def load(name): return np.asarray(Image.open(f'{SRC}/{name}.webp').convert('RGBA')).astype(np.float32)

def seamless(a, m):
    """a: (h+m, w+m) crop -> (h, w) patch that wraps. The last m columns/rows cross-fade over the first ones."""
    h, w = a.shape[0] - m, a.shape[1] - m
    t = np.linspace(0, 1, m, endpoint=False)
    b = a[:, :w].copy(); b[:, :m] = b[:, :m] * t[None, :, None] + a[:, w:w + m] * (1 - t[None, :, None])
    c = b[:h].copy();    c[:m] = c[:m] * t[:, None, None] + b[h:h + m] * (1 - t[:, None, None])
    return c

def unroll(img, p0, p1, axis, hw):
    """Sample the tile along p0->p1 (length = |p1-p0|), across = the other map diagonal, giving (2hw, len)."""
    p0, p1 = np.array(p0, float), np.array(p1, float); L = int(np.hypot(*(p1 - p0)))
    A = (p1 - p0) / np.hypot(*(p1 - p0))
    B = {'EX': EYh, '-EY': EXh}[axis]
    pil = Image.fromarray(img.astype(np.uint8))
    data = (A[0], B[0], p0[0] - hw * B[0], A[1], B[1], p0[1] - hw * B[1])
    return np.asarray(pil.transform((L, 2 * hw), Image.AFFINE, data, Image.BICUBIC)).astype(np.float32)

def save(a, name):
    Image.fromarray(a.clip(0, 255).astype(np.uint8)).save(f'{OUT}/{name}.webp', quality=88)

def main():
    os.makedirs(OUT, exist_ok=True); made = []
    for n, (t, x0, y0, x1, y1) in SWATCHES.items():
        a = load(t)[y0:y1, x0:x1]; m = min(40, (x1 - x0) // 4, (y1 - y0) // 4)
        s = seamless(a, m); s[..., 3] = 255; save(s, n); made.append((n, s, 'swatch'))
    for n, (t, p0, p1, ax, hw) in STRIPS.items():
        a = unroll(load(t), p0, p1, ax, hw); m = min(60, a.shape[1] // 4)
        t_ = np.linspace(0, 1, m, endpoint=False); w = a.shape[1] - m
        s = a[:, :w].copy(); s[:, :m] = s[:, :m] * t_[None, :, None] + a[:, w:w + m] * (1 - t_[None, :, None])   # wrap along the length only
        s[..., 3] = 255; save(s, 'strip-' + n); made.append(('strip-' + n, s, 'strip'))
    for n, (t, cx, cy, rx, ry) in STICKERS.items():
        a = load(t)[cy - ry:cy + ry, cx - rx:cx + rx].copy()
        yy, xx = np.mgrid[-ry:ry, -rx:rx]; d = np.hypot(xx / rx, yy / ry)
        mask = np.clip((1 - d) / 0.45, 0, 1); mask = mask * mask * (3 - 2 * mask)   # soft round edge
        a[..., 3] = a[..., 3] * mask; save(a, 'st-' + n); made.append(('st-' + n, a, 'sticker'))
    print('made', len(made), 'pieces in', OUT)
    if '--sheet' in sys.argv:
        out = sys.argv[sys.argv.index('--sheet') + 1]
        tiles = []
        for n, a, kind in made:
            im = Image.fromarray(a.clip(0, 255).astype(np.uint8))
            if kind == 'swatch':   # 3x3 repeat, so any seam would show
                big = Image.new('RGBA', (im.width * 3, im.height * 3))
                for i in range(3):
                    for j in range(3): big.paste(im, (i * im.width, j * im.height))
                im = big
            elif kind == 'strip':
                big = Image.new('RGBA', (im.width * 3, im.height)); [big.paste(im, (i * im.width, 0)) for i in range(3)]; im = big
            im.thumbnail((600, 400)); bg = Image.new('RGBA', (620, im.height + 24), (40, 40, 40, 255)); bg.alpha_composite(im, (10, 20))
            from PIL import ImageDraw; ImageDraw.Draw(bg).text((10, 4), n, fill='white'); tiles.append(bg)
        H = sum(t.height for t in tiles[:len(tiles) // 2 + 1]); sheet = Image.new('RGB', (1240, max(H, sum(t.height for t in tiles[len(tiles) // 2 + 1:]))), (40, 40, 40))
        y = [0, 0]
        for i, t in enumerate(tiles):
            c = 0 if i <= len(tiles) // 2 else 1; sheet.paste(t.convert('RGB'), (c * 620, y[c])); y[c] += t.height
        sheet.save(out, quality=80)

main()
