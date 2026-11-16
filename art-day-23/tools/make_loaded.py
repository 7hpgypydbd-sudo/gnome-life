from PIL import Image, ImageDraw, ImageFilter, ImageChops
K=4
l=Image.open('cut/barrow-loaded-full.png');o=Image.open('../gnome-life/sprites/wheelbarrow.webp').convert('RGBA');bb=o.getbbox();o=o.crop(bb)
O=o.resize((o.width*K,o.height*K),Image.LANCZOS);L=l.resize(O.size,Image.LANCZOS)
pts=[(55,0),(55,44),(62,47),(174,111),(250,69),(261,69),(261,0)]
m=Image.new('L',O.size,0);ImageDraw.Draw(m).polygon([(x*K,y*K) for x,y in pts],fill=255);m=m.filter(ImageFilter.GaussianBlur(3))
# alpha of junk region: from loaded; colour from loaded
out=O.copy()
Lm=L.copy();Lm.putalpha(ImageChops.multiply(L.getchannel('A'),m))
# clear original inside region where junk alpha present
oa=ImageChops.multiply(O.getchannel('A'),ImageChops.invert(m)); out.putalpha(oa)
out=Image.alpha_composite(out,Lm) if False else out
res=Image.new('RGBA',O.size,(0,0,0,0));res.alpha_composite(out);res.alpha_composite(Lm)
res=res.resize(o.size,Image.LANCZOS)
full=Image.new('RGBA',(o.width+bb[0]*0,o.height),(0,0,0,0));res.save('cut/wheelbarrow-loaded.png')
c=Image.new('RGBA',(o.width*2*2,o.height*2),(200,210,190,255));c.alpha_composite(o.resize((o.width*2,o.height*2)),(0,0));c.alpha_composite(res.resize((o.width*2,o.height*2)),(o.width*2,0));c.save('/private/tmp/claude-501/-Users-Talisman-Downloads/92ffeb96-16b2-47f3-9a94-95d95bddada3/scratchpad/loaded.png')
