import sys, json, numpy as np
sys.path.insert(0,'.')
from cutframes import frames
from match import find
from PIL import Image
who=sys.argv[1]; raw=sys.argv[2]
fs,_=frames(raw)
L=Image.open('cut/wheelbarrow-loaded.png'); E=Image.open('../gnome-life/sprites/wheelbarrow.webp').convert('RGBA'); E=E.crop(E.getbbox())
assert L.size==E.size
KEEPX=130
DX=int(sys.argv[3]) if len(sys.argv)>3 else 0
DY=int(sys.argv[4]) if len(sys.argv)>4 else 0
res=[]
import os
cache=f'cut/{who}-match.json'
if os.path.exists(cache): res=json.load(open(cache))
else:
    for i,f in enumerate(fs):
        e,w,x,y=find(f,L,470); res.append((w,x,y)); print(i,w,x,y,flush=True)
    json.dump(res,open(cache,'w'))
W0=round(np.median([r[0] for r in res]))
out={'loaded':[], 'empty':[]}
info=[]
for f,(w,x,y) in zip(fs,res):
    k=W0/w
    if abs(k-1)>0.004:
        f=f.resize((round(f.width*k),round(f.height*k)),Image.LANCZOS); x=round(x*k); y=round(y*k); w=W0
    s=w/462
    h=round(W0*L.height/L.width)
    A=np.asarray(f).copy()
    X=np.arange(A.shape[1])[None,:]; Y=np.arange(A.shape[0])[:,None]
    inb=(X>=x+KEEPX*s)&(Y>=y-30)&(X<x+W0+20)&(Y<y+h+20)
    skin=(A[...,0].astype(int)>170)&((A[...,0].astype(int)-A[...,1])>45)
    Ag=A.copy(); Ag[...,3]=np.where(inb,0,Ag[...,3])
    g=Image.fromarray(Ag)
    # hand boxes (local coords at 462 scale)
    hm=np.zeros(A.shape[:2],bool)
    for (x0,x1,y0,y1) in [(-60,60,60,150),(70,160,-40,60)]:
        hm|=(X>=x+x0*s)&(X<x+x1*s)&(Y>=y+y0*s)&(Y<y+y1*s)
    Hs=A.copy(); Hs[...,3]=np.where(hm&skin,A[...,3],0); hand=Image.fromarray(Hs)
    for key,B in (('loaded',L),('empty',E)):
        c=g.copy(); c.alpha_composite(B.resize((W0,h),Image.LANCZOS),(x+DX,y+DY)); c.alpha_composite(hand)
        out[key].append((c,x,y))
# gnome height from frame 0: alpha rows left of barrow
a0=np.asarray(out['empty'][0][0])[...,3]
def gh(c,x):
    a=np.asarray(c)[...,3][:, :x+60]; ys=np.nonzero(a.max(1)>60)[0]; return ys[-1]-ys[0]
G=np.median([gh(c,x) for c,x,y in out['empty']])
sc=242/G; print('gnome h',G,'scale',sc)
# align by barrow: barrow at fixed cell position
left=max(x for _,x,_ in out['empty']); right=max(c.width-x for c,x,_ in out['empty'])
top=max(y for _,_,y in out['empty']); bot=max(c.height-y for c,_,y in out['empty'])
CW=left+right; CH=top+bot
cw,ch=round(CW*sc),round(CH*sc)
for key in out:
    strip=Image.new('RGBA',(cw*len(fs),ch),(0,0,0,0))
    for i,(c,x,y) in enumerate(out[key]):
        cell=Image.new('RGBA',(CW,CH),(0,0,0,0)); cell.alpha_composite(c,(left-x,top-y))
        strip.alpha_composite(cell.resize((cw,ch),Image.LANCZOS),(i*cw,0))
    name=f'{who}-barrowwalk' + ('' if key=='loaded' else '-empty')
    strip.save(f'cut/{name}.png'); strip.save(f'cut/{name}.webp',quality=90,method=6)
    print(name,strip.size,'cell',cw,ch)
json.dump({'cell':[cw,ch],'n':len(fs),'barrow_left_in_cell':round(left*sc),'barrow_top_in_cell':round(top*sc),'barrow_w_in_cell':round(W0*sc)},open(f'cut/{who}-barrowwalk.json','w'))
