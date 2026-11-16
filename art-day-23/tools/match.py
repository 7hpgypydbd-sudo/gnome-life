import sys, numpy as np
from PIL import Image
sys.path.insert(0,'.')
from cutframes import frames
def arr(im): return np.asarray(im).astype(np.float32)/255
def score(F, B):
    # F frame RGBA arr, B barrow RGBA arr placed; returns best (err,x,y)
    fh,fw=F.shape[:2]; bh,bw=B.shape[:2]
    m=B[...,3]>0.6; ys,xs=np.nonzero(m); col=B[ys,xs,:3]
    best=(1e9,0,0)
    for y in range(0,fh-bh+1):
        for x in range(0,fw-bw+1):
            f=F[ys+y,xs+x]
            e=(((f[:,:3]-col)**2).sum(1)*f[:,3] + (1-f[:,3])*1.0).mean()
            if e<best[0]: best=(e,x,y)
    return best
def find(frame, barrow, wguess):
    best=None
    for d in (6,):
        Fs=frame.resize((frame.width//d,frame.height//d),Image.BILINEAR); F=arr(Fs)
        for w in range(int(wguess*0.8),int(wguess*1.2),6):
            h=round(w*barrow.height/barrow.width)
            B=arr(barrow.resize((w//d,h//d),Image.BILINEAR))
            e,x,y=score(F,B)
            if best is None or e<best[0]: best=(e,w,x*d,y*d)
    e,w0,x0,y0=best
    # refine at d=2
    d=2; F=arr(frame.resize((frame.width//d,frame.height//d),Image.BILINEAR)); best=None
    for w in range(w0-8,w0+9,2):
        h=round(w*barrow.height/barrow.width); B=arr(barrow.resize((w//d,h//d),Image.BILINEAR))
        bh,bw=B.shape[:2]; m=B[...,3]>0.6; ys,xs=np.nonzero(m); col=B[ys,xs,:3]
        for y in range(max(0,(y0-10)//d),min(F.shape[0]-bh,(y0+10)//d)+1):
            for x in range(max(0,(x0-10)//d),min(F.shape[1]-bw,(x0+10)//d)+1):
                f=F[ys+y,xs+x]; e=(((f[:,:3]-col)**2).sum(1)*f[:,3]+(1-f[:,3])).mean()
                if best is None or e<best[0]: best=(e,w,x*d,y*d)
    return best
if __name__=='__main__':
    fs,_=frames(sys.argv[1]); b=Image.open('cut/wheelbarrow-loaded.png')
    for i,f in enumerate(fs):
        print(i,f.size,find(f,b,470),flush=True)
