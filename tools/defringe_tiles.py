"""Remove the pink/magenta fringe left on painted tile edges by the magenta key.
usage: python3 tools/defringe_tiles.py sprites/tile-*.webp sprites/plot-barren.webp
Each pinkish pixel within a few pixels of the outline takes the average colour of its clean neighbours (alpha is kept). Writes the files in place.
"""
import sys
import numpy as np
from PIL import Image

def defringe(path, passes=6):
    im = Image.open(path).convert('RGBA'); a = np.asarray(im).astype(np.float32)
    rgb, al = a[..., :3], a[..., 3]
    near = al < 255   # only near the tile's outline (so painted pink flowers stay pink)
    for _ in range(5): near = near | np.roll(near, 1, 0) | np.roll(near, -1, 0) | np.roll(near, 1, 1) | np.roll(near, -1, 1)
    bad = (np.minimum(rgb[..., 0], rgb[..., 2]) - rgb[..., 1] > 18) & (al > 0) & near
    n0 = int(bad.sum())
    for _ in range(passes):
        if not bad.any(): break
        good = (~bad) & (al > 200)
        acc = np.zeros_like(rgb); cnt = np.zeros(al.shape, np.float32)
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                g = np.roll(np.roll(good, dy, 0), dx, 1); c = np.roll(np.roll(rgb, dy, 0), dx, 1)
                acc += c * g[..., None]; cnt += g
        fix = bad & (cnt > 0)
        rgb[fix] = acc[fix] / cnt[fix][:, None]; bad &= ~fix
    rgb[bad, 2] = np.minimum(rgb[bad, 2], rgb[bad, 1]); rgb[bad, 0] = np.minimum(rgb[bad, 0], rgb[bad, 1] + 30)   # leftovers: just take the pink out
    Image.fromarray(np.dstack([rgb, al]).clip(0, 255).astype(np.uint8)).save(path, quality=90)
    print(f'{path}: {n0} pink pixels fixed')

if __name__ == '__main__':
    for p in sys.argv[1:]: defringe(p)
