"""Turn the painted stream-bank and path-edge strips (sprites/kit/edge-01..06, art day 14) into long, straight,
seamless ribbons the game can lay along the stream and the path.

The painted strips are slanted wedges with hard ends. Each one is straightened (every column of pixels is shifted
and stretched so its top and bottom edges become level lines), the ragged ends are cut off, and the pieces are joined
end to end with soft cross-fades, the last one fading back into the first, so a ribbon can repeat with no seam.
Columns are only shifted up or down, never turned, so grass blades and reeds stay upright.

    python3 tools/make_ribbons.py

Writes sprites/kit/ribbon-bank.webp (stream bank: grass on top, earth face below), ribbon-lip.webp (just the
bank's grassy top, fading out at the bottom, for the near bank) and ribbon-path.webp (a worn path with grassy verges).
"""
import os
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KIT = os.path.join(ROOT, 'sprites', 'kit')

# (strip, first column, last column) of the even, thick part of each painted strip
BANK = [(3, 230, 520), (1, 60, 330), (2, 380, 640)]
PATH = [(4, 110, 600), (5, 110, 600), (6, 110, 620)]
BANK_H, PATH_H, FADE = 72, 96, 70


def edges(a, x0, x1, win=31):
    """Top and bottom of the painting in each column, smoothed so the ragged grass keeps its raggedness."""
    tops, bots = [], []
    for x in range(x0, x1):
        nz = np.nonzero(a[:, x] > 0.35)[0]
        tops.append(nz.min() if len(nz) else np.nan); bots.append(nz.max() if len(nz) else np.nan)
    tops, bots = np.array(tops, float), np.array(bots, float)
    xs = np.arange(len(tops)); ok = ~np.isnan(tops)
    tops = np.interp(xs, xs[ok], tops[ok]); bots = np.interp(xs, xs[ok], bots[ok])
    pad = np.pad(tops, win // 2, mode='edge'); tops = np.array([pad[i:i + win].min() for i in range(len(tops))])
    pad = np.pad(bots, win // 2, mode='edge'); bots = np.array([pad[i:i + win].max() for i in range(len(bots))])
    # a gentle line through them, so the straightening does not wobble
    t = np.polyval(np.polyfit(xs, tops, 2), xs); b = np.polyval(np.polyfit(xs, bots, 2), xs)
    return np.minimum(t, tops) - 2, np.maximum(b, bots) + 2


def straighten(n, x0, x1, H):
    im = np.asarray(Image.open(os.path.join(KIT, f'edge-{n:02d}.webp')).convert('RGBA')).astype(np.float32) / 255
    a = im[..., 3]; top, bot = edges(a, x0, x1)
    out = np.zeros((H, x1 - x0, 4), np.float32)
    ys = np.arange(H) / (H - 1)
    for i, x in enumerate(range(x0, x1)):
        sy = top[i] + ys * (bot[i] - top[i])
        y0 = np.clip(np.floor(sy).astype(int), 0, im.shape[0] - 1); y1 = np.clip(y0 + 1, 0, im.shape[0] - 1); f = (sy - np.floor(sy))[:, None]
        col = im[:, x]; c = col[y0] * (1 - f) + col[y1] * f
        c[sy < 0] = 0; c[sy > im.shape[0] - 1] = 0
        out[:, i] = c
    out[..., :3] *= out[..., 3:]   # premultiplied, so cross-fades do not leave dark rims
    return out


def join(pieces):
    """Cross-fade the pieces end to end, and the last back into the first."""
    ramp = np.linspace(0, 1, FADE)[None, :, None]
    long = pieces[0]
    for p in pieces[1:]:
        long = np.concatenate([long[:, :-FADE], long[:, -FADE:] * (1 - ramp) + p[:, :FADE] * ramp, p[:, FADE:]], axis=1)
    head = long[:, :FADE] * ramp + long[:, -FADE:] * (1 - ramp)   # the wrap: the tail fades into the head
    return np.concatenate([head, long[:, FADE:-FADE]], axis=1)


def save(rib, name):
    a = rib[..., 3:]; rgb = np.where(a > 1e-4, rib[..., :3] / np.maximum(a, 1e-4), 0)
    Image.fromarray((np.clip(np.concatenate([rgb, a], 2), 0, 1) * 255).astype(np.uint8)).save(os.path.join(KIT, name), quality=88)


def feather(rib, top, bot):
    """Fade the top and/or bottom rows away, so the ribbon melts into the ground it lies on instead of sitting on it like a plank."""
    h = rib.shape[0]; y = np.arange(h) / (h - 1)
    k = np.ones(h)
    if top: k *= np.clip(y / top, 0, 1) ** 1.5
    if bot: k *= np.clip((1 - y) / bot, 0, 1) ** 1.5
    return rib * k[:, None, None]


bank = join([straighten(n, x0, x1, BANK_H) for n, x0, x1 in BANK])
shade = 1 - 0.2 * np.clip((np.arange(BANK_H) / BANK_H - 0.35) / 0.65, 0, 1)   # the earth face a little darker towards the water, so it reads as a drop
bank[..., :3] *= shade[:, None, None]
save(feather(bank, 0.4, 0), 'ribbon-bank.webp')
lip = bank[:int(BANK_H * 0.5)].copy()   # the grassy top half only; it fades away where the earth face would start, and towards the land
save(feather(lip, 0, 0.75), 'ribbon-lip.webp')
save(feather(join([straighten(n, x0, x1, PATH_H) for n, x0, x1 in PATH]), 0.3, 0.3), 'ribbon-path.webp')
print('ribbons:', bank.shape[1], 'px long')
