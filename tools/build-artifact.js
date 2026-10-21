#!/usr/bin/env node
// Paylaşılabilir (claude.ai Artifact) sürüm için sayfa gövdesini üretir.
// Artifact yayıncısı <head>/<body> iskeletini kendisi ekler; bu yüzden index.html'in
// yalnızca başlığını, stilini ve <body> içeriğini alırız. Kaynak dosyalar aynı yollarla yayınlanır.
// Kullanım: node tools/build-artifact.js <çıkış-klasörü>
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const out = path.resolve(process.argv[2] || path.join(ROOT, 'dist'));
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const body = /<body>([\s\S]*)<\/body>/.exec(html)[1];

const page = `<title>CİCO</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="src/ui/styles.css">
${body.trim()}
`;
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), page);

// Yayınlanacak dosyalar: index.html'de geçen script'ler, stil ve sahne görselleri
const files = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);
files.push('src/ui/styles.css', 'assets/logo.png');
const story = require(path.join(ROOT, 'src/story/chapter1.js'));
story.scenes.forEach((s) => [s.image_asset, s.ambient_video, s.video_asset].forEach((f) => f && files.push(f)));
const list = [...new Set(files)];
list.forEach((f) => { if (!fs.existsSync(path.join(ROOT, f))) throw new Error('Eksik dosya: ' + f); });
fs.writeFileSync(path.join(out, 'files.json'), JSON.stringify(Object.fromEntries(list.map((f) => [f, f])), null, 2));
console.log(`✓ ${path.join(out, 'index.html')} · ${list.length} dosya`);
