import sys, json, numpy as np
from PIL import Image
sys.path.insert(0, '/home/claude/gnome-life/tools')
from cut_blobs import key_magenta, runs
S=sys.argv[1]; SRC=S+'/src'; OUT=S+'/out'
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
SHEETS = {
 'him': {'dig-water': ('action-him-dig-water', [2,2,2,2], {'dig':(0,4), 'water':(4,8)}),
         'carry-eat': ('action-him-carry-eat', [2,2,2,2], {'carry':(0,4), 'eat':(4,8)}),
         'sit-sleep': ('action-him-sit-sleep', [2,2,1,1,1,1], {'sit':(0,4), 'sleep':(4,8)})},
 'her': {'dig-water': ('action-her-dig-water', [2,2,2,2], {'dig':(0,4), 'water':(4,8)}),
         'carry-eat': ('action-her-carry-eat', [3,3,4,4], {'carry':(0,6), 'eat':(6,14)}),
         'sit-sleep': ('action-her-sit-knit', [2,2,1,1,1,1], {'sit':(0,4), 'sleep':(4,8)})},
}
TARGET_H = 240
atlas = json.load(open('/home/claude/gnome-life/sprites/gnomes.json'))
for who, sheets in SHEETS.items():
    acts = {}
    for key, (name, rows, groups) in sheets.items():
        fr = frames(load(name), rows, 0)
        for act, (a, b) in groups.items(): acts[act] = fr[a:b]
    scale = TARGET_H / max(im.height for im in acts['dig'])
    atlas[who]['acts'] = {}
    for act, ims in acts.items():
        if act == 'eat' and len(ims) == 8: ims = ims[::2]          # her eat row has 8 frames: keep 4
        if act == 'sleep' and who == 'her': ims = ims[:2]          # her last two sleep frames lost the mattress
        s = scale
        if act == 'sit': s = TARGET_H * 0.86 / max(im.height for im in ims)
        if act == 'sleep': s = 260 / max(im.width for im in ims)
        ims = [im.resize((round(im.width*s), round(im.height*s)), Image.LANCZOS) for im in ims]
        cw = max(im.width for im in ims) + 4; ch = max(im.height for im in ims) + 2
        strip = Image.new('RGBA', (cw*len(ims), ch))
        for i, im in enumerate(ims): strip.paste(im, (i*cw + (cw-im.width)//2, ch - im.height), im)
        strip.save(f'{OUT}/{who}-{act}.webp', lossless=True, exact=True, method=6)
        atlas[who]['acts'][act] = {'n': len(ims), 'cell': [cw, ch]}
        print(who, act, len(ims), cw, ch)
json.dump(atlas, open(f'{OUT}/gnomes.json', 'w'), indent=1)
# preview sheet on moss green
rows = []
for who in SHEETS:
    for act in ['dig','water','carry','eat','sit','sleep']:
        st = Image.open(f'{OUT}/{who}-{act}.webp'); bg = Image.new('RGB', st.size, (92,110,70)); bg.paste(st, (0,0), st); rows.append(bg)
W = max(r.width for r in rows); H = sum(r.height for r in rows) + 6*len(rows)
pv = Image.new('RGB', (W, H), (30,30,30)); y = 0
for r in rows: pv.paste(r, (0, y)); y += r.height + 6
pv.save(f'{S}/actions-preview.jpg', quality=85); print(pv.size)
