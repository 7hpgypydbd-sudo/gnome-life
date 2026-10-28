"""Peel the white sticker border off icons painted with one (the crop icons: carrot, lettuce, bean, pumpkin), so they match
the other store icons, which have none. Pale, nearly colourless pixels are taken away from the outside in, a few rings deep;
the cream inside a picture is never reached because the peel stops at the first ring of real colour. Art consistency review, v72.
usage: python3 tools/unsticker.py sprites/icon-carrot.webp ...   (in place)
"""
import sys
import numpy as np
from PIL import Image

for path in sys.argv[1:]:
    im = Image.open(path).convert('RGBA'); a = np.asarray(im).astype(np.float32)
    rgb, al = a[..., :3], a[..., 3]
    mx, mn = rgb.max(-1), rgb.min(-1)
    pale = (mn > 175) & (mx - mn < 50)   # white to cream paper
    out = al < 40; n = 0
    for _ in range(14):   # peel ring by ring from the outside
        ring = (out | np.roll(out, 1, 0) | np.roll(out, -1, 0) | np.roll(out, 1, 1) | np.roll(out, -1, 1)) & ~out
        peel = ring & (pale | (al < 200))
        if not peel.any(): break
        out |= peel; n += int(peel.sum())
    # soften the new edge by one pixel so it is not jagged
    edge = (np.roll(out, 1, 0) | np.roll(out, -1, 0) | np.roll(out, 1, 1) | np.roll(out, -1, 1)) & ~out
    a[..., 3] = np.where(out, 0, np.where(edge, al * 0.6, al))
    Image.fromarray(a.clip(0, 255).astype(np.uint8)).save(path, quality=90)
    print(f'{path}: {n} border pixels peeled')
