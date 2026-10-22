#!/usr/bin/env bash
# Sahne kliplerini web/mobil için sıkıştırır (Flow çıktıları 1.3–8 MB → hedef ~0.6–1.2 MB / 8 sn).
#   Gerekli: ffmpeg  (macOS: brew install ffmpeg)
#   Kullanım: bash tools/compress-videos.sh            → assets/video/*.mp4 dosyalarını yerinde küçültür
#   Orijinaller assets/video/_master/ altına bir kez taşınır (yeniden sıkıştırma hep masterdan yapılır).
#
# Ayarlar: H.264 High, 540x960 (9:16), CRF 28, AAC 80 kbps, +faststart (indirme bitmeden oynar).
#          Döngü dikişini bozmamak için kare sayısı ve süre korunur.
set -euo pipefail
cd "$(dirname "$0")/.."
command -v ffmpeg >/dev/null || { echo "ffmpeg yok → brew install ffmpeg"; exit 1; }
mkdir -p assets/video/_master
for f in assets/video/*.mp4; do
  name=$(basename "$f")
  case "$name" in *_v0.mp4) continue;; esac
  master="assets/video/_master/$name"
  [ -f "$master" ] || cp "$f" "$master"
  tmp="$(mktemp -t cico).mp4"
  ffmpeg -loglevel error -y -i "$master" \
    -vf "scale=540:960:flags=lanczos,format=yuv420p" \
    -c:v libx264 -profile:v high -preset slow -crf 28 -g 48 \
    -c:a aac -b:a 80k -ac 2 \
    -movflags +faststart "$tmp"
  mv "$tmp" "$f"
  printf '%-40s %6s KB → %6s KB\n' "$name" "$(( $(stat -f%z "$master") / 1024 ))" "$(( $(stat -f%z "$f") / 1024 ))"
done
du -sh assets/video --exclude=_master 2>/dev/null || du -sh assets/video
