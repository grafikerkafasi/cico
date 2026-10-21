#!/usr/bin/env node
// Terminalden hızlı oynatma (dallanmayı tarayıcısız test etmek için).
// Kullanım: npm run play [-- en]
// Komutlar: 1-9 seç · Enter devam · t zaman aşımı · s durum · r baştan · q çık
const readline = require('readline');
const story = require('../src/story/chapter1.js');
const { createEngine } = require('../src/engine/engine.js');
const { createTranslator } = require('../src/engine/i18n.js');
const locales = require('./locales.js');

const lang = locales[process.argv[2]] ? process.argv[2] : 'tr';
const t = createTranslator(locales, lang);
const game = createEngine(story);
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function show() {
  const s = game.getScene();
  console.log(`\n\x1b[2m── ${s.scene_id} (${s.scene_type})${s.timer ? ` ⏱ ${s.timer.seconds}s` : ''} ──\x1b[0m`);
  console.log(`\x1b[1m${t(`scenes.${s.scene_id}.title`)}\x1b[0m\n`);
  game.textBlocks().forEach((b) => console.log(
    b.kind === 'msg' ? `  📱 ${t(`speakers.${b.from}`)}: ${t(b.key)}`
      : b.kind === 'say' ? `  ${t(`speakers.${b.from}`)}: "${t(b.key)}"`
        : t(b.key)));
  console.log('');
  if (s.scene_type === 'ending') {
    console.log(`\x1b[33m${t('ui.chapter_end')}\x1b[0m  ${t('ui.earnings', { n: game.state.vars.earnings })}`);
    console.log('vars:', JSON.stringify(game.state.vars), 'clues:', game.state.clues.join(', '));
    console.log(`\n\x1b[33m— ${t('ui.epilogue_kicker')} —\x1b[0m`);
    game.epilogueKeys().forEach((k) => console.log(`  ${t(k)}`));
    console.log('\n[r] baştan · [q] çık');
  } else if ((s.choices || []).length) {
    game.getChoices().forEach((c, i) => console.log(c.locked
      ? `  \x1b[2m${i + 1}) [${t('ui.locked')}] ${t(`scenes.${s.scene_id}.choices.${c.id}_hint`)}\x1b[0m`
      : `  ${i + 1}) ${t(`scenes.${s.scene_id}.choices.${c.id}`)}${t.has(`scenes.${s.scene_id}.choices.${c.id}_sub`) ? `  \x1b[2m${t(`scenes.${s.scene_id}.choices.${c.id}_sub`)}\x1b[0m` : ''}`));
    if (s.timer) console.log(`  \x1b[2m[t] ${t('ui.timeout_hint')}\x1b[0m`);
  } else console.log(`[Enter] ${t('ui.continue')}`);
  rl.question('> ', handle);
}

function handle(input) {
  const k = input.trim().toLowerCase();
  const s = game.getScene();
  try {
    if (k === 'q') return rl.close();
    if (k === 'r') game.restart();
    else if (k === 's') console.log(JSON.stringify({ vars: game.state.vars, clues: game.state.clues }, null, 2));
    else if (k === 't' && s.timer) game.timeout();
    else if (/^\d$/.test(k)) {
      const c = game.getChoices()[Number(k) - 1];
      if (c && c.enabled) game.choose(c.id); else console.log('Geçersiz seçim.');
    } else if (k === '' && !(s.choices || []).length && s.scene_type !== 'ending') game.advance();
  } catch (e) { console.log('Hata:', e.message); }
  show();
}

show();
