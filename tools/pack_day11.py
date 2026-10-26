"""Pack art day 11 gnome strips (4 frames each on magenta) into sprites/<who>-<act>.png and add them to sprites/gnomes.json.
usage: pack_day11.py art-day-11/   (him-carry-can -> him-canwalk, him-craft -> him-craft, her-craft -> her-craft)
"""
import sys, json, numpy as np
from PIL import Image
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from cut_blobs import key_magenta, runs
SRC = sys.argv[1]; OUT = 'sprites'; TARGET_H = 240
JOBS = [('him-carry-can', 'him', 'canwalk'), ('him-craft', 'him', 'craft'), ('her-craft', 'her', 'craft')]
atlas = json.load(open(f'{OUT}/gnomes.json'))
for name, who, act in JOBS:
    im = Image.open(f'{SRC}/{name}.jpg').convert('RGB'); im = im.resize((im.width // 2, im.height // 2), Image.LANCZOS)
    rgba = key_magenta(im, 0.42); solid = rgba[..., 3] > 128
    prof = solid.sum(0); L = len(prof); cuts = [0]
    for k in range(1, 4):   # split at the emptiest column near each quarter line (props can reach into the next frame's space)
        c = L * k // 4; lo, hi = c - L // 16, c + L // 16; cuts.append(lo + int(np.argmin(prof[lo:hi])))
    cuts.append(L); ims = []
    for a, b in zip(cuts, cuts[1:]):
        sub = solid[:, a:b]; ys = np.where(sub.any(1))[0]; xs = np.where(sub.any(0))[0]
        ims.append(Image.fromarray(rgba[ys.min():ys.max() + 1, a + xs.min():a + xs.max() + 1]))
    s = TARGET_H / max(i.height for i in ims)
    ims = [i.resize((round(i.width * s), round(i.height * s)), Image.LANCZOS) for i in ims]
    cw = max(i.width for i in ims) + 4; ch = max(i.height for i in ims) + 2
    strip = Image.new('RGBA', (cw * 4, ch))
    for i, f in enumerate(ims): strip.paste(f, (i * cw + (cw - f.width) // 2, ch - f.height), f)
    strip.save(f'{OUT}/{who}-{act}.png', optimize=True); atlas[who]['acts'][act] = {'n': 4, 'cell': [cw, ch]}; print(who, act, cw, ch)
json.dump(atlas, open(f'{OUT}/gnomes.json', 'w'), indent=1)
