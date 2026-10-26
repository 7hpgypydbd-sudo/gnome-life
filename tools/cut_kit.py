"""Cut a Nano Banana sheet into pieces by connected blobs (works for diagonal strips too).
usage: cut_kit.py sheet.jpg out_dir prefix [--grow 14] [--min 4000] [--thresh 0.42] [--soft 0.22] [--w 600]
Keys out magenta with proper un-mixing (no pink fringe), merges blobs closer than --grow px,
orders pieces row by row (top to bottom, then left to right), writes prefix-NN.webp (max width --w).
"""
import sys, os
import numpy as np
from PIL import Image

def key(im, thresh, soft):
    a = np.asarray(im.convert('RGB')).astype(np.float32) / 255
    mag = np.minimum(a[..., 0], a[..., 2]) - a[..., 1]
    alpha = np.clip((thresh - mag) / soft, 0, 1)
    M = np.array([1, 0, 1], np.float32)
    al = np.maximum(alpha, 0.05)[..., None]
    fg = np.clip((a - (1 - al) * M) / al, 0, 1)
    fg = np.where(alpha[..., None] < 1, fg, a)
    return fg, alpha

def label(mask):
    h, w = mask.shape
    lab = np.zeros((h, w), np.int32); n = 0
    for y in range(h):
        for x in range(w):
            if mask[y, x] and not lab[y, x]:
                n += 1; stack = [(y, x)]; lab[y, x] = n
                while stack:
                    cy, cx = stack.pop()
                    for dy in (-1, 0, 1):
                        for dx in (-1, 0, 1):
                            ny, nx = cy + dy, cx + dx
                            if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not lab[ny, nx]:
                                lab[ny, nx] = n; stack.append((ny, nx))
    return lab, n

def main():
    sheet, out, prefix = sys.argv[1:4]
    o = {'--grow': 14, '--min': 4000, '--thresh': 0.42, '--soft': 0.22, '--w': 600}
    for i in range(4, len(sys.argv), 2): o[sys.argv[i]] = float(sys.argv[i + 1])
    fg, alpha = key(Image.open(sheet), o['--thresh'], o['--soft'])
    H, W = alpha.shape
    S = 4
    small = (alpha[:H // S * S, :W // S * S].reshape(H // S, S, W // S, S).max(axis=(1, 3)) > 0.5)
    g = int(o['--grow'] // S * 1) or 1
    grown = small.copy()
    for dy in range(-g, g + 1):
        for dx in range(-g, g + 1):
            grown |= np.roll(np.roll(small, dy, 0), dx, 1)
    lab, n = label(grown)
    boxes = []
    for k in range(1, n + 1):
        ys, xs = np.where((lab == k) & small)
        if len(ys) * S * S < o['--min']: continue
        boxes.append([xs.min() * S, ys.min() * S, (xs.max() + 1) * S, (ys.max() + 1) * S, lab.copy() if False else k])
    # order by row bands then x
    boxes.sort(key=lambda b: (b[1] + b[3]) / 2)
    rows, cur = [], []
    for b in boxes:
        if cur and (b[1] + b[3]) / 2 - np.mean([(c[1] + c[3]) / 2 for c in cur]) > 0.5 * (b[3] - b[1]) + 0.01 * H: rows.append(cur); cur = []
        cur.append(b)
    if cur: rows.append(cur)
    ordered = [b for r in rows for b in sorted(r, key=lambda b: (b[0] + b[2]) / 2)]
    os.makedirs(out, exist_ok=True)
    rgba = (np.dstack([fg, alpha[..., None]]) * 255).astype(np.uint8)
    for i, b in enumerate(ordered, 1):
        x0, y0, x1, y1, k = b
        # keep only pixels of this blob (so neighbouring strips do not leak in)
        own = np.kron(lab == k, np.ones((S, S), bool))
        own = np.pad(own, ((0, max(0, H - own.shape[0])), (0, max(0, W - own.shape[1]))))[:H, :W]
        piece = rgba[y0:y1, x0:x1].copy()
        piece[..., 3] = np.where(own[y0:y1, x0:x1], piece[..., 3], 0)
        im = Image.fromarray(piece)
        bb = im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
        if bb: im = im.crop(bb)
        if im.width > o['--w']: im = im.resize((int(o['--w']), int(im.height * o['--w'] / im.width)), Image.LANCZOS)
        im.save(os.path.join(out, f'{prefix}-{i:02d}.webp'), quality=88)
        print(f'{prefix}-{i:02d}', im.size)

main()
