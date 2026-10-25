"""Split a keyed sprite sheet (RGBA array) into its separate pieces by connected areas, not by straight gaps,
so pieces whose outlines overlap side to side (a beak past a tail, a stick across a neighbour) still come apart.
Small bits (a puff of smoke, a loose stick, a pebble) join the nearest big piece. Pieces come back in reading order.
"""
import numpy as np
from scipy import ndimage

def pieces(rgba, n, rows=1, join=4, keep_small=0.004):
    solid = rgba[..., 3] > 100
    lab, k = ndimage.label(ndimage.binary_dilation(solid, iterations=join))
    if k == 0: return None
    area = ndimage.sum(solid, lab, range(1, k + 1))
    while (area > 0.02 * solid.sum()).sum() < n:   # two pieces touch: cut the widest one at its thinnest column
        b = int(np.argmax([np.ptp(np.where(lab == i + 1)[1]) if area[i] > 0.02 * solid.sum() else 0 for i in range(k)])) + 1
        xs = np.where((lab == b).any(axis=0))[0]; x0, x1 = xs.min(), xs.max()
        cols = ((lab == b) & solid).sum(axis=0)[x0 + (x1 - x0) // 4: x1 - (x1 - x0) // 4]
        cut = x0 + (x1 - x0) // 4 + int(np.argmin(cols))
        k += 1; lab[:, cut:][lab[:, cut:] == b] = k
        area = ndimage.sum(solid, lab, range(1, k + 1))
    order = np.argsort(area)[::-1]
    big = [i + 1 for i in order[:n]]
    cents = {b: ndimage.center_of_mass(lab == b) for b in big}
    groups = {b: [b] for b in big}
    total = solid.sum()
    for i in order[n:]:   # small bits: join the nearest big piece if worth keeping
        if area[i] < keep_small * total: continue
        c = ndimage.center_of_mass(lab == i + 1)
        b = min(big, key=lambda b: (cents[b][0] - c[0]) ** 2 + (cents[b][1] - c[1]) ** 2)
        groups[b].append(i + 1)
    H = rgba.shape[0]
    def key(b):   # reading order: row band first, then left to right
        cy, cx = cents[b]; return (int(cy * rows / H), cx)
    out = []
    for b in sorted(big, key=key):
        m = np.isin(lab, groups[b])
        ys, xs = np.where(m & solid)
        a = rgba.copy(); a[..., 3] = np.where(m, a[..., 3], 0)
        out.append(a[ys.min():ys.max() + 1, xs.min():xs.max() + 1])
    return out
