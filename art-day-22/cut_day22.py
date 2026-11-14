# art day 22: cut the round-eleven sheets into sprites (magenta key, despill, blob split, sort by row/col)
import numpy as np, os
from PIL import Image, ImageFilter
from scipy import ndimage
P='art-day-22/painted/'; OUT='art-day-22/cut/'; os.makedirs(OUT,exist_ok=True)
def key(im):
    a=np.asarray(im.convert('RGB')).astype(np.float32)
    R,G,B=a[...,0],a[...,1],a[...,2]
    mag=(np.minimum(R,B)-G)/255
    al=np.clip((0.42-mag)/0.22,0,1)
    # despill: pull R and B down toward G where pinkish
    spill=np.clip(B-G*0.92,0,None)   # brown earth has B<G; pink fringe has B>G
    a[...,0]=R-spill*1.1; a[...,2]=B-spill
    al=al*np.clip(1-np.clip(np.minimum(R,B)-G,0,None)/90,0.0,1)   # fade strongly pink pixels
    R,G,B=a[...,0],a[...,1],a[...,2]
    mauve=(B>G*0.85)&(R>G*1.12)   # leftover mauve rim on soft earth edges: make it earth brown
    a[...,2]=np.where(mauve,G*0.78,B)
    al=ndimage.grey_erosion(al,size=(3,3))
    return a,al
def cut(sheet,names,rows,maxw=1100):
    im=Image.open(P+sheet); a,al=key(im)
    lab0,n=ndimage.label(ndimage.binary_dilation(al>0.5,iterations=4))
    sizes=ndimage.sum(np.ones_like(al),lab0,range(1,n+1)); cms=ndimage.center_of_mass(np.ones_like(al),lab0,range(1,n+1))
    seeds=sorted(range(n),key=lambda i:-sizes[i])[:len(names)]
    lab=np.zeros_like(lab0)
    for i in range(n):
        if sizes[i]<150: continue
        j=min(seeds,key=lambda k:(cms[i][0]-cms[k][0])**2+(cms[i][1]-cms[k][1])**2)
        lab[lab0==i+1]=j+1
    objs=ndimage.find_objects(lab)
    big=seeds
    H=al.shape[0]
    def rc(i):
        s=objs[i]; cy=(s[0].start+s[0].stop)/2; cx=(s[1].start+s[1].stop)/2
        return (int(cy/(H/rows)),cx)
    big.sort(key=rc)
    for nm,i in zip(names,big):
        s=objs[i]; m=ndimage.binary_dilation(lab[s]==i+1,iterations=3)
        A=al[s]*m; rgb=a[s]
        ys,xs=np.where(A>0.02); y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
        o=np.dstack([rgb,A[...,None]*255])[y0:y1,x0:x1].clip(0,255).astype(np.uint8)
        img=Image.fromarray(o)
        if img.width>maxw: img=img.resize((maxw,int(img.height*maxw/img.width)),Image.LANCZOS)
        img.save(OUT+nm+'.webp',quality=90); print(nm,img.size)
cut('01-stump-dig-a.jpeg',['lanternstump','stump-1','stump-2'],1)
cut('02-stump-dig-b.jpeg',['stump-c2','stump-c4','stump-4'],1)
cut('03-broken-stump.jpeg',['stumps-rocks-02','stumps-rocks-08'],1)
cut('04-fallen-log.jpeg',['stumps-rocks-06','stumps-rocks-12'],2)
cut('05-woodpile.jpeg',['woodpile-1','woodpile-2','woodpile-3'],1)
cut('06-stick-pile.jpeg',['stick-pile-1','stick-pile-2','stick-pile-3','stick-pile-4'],2)
cut('07-workcorner.jpeg',['yard-workcorner'],1)
cut('08-heap-stages.jpeg',['heap-1','heap-2','heap-3-old','heap-4-old'],2)
# Bryce (round eleven follow-up, twice): the last stages have no rubbish and END IN A PIT
cut('12-heap-pit-flat.png',['heap-3','heap-4'],1)          # gentle angle, matches heap-1/2 (only 1024 px: Chrome blocked the full download)
cut('11-heap-pit.jpeg',['heap-3-deep','heap-4-deep'],1)    # same two seen from higher up, full size, a spare
