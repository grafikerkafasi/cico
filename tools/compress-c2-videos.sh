#!/usr/bin/env bash
# Bölüm 2 kliplerini web/mobil için sıkıştırır: assets/video/c2/_master/<KOD>.mp4 → assets/video/c2/<KOD>.mp4
# Ayarlar Bölüm 1 ile aynı: 540x960, H.264 High CRF 28, AAC 80 kbps, +faststart; kare sayısı korunur (döngü dikişi bozulmaz).
# _v2/_v3 yedekleri atlanır. Zaten güncel olan dosya yeniden sıkıştırılmaz.
set -euo pipefail
cd "$(dirname "$0")/.."
FF=$(command -v ffmpeg || echo /usr/local/bin/ffmpeg)
mkdir -p assets/video/c2
# Arka planda konuşma/dil duyulan klipler: konuşmanın anlaşılır bandı (300–5000 Hz) kesilir, dil kaybolur,
# ortam sesi boğuk bir zemin olarak kalır. Yeni istemle yeniden üretilince listeden çıkarılmalı.
NOVOICE=" 2A5b 2B2b 2A2 2A2-a 2A2-b 2A2-d 2A4 2A4-a 2A4-b 2A4-c "
# Gemini'de üretilen klipler (10 sn; Flow 8 sn): ses Flow'dan ~20 dB kısık gelir; yükseltilip tepe sınırlanır
GF="volume=16dB,alimiter=limit=0.7"
VF="asplit[a][b];[a]lowpass=f=300,lowpass=f=300,volume=1.8[l];[b]highpass=f=5000,highpass=f=5000,volume=0.7[h];[l][h]amix=inputs=2:normalize=0"
for m in assets/video/c2/_master/*.mp4; do
  name=$(basename "$m"); case "$name" in *_v[0-9]*.mp4) continue;; esac
  out="assets/video/c2/$name"
  [ -f "$out" ] && [ "$out" -nt "$m" ] && [ "${FORCE:-}" != 1 ] && continue
  af=(); case "$NOVOICE" in *" ${name%.mp4} "*) af=(-af "$VF");; esac
  dur=$( ("$FF" -hide_banner -i "$m" 2>&1 || true) | sed -n 's/.*Duration: 00:00:\([0-9]*\).*/\1/p')
  [ "${dur:-8}" -ge 9 ] && af=(-af "$GF")
  "$FF" -loglevel error -y -i "$m" ${af[@]+"${af[@]}"} -vf "scale=540:960:flags=lanczos,format=yuv420p" \
    -c:v libx264 -profile:v high -preset slow -crf 28 -g 48 -c:a aac -b:a 80k -ac 2 -movflags +faststart "$out"
  printf '%-14s %6s KB → %5s KB\n' "$name" "$(( $(stat -f%z "$m") / 1024 ))" "$(( $(stat -f%z "$out") / 1024 ))"
done
total=0; for f in assets/video/c2/*.mp4; do total=$(( total + $(stat -f%z "$f") )); done
echo "Bölüm 2 toplam: $(( total / 1048576 )) MB"
