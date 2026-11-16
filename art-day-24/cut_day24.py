# Art day 24 cutter: magenta key + despill, pieces found as connected blobs (on a 1/4 mask), sorted, saved as webp.
import sys, numpy as np
from collections import deque
from PIL import Image, ImageFilter
def key(im):
    a = np.asarray(im.convert('RGB')).astype(np.float32)
    R,G,B = a[...,0],a[...,1],a[...,2]
    mag = (np.minimum(R,B)-G)/255
    al = np.clip((0.42-mag)/0.22,0,1)
    # despill: pull R,B toward G where pinkish
    m = np.minimum(R,B) > G
    s = np.where(m, np.minimum(R,B)-G, 0)
    a[...,0] = R - s*0.9*(1-al*0) ; a[...,2] = B - s*0.9
    rgba = np.dstack([np.clip(a,0,255), al*255]).astype(np.uint8)
    out = Image.fromarray(rgba,'RGBA')
    A = out.split()[3].filter(ImageFilter.MinFilter(3)); out.putalpha(A)
    return out
def blobs(rgba, n, minfrac=0.0, drop=False):
    A = np.asarray(rgba.split()[3].resize((rgba.width//4, rgba.height//4)).filter(ImageFilter.MaxFilter(3)))>40
    h,w = A.shape; lab = np.zeros((h,w),int); k=0; sizes=[]
    for y in range(h):
        for x in range(w):
            if A[y,x] and not lab[y,x]:
                k+=1; q=deque([(y,x)]); lab[y,x]=k; c=0
                while q:
                    cy,cx=q.popleft(); c+=1
                    for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
                        ny,nx=cy+dy,cx+dx
                        if 0<=ny<h and 0<=nx<w and A[ny,nx] and not lab[ny,nx]:
                            lab[ny,nx]=k; q.append((ny,nx))
                sizes.append(c)
    big = sorted(range(1,k+1), key=lambda i:-sizes[i-1])[:n]
    # assign small blobs to nearest big one
    cents = {i: np.argwhere(lab==i).mean(0) for i in big}
    for i in range(1,k+1):
        if i in big: continue
        if drop: lab[lab==i]=0; continue
        c = np.argwhere(lab==i).mean(0)
        j = min(big, key=lambda b: np.hypot(*(cents[b]-c))); lab[lab==i]=j
    return lab, big, cents
def cut(src, names, sizes, order='rowcol'):
    im = Image.open(src); rgba = key(im)
    lab, big, cents = blobs(rgba, len(names))
    if order=='rowcol': big.sort(key=lambda i:(round(cents[i][0]/(lab.shape[0]/2.2)), cents[i][1]))
    else: big.sort(key=lambda i: cents[i][1])
    for name,(dim,val),i in zip(names,sizes,big):
        m = Image.fromarray(((lab==i)*255).astype(np.uint8)).resize(rgba.size).filter(ImageFilter.MaxFilter(9))
        p = rgba.copy(); A = np.minimum(np.asarray(p.split()[3]), np.asarray(m)); p.putalpha(Image.fromarray(A))
        p = p.crop(p.getbbox())
        sc = val/(p.height if dim=='h' else p.width)
        p = p.resize((round(p.width*sc), round(p.height*sc)), Image.LANCZOS)
        p.save(f'cut/{name}.webp', quality=88, method=6); print(name, p.size)
P='painted/'
cut(P+'01-ring-stones.jpeg', [f'camp-stone-{i}' for i in range(1,7)], [('h',260)]*6)
cut(P+'05-ring-stones-soot.jpeg', [f'camp-stone-soot-{i}' for i in range(1,7)], [('h',260)]*6)
cut(P+'02-ash-beds.jpeg', ['camp-ash','camp-raked'], [('w',900)]*2, 'x')
cut(P+'04-wattle-bushes.jpeg', ['camp-sprouts','camp-wattle-young','camp-wattle'], [('h',120),('h',200),('h',240)], 'x')
# welcome stone: middle piece only (neighbours' earth patches touch it), crop then biggest blob
im = Image.open(P+'06-welcome-stone.jpeg').crop((840,90,1960,1420)); im.save('/tmp/_ws.png') if False else None
rgba = key(im); lab, big, cents = blobs(rgba, 1, drop=True)
m = Image.fromarray(((lab==big[0])*255).astype(np.uint8)).resize(rgba.size).filter(ImageFilter.MaxFilter(9))
p = rgba.copy(); p.putalpha(Image.fromarray(np.minimum(np.asarray(p.split()[3]), np.asarray(m)))); p = p.crop(p.getbbox())
p = p.resize((round(p.width*160/p.height),160), Image.LANCZOS); p.save('cut/make-milestone.webp', quality=88, method=6); print('make-milestone', p.size)
