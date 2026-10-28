"""Take the pink fringe off cut-out sprites: the thin rim of magenta left by the background key (moth antennae, butterfly
wing edges, the wren's tail, the folk's hat edges, the fire ring's purple smear). Only pixels near the outline are touched,
and they are warmed to plain brown, not repainted, so ink lines stay dark and colours that are meant (Nettle's magenta hat)
keep their inside. Art consistency review, v72.
usage: python3 tools/defringe_sprites.py [--soft] sprites/vis-moth.webp ...   (in place; keeps lossless files lossless)
--soft: the faint pale-pink rim on light edges (the house roots, the hedgehog's spines): any purplish edge pixel, 2 px deep
"""
import sys
import numpy as np
from PIL import Image

def grow(m, r):
    for _ in range(r): m = m | np.roll(m, 1, 0) | np.roll(m, -1, 0) | np.roll(m, 1, 1) | np.roll(m, -1, 1)
    return m

def near_edge(al, r=3):
    return grow(al < 250, r) & (al > 0)

soft = '--soft' in sys.argv
for path in [p for p in sys.argv[1:] if p != '--soft']:
    lossless = b'VP8L' in open(path, 'rb').read(64)
    im = Image.open(path).convert('RGBA'); a = np.asarray(im).astype(np.float32)
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    pink = ((r > g + 5) & (b > g + 5)) if soft else (np.minimum(r, b) - g > 14)
    meant = grow(~grow(~(pink & (al > 250)), 3), 8)   # a pink or purple area with a solid inside (a hat, a dress, a flag) is painted that way: leave it
    m = near_edge(al, 2 if soft else 3) & pink & ~meant
    a[..., 2] = np.where(m, np.minimum(b, g * 0.8), b)
    a[..., 0] = np.where(m, np.minimum(r, g * 1.1 + 6), r)
    out = Image.fromarray(a.clip(0, 255).astype(np.uint8))
    out.save(path, **({'lossless': True, 'exact': True, 'method': 6} if lossless else {'quality': 90}))
    print(f'{path}: {int(m.sum())} pink edge pixels warmed{" (lossless)" if lossless else ""}')
