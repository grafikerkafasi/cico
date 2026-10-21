#!/usr/bin/env node
// Sahne verisinden Mermaid akış şeması + düğüm tablosu üretir ve
// docs/story-flow.md içindeki işaretler arasına yazar. Demo ile doküman böylece ayrışamaz.
// Kullanım: npm run flow        (dosyayı günceller)
//           npm run flow -- --check   (güncel değilse hata verir)
const fs = require('fs');
const path = require('path');
const story = require('../src/story/chapter1.js');
const tr = require('../src/i18n/tr.js');
const { sceneEdges } = require('../src/engine/engine.js');
const { createTranslator } = require('../src/engine/i18n.js');

const t = createTranslator({ tr }, 'tr');
const FILE = path.join(__dirname, '..', 'docs', 'story-flow.md');
const START = '<!-- FLOW:START (npm run flow ile üretilir, elle düzenlemeyin) -->';
const END = '<!-- FLOW:END -->';

const q = (s) => `"${String(s).replace(/"/g, '#quot;')}"`;
const short = (s, n = 34) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

function condText(c) {
  if (!c) return '';
  if (c.all) return c.all.map(condText).join(' ve ');
  if (c.any) return c.any.map(condText).join(' veya ');
  if (c.not) return `değil(${condText(c.not)})`;
  if (c.clue) return `ipucu:${c.clue}`;
  if (c.flag) return c.flag;
  const op = ['eq', 'gte', 'lte', 'gt', 'lt'].find((o) => o in c);
  return `${c.var}${{ eq: '=', gte: '≥', lte: '≤', gt: '>', lt: '<' }[op]}${c[op]}`;
}

function mermaid() {
  const shape = {
    cinematic: (id, l) => `${id}[${l}]`,
    choice: (id, l) => `${id}{{${l}}}`,
    interaction: (id, l) => `${id}[/${l}/]`,
    ending: (id, l) => `${id}([${l}])`,
  };
  const lines = ['flowchart TD'];
  for (const s of story.scenes) lines.push(`  ${shape[s.scene_type](s.scene_id, q(`${t(`scenes.${s.scene_id}.title`)}<br/><small>${s.scene_id}</small>`))}`);
  for (const s of story.scenes) {
    const choices = new Map((s.choices || []).map((c) => [c.id, c]));
    for (const e of sceneEdges(s)) {
      let label = '';
      if (e.timeout) label = '⏱ zaman aşımı';
      else if (e.choice) label = short(t(`scenes.${s.scene_id}.choices.${e.choice}`));
      const ch = e.choice && choices.get(e.choice);
      if (ch && ch.conditions) label = `🔒 ${label} [${condText(ch.conditions)}]`;
      if (e.cond) label += ` [${condText(e.cond)}]`;
      else if (ch && Array.isArray(ch.next)) label += ' [aksi hâlde]';
      const arrow = e.timeout ? '-.->' : '-->';
      lines.push(label ? `  ${e.from} ${arrow}|${q(label)}| ${e.to}` : `  ${e.from} ${arrow} ${e.to}`);
    }
  }
  lines.push('  classDef ending fill:#2b1f0b,stroke:#ffb547,color:#fff;');
  lines.push('  classDef choice fill:#10241c,stroke:#5fc29a,color:#fff;');
  lines.push(`  class ${story.scenes.filter((s) => s.scene_type === 'ending').map((s) => s.scene_id).join(',')} ending;`);
  lines.push(`  class ${story.scenes.filter((s) => ['choice', 'interaction'].includes(s.scene_type)).map((s) => s.scene_id).join(',')} choice;`);
  return lines.join('\n');
}

function table() {
  const rows = story.scenes.map((s) =>
    `| \`${s.scene_id}\` | ${s.scene_type} | ${t(`scenes.${s.scene_id}.title`)} | ${(s.notes && s.notes.dev || '').replace(/\|/g, '/')} | ${s.video_asset ? `\`${s.video_asset}\`` : '—'} |`);
  return ['| scene_id | tür | başlık | işlev | video_asset |', '|---|---|---|---|---|', ...rows].join('\n');
}

function build() {
  return `${START}\n\n\`\`\`mermaid\n${mermaid()}\n\`\`\`\n\n${table()}\n\n${END}`;
}

if (require.main === module) {
  const doc = fs.readFileSync(FILE, 'utf8');
  const a = doc.indexOf(START), b = doc.indexOf(END);
  if (a < 0 || b < 0) { console.error('İşaretler bulunamadı:', FILE); process.exit(1); }
  const next = doc.slice(0, a) + build() + doc.slice(b + END.length);
  if (process.argv.includes('--check')) {
    if (next !== doc) { console.error('docs/story-flow.md güncel değil → npm run flow'); process.exit(1); }
    console.log('✓ docs/story-flow.md güncel');
  } else {
    fs.writeFileSync(FILE, next);
    console.log('✓ docs/story-flow.md güncellendi');
  }
}

module.exports = { build, START, END, FILE };
