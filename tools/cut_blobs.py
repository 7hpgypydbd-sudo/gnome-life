"""Key out magenta and cut each figure from a Nano Banana sprite sheet by gaps.
usage: cut_blobs.py sheet.jpg out_dir prefix [--thresh 0.42] [--gap 8] [--minsize 40]
Splits into row bands (horizontal gaps of empty alpha), then columns within each band.
Writes prefix_NN.png (RGBA, cropped) and prefix.json.
"""
import sys, json, os
import numpy as np
from PIL import Image

def key_magenta(im, thresh=0.42, soft=0.22):
    a = np.asarray(im.convert('RGB')).astype(np.float32) / 255
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mag = np.minimum(r, b) - g
    alpha = np.clip((thresh - mag) / soft, 0, 1)
    rgb = a.copy()
    fringe = (alpha > 0) & (alpha < 1)
    rgb[fringe, 0] = np.minimum(rgb[fringe, 0], (rgb[fringe, 1] + rgb[fringe, 2]) / 2 + 0.15)
    rgb[fringe, 2] = np.minimum(rgb[fringe, 2], (rgb[fringe, 1] + rgb[fringe, 0]) / 2 + 0.15)
    return (np.dstack([rgb, alpha[..., None]]) * 255).astype(np.uint8)

def runs(mask1d, gap, minsize):
    """Return [start,end) spans of True separated by gaps >= gap, dropping spans < minsize."""
    spans, start, last = [], None, None
    for i, v in enumerate(mask1d):
        if v:
            if start is None: start = i
            elif i - last > gap: spans.append((start, last + 1)); start = i
            last = i
    if start is not None: spans.append((start, last + 1))
    return [s for s in spans if s[1] - s[0] >= minsize]

def main():
    args = sys.argv[1:]
    sheet, out_dir, prefix = args[:3]
    opts = {'--thresh': 0.42, '--gap': 8, '--minsize': 40}
    for i in range(3, len(args), 2): opts[args[i]] = float(args[i + 1])
    gap, minsize = int(opts['--gap']), int(opts['--minsize'])
    rgba = key_magenta(Image.open(sheet), opts['--thresh'])
    solid = rgba[..., 3] > 128
    # strip stray specks: require a few pixels per row/col
    rowmask = solid.sum(axis=1) > 2
    boxes, rows = [], runs(rowmask, gap, minsize)
    for ri, (y0, y1) in enumerate(rows):
        band = solid[y0:y1]
        colmask = band.sum(axis=0) > 2
        for (x0, x1) in runs(colmask, gap, minsize):
            sub = band[:, x0:x1]
            ys = np.where(sub.any(axis=1))[0]
            boxes.append((ri, [x0, y0 + ys.min(), x1, y0 + ys.max() + 1]))
    os.makedirs(out_dir, exist_ok=True)
    meta = []
    for i, (ri, b) in enumerate(boxes):
        Image.fromarray(rgba[b[1]:b[3], b[0]:b[2]]).save(os.path.join(out_dir, f'{prefix}_{i:02d}.png'))
        meta.append({'file': f'{prefix}_{i:02d}.png', 'row': ri, 'box': [int(v) for v in b]})
    json.dump(meta, open(os.path.join(out_dir, prefix + '.json'), 'w'), indent=1)
    print(f'{prefix}: {len(boxes)} pieces in {len(rows)} rows')
    for m in meta: print(' ', m['file'], 'row', m['row'], m['box'], m['box'][2]-m['box'][0], 'x', m['box'][3]-m['box'][1])

if __name__ == '__main__':
    main()
