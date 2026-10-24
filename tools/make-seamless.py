#!/usr/bin/env python3
"""Dikey tekrar eden yol dokusu: alt şeridi üst şeride yumuşakça karıştırır, dikişsiz döşenir.
Kullanım: python3 tools/make-seamless.py girdi.png çıktı.jpg [genişlik=720] [karışım_oranı=0.18]"""
import sys
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
W = int(sys.argv[3]) if len(sys.argv) > 3 else 720
frac = float(sys.argv[4]) if len(sys.argv) > 4 else 0.18
im = Image.open(src).convert('RGB')
im = im.resize((W, int(im.height * W / im.width)), Image.LANCZOS)
H = im.height; b = int(H * frac)
tile = Image.new('RGB', (W, H - b))
tile.paste(im.crop((0, b, W, H - b)), (0, b))
for r in range(b):
    a = r / b  # 0 → alttan gelen, 1 → üstteki asıl satır
    top = im.crop((0, r, W, r + 1)); bot = im.crop((0, H - b + r, W, H - b + r + 1))
    tile.paste(Image.blend(bot, top, a), (0, r))
tile.save(out, quality=86)
print(out, tile.size)
