#!/usr/bin/env node
/*
 * Uygulama kabuğu (Capacitor) için www/ klasörünü hazırlar.
 *   node tools/build-www.js                 → videolar sunucudan akar (varsayılan)
 *   node tools/build-www.js --bundle-videos → videolar da paketin içine kopyalanır (çevrimdışı test için)
 *   CICO_MEDIA_BASE=https://cdn.example.com/cico/ node tools/build-www.js → video sunucusunu değiştir
 *
 * Pakete girenler: index.html, src/ (motor, veri, diller, arayüz), sahne görselleri (.jpg), logo/ikon,
 * bölüm müziği. Girmeyenler: PNG masterlar, video masterları, inceleme sayfaları, belgeler, testler.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'www');
const bundleVideos = process.argv.includes('--bundle-videos');
const MEDIA_BASE = process.env.CICO_MEDIA_BASE || 'https://grafikerkafasi.github.io/cico/';

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const copy = (rel) => {
  const from = path.join(ROOT, rel);
  const to = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
};
const copyDir = (rel, filter = () => true) => {
  const dir = path.join(ROOT, rel);
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(rel, name);
    const st = fs.statSync(path.join(ROOT, p));
    if (st.isDirectory()) { if (!name.startsWith('_') && !name.startsWith('.')) copyDir(p, filter); }
    else if (filter(name, p)) copy(p);
  }
};

// Kod ve veri
copyDir('src', (n) => /\.(js|css)$/.test(n));
// Görseller (yalnızca web JPEG'leri; _v1/_v2 yedekleri hariç), logo, ikon, manifest
copyDir('assets/scenes', (n) => /\.jpg$/.test(n) && !/_v\d+\.jpg$/.test(n));
// Mini oyun katmanları (jiroskop kaçışları: zemin JPEG, saydam sprite PNG)
copyDir('assets/game', (n) => /\.(jpg|png)$/.test(n));
['assets/logo.png', 'assets/icon.svg', 'manifest.webmanifest'].forEach((f) => fs.existsSync(path.join(ROOT, f)) && copy(f));
// Müzik paketin içinde (2.4 MB); videolar varsayılan olarak sunucudan
copyDir('assets/audio', (n) => /\.(mp3|m4a)$/.test(n));
if (bundleVideos) copyDir('assets/video', (n) => /\.mp4$/.test(n) && !/_v0\.mp4$/.test(n));

// index.html: önbellek parametrelerini temizle, video sunucusunu yaz
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').replace(/\?v=\d+/g, '');
const base = bundleVideos ? '' : MEDIA_BASE;
html = html.replace('<head>', `<head>\n  <script>window.CICO_MEDIA_BASE = ${JSON.stringify(base)};</script>`);
fs.writeFileSync(path.join(OUT, 'index.html'), html);

// Özet
let total = 0, count = 0;
(function walk(d) { for (const n of fs.readdirSync(d)) { const p = path.join(d, n); const s = fs.statSync(p); if (s.isDirectory()) walk(p); else { total += s.size; count++; } } })(OUT);
console.log(`✓ www/ hazır · ${count} dosya · ${(total / 1048576).toFixed(1)} MB · videolar: ${bundleVideos ? 'pakette' : 'sunucudan (' + MEDIA_BASE + ')'}`);
