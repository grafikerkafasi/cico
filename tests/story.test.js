// Hikâye bütünlüğü: ID'ler, hedefler, erişilebilirlik, döngüler, sonlar, çeviriler, doküman senkronu.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const story = require('../src/story/chapter1.js');
const { validateStory, exploreAll } = require('../src/engine/validate.js');
const locales = require('../tools/locales.js');

const result = validateStory(story, locales);
const explored = exploreAll(story);

test('validator raporunda hata yok', () => {
  assert.deepEqual(result.errors, []);
});

test('tüm scene_id değerleri benzersiz', () => {
  const ids = story.scenes.map((s) => s.scene_id);
  assert.equal(new Set(ids).size, ids.length);
});

test('her hedef sahne gerçekten var', () => {
  const ids = new Set(story.scenes.map((s) => s.scene_id));
  for (const e of result.report.edges) assert.ok(ids.has(e.to), `${e.from} → ${e.to}`);
});

test('başlangıçtan erişilemeyen sahne yok (grafik ve gerçek koşullarla)', () => {
  assert.deepEqual(result.report.unreachable, []);
  assert.deepEqual(explored.neverHit, []);
});

test('istenmeyen döngü yok', () => {
  assert.deepEqual(result.report.cycles, []);
});

test('her oynanış bir sona ulaşıyor, kimse takılmıyor', () => {
  assert.deepEqual(explored.stuck, []);
  assert.ok(explored.paths.length > 0);
  for (const p of explored.paths) assert.equal(story.scenes.find((s) => s.scene_id === p.ending).scene_type, 'ending');
});

test('dokuz sonun her biri en az bir yoldan ulaşılabilir (A: 5, B: 4)', () => {
  for (const id of result.report.endings) assert.ok(explored.endingsHit[id] > 0, `${id} ulaşılamıyor`);
  assert.equal(result.report.endings.filter((id) => id.startsWith('c1_end_a_')).length, 5);
  assert.equal(result.report.endings.filter((id) => id.startsWith('c1_end_b_')).length, 4);
});

test('kapsam: iki katman için ≤ 24 sahne, ≤ 10 gerçek seçim düğümü', () => {
  const choiceNodes = story.scenes.filter((s) => (s.choices || []).some((c) => !c.hidden));
  assert.ok(story.scenes.length <= 24, `${story.scenes.length} sahne`);
  assert.ok(choiceNodes.length >= 4 && choiceNodes.length <= 10, `${choiceNodes.length} seçim düğümü`);
});

test('iki katman ilk seçimden sonra asla birleşmez', () => {
  for (const p of explored.paths) {
    const scenes = p.state.visited;
    const layer = p.state.vars.route === 'envelope' ? 'a' : 'b';
    const other = layer === 'a' ? 'b' : 'a';
    const leaked = scenes.filter((id) => id.startsWith(`c1_${other}`) || id.startsWith(`c1_end_${other}_`));
    assert.deepEqual(leaked, [], `${p.trail.join(' → ')}`);
    assert.ok(p.ending.startsWith(`c1_end_${layer}_`));
  }
});

test('her oynanışın epilogu: tek bir son parçası, ≥ 6 satır, açılış ve kapanış', () => {
  const endingKeys = story.scenes.filter((s) => s.scene_type === 'ending').map((s) => s.scene_id);
  const { epilogueKeys } = require('../src/engine/engine.js');
  for (const p of explored.paths) {
    const k = epilogueKeys(story, p.state);
    assert.ok(k.length >= 6, `${p.ending}: ${k.length}`);
    assert.equal(k[0], 'epilogue.open');
    assert.equal(k.filter((x) => x === 'epilogue.on_road' || x === 'epilogue.off_road').length, 1);
    const endingFragments = story.epilogue.filter((b) => b.if && b.if.visited && b.key !== 'off_road').map((b) => `epilogue.${b.key}`);
    assert.equal(k.filter((x) => endingFragments.includes(x)).length, 1, `${p.ending}: ${k.join(', ')}`);
  }
  assert.ok(endingKeys.length > 0);
});

test('her sahne medya alanlarını taşıyor (video_asset ilk sürümde boş)', () => {
  for (const s of story.scenes) {
    assert.ok('video_asset' in s, s.scene_id);
    assert.equal(s.video_asset, null, `${s.scene_id}: ilk sürümde sahte video yolu olmamalı`);
    assert.ok(s.notes && s.notes.video, `${s.scene_id}: video üretim notu eksik`);
  }
});

test('her dilde tüm anahtarlar mevcut', () => {
  assert.deepEqual(result.report.missing, {});
});

test('docs/story-flow.md içindeki Mermaid şeması sahne verisiyle güncel', () => {
  const { build, FILE } = require('../tools/gen-flow.js');
  assert.ok(fs.readFileSync(FILE, 'utf8').includes(build()), 'npm run flow çalıştırın');
});

test('her karakter konuştuğu/yazdığı ilk sahnede tanıtılır ve bir oynanışta en fazla bir kez', () => {
  const { textBlocks } = require('../src/engine/engine.js');
  const byId = new Map(story.scenes.map((s) => [s.scene_id, s]));
  const owner = {};
  Object.entries(story.characters).forEach(([who, c]) => c.speakers.forEach((sp) => { owner[sp] = who; }));
  for (const p of explored.paths) {
    const introduced = {};
    for (const id of p.state.visited) {
      const blocks = textBlocks(byId.get(id), p.state);
      const introsHere = blocks.filter((b) => b.kind === 'intro').map((b) => b.who);
      introsHere.forEach((who) => { introduced[who] = (introduced[who] || 0) + 1; });
      for (const b of blocks) {
        const who = owner[b.from];
        if (who && who !== 'cico') assert.ok(introduced[who], `${p.ending}: ${who} ${id} sahnesinde tanıtılmadan konuşuyor`);
      }
    }
    Object.entries(introduced).forEach(([who, n]) => assert.equal(n, 1, `${p.ending}: ${who} ${n} kez tanıtıldı`));
  }
});

test('oyuncuya görünen metinde karışıklık yaratan isimler yok (yalnızca Cico ve Kabile Şefi)', () => {
  const all = JSON.stringify(locales.tr) + JSON.stringify(locales.en);
  for (const name of ['Yusuf', 'Tayfun']) assert.ok(!all.includes(name), name);
});

test('akış şemasında bütün sonlar aynı (son) sütunda; sayaç 9 son gösterir', () => {
  const { layout, render } = require('../src/ui/flowchart.js');
  const L = layout(story);
  const endings = story.scenes.filter((s) => s.scene_type === 'ending').map((s) => L.nodes.get(s.scene_id).x);
  const maxX = Math.max(...[...L.nodes.values()].map((n) => n.x));
  assert.ok(endings.every((x) => x === maxX), 'sonlar farklı sütunlarda');
  const t = (k) => k;
  const fc = render(story, { t, now: { scenes: new Set(['c1_end_b_strike']), edges: new Set() }, past: { scenes: new Set(), edges: new Set() }, current: 'c1_end_b_strike' });
  assert.equal(fc.endingsTotal, 9);
  assert.equal(fc.endingsFound, 1);
  assert.ok(fc.svg.includes('ui.unknown_ending'));
});

test('üretim rehberi: her sahnenin çekim tanımı ve her seçim noktasının nesnesi var; dosya güncel', () => {
  const { SHOTS, LOCATIONS, CHARACTERS } = require('../production/shots.js');
  for (const s of story.scenes) {
    const shot = SHOTS[s.code];
    assert.ok(shot, `${s.code} çekim tanımı yok`);
    assert.ok(LOCATIONS[shot.location], `${s.code}: bilinmeyen mekân`);
    shot.cast.forEach((c) => assert.ok(CHARACTERS[c], `${s.code}: bilinmeyen karakter ${c}`));
    for (const c of (s.choices || []).filter((x) => !x.hidden)) assert.ok(shot.spots && shot.spots[c.id], `${s.code}.${c.id}: seçim noktası nesnesi yok`);
  }
  const { build, FILE } = require('../tools/gen-bible.js');
  assert.equal(require('fs').readFileSync(FILE, 'utf8'), build(), 'npm run bible');
});
