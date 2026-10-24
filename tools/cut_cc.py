"""Connected-component cutter for irregular sheets (no scipy).
usage: cut_cc.py sheet.jpg out_dir prefix [--thresh 0.42] [--join 6] [--minarea 600] [--scale 4]
"""
import sys, json, os
from collections import deque
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from cut_blobs import key_magenta

def main():
    args = sys.argv[1:]
    sheet, out_dir, prefix = args[:3]
    opts = {'--thresh': 0.42, '--join': 6, '--minarea': 600, '--scale': 4}
    for i in range(3, len(args), 2): opts[args[i]] = float(args[i + 1])
    s, j = int(opts['--scale']), int(opts['--join'])
    rgba = key_magenta(Image.open(sheet), opts['--thresh'])
    solid = rgba[..., 3] > 128
    H, W = solid.shape
    small = solid[:H//s*s, :W//s*s].reshape(H//s, s, W//s, s).any(axis=(1, 3))
    # dilate by join/s cells
    r = max(1, j // s)
    pad = np.pad(small, r)
    dil = np.zeros_like(small)
    for dy in range(-r, r+1):
        for dx in range(-r, r+1):
            dil |= pad[r+dy:r+dy+small.shape[0], r+dx:r+dx+small.shape[1]]
    lab = np.zeros(dil.shape, int); n = 0
    h, w = dil.shape
    for y in range(h):
        for x in range(w):
            if dil[y, x] and not lab[y, x]:
                n += 1; q = deque([(y, x)]); lab[y, x] = n
                while q:
                    cy, cx = q.popleft()
                    for ny, nx in ((cy-1,cx),(cy+1,cx),(cy,cx-1),(cy,cx+1)):
                        if 0 <= ny < h and 0 <= nx < w and dil[ny, nx] and not lab[ny, nx]:
                            lab[ny, nx] = n; q.append((ny, nx))
    boxes = []
    for k in range(1, n+1):
        ys, xs = np.where(lab == k)
        y0, y1, x0, x1 = ys.min()*s, (ys.max()+1)*s, xs.min()*s, (xs.max()+1)*s
        y0, x0 = max(0, y0 - s), max(0, x0 - s); y1, x1 = min(H, y1 + s), min(W, x1 + s)
        sub = solid[y0:y1, x0:x1]
        if sub.sum() < opts['--minarea']: continue
        yy, xx = np.where(sub)
        boxes.append([x0+xx.min(), y0+yy.min(), x0+xx.max()+1, y0+yy.max()+1])
    boxes.sort(key=lambda b: (round((b[1]+b[3])/2 / 150), b[0]))
    os.makedirs(out_dir, exist_ok=True); meta = []
    for i, b in enumerate(boxes):
        # mask pixels of other blobs inside this box: keep only this component's pixels (approx by bbox overlap is fine here)
        Image.fromarray(rgba[b[1]:b[3], b[0]:b[2]]).save(os.path.join(out_dir, f'{prefix}_{i:02d}.png'))
        meta.append({'file': f'{prefix}_{i:02d}.png', 'box': [int(v) for v in b]})
    json.dump(meta, open(os.path.join(out_dir, prefix + '.json'), 'w'), indent=1)
    print(f'{prefix}: {len(boxes)} pieces')
    for m in meta: print(' ', m['file'], m['box'], m['box'][2]-m['box'][0], 'x', m['box'][3]-m['box'][1])
main()
