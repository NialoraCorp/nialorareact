"""Beyaz zeminli ürün fotoğrafından şeffaf kesim (PNG, alpha).

  python3 scripts/cutout.py <src.jpg> <out.png> <height> [thr=232] [soft_thr=196] [soft_from=0.74] [cut_from=0.905] [glass_from=0.80] [glass_start=185]

1. Kenardan flood-fill: min(r,g,b) > thr olan, kenara bağlı pikseller arka plan.
2. Alt bölge (soft_from·H ve altı): daha gevşek eşik (soft_thr) ile yumuşak gölge/yansıma da temizlenir.
3. cut_from·H altındaki her şey (zemin yansıması) atılır.
4. Cam taban (glass_from·H altı): içeriden görünen beyaz zemin, parlaklığa göre yarı saydam yapılır.
5. Kenar pikselleri yumuşatılır (beyaz halo kalmasın).
"""
import subprocess, sys, json
from collections import deque

src, out, height = sys.argv[1], sys.argv[2], int(sys.argv[3])
arg = lambda i, d: type(d)(sys.argv[i]) if len(sys.argv) > i else d
thr, soft_thr = arg(4, 232), arg(5, 196)
soft_from, cut_from, glass_from = arg(6, 0.74), arg(7, 0.905), arg(8, 0.80)
glass_start = arg(9, 185)

info = json.loads(subprocess.run(['ffprobe','-v','quiet','-print_format','json','-show_streams',src],capture_output=True).stdout)
st = info['streams'][0]; W0, H0 = st['width'], st['height']
H = height; W = round(W0 * H / H0 / 2) * 2
raw = subprocess.run(['ffmpeg','-v','error','-i',src,'-vf',f'scale={W}:{H}:flags=lanczos','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
n = W*H
mn = bytearray(n)
for i in range(n):
    j = i*3; mn[i] = min(raw[j], raw[j+1], raw[j+2])

bg = bytearray(n)
soft_row = int(soft_from*H); cut_row = int(cut_from*H); glass_row = int(glass_from*H)
def is_bg_candidate(i):
    return mn[i] > (soft_thr if i // W >= soft_row else thr)

q = deque()
seeds = list(range(W)) + [(H-1)*W + x for x in range(W)] + [y*W for y in range(H)] + [y*W + W-1 for y in range(H)]
for i in seeds:
    if not bg[i] and is_bg_candidate(i): bg[i] = 1; q.append(i)
while q:
    i = q.popleft(); x = i % W
    for j in (i-W, i+W, i-1 if x>0 else -1, i+1 if x<W-1 else -1):
        if 0 <= j < n and not bg[j] and is_bg_candidate(j): bg[j] = 1; q.append(j)
for i in range(cut_row*W, n): bg[i] = 1

alpha = bytearray(n)
for i in range(n):
    if bg[i]: continue
    x = i % W; y = i // W
    a = 255
    if y >= glass_row and mn[i] >= glass_start:
        a = int(255 - (mn[i]-glass_start)/(255-glass_start) * 215)   # parlak cam → saydam (alt sınır 40)
    nb = (i>=W and bg[i-W]) or (i+W<n and bg[i+W]) or (x>0 and bg[i-1]) or (x<W-1 and bg[i+1])
    if nb: a = min(a, max(0, int((255-mn[i])*2.0)), 150 if y < glass_row else 90)
    alpha[i] = max(0, min(255, a))

rgba = bytearray(n*4)
for i in range(n):
    j=i*3; k=i*4
    rgba[k]=raw[j]; rgba[k+1]=raw[j+1]; rgba[k+2]=raw[j+2]; rgba[k+3]=alpha[i]
subprocess.run(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgba','-s',f'{W}x{H}','-i','-','-frames:v','1',out],input=bytes(rgba),check=True)
print(f'{out}: {W}x{H}, bg {sum(bg)/n:.1%}')
