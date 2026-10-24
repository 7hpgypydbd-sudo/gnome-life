import sys, json, os
from PIL import Image, ImageDraw
out = sys.argv[1]; groups = sys.argv[2:]
rows = []
for g in groups:
    meta = json.load(open(f'cut/{g}.json'))
    ims = [Image.open(f'cut/{m["file"]}') for m in meta]
    rows.append((g, ims))
cell = 150
W = max(len(r[1]) for r in rows) * cell + 20
H = len(rows) * (cell + 30) + 10
sheet = Image.new('RGB', (W, H), (60, 70, 55))
d = ImageDraw.Draw(sheet)
y = 10
for g, ims in rows:
    d.text((10, y), g, fill=(255, 255, 255))
    for i, im in enumerate(ims):
        t = im.copy(); t.thumbnail((cell - 10, cell - 10))
        x = 10 + i * cell
        sheet.paste(t, (x + (cell - 10 - t.width)//2, y + 18 + (cell - 10 - t.height)), t)
        d.text((x, y + 18 + cell - 12), str(i), fill=(255, 220, 120))
    y += cell + 30
sheet.save(out)
print(out, sheet.size)
