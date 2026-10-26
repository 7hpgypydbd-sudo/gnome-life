"""Cut art day 11 greeting-card portraits (3x3 grid of rounded paintings on cream) into sprites/portrait-<id>.webp.
usage: cut_cards.py sprites/   (reads art-day-11/cards-1..3.jpg; order is listed in art-day-11/README.md)
Each card is found by its difference from the cream paper, cropped, given transparent rounded corners and stored at 360 px.
"""
import sys, numpy as np
from PIL import Image, ImageDraw
ORDER = [['robin','mouse','hedgehog','owl','ladybird','spirit','wren','rosella','butterfly'],
         ['snail','frog','dragonfly','possum','bluetongue','echidna','bandicoot','frogmouth','kookaburra'],
         ['nativebee','glowworm','moth','silvereye','kingfisher','beetle','cockatoo','wisp','rabbit']]
out = sys.argv[1]; S = 360
for n, ids in enumerate(ORDER, 1):
    im = Image.open(f'art-day-11/cards-{n}.jpg').convert('RGB'); W = im.width; c = W / 3
    a = np.asarray(im).astype(int); bg = np.median(a[:40, :40].reshape(-1, 3), axis=0)
    boxes = []
    for i, vid in enumerate(ids):
        x0, y0 = int((i % 3) * c), int((i // 3) * c)
        cell = a[y0:y0 + int(c), x0:x0 + int(c)]
        m = (np.abs(cell - bg).sum(axis=2) > 60)
        # drop thin paper-edge noise: use rows/cols with plenty of non-paper pixels
        cols = np.where(m.sum(0) > c * 0.25)[0]; rows = np.where(m.sum(1) > c * 0.25)[0]
        boxes.append((x0 + cols[0] + 3, y0 + rows[0] + 3, x0 + cols[-1] - 2, y0 + rows[-1] - 2))
    # pale skies can match the paper, so take each card's edges from the median of its row and column
    med = lambda v: int(np.median(v))
    for i, vid in enumerate(ids):
        r, k = i // 3, i % 3
        L = min([boxes[j * 3 + k][0] for j in range(3)])
        R = max([boxes[j * 3 + k][2] for j in range(3)]); T = min([boxes[r * 3 + j][1] for j in range(3)]); B = max([boxes[r * 3 + j][3] for j in range(3)])
        box = (L, T, R, B)
        p = im.crop(box).resize((S, round(S * (box[3] - box[1]) / (box[2] - box[0]))), Image.LANCZOS)
        mask = Image.new('L', (p.width * 4, p.height * 4), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, mask.width - 1, mask.height - 1], radius=int(S * 0.09) * 4, fill=255)
        p = p.convert('RGBA'); p.putalpha(mask.resize(p.size, Image.LANCZOS))
        p.save(f'{out}/portrait-{vid}.webp', quality=86); print(vid, box, p.size)
