# Art day 25 cutter (Mabel redesign): magenta key + despill, scipy blobs, smallest bits joined to nearest piece or dropped.
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
def key(im):
    a = np.asarray(im.convert('RGB')).astype(np.float32)
    R,G,B = a[...,0],a[...,1],a[...,2]
    mag = (np.minimum(R,B)-G)/255
    al = np.clip((0.42-mag)/0.22,0,1)
    s = np.clip(np.minimum(R,B)-G,0,None)
    a[...,0] = R - s*0.9; a[...,2] = B - s*0.9
    B2 = a[...,2]; G2 = a[...,1]; R2 = a[...,0]
    pink = (B2 > 0.85*G2) & (R2 > 1.12*G2) & (al < 0.98)
    a[...,2] = np.where(pink, 0.78*G2, B2)
    out = Image.fromarray(np.dstack([np.clip(a,0,255), al*255]).astype(np.uint8),'RGBA')
    out.putalpha(out.split()[3].filter(ImageFilter.MinFilter(3)))
    return out
def pieces(rgba, n, drop=False, dil=4):
    A = np.asarray(rgba.split()[3]) > 40
    A = ndi.binary_dilation(A, iterations=dil)
    lab, k = ndi.label(A)
    sizes = ndi.sum(A, lab, range(1,k+1))
    big = list(np.argsort(-sizes)[:n]+1)
    cents = {i: np.array(ndi.center_of_mass(A, lab, i)) for i in big}
    for i in range(1,k+1):
        if i in big: continue
        if drop or sizes[i-1] < 50: lab[lab==i]=0; continue
        c = np.array(ndi.center_of_mass(A, lab, i))
        lab[lab==i] = min(big, key=lambda b: np.hypot(*(cents[b]-c)))
    return lab, big, cents
def save(p, name, dim, val):
    p = p.crop(p.getbbox())
    sc = val/(p.height if dim=='h' else p.width)
    p = p.resize((round(p.width*sc), round(p.height*sc)), Image.LANCZOS)
    p.save(f'cut/{name}.webp', quality=88, method=6); print(name, p.size); return p
def cut(src, names, sizes, order='x', drop=False, rows=1):
    rgba = key(Image.open(src))
    lab, big, cents = pieces(rgba, len(names), drop)
    H = lab.shape[0]
    big.sort(key=lambda i:(int(cents[i][0]/(H/rows)), cents[i][1]))
    out=[]
    for name,(dim,val),i in zip(names,sizes,big):
        p = rgba.copy(); A = np.asarray(p.split()[3]).copy(); A[lab!=i]=0; p.putalpha(Image.fromarray(A))
        out.append(save(p,name,dim,val))
    return out
P='painted/'
m = cut(P+'01-mabel.png', ['folk-mabel'], [('h',699)], drop=True)[0]
# face: square around the face (below the hat brim)
W,H = m.size; fs = H*0.43; fx = W*0.5
m.crop((int(fx-fs/2),0,int(fx+fs/2),int(fs))).resize((96,96),Image.LANCZOS).save('cut/face-mabel.webp',quality=90); print('face-mabel')
cut(P+'02-wagon-arrive.png', ['wagon-arrive'], [('w',640)], drop=True)   # drops the chimney smoke puff
cut(P+'04-wagon-home.png', ['home-mabel'], [('w',520)])
cut(P+'03-mice.png', [f'carter-mice-{i}' for i in range(1,5)], [('h',150)]*4)
cut(P+'05-oven.png', ['bld-mabel-1','bld-mabel-2','bld-mabel'], [('w',260)]*3)
cut(P+'06-wheat.png', [f'wheat-bed-{i}' for i in range(1,6)], [('w',160)]*5)
cut(P+'07-baker-bits.png', ['baker-sack','baker-sacks','baker-loaves','baker-paddle','baker-buns','baker-trough','baker-sheaf','baker-pin-honey','baker-sign'], [('h',120)]*9, rows=3)
for src,name,size in [('08-story-mabel.png','story-mabel',(1200,900)),('09-story-arrive.png','story-mabel-home',(1200,670))]:
    im = Image.open(P+src).convert('RGB'); tw,th = size
    sc = max(tw/im.width, th/im.height); im = im.resize((round(im.width*sc), round(im.height*sc)), Image.LANCZOS)
    l=(im.width-tw)//2; t=(im.height-th)//2; im.crop((l,t,l+tw,t+th)).save(f'cut/{name}.webp',quality=86); print(name)
