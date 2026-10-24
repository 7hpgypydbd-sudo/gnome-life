"""Pack chosen frames into per-direction strips with a common cell (bottom-centre aligned). Also writes GIF previews."""
import json, os
from PIL import Image
SEL = {
 'him': {'side': ('walk-him-sw', [1,2,3,4,5,7,8,9,10,11]), 'front': ('walk-him-front', [0,1,2,3,4,5]), 'back': ('walk-him-back', [0,1,2,3,4,5])},
 'her': {'side': ('walk-her-side', list(range(10))), 'front': ('walk-her-front', [0,1,2,3,4,5]), 'back': ('walk-her-back', [0,1,2,3,4,5])},
}
TARGET_H = 240  # px height of a standing gnome in the atlas
os.makedirs('sprites', exist_ok=True); os.makedirs('preview', exist_ok=True)
atlas = {}
for who, dirs in SEL.items():
    frames_by_dir = {}
    for d, (sheet, idx) in dirs.items():
        meta = json.load(open(f'cut/{sheet}.json'))
        ims = [Image.open(f'cut/{meta[i]["file"]}').convert('RGBA') for i in idx]
        # scale every frame so the tallest frame of this direction = TARGET_H (keeps per-frame height variation)
        s = TARGET_H / max(im.height for im in ims)
        ims = [im.resize((round(im.width*s), round(im.height*s)), Image.LANCZOS) for im in ims]
        frames_by_dir[d] = ims
    cw = max(im.width for ims in frames_by_dir.values() for im in ims) + 4
    ch = max(im.height for ims in frames_by_dir.values() for im in ims) + 2
    atlas[who] = {'cell': [cw, ch], 'dirs': {}}
    for d, ims in frames_by_dir.items():
        strip = Image.new('RGBA', (cw*len(ims), ch))
        for i, im in enumerate(ims):
            strip.paste(im, (i*cw + (cw-im.width)//2, ch - im.height), im)
        strip.save(f'sprites/{who}-{d}.png', optimize=True)
        atlas[who]['dirs'][d] = len(ims)
        # gif preview on moss green
        gif = []
        for i in range(len(ims)):
            f = Image.new('RGB', (cw, ch), (92, 110, 70)); f.paste(strip.crop((i*cw, 0, (i+1)*cw, ch)), (0,0), strip.crop((i*cw, 0, (i+1)*cw, ch))); gif.append(f)
        gif[0].save(f'preview/{who}-{d}.gif', save_all=True, append_images=gif[1:], duration=110, loop=0)
json.dump(atlas, open('sprites/gnomes.json', 'w'), indent=1)
print(json.dumps(atlas))
