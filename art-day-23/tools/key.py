import numpy as np
from PIL import Image, ImageFilter
def key(path):
    a=np.asarray(Image.open(path).convert('RGB')).astype(float)
    R,G,B=a[...,0],a[...,1],a[...,2]
    mag=(np.minimum(R,B)-G)/255
    al=np.clip((0.42-mag)/0.22,0,1)
    # despill
    m=np.minimum(R,B); sp=np.clip(m-G,0,None)*(al<1)
    a[...,0]-=sp*0.8; a[...,2]-=sp*0.8
    al=np.asarray(Image.fromarray((al*255).astype('uint8')).filter(ImageFilter.MinFilter(3)))
    out=np.dstack([np.clip(a,0,255).astype('uint8'),al])
    im=Image.fromarray(out,'RGBA'); return im.crop(im.getbbox())
