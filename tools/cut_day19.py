"""Art day 19: cut the W+H bench and compost heap off magenta, crop the three store shelf paintings.
Usage: python3 tools/cut_day19.py <art-day-19/painted> <out dir (sprites/)>"""
import sys, os
import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]

def key(path):
    a = np.asarray(Image.open(path).convert('RGB')).astype(np.float32) / 255
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mag = np.minimum(r, b) - g
    al = np.clip((0.42 - mag) / 0.22, 0, 1)
    # un-mix the magenta from half-covered edge pixels
    m = np.array([252, 12, 249], np.float32) / 255
    safe = np.maximum(al, 0.05)[..., None]
    rgb = np.clip((a - (1 - al[..., None]) * m) / safe, 0, 1)
    im = Image.fromarray(np.dstack([rgb * 255, al * 255]).astype(np.uint8), 'RGBA')
    ys, xs = np.where(al > 0.1)
    return im.crop((xs.min() - 4, ys.min() - 4, xs.max() + 5, ys.max() + 5))

def save(im, name, w):
    h = round(im.height * w / im.width)
    im.resize((w, h), Image.LANCZOS).save(os.path.join(out, name + '.webp'), quality=88, method=6)
    print(name, w, h)

save(key(os.path.join(src, '01-bench.jpeg')), 'bench-wh', 560)
save(key(os.path.join(src, '05-compost.jpeg')), 'compost-heap', 420)
# store shelves: the paintings are used whole (cream margins and all) behind the store grid
for n, slot in [('02-store-shelter', 'store-1'), ('03-store-stump', 'store-2'), ('04-store-gnomestead', 'store-3')]:
    im = Image.open(os.path.join(src, n + '.jpeg')).convert('RGB')
    im.resize((720, 964), Image.LANCZOS).save(os.path.join(out, slot + '.webp'), quality=80, method=6)
    print(slot)
