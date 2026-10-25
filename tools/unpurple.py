"""Take the purple cast out of browns that soaked up the magenta background (wicker, wood, ink lines).
usage: python3 tools/unpurple.py sprites/fence.webp ...   (in place; only pinkish pixels: red above green, blue not below it)
"""
import sys
import numpy as np
from PIL import Image

for path in sys.argv[1:]:
    im = Image.open(path).convert('RGBA'); a = np.asarray(im).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = (r > g + 4) & (b > g - 3) & (a[..., 3] > 0)
    a[..., 2] = np.where(m, np.minimum(b, g * 0.82), b)        # blue under green, and red not far above it:
    a[..., 0] = np.where(m, np.minimum(r, g * 1.3 + 10), r)    # purple / pink browns -> plain warm brown
    Image.fromarray(a.clip(0, 255).astype(np.uint8)).save(path, **({'quality': 90} if path.endswith('.webp') else {}))
    print(f'{path}: {int(m.sum())} pixels warmed')
