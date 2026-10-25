import sys, os, numpy as np
from PIL import Image
sys.path.insert(0, '/home/claude/gnome-life/tools')
from cut_blobs import key_magenta
S = sys.argv[1]; SRC = S + '/src'; OUT = S + '/out'
# ---- tiles: key, crop to the painted diamond, scale to 1225 wide, place on a 1225x728 canvas aligned to the top
TILES = {'tile-barren-creek':'tile-barren-creek','tile-barren-fence':'tile-barren-fence','tile-barren-deadtree':'tile-barren-deadtree',
 'tile-stream-bend-left':'tile-stream-bend-left','tile-stream-bend-right':'tile-stream-bend-right','tile-stream-spring':'tile-stream-spring',
 'tile-path-bend-bottom':'tile-path-bend-right','tile-path-bend-left':'tile-path-bend-left','tile-path-fork':'tile-path-fork','tile-crossing':'tile-crossing'}
for src, dst in TILES.items():
    im = Image.open(f'{SRC}/{src}.jpg')
    if im.width > 1500: im = im.resize((im.width//2, im.height//2), Image.LANCZOS)
    rgba = key_magenta(im, 0.42)
    a = rgba[...,3] > 128
    rows = np.where(a.sum(1) > 20)[0]; cols = np.where(a.sum(0) > 20)[0]
    y0,y1,x0,x1 = rows.min(), rows.max()+1, cols.min(), cols.max()+1
    crop = Image.fromarray(rgba[y0:y1, x0:x1])
    s = 1225 / crop.width; crop = crop.resize((1225, round(crop.height*s)), Image.LANCZOS)
    cv = Image.new('RGBA', (1225, 728)); cv.paste(crop, (0, 0), crop)
    # widest row = the left/right corner row; batch 1 tiles have it at ~343-349
    aa = np.asarray(cv)[...,3] > 128; wr = aa.sum(1).argmax()
    cv.save(f'{OUT}/{dst}.webp', quality=82, method=6)
    print(dst, 'crop h', crop.height, 'widest row', wr, 'bottom', np.where(aa.any(1))[0].max())
# ---- icons: key on the dull pink background, cut 9 pieces
im = np.asarray(Image.open(f'{SRC}/icons-pickups.jpg').convert('RGB')).astype(np.float32)
bg = np.array([201,73,160], np.float32)
# sample actual bg from corners
corner = np.concatenate([im[:40,:40].reshape(-1,3), im[-40:,-40:].reshape(-1,3)]); bg = corner.mean(0); print('bg', bg)
d = np.linalg.norm(im - bg, axis=2)
alpha = np.clip((d - 38) / 30, 0, 1)
rgb = im.copy()
fr = (alpha > 0) & (alpha < 1)
# de-pink fringe: pull towards neutral by removing the bg tint
rgb[fr] = np.clip((rgb[fr] - bg * (1 - alpha[fr])[:,None]) / np.maximum(alpha[fr][:,None], 0.2), 0, 255)
rgba = np.dstack([rgb, alpha[...,None]*255]).astype(np.uint8)
solid = alpha > 0.5
# flood-fill components on a 4x downsample
from collections import deque
s_ = 4; H, W = solid.shape; small = solid[:H//s_*s_, :W//s_*s_].reshape(H//s_, s_, W//s_, s_).any(axis=(1,3))
r = 3; pad = np.pad(small, r); dil = np.zeros_like(small)
for dy in range(-r, r+1):
    for dx in range(-r, r+1): dil |= pad[r+dy:r+dy+small.shape[0], r+dx:r+dx+small.shape[1]]
lab = np.zeros(dil.shape, int); n = 0; h, w = dil.shape
for y in range(h):
    for x in range(w):
        if dil[y,x] and not lab[y,x]:
            n += 1; q = deque([(y,x)]); lab[y,x] = n
            while q:
                cy, cx = q.popleft()
                for ny, nx in ((cy-1,cx),(cy+1,cx),(cy,cx-1),(cy,cx+1)):
                    if 0<=ny<h and 0<=nx<w and dil[ny,nx] and not lab[ny,nx]: lab[ny,nx] = n; q.append((ny,nx))
boxes = []
for k in range(1, n+1):
    ys, xs = np.where(lab == k); y0,y1,x0,x1 = ys.min()*s_, (ys.max()+1)*s_, xs.min()*s_, (xs.max()+1)*s_
    if solid[y0:y1, x0:x1].sum() < 400: continue
    boxes.append([x0,y0,x1,y1])
boxes.sort(key=lambda b: (round((b[1]+b[3])/2/200), b[0]))
NAMES = ['twig','moss','stone','acorn','seed','water','berry','feather','light']
print('icons found', len(boxes))
for nm, b in zip(NAMES, boxes):
    pc = Image.fromarray(rgba[b[1]:b[3], b[0]:b[2]])
    # pad to a square 160 canvas, item scaled to fit 140
    sc = 140 / max(pc.size); pc = pc.resize((max(1,round(pc.width*sc)), max(1,round(pc.height*sc))), Image.LANCZOS)
    cv = Image.new('RGBA', (160,160)); cv.paste(pc, ((160-pc.width)//2, (160-pc.height)//2), pc)
    cv.save(f'{OUT}/icon-{nm}.webp', quality=90, method=6); print(nm, b)
