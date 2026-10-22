#!/usr/bin/env bash
# Sahne kliplerini web/mobil için sıkıştırır (Flow çıktıları 1.3–8 MB → hedef ~0.6–1.2 MB / 8 sn).
#   Gerekli: ffmpeg  (macOS: brew install ffmpeg)
#   Kullanım: bash tools/compress-videos.sh            → assets/video/*.mp4 dosyalarını yerinde küçültür
#   Orijinaller assets/video/_master/ altına bir kez taşınır (yeniden sıkıştırma hep masterdan yapılır).
#
# Ayarlar: H.264 High, 540x960 (9:16), CRF 28, AAC 80 kbps, +faststart (indirme bitmeden oynar).
#          Döngü dikişini bozmamak için kare sayısı ve süre korunur.
#          Ses: yalnızca FADE_ONLY kliplerinde (varsayılan O1) başta 0.35 sn fade-in, sonda 0.45 sn fade-out
#          (iOS video sesini koddan kısmaya izin vermediği için yumuşatma dosyanın içine gömülür).
set -euo pipefail
cd "$(dirname "$0")/.."
FF=$(command -v ffmpeg || echo /usr/local/bin/ffmpeg)
[ -x "$FF" ] || { echo "ffmpeg yok → https://evermeet.cx/ffmpeg/"; exit 1; }
FADE_ONLY="${FADE_ONLY:-O1}"
mkdir -p assets/video/_master
for f in assets/video/*.mp4; do
  name=$(basename "$f")
  case "$name" in *_v0.mp4) continue;; esac
  master="assets/video/_master/$name"
  [ -f "$master" ] || cp "$f" "$master"
  tmp="assets/video/_master/.tmp_$name"
  dur=$( ("$FF" -hide_banner -i "$master" 2>&1 || true) | sed -n 's/.*Duration: \([0-9:.]*\).*/\1/p' | awk -F: '{print $1*3600+$2*60+$3}')
  fo=$(awk -v d="$dur" 'BEGIN{printf "%.2f", d-0.45}')
  # Ses yumuşatma yalnızca FADE_ONLY listesindeki kliplerde (şimdilik yalnızca açılış sahnesi O1)
  af=""
  case " $FADE_ONLY " in *" ${name%%_*} "*) af="-af afade=t=in:st=0:d=0.35,afade=t=out:st=${fo}:d=0.45";; esac
  "$FF" -loglevel error -y -i "$master" \
    -vf "scale=540:960:flags=lanczos,format=yuv420p" \
    $af \
    -c:v libx264 -profile:v high -preset slow -crf 28 -g 48 \
    -c:a aac -b:a 80k -ac 2 \
    -movflags +faststart "$tmp"
  mv "$tmp" "$f"
  printf '%-40s %6s KB → %6s KB\n' "$name" "$(( $(stat -f%z "$master") / 1024 ))" "$(( $(stat -f%z "$f") / 1024 ))"
done
total=0; for f in assets/video/*.mp4; do total=$(( total + $(stat -f%z "$f") )); done
echo "Toplam (masterlar hariç): $(( total / 1048576 )) MB"
