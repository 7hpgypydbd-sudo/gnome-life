"""Cut art day 10 (woodpile stages, spring, rabbit poses) by hand-picked column ranges.
usage: cut_day10.py woodpile.jpg spring.jpg rabbit.jpg sprites/
Column ranges are in a 1100-px-wide view of the 2752-px sheets. Pieces are keyed from magenta, cropped, and stored at 25% size.
"""
import sys, numpy as np
from PIL import Image

def key(im, thresh=0.42, soft=0.22):
    a = np.asarray(im.convert('RGB')).astype(np.float32) / 255
    mag = np.minimum(a[..., 0], a[..., 2]) - a[..., 1]
    alpha = np.clip((thresh - mag) / soft, 0, 1)
    M = np.array([1, 0, 1], np.float32); al = np.maximum(alpha, 0.05)[..., None]
    fg = np.clip((a - (1 - al) * M) / al, 0, 1); fg = np.where(alpha[..., None] < 1, fg, a)
    return np.dstack([fg, alpha[..., None]])

def cut(path, ranges, names, out, k=0.25):
    im = Image.open(path); sx = im.width / 1100
    rgba = key(im)
    for (a, b), n in zip(ranges, names):
        piece = Image.fromarray((rgba[:, int(a * sx):int(b * sx)] * 255).astype(np.uint8))
        bb = piece.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
        piece = piece.crop(bb); piece = piece.resize((round(piece.width * k), round(piece.height * k)), Image.LANCZOS)
        piece.save(f'{out}/{n}.webp', quality=88); print(n, piece.size)

wood, spring, rabbit, out = sys.argv[1:5]
cut(wood, [(10, 380), (385, 730), (735, 1085)], ['woodpile-1', 'woodpile-2', 'woodpile-3'], out)
cut(spring, [(20, 545), (560, 1085)], ['spring-choked', 'spring-clear'], out)
cut(rabbit, [(15, 250), (270, 500), (510, 680), (685, 900), (915, 1075)], ['rabbit-dish', 'rabbit-nibble', 'rabbit-sit', 'rabbit-nap', 'rabbit-berry'], out)
