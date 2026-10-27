#!/usr/bin/env node
/*
 * Bölüm 2 oyun verisini üretir: production/chapter2-script.js (metinler, akış panosuyla ortak kaynak)
 *   → src/story/chapter2.js   (sahneler, koşullar, etkiler; metin yok)
 *   → src/story/chapter2.tr.js     (Türkçe metinler; tarayıcıda locales.tr içine katılır)
 * Kullanım: node tools/gen-chapter2.js
 *
 * Bölüm 1'den taşınan durum (oyun Bölüm 1 sonunda kaydeder):
 *   c1_end      : 'SA1'…'SA5' | 'SB1'…'SB4'
 *   c1_chief    : 'stayed' | 'chased' | null
 *   c1_earnings : Bölüm 1 kazancı (kira açığı 1.400 ₺)
 */
const fs = require('fs');
const path = require('path');
const script = require('../production/chapter2-script.js');

const ROOT = path.join(__dirname, '..');
const id = (code) => 'c2_' + code.toLowerCase();
const S = script.scenes;

// Konuşmacı adları → kimlik
const WHO = { Filiz: 'teacher', Endurocu: 'enduro', 'Paltolu adam': 'man', 'Kabile Şefi': 'chief', 'Mendilci çocuk': 'kid', Annem: 'mom', ROTA: 'rota', Cico: 'cico', Kurye: 'courier', 'Bilinmeyen numara': 'unknown' };

// "yalnızca" etiketleri → koşul
const C1 = (e) => ({ var: 'c1_end', eq: e });
const ONLY = {
  'SA1 · Sessizlik': C1('SA1'), 'SA2 · Kabile': C1('SA2'), 'SA3 · Paket Bende': C1('SA3'), 'SA4 · Düşüş': C1('SA4'),
  'SB1 · Kontak Kapatma': C1('SB1'), 'SB2 · Manşet': C1('SB2'), 'SB4 · Kanıt': C1('SB4'),
  "Bölüm 1'de paketi seçtiyse": null,
  'kira ödenmediyse': { var: 'c1_earnings', lt: 1400 }, 'kira ödendiyse': { var: 'c1_earnings', gte: 1400 },
  "Endurocu'ya anlattıysa": { flag: 'told_enduro' },
  'kabul ettiyse': { var: 'offer', eq: 'accept' }, 'sustuysa': { var: 'offer', eq: 'silent' },
  'planı yazdıysa': { flag: 'wrote_plan' },
  "Bölüm 1'de yanında kaldıysa": { var: 'c1_chief', eq: 'stayed' }, "Bölüm 1'de kovaladıysa": { var: 'c1_chief', eq: 'chased' },
};

// Kilitler → koşul
const LOCK = {
  liste: { var: 'c1_end', eq: 'SA4' },
  'diskler / liste': { any: [C1('SA3'), C1('SA4')] },
  içeriden: C1('SA5'),
  'fotoğraf / kanıt': { any: [C1('SB2'), C1('SB4')] },
  köstebek: C1('SB3'),
};

// Seçenek etkileri: sahne kodu → seçenek sırası → etki
const FX = {
  '2A2': [[{ add: { earnings: 150, filiz: -1 } }], [{ add: { filiz: 1 } }], [{ add: { filiz: 2 } }], [{ add: { earnings: 150 }, set: { hesitated: true } }]],
  '2A4': [[{ add: { filiz: 1 } }], [{ add: { earnings: 150 } }], [{ set: { hesitated: true } }]],
  '2A7': [[{ set: { told_enduro: true } }], [], []],
  '2A9': [[{ set: { offer: 'accept' } }], [{ set: { offer: 'refuse' } }], [{ set: { offer: 'play' } }], [{ set: { offer: 'wipe' } }], [{ set: { offer: 'silent', hesitated: true } }]],
  '2A10': [[{ add: { filiz: 2 } }], [{ add: { filiz: 1 } }], []],
  '2B2': [[{ set: { locker: 'put' } }], [{ set: { locker: 'warn' }, add: { filiz: 2 } }], [{ set: { locker: 'photo', evidence: true } }], [{ set: { locker: 'put', hesitated: true } }]],
  '2B5': [[{ set: { fund: 'took' } }], [{ set: { fund: 'refused' } }], [{ set: { fund: 'tested' } }]],
  '2B7': [[{ add: { filiz: 2 } }], [{ add: { filiz: 1 } }], [], [{ add: { filiz: 3 }, set: { confessed_filiz: true } }]],
  '2B9': [[], [], [{ set: { confessed: true } }], [{ set: { wrote_plan: true } }], [{ set: { hesitated: true } }]],
};

// Koşullu geçişler (önceki karara göre)
const OFFER = (v) => ({ var: 'offer', eq: v });
const NEXT = {
  '2A13a': [{ if: OFFER('refuse'), goto: id('2SA1') }, { if: OFFER('play'), goto: id('2SA2') }, { if: OFFER('wipe'), goto: id('2SA6') }, { if: OFFER('accept'), goto: id('2SA4') }, { goto: id('2SA5') }],
  '2A13b': [{ if: OFFER('accept'), goto: id('2SA4') }, { if: OFFER('silent'), goto: id('2SA5') }, { goto: id('2SA3') }],
  '2B2b': [{ if: { var: 'c1_chief', eq: 'chased' }, goto: id('2B3b') }, { goto: id('2B3a') }],
  '2B11a': [{ if: { flag: 'confessed' }, goto: id('2SB6') }, { if: { flag: 'evidence' }, goto: id('2SB2') }, { goto: id('2SB1') }],
  '2B11b': [{ if: { var: 'locker', eq: 'put' }, goto: id('2SB5') }, { goto: id('2SB4') }],
};

// Görselin üzerindeki seçim noktaları (seçenek sayısına göre yayılır; yüzün üstüne gelmesin diye kenarlarda)
const SPOTS = {
  1: [{ x: 50, y: 74, side: 'below' }],
  2: [{ x: 26, y: 62 }, { x: 74, y: 70 }],
  3: [{ x: 24, y: 54 }, { x: 76, y: 62 }, { x: 40, y: 80 }],
  4: [{ x: 22, y: 46 }, { x: 78, y: 54 }, { x: 24, y: 72 }, { x: 76, y: 82 }],
};

const scenes = [];
// Seçim sonrası sahneler: oyuncu seçiminin yaşandığını görür, sonra hikâye seçimin hedefine devam eder
const extra = [];
function afterScene(c, parentCode) {
  if (!c.after) return id(c.to);
  const code = c.after.id;
  const sid = 'c2_' + code.toLowerCase().replace('-', '_');
  const img = path.join(ROOT, 'assets/scenes/c2', `${code}.jpg`);
  extra.push({ scene_id: sid, code, scene_type: 'cinematic', after_of: parentCode, text: ['b0'], next: id(c.to),
    image_asset: fs.existsSync(img) ? `assets/scenes/c2/${code}.jpg` : `assets/scenes/c2/${parentCode}.jpg`, still_motion: true });
  tr.scenes[sid] = { title: (S[parentCode] || {}).title || code, b0: c.after.t, choices: {} };
  return sid;
}
const tr = { ui: { chapter2_title: 'Sabah Zili', c2_pick_title: 'Bölüm 1\'i nasıl bitirdin?', c2_pick_hint: 'Bölüm 2, Bölüm 1\'deki sonuna göre açılır.', c2_continue: 'Bölüm 2 · Sabah Zili', c2_new: 'yeni', c2_ready: 'Kaçışa hazır', c2_ready_sub: 'Telefonu eğerek sür', c2_gyro_title: 'Endurocu peşinde!', c2_gyro_how: 'Telefonu sağa sola eğ. Ya da ekranın iki yanına basılı tut. 35 saniye dayan.', c2_gyro_ready: 'Hazırım', c2_gyro_loading: 'Yükleniyor…', c2_gyro_caught: 'Yakalandın.', c2_gyro_retry: 'Tekrar dene', c2_gyro_cont: 'Hikâyeye devam et', c2_gyro_gap: 'Mesafe' }, speakers: { teacher: 'Filiz', enduro: 'Endurocu', courier: 'Kurye' }, characters: {}, scenes: {} };

for (const [code, s] of Object.entries(S)) {
  const sid = id(code);
  const T = (tr.scenes[sid] = { title: s.title, choices: {} });
  const text = [];
  s.beats.forEach((b, i) => {
    const key = 'b' + i;
    const cond = b.only ? ONLY[b.only] : null;
    if (b.only && !(b.only in ONLY)) throw new Error(`${code}: bilinmeyen koşul "${b.only}"`);
    const ifc = cond ? { if: cond } : {};
    if (b.k === 'i') {
      const who = WHO[b.who];
      tr.characters[who] = tr.characters[who] || { name: b.who, line: b.t };
      text.push({ key: `@characters.${who}.line`, kind: 'intro', who, ...ifc });
      return;
    }
    T[key] = b.t;
    if (b.k === 's') text.push({ key, kind: 'say', from: WHO[b.who], ...ifc });
    else if (b.k === 'm') text.push({ key, kind: 'msg', from: WHO[b.who], ...ifc });
    else if (b.k === 'g') return; // oyun açıklaması: ekranda değil
    else text.push(cond ? { key, if: cond } : key);
  });

  const scene = { scene_id: sid, code, scene_type: s.type, text };
  const img = path.join(ROOT, 'assets/scenes/c2', `${code}.jpg`);
  scene.image_asset = fs.existsSync(img) ? `assets/scenes/c2/${code}.jpg` : 'assets/scenes/c2/2A13a.jpg';
  if (s.type !== 'ending') scene.still_motion = true;

  if (s.game) {
    // Jiroskop kaçışı (src/ui/gyro.js): sonuç 'escape' ya da 'caught' seçeneği olarak motora döner
    const caught = s.choices.find((c) => c.t === 'Yakalandı').to;
    const escaped = s.choices.find((c) => c.t === 'Kaçtı').to;
    const plan = s.choices.find((c) => c.auto);
    const wrap = (to) => (plan ? [{ if: { flag: 'wrote_plan' }, goto: id(plan.to) }, { goto: id(to) }] : id(to));
    scene.scene_type = 'interaction';
    scene.game = { type: 'gyro', set: code.startsWith('2A') ? 'A' : 'B', seconds: 35 };
    scene.choices = [
      { id: 'escape', hotspot: { x: 50, y: 76, side: 'below' }, effects: [{ set: { escaped: true } }], next: wrap(escaped) },
      { id: 'caught', hotspot: { x: 50, y: 76, side: 'below' }, effects: [{ set: { escaped: false } }], next: wrap(caught) },
    ];
    T.choices.escape = 'Kaçtı';
    T.choices.caught = 'Yakalandı';
  } else if (NEXT[code]) {
    scene.next = NEXT[code];
  } else {
    const visible = s.choices.filter((c) => c.t && !c.timeout && !c.auto);
    const tout = s.choices.find((c) => c.timeout);
    if (!visible.length) {
      if (s.choices[0]) scene.next = id(s.choices[0].to);
    } else {
      const fx = FX[code] || [];
      // Kilitli seçenekler gizli değil, kilitli görünür; açık olanlar noktaları paylaşır
      const spots = SPOTS[Math.min(visible.length, 4)];
      scene.choices = visible.map((c, i) => {
        const ch = { id: 'c' + i, hotspot: spots[i % spots.length], effects: fx[i] || [], next: afterScene(c, code) };
        if (c.lock) { ch.conditions = LOCK[c.lock]; if (!ch.conditions) throw new Error(`${code}: bilinmeyen kilit "${c.lock}"`); }
        T.choices['c' + i] = c.t;
        return ch;
      });
      if (tout) {
        scene.timer = { seconds: s.timer || 10, on_timeout: 'timeout' };
        scene.choices.push({ id: 'timeout', hidden: true, effects: fx[visible.length] || [], next: afterScene(tout, code) });
      }
    }
  }
  scenes.push(scene);
  scenes.push(...extra.splice(0));
}

const story = {
  id: 'chapter2',
  chapter: 2,
  title_key: 'ui.chapter2_title',
  // Giriş Bölüm 1'in sonuna göre seçilir
  start: [{ if: C1('SA5'), goto: id('2AI') }, { if: C1('SB3'), goto: id('2BK') }, { if: { any: ['SB1', 'SB2', 'SB4'].map(C1) }, goto: id('2B0') }, { goto: id('2A0') }],
  variables: {
    c1_end: { initial: 'SA1', doc: 'Bölüm 1 sonu' },
    c1_chief: { initial: null, doc: "Bölüm 1: 'stayed' | 'chased'" },
    c1_earnings: { initial: 0, doc: 'Bölüm 1 kazancı' },
    earnings: { initial: 0, doc: 'Bölüm 2 kazancı' },
    filiz: { initial: 0, doc: 'Filiz ile yakınlık' },
    told_enduro: { initial: false, doc: "A: Endurocu'ya anlattı" },
    offer: { initial: null, doc: "A: teklif 'accept' | 'refuse' | 'play' | 'wipe' | 'silent'" },
    escaped: { initial: false, doc: 'Jiroskop kaçışı sonucu' },
    locker: { initial: null, doc: "B: koli 'put' | 'warn' | 'photo'" },
    evidence: { initial: false, doc: 'B: dolabın fotoğrafı çekildi' },
    fund: { initial: null, doc: "B: Endurocu'nun parası" },
    confessed_filiz: { initial: false, doc: "B: Filiz'e köstebek olduğunu söyledi" },
    confessed: { initial: false, doc: 'B: Kabile önünde itiraf' },
    wrote_plan: { initial: false, doc: 'B: planı adama yazdı' },
    hesitated: { initial: false, doc: 'Süre doldu' },
  },
  clues: {},
  characters: { teacher: { speakers: ['teacher'] }, enduro: { speakers: ['enduro'] }, man: { speakers: ['man'] }, chief: { speakers: ['chief'] }, kid: { speakers: ['kid'] }, rota: { speakers: ['rota'] }, cico: { speakers: ['cico'] } },
  media_aspect: 9 / 16,
  music: 'assets/audio/c1_music.mp3',
  scenes,
  epilogue: [],
};

const header = `/* ÜRETİLDİ — elle düzenlemeyin. Kaynak: production/chapter2-script.js · node tools/gen-chapter2.js */\n`;
fs.writeFileSync(path.join(ROOT, 'src/story/chapter2.js'), `${header}(function (root) {
  'use strict';
  const story = ${JSON.stringify(story, null, 1)};
  if (typeof module === 'object' && module.exports) module.exports = story;
  else (root.CICO = root.CICO || {}).story2 = story;
})(typeof self !== 'undefined' ? self : this);
`);
fs.writeFileSync(path.join(ROOT, 'src/story/chapter2.tr.js'), `${header}(function (root) {
  'use strict';
  const part = ${JSON.stringify(tr, null, 1)};
  function merge(a, b) { for (const k of Object.keys(b)) { if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) merge(a[k] = a[k] || {}, b[k]); else a[k] = b[k]; } return a; }
  if (typeof module === 'object' && module.exports) module.exports = part;
  // Diğer diller: çeviri gelene kadar Türkçe metin (yalnızca eksik anahtarlar)
  function fill(a, b) { for (const k of Object.keys(b)) { if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) fill(a[k] = a[k] || {}, b[k]); else if (!(k in a)) a[k] = b[k]; } return a; }
  if (typeof module === 'object' && module.exports) { /* node: yalnızca dışa aktar */ }
  else { const L = ((root.CICO = root.CICO || {}).locales = root.CICO.locales || {}); merge(L.tr = L.tr || {}, part); Object.keys(L).filter((c) => c !== 'tr').forEach((c) => fill(L[c], part)); }
})(typeof self !== 'undefined' ? self : this);
`);
console.log('chapter2:', scenes.length, 'sahne');
