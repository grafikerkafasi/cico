#!/usr/bin/env node
// Görsel/video üretim rehberini üretir: docs/uretim-rehberi.md
// Kaynak: production/shots.js (promptlar) + src/story/chapter1.js (akış, seçenekler, noktalar) + src/i18n/tr.js (ekran metinleri)
// Kullanım: npm run bible            (dosyayı yazar)
//           npm run bible -- --check (güncel değilse hata verir)
const fs = require('fs');
const path = require('path');
const story = require('../src/story/chapter1.js');
const tr = require('../src/i18n/tr.js');
const { sceneEdges } = require('../src/engine/engine.js');
const { createTranslator } = require('../src/engine/i18n.js');
const { STYLE, CHARACTERS, LOCATIONS, SHOTS } = require('../production/shots.js');

const t = createTranslator({ tr }, 'tr');
const FILE = path.join(__dirname, '..', 'docs', 'uretim-rehberi.md');
const byId = new Map(story.scenes.map((s) => [s.scene_id, s]));
const title = (id) => t(`scenes.${id}.title`);
const code = (id) => byId.get(id).code;

// Önceki sahneler (devamlılık için): bu sahneye ok veren sahnelerin kodları
const prev = new Map(story.scenes.map((s) => [s.scene_id, new Set()]));
story.scenes.forEach((s) => sceneEdges(s).forEach((e) => prev.get(e.to).add(s.scene_id)));

const KIND = { line: 'Anlatı', say: 'Konuşma', msg: 'Telefon mesajı', intro: 'Tanıtım slaytı' };
const quote = (s) => s.replace(/\n/g, ' ');

function screenText(s) {
  return (s.text || []).map((b0) => {
    const b = typeof b0 === 'string' ? { key: b0 } : b0;
    const key = b.key.startsWith('@') ? b.key.slice(1) : `scenes.${s.scene_id}.${b.key}`;
    const kind = b.kind || 'line';
    let who = '';
    if (kind === 'say' || kind === 'msg') who = ` — ${t(`speakers.${b.from}`)}`;
    if (kind === 'intro') who = ` — ${t(`characters.${b.who}.name`)}`;
    return `- *${KIND[kind]}${who}${b.if ? ' (koşullu)' : ''}:* ${quote(t(key))}`;
  }).join('\n');
}

function spotsTable(s, shot) {
  const visible = (s.choices || []).filter((c) => !c.hidden);
  if (!visible.length) return '';
  const rows = visible.map((c) => {
    const label = t(`scenes.${s.scene_id}.choices.${c.id}`);
    const h = c.hotspot ? `x ${c.hotspot.x}% · y ${c.hotspot.y}%` : '—';
    const obj = (shot.spots && shot.spots[c.id]) || '—';
    return `| ${label}${c.conditions ? ' 🔒' : ''} | ${obj} | ${h} |`;
  });
  return [
    '**Seçim noktaları — bu nesneler görselde bu konumlarda net görünmeli:**',
    '',
    '| Seçenek (oyunda) | Görselde ne olmalı | Konum (görselin yüzdesi; sol üst = 0,0) |',
    '|---|---|---|',
    ...rows,
  ].join('\n');
}

function sceneSection(s) {
  const shot = SHOTS[s.code];
  if (!shot) throw new Error(`production/shots.js: ${s.code} eksik`);
  const loc = LOCATIONS[shot.location];
  const before = [...prev.get(s.scene_id)].map((id) => `**${code(id)}** ${title(id)}`);
  const next = sceneEdges(s).map((e) => e.to).filter((v, i, a) => a.indexOf(v) === i).map((id) => `**${code(id)}** ${title(id)}`);
  const castLines = shot.cast.map((k) => `[${CHARACTERS[k].name}]`).join(' + ');
  const imagePrompt = [
    `[STYLE] ${STYLE.look} ${STYLE.frame}`,
    `[LOCATION: ${loc.name}] ${loc.prompt}`,
    ...shot.cast.map((k) => `[CHARACTER] ${CHARACTERS[k].prompt}`),
    `[SCENE ${s.code}] ${shot.image}`,
    shot.spots ? `[MUST BE CLEARLY VISIBLE] ${Object.entries(shot.spots).map(([id, obj]) => {
      const c = s.choices.find((x) => x.id === id);
      return `${obj} at about ${c.hotspot.x}% from the left and ${c.hotspot.y}% from the top`;
    }).join('; ')}.` : '',
    `[RULES] ${STYLE.rules.join(' ')}`,
    `[AVOID] ${STYLE.negative}`,
  ].filter(Boolean).join('\n');

  return `---

## ${s.code} · ${title(s.scene_id)}

| | |
|---|---|
| Tür | ${{ cinematic: 'Sinematik (seçimsiz)', choice: 'Karar', interaction: 'Aksiyon (süreli)', ending: 'Son' }[s.scene_type]}${s.timer ? ` · ⏱ ${s.timer.seconds} sn` : ''} |
| Önceki sahne | ${before.length ? before.join(', ') : '— (oyunun başı)'} |
| Sonraki sahne | ${next.length ? next.join(', ') : '— (bölüm sonu)'} |
| Mekân | ${loc.name} |
| Kadro | ${castLines} |
| Zaman / ışık | ${shot.time} |
| Dosya adı | \`${s.code}.png\` (görsel) · \`${s.code}.mp4\` (video)${shot.loop ? ' · döngü' : ''} |
| Mevcut | ${s.ambient_video ? 'görsel ✓ · video ✓' : s.image_asset ? 'görsel ✓' : 'henüz yok'} |

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

${screenText(s)}

${spotsTable(s, shot)}

**Görsel promptu (ChatGPT):**

\`\`\`text
${imagePrompt}
\`\`\`

**Video promptu (Google Flow · görselden videoya · 9:16):**

\`\`\`text
${shot.video}${shot.loop ? ' Start and end on the same frame so the clip loops seamlessly (use this image as both first and last frame if available).' : ''}
\`\`\`

**Devamlılık kontrolü:**

${['Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)', ...shot.continuity].map((c) => `- [ ] ${c}`).join('\n')}
`;
}

function build() {
  const order = story.scenes;
  const chars = Object.entries(CHARACTERS).map(([k, c]) => `### ${c.name}\n\n${c.tr}${c.ref ? `\n\n*Referans:* ${c.ref}` : ''}\n\n\`\`\`text\n${c.prompt}\n\`\`\``).join('\n\n');
  const locs = Object.entries(LOCATIONS).map(([k, l]) => {
    const used = order.filter((s) => SHOTS[s.code] && SHOTS[s.code].location === k).map((s) => s.code).join(', ');
    return `### ${l.name}\n\n*Kullanıldığı sahneler:* ${used}${l.ref ? `\n\n*Referans:* ${l.ref}` : ''}\n\n\`\`\`text\n${l.prompt}\n\`\`\``;
  }).join('\n\n');
  const index = order.map((s) => `| **${s.code}** | ${title(s.scene_id)} | ${[...prev.get(s.scene_id)].map(code).join(', ') || '—'} | ${LOCATIONS[SHOTS[s.code].location].name} |`).join('\n');

  return `# CİCO · Bölüm 1 "Gece Vardiyası" — Görsel ve Video Üretim Rehberi

> Bu dosya oyunun verisinden üretilir (\`npm run bible\`). Elle düzenlemeyin; promptlar \`production/shots.js\` içinde.

## Nasıl kullanılır

1. **ChatGPT'de yeni bir sohbet aç**, bu dosyayı yükle ve aşağıdaki talimatı ilk mesaj olarak yapıştır. Karakter ve scooter referans sayfalarını da ekle.
2. Sonra yalnızca kodu yaz: **"O1"**, **"A3"**, **"SB2"**… ChatGPT o sahnenin görselini üretir.
3. Görseli **kodla adlandırarak** indir (ör. \`A3.png\`).
4. **Google Flow**'da "görselden videoya" (Frames to Video) seç, en-boy oranını **dikey 9:16** yap, görseli başlangıç karesi olarak yükle ve sahnenin **video promptunu** yapıştır. Döngü sahnelerinde, destekleniyorsa aynı görseli bitiş karesi olarak da ver.
5. Videoyu da kodla adlandır (\`A3.mp4\`) ve görselle birlikte bana gönder; oyuna ben eklerim.

**Önerilen üretim sırası:** önce bir katmanı baştan sona üret (O1 → O2 → A1 → … ), sonra diğerini. Böylece her görsel bir öncekine bakılarak üretilir.

### ChatGPT'ye ilk mesaj (kopyala-yapıştır)

\`\`\`text
You are the production artist for "CİCO", a mobile interactive story game set in night-time Istanbul.
The attached markdown file is the production bible. It contains a global style, character sheets, location sheets and one section per scene, each identified by a short code (O1, O2, A1…A6, B1…B5, SA1…SA5, SB1…SB4).

When I send you a scene code:
1. Find that scene's section and generate exactly ONE image in a vertical 9:16 portrait frame, using its "Görsel promptu" block.
2. Keep every character IDENTICAL to the character sheets and to the images you already created in this chat (face, outfit, colours, the "26" badge on Cico's LEFT shoulder, the half-open helmet, the green scooter with plate 34 AEA 8430 and no logos).
3. Keep visual continuity with the scene listed as "Önceki sahne" if you created it in this chat: same lighting, weather, wardrobe state, props.
4. Place the objects listed under "Seçim noktaları" clearly visible at the given positions (percent from the left / from the top). The game puts tappable markers there.
5. Never add readable text, captions, UI, logos or watermarks. Phone screens show only a glow. Keep the top 14% and the bottom 20% free of important details.
6. After the image, write one short line in Turkish: the scene code and any continuity choice you made.
If I attach reference images, treat them as canonical.
\`\`\`

## Ortak stil

\`\`\`text
${STYLE.look}
${STYLE.frame}
\`\`\`

**Kurallar:**

${STYLE.rules.map((r) => `- ${r}`).join('\n')}

**Kaçınılacaklar:** \`${STYLE.negative}\`

**Ekran yerleşimi (9:16):** üst %14 bildirim kartları ve duraklat düğmesi · alt %20 altyazı · seçim noktaları genelde %30–75 yükseklik arasında.

## Karakter ve araç kartları

${chars}

## Mekân kartları

${locs}

## Sahne dizini

| Kod | Sahne | Önceki | Mekân |
|---|---|---|---|
${index}

${order.map(sceneSection).join('\n')}
`;
}

if (require.main === module) {
  const md = build();
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(FILE) || fs.readFileSync(FILE, 'utf8') !== md) { console.error('docs/uretim-rehberi.md güncel değil → npm run bible'); process.exit(1); }
    console.log('✓ docs/uretim-rehberi.md güncel');
  } else {
    fs.writeFileSync(FILE, md);
    console.log(`✓ ${FILE} (${md.length} karakter)`);
  }
}
module.exports = { build, FILE };
