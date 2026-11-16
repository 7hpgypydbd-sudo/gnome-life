import sys;sys.path.insert(0,'.')
import numpy as np
from key import key
from PIL import Image
p=key('raw/pond-new-1.jpg')
a=np.asarray(p).astype(float)
R,G,B,A=[a[...,i] for i in range(4)]
# pink/mauve rim despill on mud
B=np.where(B>G,G+(B-G)*0.3,B); R=np.where((R>1.15*G)&(B>0.85*G),np.minimum(R,1.15*G+8),R)
a[...,0]=R;a[...,2]=B
p=Image.fromarray(np.clip(a,0,255).astype('uint8'))
ref=Image.open('../gnome-life/sprites/garden-hollow-rain.webp').convert('RGBA'); bb=ref.getbbox(); print('ref',ref.size,bb)
q=p.resize((bb[2]-bb[0],bb[3]-bb[1]),Image.LANCZOS)
out=Image.new('RGBA',ref.size,(0,0,0,0)); out.alpha_composite(q,(bb[0],bb[1]))
out.save('cut/garden-pond-new.png'); out.save('cut/garden-pond-new.webp',quality=90,method=6); print(out.size)
