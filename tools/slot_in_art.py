"""Turn finished Batch 3, 4, 5 and 6 pictures (docs/ART-BATCH-3.md ... -6.md) into the game's art-slot files.
usage: python3 tools/slot_in_art.py <folder with the finished .jpg/.png files> [--thresh 0.42]
Looks for each file by its Batch 3 name (plot-ruts-filled.jpg, yard-bits.jpg, icons-buttons.jpg ...), keys out the magenta,
crops, sizes it and writes sprites/<slot>.webp. Files that are missing are skipped. The game picks the new files up on its
own (ART_SLOTS in index.html); if a piece looks too big or small, change its w in ART_SLOTS.
"""
import sys, os
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from cut_blobs import key_magenta, runs

ROOT = os.path.join(os.path.dirname(__file__), '..')
SPR = os.path.join(ROOT, 'sprites')
PLOT = (1225, 728)
# single pieces: source name -> (slot, width in sprite pixels; a sprite name means "same width as that sprite")
SINGLE = {
    'shelter-mossroof': ('shelter-mossroof', 'shelter'), 'fence-fallen': ('fence-fallen', 'fence'),
    'barrel-full': ('barrel-full', 'barrel'), 'lantern-lit': ('lantern-lit', 'lanternstump'),
    'oak-planted': ('oak-planted', 220), 'washing-line': ('washing-line', 400), 'stick-pile': ('stick-pile', 240),
    'stepping-stones': ('stepping-stones', 520),
    'feeding-dish': ('feeding-dish', 200),   # batch 5
    # batch 4: home stage 2, each the whole stump at the shelter's width
    'house-hollowed': ('house-hollowed', 'shelter'), 'house-windows': ('house-windows', 'shelter'), 'house-finished': ('house-finished', 'shelter'),
    'bridge': ('bld-bridge', 400),   # batch 6
}
STORIES = ('mabel', 'tobias', 'fernsby', 'pebbleworth', 'clem', 'barnaby', 'nettle', 'juniper')   # batch 6: story-<id>.jpg, landscape paintings, no magenta
ROOMS = ('room-shelter', 'room-stump')   # square room paintings: no magenta to key, just sized to 1000x1000
SHEETS = {   # one row of separate pieces, left to right
    'yard-bits': (['yard-doorstep', 'yard-windowbox', 'yard-stones', 'yard-firewood'], [180, 90, 170, 220]),
    'icons-buttons': (['btn-pack', 'btn-jobs', 'btn-magic', 'btn-journal'], [160, 160, 160, 160]),
    # batch 5 (docs/ART-BATCH-5.md): visitors, four to a sheet, each facing LEFT; the game sizes them by height (h in content.js)
    'visitors-birds':  (['vis-wren', 'vis-rosella', 'vis-kookaburra', 'vis-frogmouth'], [300] * 4),
    'visitors-ground': (['vis-echidna', 'vis-bluetongue', 'vis-bandicoot', 'vis-possum'], [300] * 4),
    'visitors-small':  (['vis-snail', 'vis-frog', 'vis-glowworm', 'vis-nativebee'], [240] * 4),
    'visitors-flying': (['vis-butterfly', 'vis-dragonfly', 'vis-moth', 'vis-wisp'], [240] * 4),
    'nests':           (['nest-nest', 'nest-burrow', 'nest-leafpile', 'nest-stones'], [160, 200, 240, 200]),
    # batch 6 (docs/ART-BATCH-6.md): neighbours (standing, facing the viewer), their homes, trade buildings, the camp, icons and story finds
    'folk-1': (['folk-mabel', 'folk-tobias', 'folk-pebbleworth', 'folk-pebbleworth-2'], [300] * 4),
    'folk-2': (['folk-fernsby', 'folk-fernsby-2', 'folk-fernsby-3', 'folk-fernsby-4'], [300] * 4),
    'folk-3': (['folk-clem', 'folk-barnaby', 'folk-nettle', 'folk-juniper'], [300] * 4),
    'homes-1': (['home-mabel', 'home-tobias'], [380] * 2),
    'homes-2': (['home-fernsby', 'home-pebbleworth'], [380] * 2),
    'homes-3': (['home-clem', 'home-barnaby'], [380] * 2),
    'homes-4': (['home-nettle', 'home-juniper'], [380] * 2),
    'buildings-1': (['bld-mabel', 'bld-tobias', 'bld-fernsby'], [260] * 3),
    'buildings-2': (['bld-pebbleworth', 'bld-clem', 'bld-barnaby'], [260] * 3),
    'buildings-3': (['bld-nettle', 'glow-jar', 'camp-tent'], [260, 60, 220]),
    'icons-village': (['icon-bread', 'icon-plank', 'icon-honey', 'icon-yarn'], [160] * 4),
    'finds': (['find-mabel', 'find-fernsby', 'find-clem', 'find-nettle', 'find-juniper'], [120] * 5),
}

def find(folder, name):
    for ext in ('.jpg', '.jpeg', '.png', '.webp'):
        p = os.path.join(folder, name + ext)
        if os.path.exists(p): return p

def crop(rgba):
    ys, xs = np.where(rgba[..., 3] > 16)
    return rgba[ys.min():ys.max() + 1, xs.min():xs.max() + 1]

def save(rgba, slot, width=None, size=None):
    im = Image.fromarray(rgba)
    if size: im = im.resize(size, Image.LANCZOS)
    elif width: im = im.resize((int(width), round(im.height * width / im.width)), Image.LANCZOS)
    im.save(os.path.join(SPR, slot + '.webp'), quality=88)
    print(f'  {slot}.webp  {im.width}x{im.height}')

def main():
    folder = sys.argv[1]
    thresh = float(sys.argv[sys.argv.index('--thresh') + 1]) if '--thresh' in sys.argv else 0.42
    for name in ('plot-ruts-filled', 'plot-cleared'):   # whole tiles: stretched onto the exact plot diamond
        p = find(folder, name)
        if p: save(crop(key_magenta(Image.open(p), thresh)), name, size=PLOT)
    for name in ROOMS:
        p = find(folder, name)
        if p: im = Image.open(p).convert('RGB'); side = min(im.size); save(np.array(im.crop(((im.width - side) // 2, (im.height - side) // 2, (im.width + side) // 2, (im.height + side) // 2))), name, size=(1000, 1000))
    for fid in STORIES:   # story pictures: landscape, cropped to 4:3
        p = find(folder, 'story-' + fid)
        if not p: continue
        im = Image.open(p).convert('RGB'); w = min(im.width, im.height * 4 // 3); h = w * 3 // 4
        save(np.array(im.crop(((im.width - w) // 2, (im.height - h) // 2, (im.width + w) // 2, (im.height + h) // 2))), 'story-' + fid, size=(1200, 900))
    for name, (slot, w) in SINGLE.items():
        p = find(folder, name)
        if not p: continue
        if isinstance(w, str): w = Image.open(os.path.join(SPR, w + '.webp')).width
        save(crop(key_magenta(Image.open(p), thresh)), slot, width=w)
    for name, (slots, widths) in SHEETS.items():
        p = find(folder, name)
        if not p: continue
        rgba = key_magenta(Image.open(p), thresh)
        cols = runs((rgba[..., 3] > 128).sum(axis=0) > 2, 12, 30)
        cols = sorted(sorted(cols, key=lambda c: c[1] - c[0])[-len(slots):])   # the widest pieces, back in left-to-right order
        if len(cols) < len(slots): print(f'  {name}: found {len(cols)} pieces, expected {len(slots)}; skipped'); continue
        for (x0, x1), slot, w in zip(cols, slots, widths): save(crop(rgba[:, x0:x1]), slot, width=w)
    print('Done. Missing pictures were skipped; the game keeps its stand-ins for those.')

main()
