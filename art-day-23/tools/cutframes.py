import sys, numpy as np
from PIL import Image
from scipy import ndimage
sys.path.insert(0,'.')
from key import key
def frames(path, n=8):
    im=key(path)
    A=np.asarray(im)[...,3]
    m=ndimage.binary_dilation(A>40,iterations=4)
    lab,k=ndimage.label(m)
    sizes=ndimage.sum(m,lab,range(1,k+1))
    order=np.argsort(sizes)[::-1]
    seeds=[i+1 for i in order[:n]]
    # assign small blobs to nearest seed
    objs=ndimage.find_objects(lab)
    cent={i:ndimage.center_of_mass(m,lab,i) for i in range(1,k+1)}
    owner={}
    for i in range(1,k+1):
        owner[i]=i if i in seeds else min(seeds,key=lambda s:(cent[s][0]-cent[i][0])**2+(cent[s][1]-cent[i][1])**2)
    out=[]
    for s in seeds:
        mask=np.isin(lab,[i for i in owner if owner[i]==s])
        arr=np.asarray(im).copy(); arr[...,3]=np.where(mask,arr[...,3],0)
        f=Image.fromarray(arr,'RGBA'); bb=f.getbbox(); out.append((bb,f.crop(bb)))
    H=max(b[3]-b[1] for b,_ in out)
    out.sort(key=lambda t:(round(t[0][1]/(H*0.6)),t[0][0]))
    return [f for _,f in out],[b for b,_ in out]
if __name__=='__main__':
    fs,bs=frames(sys.argv[1]); print(len(fs),bs)
