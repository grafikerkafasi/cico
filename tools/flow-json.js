// production/flow-prompts.json üretir: { KOD: { file, prompt } } — Flow tarayıcı otomasyonu bunu okur.
const fs = require('fs');
const path = require('path');
const f = require('../production/flow-prompts.js');
const story = require('../src/story/chapter1.js');
const out = {};
for (const code of Object.keys(f.SHOTS)) {
  const sc = story.scenes.find((s) => s.code === code);
  out[code] = { file: path.basename(sc.image_asset, '.jpg'), prompt: f.prompt(code).replace(/\n\n/g, ' '), end_only: !!f.SHOTS[code].end_only };
}
fs.writeFileSync(path.join(__dirname, '../production/flow-prompts.json'), JSON.stringify(out, null, 1));
console.log('✓ production/flow-prompts.json ·', Object.keys(out).length, 'sahne');
