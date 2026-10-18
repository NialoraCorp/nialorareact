"""Gri/vinyetli stüdyo zemininden kesim: kenardan gradyan-toleranslı flood-fill
(komşu farkı <= tol, min kanal >= floor), yansıma kesimi ve cam taban saydamlığı.

  python3 scripts/cutout_gradient.py <src> <out.png> <height> [crop=x:y:w:h] [tol=7] [floor=150] [cut_from=0.83] [glass_from=0.70] [glass_start=190]
"""
import subprocess, sys, json
from collections import deque
src, out, height = sys.argv[1], sys.argv[2], int(sys.argv[3])
arg = lambda i, d: type(d)(sys.argv[i]) if len(sys.argv) > i else d
crop = arg(4, '')
tol, floor = arg(5, 7), arg(6, 150)
cut_from, glass_from, glass_start = arg(7, 0.83), arg(8, 0.70), arg(9, 190)
vf = []
if crop:
    x, y, w, h = crop.split(':'); vf.append(f'crop={w}:{h}:{x}:{y}'); W0, H0 = int(w), int(h)
else:
    st = json.loads(subprocess.run(['ffprobe','-v','quiet','-print_format','json','-show_streams',src],capture_output=True).stdout)['streams'][0]; W0, H0 = st['width'], st['height']
H = height; W = round(W0 * H / H0 / 2) * 2
vf.append(f'scale={W}:{H}:flags=lanczos')
raw = subprocess.run(['ffmpeg','-v','error','-i',src,'-vf',','.join(vf),'-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
n = W*H
mn = bytearray(n)
for i in range(n):
    j=i*3; mn[i] = min(raw[j],raw[j+1],raw[j+2])
bg = bytearray(n)
def ok(i, j):
    a=i*3; b=j*3
    return (mn[j] >= floor and abs(raw[a]-raw[b])<=tol and abs(raw[a+1]-raw[b+1])<=tol and abs(raw[a+2]-raw[b+2])<=tol)
q = deque()
seeds = list(range(W)) + [(H-1)*W + x for x in range(W)] + [y*W for y in range(H)] + [y*W + W-1 for y in range(H)]
for i in seeds:
    if not bg[i] and mn[i] >= floor: bg[i]=1; q.append(i)
while q:
    i = q.popleft(); x = i % W
    for j in (i-W, i+W, i-1 if x>0 else -1, i+1 if x<W-1 else -1):
        if 0 <= j < n and not bg[j] and ok(i, j): bg[j]=1; q.append(j)
cut_row = int(cut_from*H); glass_row = int(glass_from*H)
for i in range(cut_row*W, n): bg[i] = 1
# küçük delikleri kapat
for _ in range(2):
    flips=[]
    for i in range(n):
        if bg[i]: continue
        x=i%W; c=0
        if i>=W and bg[i-W]: c+=1
        if i+W<n and bg[i+W]: c+=1
        if x>0 and bg[i-1]: c+=1
        if x<W-1 and bg[i+1]: c+=1
        if c>=3: flips.append(i)
    for i in flips: bg[i]=1
alpha = bytearray(n)
for i in range(n):
    if bg[i]: continue
    x=i%W; y=i//W; a=255
    if y >= glass_row and mn[i] >= glass_start:
        a = int(255 - (mn[i]-glass_start)/(255-glass_start) * 215)
    nb = (i>=W and bg[i-W]) or (i+W<n and bg[i+W]) or (x>0 and bg[i-1]) or (x<W-1 and bg[i+1])
    if nb: a = min(a, 120 if y < glass_row else 80)
    alpha[i] = max(0, min(255, a))
rgba = bytearray(n*4)
for i in range(n):
    j=i*3; k=i*4
    rgba[k]=raw[j]; rgba[k+1]=raw[j+1]; rgba[k+2]=raw[j+2]; rgba[k+3]=alpha[i]
subprocess.run(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgba','-s',f'{W}x{H}','-i','-','-frames:v','1',out],input=bytes(rgba),check=True)
print(f'{out}: {W}x{H}, bg {sum(bg)/n:.1%}')
