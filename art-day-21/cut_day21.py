"""Art day 21: cut the trial pieces into game sprites. Run from repo root: python3 art-day-21/cut_day21.py <trial_dir>"""
import sys, numpy as np
from PIL import Image, ImageFilter
T = sys.argv[1]
def load(n): return Image.open(f'{T}/{n}.png').convert('RGBA')
def bbox_crop(im):
    return im.crop(im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox())
def save(im, name, w=None, h=None, scale=None):
    im = bbox_crop(im)
    if scale: w = round(im.width * scale)
    if w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    elif h: im = im.resize((round(im.width * h / im.height), h), Image.LANCZOS)
    im.save(f'sprites/{name}.webp', quality=88, method=6); print(name, im.size)
def feather(im, erode=31, blur=45):
    rgb = np.asarray(im.convert('RGB'), np.float32)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    spill = np.minimum(r, b) > g          # pink/magenta cast left in the fuzzy edge
    rgb[spill, 0] = np.minimum(r[spill], g[spill] * 0.95); rgb[spill, 2] = np.minimum(b[spill], g[spill] * 0.8)
    im = Image.fromarray(rgb.astype(np.uint8)).convert('RGBA'); im.putalpha(Image.open(im_src[0]).getchannel('A') if False else a0[0])
    a = im.getchannel('A')
    lawn = np.asarray(Image.open('sprites/ground/lawn-calm.webp').convert('RGB'), np.float32).reshape(-1, 3).mean(0)
    al = np.asarray(a, np.float32) / 255; m = al > 0.9
    gain = 1 + 0.75 * (lawn / np.median(rgb[m], 0) - 1)    # pull the patch's grass colour toward the lawn
    im = Image.fromarray(np.clip(rgb * gain, 0, 255).astype(np.uint8)).convert('RGBA'); im.putalpha(a)
    core = a.filter(ImageFilter.MinFilter(erode)).filter(ImageFilter.GaussianBlur(blur))
    na = (np.asarray(a, np.float32) / 255) * (np.asarray(core, np.float32) / 255) ** 2.0
    out = im.copy(); out.putalpha(Image.fromarray((na * 255).astype(np.uint8))); return out
a0=[None]; im_src=[None]
for i, n in enumerate(['clover', 'buttercup', 'violet', 'moss', 'leaves', 'fresh']):
    src = load(f'02-ground-patches_0{i}'); a0[0] = src.getchannel('A'); save(feather(src), f'kit/patch-calm-{n}', w=420)
for n, src in [('heap', '1-heap'), ('heap-half', '2-half'), ('hollow', '3-hollow'), ('hollow-rain', '4-rain'), ('pond-large', '5-pond')]:
    save(load(f'03-pond-{src}_00'), f'garden-{n}', w=1000)
save(load('04-spring-pavers_00'), 'spring-paved', w=640)
save(load('05-washtub_00'), 'tub-wash', w=420)
save(load('06-leanto_00'), 'yard-leanto', h=520)
save(load('06-leanto_01'), 'yard-leanto-frame', h=520)
save(load('07b-seedbed-rect-dark_00'), 'seedbed-rect', w=720)
save(load('08-stepping-stones_00'), 'stepping-stones', w=600)
s = 420 / 1134
for i in range(3): save(load(f'09-wildflowers_0{i}'), f'wildflower-patch-{i+1}', scale=s)
# calm lawn swatch: whole painting shrunk, made seamless
a = Image.open('art-day-21/painted/01c-ground-meadowlike.jpeg').convert('RGB').resize((560, 280), Image.LANCZOS)
A = np.asarray(a, np.float32); B = np.roll(np.roll(A, 140, 0), 280, 1)
yy, xx = np.mgrid[0:280, 0:560]
w = np.minimum(np.minimum(xx, 559 - xx) / 280, np.minimum(yy, 279 - yy) / 140); w = np.clip(w * 2.2, 0, 1)[..., None]
Image.fromarray((A * w + B * (1 - w)).astype(np.uint8)).resize((280, 140), Image.LANCZOS).save('sprites/ground/lawn-calm.webp', quality=90); print('ground/lawn-calm')
Image.open('art-day-21/painted/10-story-mabel-home.jpeg').convert('RGB').resize((1200, 670), Image.LANCZOS).save('sprites/story-mabel-home.webp', quality=86); print('story-mabel-home')
Image.open('art-day-21/painted/11b-room-stump-hollowing.jpeg').convert('RGB').resize((1000, 1000), Image.LANCZOS).save('sprites/room-stump-hollowing.webp', quality=86); print('room-stump-hollowing')
# faces for the folk with none: head-and-hat crops of their own folk sprites, 96x96 like face-her
if len(sys.argv) > 2:
    for f in ['mabel', 'tobias', 'fernsby', 'pebbleworth', 'clem', 'barnaby', 'nettle', 'juniper']:
        im = bbox_crop(Image.open(f'sprites/folk-{f}.webp').convert('RGBA')); a = np.asarray(im.getchannel('A')) > 40
        H = im.height; s = int(H * float(sys.argv[2]))
        rgb = np.asarray(im.convert('RGB')).astype(int); r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
        skin = a & (r > g) & (g > b) & (r - b > 45) & (r > 170); skin[int(H * .5):] = False   # the face, in the top half
        ys, xs = np.where(skin); cy, cx = int(np.median(ys)), int(np.median(xs))
        x0 = max(0, min(im.width - s, cx - s // 2)); y0 = max(0, cy - int(s * .55))
        im.crop((x0, y0, x0 + s, y0 + s)).resize((96, 96), Image.LANCZOS).save(f'sprites/face-{f}.webp', quality=90); print('face', f)
for f in ['tobias', 'fernsby', 'pebbleworth', 'clem', 'barnaby', 'nettle', 'juniper']:
    src = f'art-day-21/painted/13b-story-fernsby-home.png' if f == 'fernsby' else [p for p in __import__('glob').glob(f'art-day-21/painted/1[2-8]-story-{f}-home.jpeg')][0]
    Image.open(src).convert('RGB').resize((1200, 670), Image.LANCZOS).save(f'sprites/story-{f}-home.webp', quality=86); print('story', f)
