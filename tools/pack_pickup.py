import sys, json, numpy as np
from PIL import Image
sys.path.insert(0, '/home/claude/gnome-life/tools')
from cut_blobs import key_magenta, runs
def load(name):
    im = Image.open(f'{SRC}/{name}.jpg').convert('RGB'); arr = np.asarray(im).astype(np.int16)
    if name == 'action-her-dig-water':
        white = (arr.min(2) > 225) & ((arr.max(2)-arr.min(2)) < 14)
        rl = white.mean(1) > 0.5; cl = white.mean(0) > 0.5
        for k in range(-3, 4): rl |= np.roll(rl, k); cl |= np.roll(cl, k)
        line = (rl[:, None] | cl[None, :]) & (arr.min(2) > 200) & ((arr.max(2)-arr.min(2)) < 30)
        arr[line] = (255, 0, 255); im = Image.fromarray(arr.astype(np.uint8))
    rgba = key_magenta(im, 0.42)
    if name == 'action-him-sit-sleep':
        r, g, b, a = [rgba[...,i].astype(int) for i in range(4)]
        pink = (r > 185) & (b > 150) & (r - g > 25) & (b - g > 5) & (a > 0); rgba[pink, 3] = 0
    return rgba
def split_band(solid1d, n):
    """split a 1-D density profile into n pieces at the weakest points near the even boundaries"""
    L = len(solid1d); cuts = [0]
    for k in range(1, n):
        c = L*k//n; lo, hi = max(1, c - L//(n*4)), min(L-1, c + L//(n*4))
        cuts.append(lo + int(np.argmin(solid1d[lo:hi])))
    cuts.append(L); return [(cuts[i], cuts[i+1]) for i in range(n)]
def frames(rgba, rows_expected, cols_expected):
    """rows_expected: list of expected frame counts per row band (bands merged vertically are split evenly)"""
    solid = rgba[...,3] > 128
    bands = runs(solid.sum(1) > 2, 1, 30)
    out = []
    # if fewer bands than expected rows, split tall bands
    exp_rows = len(rows_expected)
    while len(bands) < exp_rows:
        i = max(range(len(bands)), key=lambda i: bands[i][1]-bands[i][0]); y0, y1 = bands[i]
        prof = solid[y0:y1].sum(1); (a0,a1),(b0,b1) = split_band(prof, 2)
        bands[i:i+1] = [(y0+a0, y0+a1), (y0+b0, y0+b1)]
    for (y0, y1), n in zip(bands, rows_expected):
        band = solid[y0:y1]; cols = runs(band.sum(0) > 2, 1, 30)
        if len(cols) != n:  # merged columns: split the widest spans
            while len(cols) < n:
                i = max(range(len(cols)), key=lambda i: cols[i][1]-cols[i][0]); x0, x1 = cols[i]
                prof = band[:, x0:x1].sum(0); (a0,a1),(b0,b1) = split_band(prof, 2); cols[i:i+1] = [(x0+a0, x0+a1), (x0+b0, x0+b1)]
        for (x0, x1) in cols:
            sub = band[:, x0:x1]; ys = np.where(sub.any(1))[0]; xs = np.where(sub.any(0))[0]
            out.append(Image.fromarray(rgba[y0+ys.min():y0+ys.max()+1, x0+xs.min():x0+xs.max()+1]))
    return out

# Art day 9: pack the two bend-down pick-up sheets (top row = "pickup", bottom row = "gather") into action strips.
# usage: pack_pickup.py <dir with action-her-pickup.jpg and action-him-pickup.jpg> <out dir>
from scipy import ndimage
SRC, OUT = sys.argv[1], sys.argv[2]
def load2(name):
    return key_magenta(Image.open(f'{SRC}/{name}.jpg').convert('RGB'), 0.42)
def main_blob(im):
    """keep only the biggest connected blob (drops loose twigs, leaves and pebbles lying on the ground)"""
    a = np.asarray(im); solid = a[..., 3] > 128
    lab, n = ndimage.label(ndimage.binary_dilation(solid, iterations=5))
    if n < 2: return im
    big = 1 + int(np.argmax(ndimage.sum(solid, lab, range(1, n + 1))))
    a = a.copy(); a[(lab != big), 3] = 0
    ys, xs = np.where(a[..., 3] > 128)
    return Image.fromarray(a[ys.min():ys.max() + 1, xs.min():xs.max() + 1])
atlas = json.load(open('/home/claude/gnome-life/sprites/gnomes.json'))
for who in ('her', 'him'):
    fr = [main_blob(f) for f in frames(load2(f'action-{who}-pickup'), [4, 4], 0)]
    stand = fr[0].height
    scale = 238 / stand   # the standing frame is as tall as the gnome in the other strips
    for act, ims in (('pickup', fr[0:4]), ('gather', fr[4:8])):
        ims = [im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS) for im in ims]
        cw = max(im.width for im in ims) + 4; ch = max(im.height for im in ims) + 2
        strip = Image.new('RGBA', (cw * len(ims), ch))
        for i, im in enumerate(ims): strip.paste(im, (i * cw + (cw - im.width) // 2, ch - im.height), im)
        strip.save(f'{OUT}/{who}-{act}.png', optimize=True)
        atlas[who]['acts'][act] = {'n': len(ims), 'cell': [cw, ch]}
        print(who, act, len(ims), cw, ch)
json.dump(atlas, open(f'{OUT}/gnomes.json', 'w'), indent=1)
