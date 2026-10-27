#!/usr/bin/env python3
"""Flow'dan inen Bölüm 2 kliplerini sahne koduna eşler.
Flow dosyaları rastgele adla iner (Animate_image_..._<hash>.mp4). Her klibin ilk karesi
81 sahne görseliyle karşılaştırılır; en yakın görselin kodu verilir ve klip
assets/video/c2/_master/<KOD>.mp4 olarak taşınır. Aynı koda ikinci klip gelirse _v2, _v3 eklenir.
Kullanım: python3 tools/match-c2-videos.py [indirme-klasörü]
"""
import glob, os, subprocess, sys, shutil, tempfile
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'assets/scenes')
OUT = os.path.join(ROOT, 'assets/video/c2/_master')
FF = shutil.which('ffmpeg') or '/usr/local/bin/ffmpeg'
os.makedirs(OUT, exist_ok=True)

def vec(img):
    im = img.convert('L').resize((36, 64), Image.BILINEAR)
    a = np.asarray(im, dtype=np.float32)
    a -= a.mean(); a /= (a.std() + 1e-6)
    return a.ravel()

refs = {}
for f in glob.glob(os.path.join(ROOT, 'assets/scenes/c2/*.jpg')):
    refs[os.path.basename(f)[:-4]] = vec(Image.open(f))

tmp = tempfile.mkdtemp()
for mp4 in sorted(glob.glob(os.path.join(SRC, '*.mp4')), key=os.path.getmtime):
    fr = os.path.join(tmp, 'f.png')
    subprocess.run([FF, '-loglevel', 'error', '-y', '-ss', '0.05', '-i', mp4, '-frames:v', '1', fr], check=True)
    v = vec(Image.open(fr))
    scores = sorted(((float(np.dot(v, r) / len(v)), k) for k, r in refs.items()), reverse=True)
    (s1, code), (s2, code2) = scores[0], scores[1]
    dest = os.path.join(OUT, code + '.mp4'); n = 2
    while os.path.exists(dest):
        dest = os.path.join(OUT, f'{code}_v{n}.mp4'); n += 1
    shutil.move(mp4, dest)
    flag = '' if s1 > 0.8 and s1 - s2 > 0.05 else '  ⚠ kontrol et'
    print(f'{os.path.basename(mp4)[-14:]:>14} → {os.path.basename(dest):16} {s1:.2f} (2.: {code2} {s2:.2f}){flag}')
