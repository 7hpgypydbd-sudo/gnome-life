import json, os
from PIL import Image
CUT='cut'; OUT='/home/claude/gnome-life/sprites'; PREV='preview'
def files(prefix, idx): 
    meta=json.load(open(f'{CUT}/{prefix}.json')); return [meta[i]['file'] for i in idx]
SEL = {
 'him': {'side': files('walk-him-young-side', range(8)),
         'front': files('walk-him-young-front', [0,2,4,6,8,10,12,14]),
         'back': files('walk-him-young-back', [0,1,2,3,4,5,7,8])},
 'her': {'side': files('walk-her-young-side', [0,1,2,3]) + ['walk-her-young-side_04_0.png','walk-her-young-side_04_1.png','walk-her-young-side_05_0.png','walk-her-young-side_05_1.png'],
         'front': files('walk-her-young-front', [1,2,4,5,6,7,8,9]),
         'back': files('walk-her-young-back', [0,1,2,3,4,5,6,7])},
}
TARGET_H = 240
os.makedirs(PREV, exist_ok=True)
atlas = {}
for who, dirs in SEL.items():
    fb = {}
    for d, fl in dirs.items():
        ims = [Image.open(f'{CUT}/{f}').convert('RGBA') for f in fl]
        s = TARGET_H / max(im.height for im in ims)
        fb[d] = [im.resize((round(im.width*s), round(im.height*s)), Image.LANCZOS) for im in ims]
    cw = max(im.width for ims in fb.values() for im in ims) + 4
    ch = max(im.height for ims in fb.values() for im in ims) + 2
    atlas[who] = {'cell': [cw, ch], 'dirs': {}}
    for d, ims in fb.items():
        strip = Image.new('RGBA', (cw*len(ims), ch))
        for i, im in enumerate(ims): strip.paste(im, (i*cw + (cw-im.width)//2, ch - im.height), im)
        strip.save(f'{OUT}/{who}-{d}.webp', lossless=True, exact=True, method=6); atlas[who]['dirs'][d] = len(ims)
        gif = []
        for i in range(len(ims)):
            f = Image.new('RGB', (cw, ch), (92,110,70)); c = strip.crop((i*cw,0,(i+1)*cw,ch)); f.paste(c,(0,0),c); gif.append(f)
        gif[0].save(f'{PREV}/{who}-{d}.gif', save_all=True, append_images=gif[1:], duration=110, loop=0)
json.dump(atlas, open(f'{OUT}/gnomes.json','w'), indent=1); print(json.dumps(atlas))
