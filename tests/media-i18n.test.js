// Medya planı (video ↔ metin yedeği) ve çeviri altyapısı.
const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveMedia } = require('../src/ui/media.js');
const { createTranslator, collectKeys } = require('../src/engine/i18n.js');
const { validateStory } = require('../src/engine/validate.js');
const story = require('../src/story/chapter1.js');
const tr = require('../src/i18n/tr.js');
const en = require('../src/i18n/en.js');

test('video_asset yoksa metin modu', () => {
  assert.deepEqual(resolveMedia({ scene_id: 'x', video_asset: null }), { mode: 'text' });
  assert.deepEqual(resolveMedia({ video_asset: null, image_asset: 'a.jpg' }), { mode: 'text', image: 'a.jpg' });
});

test('video_asset varsa video modu; seçim gösterimi sahne bazında', () => {
  const p = resolveMedia({ video_asset: 'media/video/a.mp4', choice_display: 'over_video', choice_at: 4.5, subtitles: { tr: 'a.tr.vtt' } }, 'tr');
  assert.equal(p.mode, 'video');
  assert.equal(p.choiceDisplay, 'over_video');
  assert.equal(p.choiceAt, 4.5);
  assert.equal(p.subtitles, 'a.tr.vtt');
  assert.equal(resolveMedia({ video_asset: 'a.mp4' }).choiceDisplay, 'after_video');
  assert.equal(resolveMedia({ video_asset: 'a.mp4', subtitles: { tr: 'x' } }, 'en').subtitles, null);
});

test('çevirmen: yer tutucu, yedek dil, eksik anahtar', () => {
  const t = createTranslator({ tr, en: { ui: { chapter: 'Chapter {n}' } } }, 'en');
  assert.equal(t('ui.chapter', { n: 1 }), 'Chapter 1');
  assert.equal(t('ui.start'), tr.ui.start, 'eksik çeviri Türkçeye düşer');
  assert.equal(t('yok.boyle.bir.anahtar'), '⟦yok.boyle.bir.anahtar⟧');
});

test('tr ve en aynı anahtar kümesine sahip', () => {
  assert.deepEqual(collectKeys(en).sort(), collectKeys(tr).sort());
});

test('yeni bir dil eksik anahtarlarla eklenirse validator yakalar', () => {
  const r = validateStory(story, { tr, de: { meta: { name: 'Deutsch', code: 'de' }, ui: {} } });
  assert.ok(r.report.missing.de.length > 0);
  assert.ok(r.errors.some((e) => e.startsWith('Locale "de"')));
});

// İnce göndermeler: oyunda açıklanmaz ama metinden düşmemeli.
test('jargon göndermeleri Türkçe metinde duruyor', () => {
  const all = JSON.stringify(tr);
  for (const phrase of ['babuş', 'Kabile Şefi', 'Gidecek hep daha fazla yol var', 'arabacılar', 'demir kafes',
    'Uçuyorum ulan', 'fıtı fıtı', 'limon sıkar gibi', 'Hayatta kalın, bir ömür boyu motosiklet sürün',
    'korumaların üstündeydi', 'Kel motosiklet eğitmenlerinin']) {
    assert.ok(all.includes(phrase), phrase);
  }
});

test('anma metni başlık ekranında değil, yalnızca anma ekranında', () => {
  const app = require('fs').readFileSync(require('path').join(__dirname, '..', 'src/ui/app.js'), 'utf8');
  assert.equal((app.match(/ui\.dedication/g) || []).length, 1);
  assert.ok(/screen === 'memorial'[\s\S]{0,400}ui\.dedication/.test(app));
});

// Mobil kuralı: her vuruş ve seçenek tek bakışta okunmalı.
test('her vuruş ≤ 120, her seçenek ≤ 60 karakter (tüm diller)', () => {
  const locales = require('../tools/locales.js');
  for (const [code, loc] of Object.entries(locales)) {
    const check = (obj, path) => {
      for (const [k, v] of Object.entries(obj)) {
        const p = `${path}.${k}`;
        if (v && typeof v === 'object') { check(v, p); continue; }
        const limit = /\.choices\.[a-z_]+$/.test(p) && !/_(hint|sub)$/.test(p) ? 60 : 120;
        assert.ok(v.length <= limit, `${code}${p} (${v.length} > ${limit}): ${v}`);
      }
    };
    check(loc.scenes, '.scenes');
    check(loc.common, '.common');
    check(loc.epilogue, '.epilogue');
    check(loc.characters, '.characters');
  }
});
