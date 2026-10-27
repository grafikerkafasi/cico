// production/flow-prompts-c2.json üretir: { KOD: { file, prompt } } — Flow tarayıcı otomasyonu bunu okur.
const fs = require('fs');
const path = require('path');
const f = require('../production/flow-prompts-c2.js');
const story = require('../src/story/chapter2.js');
const out = {};
for (const s of story.scenes) {
  if (out[s.code]) continue;
  out[s.code] = { file: path.basename(s.image_asset), prompt: f.prompt(s.code) };
}
fs.writeFileSync(path.join(__dirname, '../production/flow-prompts-c2.json'), JSON.stringify(out, null, 1));
console.log('✓ production/flow-prompts-c2.json ·', Object.keys(out).length, 'sahne');
