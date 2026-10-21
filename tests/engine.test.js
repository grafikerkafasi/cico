// Oynanış testleri: iki katmanın her ana kolu, zaman aşımları, gecikmeli sonuçlar, epilog, yeniden başlatma.
const test = require('node:test');
const assert = require('node:assert/strict');
const story = require('../src/story/chapter1.js');
const { createEngine, evalCondition } = require('../src/engine/engine.js');

// Kısayol: '>' = advance, '⏱' = timeout, diğerleri = choice id
function play(steps) {
  const g = createEngine(story);
  for (const s of steps) {
    if (s === '>') g.advance();
    else if (s === '⏱') g.timeout();
    else g.choose(s);
  }
  return g;
}
const visible = (g) => g.getChoices().map((c) => `${c.id}${c.locked ? '🔒' : ''}`);
const keys = (g) => g.textKeys();
const epi = (g) => g.epilogueKeys();

const A = ['>', 'envelope'];               // → c1_a1_printhouse
const A_OPEN = [...A, 'open', '>'];        // → c1_a3_tower
const A_CLOSED = [...A, 'keep_closed', '>'];
const B = ['>', 'medicine', '>'];          // → c1_b2_kid
const B_PHOTO = [...B, 'take_photo'];      // → c1_b3_boulevard
const B_NOPHOTO = [...B, 'delete_photo'];

test('açılış Nevizade Sokağı, sonra ilk seçim', () => {
  const g = createEngine(story);
  assert.equal(g.state.sceneId, 'c1_s01_nevizade');
  assert.deepEqual(g.getChoices(), []);
  g.advance();
  assert.equal(g.state.sceneId, 'c1_s02_orders');
  assert.deepEqual(visible(g), ['envelope', 'medicine']);
});

// ── Katman A ─────────────────────────────────────────────────────
test('A: paketi aç → teklifte üçüncü seçenek → kabul = Masa', () => {
  const g = play(A_OPEN);
  assert.equal(g.state.sceneId, 'c1_a3_tower');
  assert.deepEqual(visible(g), ['hand_over', 'run', 'confront']);
  assert.ok(g.state.clues.includes('drive') && g.state.clues.includes('knows_name'));
  g.choose('confront'); g.choose('accept');
  assert.equal(g.state.sceneId, 'c1_end_a_desk');
});

test('A: paketi açmazsan yüzleşme kilitli görünür ve seçilemez', () => {
  const g = play(A_CLOSED);
  assert.deepEqual(visible(g), ['hand_over', 'run', 'confront🔒']);
  assert.throws(() => g.choose('confront'), /locked/);
});

test('A gecikmeli: açılan bant teklifte fark edilir, çatıda şüphe artar, Kabile sonunda tehdit', () => {
  const g = play(A_OPEN);
  assert.ok(keys(g).includes('scenes.c1_a3_tower.seal_noticed'));
  assert.equal(g.state.vars.suspicion, 1);
  g.choose('hand_over');
  assert.equal(g.state.vars.suspicion, 2);
  g.choose('tip_off');
  assert.equal(g.state.sceneId, 'c1_end_a_tribe');
  assert.ok(keys(g).includes('scenes.c1_end_a_tribe.danger'));
});

test('A: şüphe ≥ 2 iken basamaklar = Düşüş (başarısızlık yeni bir ipucu verir)', () => {
  const g = play([...A_OPEN, 'run']);
  assert.equal(g.state.vars.suspicion, 2);
  g.choose('stairs');
  assert.equal(g.state.sceneId, 'c1_end_a_fall');
  assert.ok(g.state.clues.includes('risk_list'));
});

test('A: şüphe düşükken basamaklar = kaçış ("limon", "Uçuyorum ulan")', () => {
  const g = play([...A_CLOSED, 'run', 'stairs']);
  assert.equal(g.state.sceneId, 'c1_end_a_escape');
  assert.ok(keys(g).includes('scenes.c1_end_a_escape.stairs'));
  assert.ok(keys(g).includes('scenes.c1_end_a_escape.stairs_say'));
  assert.ok(!keys(g).includes('scenes.c1_end_a_escape.plate'));
});

test('A: pasaj her zaman kaçırır ama plakayı ele verir', () => {
  const g = play([...A_OPEN, 'run', 'passage']);
  assert.equal(g.state.sceneId, 'c1_end_a_escape');
  assert.ok(keys(g).includes('scenes.c1_end_a_escape.plate'));
});

test('A: ikinci teklifi reddetmek kovalamacaya bağlanır', () => {
  const g = play([...A_OPEN, 'confront', 'refuse']);
  assert.equal(g.state.sceneId, 'c1_a5_chase');
  assert.equal(g.state.vars.suspicion, 2);
});

test('A zaman aşımı (ilk seçim): ROTA paketi seçer ve sonda hatırlanır', () => {
  const g = play(['>', '⏱']);
  assert.equal(g.state.sceneId, 'c1_a1_printhouse');
  assert.equal(g.state.vars.system_chose, true);
  assert.deepEqual(g.state.history.at(-1), { scene: 'c1_s02_orders', choice: 'timeout', timeout: true, to: 'c1_a1_printhouse' });
  ['keep_closed', '>', 'hand_over', 'stay_silent'].forEach((s) => (s === '>' ? g.advance() : g.choose(s)));
  assert.equal(g.state.sceneId, 'c1_end_a_silence');
  for (const k of ['common.system_chose', 'common.no_medicine', 'common.rent_paid']) assert.ok(keys(g).includes(k), k);
  assert.ok(epi(g).includes('epilogue.rota') && !epi(g).includes('epilogue.money'));
});

test('A zaman aşımı (teklif): yarım ücret, kira eksik', () => {
  const g = play([...A_CLOSED, '⏱']);
  assert.equal(g.state.sceneId, 'c1_a4_rooftop');
  assert.equal(g.state.vars.earnings, 750);
  assert.ok(keys(g).includes('scenes.c1_a4_rooftop.paid_half'));
  g.choose('stay_silent');
  assert.ok(keys(g).includes('common.rent_short'));
  assert.ok(epi(g).includes('epilogue.froze'));
});

test('A zaman aşımı (ikinci teklif = sessizlik "evet"; kovalamaca = düşüş)', () => {
  const a = play([...A_OPEN, 'confront', '⏱']);
  assert.equal(a.state.sceneId, 'c1_end_a_desk');
  assert.ok(keys(a).includes('scenes.c1_end_a_desk.silence'));
  const b = play([...A_CLOSED, 'run', '⏱']);
  assert.equal(b.state.sceneId, 'c1_end_a_fall');
});

// ── Katman B ─────────────────────────────────────────────────────
test('B: ilaç → fotoğraf → şefin yanında kal → hastanede gazeteci seçeneği açık', () => {
  const g = play([...B_PHOTO, 'stay']);
  assert.equal(g.state.sceneId, 'c1_b4_hospital');
  assert.ok(g.state.clues.includes('not_accident'));
  assert.deepEqual(visible(g), ['strike', 'press']);
  g.choose('press');
  assert.equal(g.state.sceneId, 'c1_end_b_headline');
  assert.ok(keys(g).includes('common.rent_short'), 'doğru olanı seçmek kirayı ödemez');
});

test('B: fotoğrafı sildirirsen gazeteci seçeneği kilitli; Kabile kontak kapatır ve kirayı toplar', () => {
  const g = play([...B_NOPHOTO, 'stay']);
  assert.deepEqual(visible(g), ['strike', 'press🔒']);
  assert.throws(() => g.choose('press'), /locked/);
  g.choose('strike');
  assert.equal(g.state.sceneId, 'c1_end_b_strike');
  assert.ok(keys(g).includes('scenes.c1_end_b_strike.kabile'));
});

test('B: arabanın peşine düş → matbaa → içeri gir = Kara Kutu / fotoğraf = Kanıt', () => {
  const g = play([...B_PHOTO, 'chase']);
  assert.equal(g.state.sceneId, 'c1_b5_printhouse');
  assert.equal(g.state.vars.chief, 'chased');
  const snap = g.snapshot();
  g.choose('enter');
  assert.equal(g.state.sceneId, 'c1_end_b_blackbox');
  assert.ok(g.state.clues.includes('risk_list'));
  g.load(snap);
  g.choose('photo_run');
  assert.equal(g.state.sceneId, 'c1_end_b_evidence');
});

test('B zaman aşımı: kaza yerinde donakalmak hastaneye; matbaada donakalmak Kara Kutu', () => {
  const a = play([...B_NOPHOTO, '⏱']);
  assert.equal(a.state.sceneId, 'c1_b4_hospital');
  assert.ok(keys(a).includes('scenes.c1_b4_hospital.froze'));
  const b = play([...B_NOPHOTO, 'chase', '⏱']);
  assert.equal(b.state.sceneId, 'c1_end_b_blackbox');
  assert.ok(keys(b).includes('scenes.c1_end_b_blackbox.froze'));
});

test('B sonlarında A\'ya ait "ilaç gelmedi" mesajı yok', () => {
  const g = play([...B_PHOTO, 'stay', 'strike']);
  assert.ok(!keys(g).includes('common.no_medicine'));
});

// ── Epilog (seslendirme metni) ───────────────────────────────────
test('epilog seçimleri yansıtır: B, fotoğraf, kaldı, kontak kapatma', () => {
  const g = play([...B_PHOTO, 'stay', 'strike']);
  assert.deepEqual(epi(g), [
    'epilogue.open', 'epilogue.medicine', 'epilogue.photo', 'epilogue.stayed',
    'epilogue.strike', 'epilogue.dots', 'epilogue.on_road',
  ]);
});

test('epilog: Masa sonunda "artık yolda değilsin"', () => {
  const g = play([...A_OPEN, 'confront', 'accept']);
  assert.ok(epi(g).includes('epilogue.off_road') && !epi(g).includes('epilogue.on_road'));
  assert.ok(epi(g).includes('epilogue.opened') && epi(g).includes('epilogue.desk'));
});

// ── Genel ────────────────────────────────────────────────────────
test('gizli/kilitli/var olmayan seçenekler seçilemez; seçim sahnesinde advance olmaz', () => {
  const g = play(['>']);
  assert.throws(() => g.choose('timeout'), /not available/);
  assert.throws(() => g.choose('nope'), /not available/);
  assert.throws(() => g.advance(), /requires a choice/);
  g.choose('envelope');
  assert.throws(() => g.timeout(), /no timer/);
});

test('yeniden başlatma tüm durumu temizler', () => {
  const g = play([...A_OPEN, 'run', 'stairs']);
  assert.equal(g.state.ended, true);
  g.restart();
  assert.deepEqual(g.state, createEngine(story).state);
  assert.equal(g.state.sceneId, story.start);
});

test('geliştirici günlüğü her etkiyi kaydeder', () => {
  const g = play([...A, 'open']);
  const entry = g.state.log.find((l) => l.source === 'choice:open');
  assert.deepEqual(entry.changes, [
    { var: 'seal_broken', from: false, to: true },
    { var: 'suspicion', from: 0, to: 1 },
    { clue: 'drive' },
  ]);
});

test('koşul dili', () => {
  const s = { vars: { a: 2, f: true, r: 'x' }, clues: ['c'], visited: ['s1'] };
  assert.ok(evalCondition({ all: [{ flag: 'f' }, { clue: 'c' }, { var: 'a', gte: 2 }, { var: 'r', eq: 'x' }, { visited: 's1' }] }, s));
  assert.ok(evalCondition({ any: [{ flag: 'nope' }, { var: 'a', lt: 3 }] }, s));
  assert.ok(!evalCondition({ not: { flag: 'f' } }, s));
  assert.throws(() => evalCondition({ weird: 1 }, s));
});
