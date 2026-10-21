#!/usr/bin/env node
// Hikâye raporu: yapısal hatalar, erişilemeyen sahneler, tüm yolların özeti.
const story = require('../src/story/chapter1.js');
const { validateStory, exploreAll } = require('../src/engine/validate.js');
const locales = require('./locales.js');

const v = validateStory(story, locales);
const x = exploreAll(story);
const choiceNodes = story.scenes.filter((s) => (s.choices || []).some((c) => !c.hidden));

console.log(`Sahneler: ${story.scenes.length} · Seçim düğümleri: ${choiceNodes.length} · Sonlar: ${v.report.endings.length}`);
console.log(`Diller: ${Object.keys(locales).join(', ')}`);
console.log(`Olası oynanışlar (tüm seçenek + zaman aşımı kombinasyonları): ${x.paths.length}`);
console.log('Sonlara dağılım:', x.endingsHit);
if (x.neverHit.length) console.log('Gerçek koşullarla hiç ulaşılamayan sahneler:', x.neverHit);
if (x.stuck.length) console.log('TAKILMA:', x.stuck);
v.warnings.forEach((w) => console.log('UYARI:', w));
v.errors.forEach((e) => console.log('HATA:', e));
const ok = v.ok && !x.stuck.length && !x.neverHit.length;
console.log(ok ? '✓ Hikâye geçerli.' : '✗ Hikâyede sorun var.');
process.exit(ok ? 0 : 1);
