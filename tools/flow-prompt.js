// Google Flow promptunu basar:  node tools/flow-prompt.js A1   |   node tools/flow-prompt.js --all
const { prompt, SHOTS, settings } = require('../production/flow-prompts.js');
const story = require('../src/story/chapter1.js');
const arg = process.argv[2];
const img = (code) => (story.scenes.find((s) => s.code === code) || {}).image_asset;
if (!arg) { console.log('Kullanım: node tools/flow-prompt.js <KOD> | --all'); process.exit(1); }
const codes = arg === '--all' ? Object.keys(SHOTS) : [arg];
for (const c of codes) {
  console.log(`## ${c} — Start = End: ${img(c)}\n${settings}\n\n${prompt(c)}\n`);
}
