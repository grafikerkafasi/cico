#!/usr/bin/env node
/*
 * Bölüm 2 görselli akış panosu: production/chapter2-script.js → tek HTML sayfa.
 * Her sahne bir kart (görsel + kod + başlık); ekranda çıkacak metinler kartın yanında not olarak durur.
 * Kullanım: node tools/gen-c2-board.js <çıktı.html> [eski-sayfa.html (ek bölümler buradan alınır)]
 * Görseller çıktının yanındaki img/<KOD>.jpg dosyalarından okunur.
 */
const fs = require('fs');
const path = require('path');
const data = require('../production/chapter2-script.js');

const OUT = process.argv[2];
const OLD = process.argv[3];
if (!OUT) { console.error('çıktı yolu gerekli'); process.exit(1); }
const imgDir = path.join(path.dirname(OUT), 'img');
const hasImg = (c) => fs.existsSync(path.join(imgDir, c + '.jpg'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const KIND = { n: 'Anlatı', s: 'Konuşma', m: 'Mesaj', i: 'Tanıtım', g: 'Oyun' };
const TYPE = { cinematic: 'Sinematik', choice: 'Karar', interaction: 'Jiroskop', ending: 'Son' };

// Ölçüler
const CW = 138, IH = 245, CH = 292;        // kart
const NW = 250, NG = 12;                   // not
const COLW = CW + NG + NW + 46;            // sütun genişliği
const GAP = 118, PADX = 30, PADY = 40;
const CPL = 40;                            // not satırı başına yaklaşık karakter

function noteHeight(s) {
  let h = 34;
  for (const b of s.beats) {
    const len = (b.who ? b.who.length + 2 : 0) + b.t.length;
    h += Math.ceil(len / CPL) * 15 + 8 + (b.only ? 15 : 0);
  }
  const ch = (s.choices || []).filter((c) => c.t && !c.auto);
  if (ch.length) {
    h += 22;
    for (const c of ch) h += Math.ceil(c.t.length / CPL) * 15 + (c.sub ? 14 : 0) + 6;
  }
  if (s.choices.some((c) => c.timeout)) h += 20;
  if (s.note) h += 18;
  if (s.redo) h += Math.ceil(s.redo.length / CPL) * 14 + 22;
  if (s.video) h += Math.ceil(s.video.length / CPL) * 14 + 22;
  return h + 14;
}

function noteHtml(code, s) {
  const beats = s.beats.map((b) => `<li class="b-${b.k}"><span class="k">${KIND[b.k]}${b.who ? ` · <b>${esc(b.who)}</b>` : ''}</span>${esc(b.t)}${b.only ? `<em class="only">yalnızca: ${esc(b.only)}</em>` : ''}</li>`).join('');
  const ch = s.choices.filter((c) => c.t && !c.auto);
  const tout = s.choices.find((c) => c.timeout);
  const chHtml = ch.length ? `<div class="nch"><span class="lbl">Seçenekler</span><ul>${ch.map((c) => `<li>${c.lock ? '🔒 ' : ''}${esc(c.t)}${c.lock ? ` <i class="lk">${esc(c.lock)}</i>` : ''}${c.sub ? `<small>${esc(c.sub)}</small>` : ''}</li>`).join('')}</ul>${tout ? `<p class="tout">⏱ ${s.timer || ''} sn dolarsa: ${esc(tout.sub || '')}</p>` : ''}</div>` : '';
  return `<aside class="note">${s.note ? `<p class="nnote">${esc(s.note)}</p>` : ''}${s.redo ? `<p class="redo">⟳ Görsel yenilenecek: ${esc(s.redo)}</p>` : ''}${s.video ? `<p class="vnote">🎬 Video notu: ${esc(s.video)}</p>` : ''}<span class="lbl">Ekranda</span><ol>${beats}</ol>${chHtml}</aside>`;
}

function board(key) {
  const L = data.layers[key];
  const codes = Object.keys(L.grid);
  const rows = Math.max(...codes.map((c) => L.grid[c][1])) + 1;
  const cols = Math.max(...codes.map((c) => L.grid[c][0])) + 1;
  const rowH = [];
  for (let r = 0; r < rows; r++) {
    const inRow = codes.filter((c) => L.grid[c][1] === r);
    rowH[r] = Math.max(CH, ...inRow.map((c) => noteHeight(data.scenes[c]))) + GAP;
  }
  const rowY = [PADY]; for (let r = 1; r < rows; r++) rowY[r] = rowY[r - 1] + rowH[r - 1];
  const W = PADX * 2 + cols * COLW, H = rowY[rows - 1] + rowH[rows - 1];
  const pos = {};
  for (const c of codes) { const [x, y] = L.grid[c]; pos[c] = { x: PADX + x * COLW, y: rowY[y] }; }

  // kenarlar: aynı hedefe giden seçenekler birleşir
  const wires = [], labels = [];
  for (const c of codes) {
    const s = data.scenes[c];
    const groups = new Map();
    for (const ch of s.choices) {
      if (!pos[ch.to]) continue;
      const kind = ch.timeout ? 'to' : ch.auto ? 'cond' : ch.t ? 'ch' : 'plain';
      const key = ch.to + '|' + (kind === 'to' ? 'to' : 'x');
      if (!groups.has(key)) groups.set(key, { to: ch.to, kind, texts: [], lock: false });
      const g = groups.get(key);
      if (ch.timeout) g.texts.push(`⏱ süre dolarsa`);
      else if (ch.t) { g.texts.push((ch.lock ? '🔒 ' : '') + ch.t); if (ch.lock) g.lock = true; }
      if (kind === 'cond') g.kind = 'cond';
    }
    const list = [...groups.values()];
    // Tüm seçenekler tek hedefe gidiyorsa etiket gereksiz (seçenekler notta yazılı)
    const chTargets = new Set(list.filter((g) => g.kind === 'ch').map((g) => g.to));
    if (chTargets.size === 1) list.forEach((g) => { if (g.kind === 'ch') g.texts = []; });
    list.forEach((g) => { if (g.texts.length > 2) g.texts = [g.texts.length + ' seçenek']; });
    list.forEach((g, i) => {
      const a = pos[c], b = pos[g.to];
      const off = (i - (list.length - 1) / 2) * 16;
      const sx = a.x + CW / 2 + off, sy = a.y + CH, tx = b.x + CW / 2 + off * 0.4, ty = b.y - 4;
      const my = (sy + ty) / 2;
      wires.push(`<path d="M${sx},${sy} C${sx},${my} ${tx},${my} ${tx},${ty}" class="${g.kind}" marker-end="url(#ah-${g.kind === 'to' ? 'to' : 'n'})"/>`);
      if (g.texts.length) {
        const t = list.length > 1 ? Math.min(0.82, Math.max(0.18, 0.5 + (i - (list.length - 1) / 2) * 0.26)) : 0.5;
        const u = 1 - t;
        const px = u * u * u * sx + 3 * u * u * t * sx + 3 * u * t * t * tx + t * t * t * tx;
        const py = u * u * u * sy + 3 * u * u * t * my + 3 * u * t * t * my + t * t * t * ty;
        const dx = g.kind === 'to' ? 46 : 0;
        labels.push(`<div class="elabel ${g.kind}${g.lock ? ' lock' : ''}" style="left:${(px + dx).toFixed(1)}px;top:${py.toFixed(1)}px">${g.texts.map(esc).join('<br>')}</div>`);
      }
    });
  }

  const cards = codes.map((c) => {
    const s = data.scenes[c], p = pos[c];
    const cls = [s.type, s.love ? 'love' : '', s.bridge ? 'bridge' : ''].join(' ');
    const img = hasImg(c) ? `<img src="img/${c}.jpg" alt="" width="${CW}" height="${IH}">` : `<span class="noimg">görsel yarın<br>(ChatGPT kotası)</span>`;
    return `<div class="node" style="left:${p.x}px;top:${p.y}px">
  <button class="card ${cls}" data-code="${c}" aria-label="${c} ${esc(s.title)}">${img}<span class="code">${c}</span>${s.timer ? `<span class="timer">⏱${s.timer}</span>` : ''}${s.bridge ? '<span class="nb">yeni köprü</span>' : ''}${s.redo ? '<span class="nb redo">görsel yenilenecek</span>' : ''}<span class="cap"><b>${esc(s.title)}</b><small>${TYPE[s.type]}${s.love ? ' · aşk' : ''}</small></span></button>
  ${noteHtml(c, s)}
</div>`;
  }).join('\n');

  return `<section class="board-sec">
  <div class="board-head"><div><h2>${esc(L.title)}</h2><p class="lede">${esc(L.entry)}</p></div><button class="fitbtn" type="button" data-fit="${key}">Gerçek boyut</button></div>
  <div class="board-scroll"><div class="board-scale" id="scale-${key}"><div class="board" style="width:${W}px;height:${H}px">
    <svg class="wires" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs>
      <marker id="ah-n" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="rgba(232,237,241,.45)"/></marker>
      <marker id="ah-to" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ff6b85"/></marker>
    </defs>${wires.join('')}</svg>
    ${labels.join('\n')}
    ${cards}
  </div></div></div>
</section>`;
}

function oldSections() {
  if (!OLD || !fs.existsSync(OLD)) return '';
  const html = fs.readFileSync(OLD, 'utf8');
  const want = ['Bölüm 1\'den gelenler', 'Dışarıdan okuma', 'Sürpriz: İki kaçış sahnesi', 'Kaydetme ve devam etme'];
  const secs = html.match(/<section>[\s\S]*?<\/section>/g) || [];
  return secs.filter((s) => want.some((w) => s.includes(w))).join('\n');
}

const sceneCount = Object.keys(data.scenes).length;
const D = {};
for (const [c, s] of Object.entries(data.scenes)) D[c] = { title: s.title, type: TYPE[s.type], img: hasImg(c), note: s.note || '', beats: s.beats.map((b) => ({ k: KIND[b.k], who: b.who || '', t: b.t, only: b.only || '' })), choices: s.choices.filter((x) => x.t || x.timeout).map((x) => ({ t: x.timeout ? '⏱ süre dolarsa' : x.t, sub: x.sub || '', lock: x.lock || '', to: x.to, auto: !!x.auto })) };

const page = `<title>Sabah Zili Akışı</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:ital,wght@0,400;0,600;1,400&display=swap">
<style>
/* Düzen: Bölüm 1 panosuyla aynı dil — görselli kartlar, oklar; ekran metinleri kartın yanında not. Oyunun gece paleti: tek koyu tema (bilinçli). */
:root { --night:#0a0d12; --panel:#11161d; --panel-2:#0d1218; --line:#232c37; --ink:#e8edf1; --muted:#93a0ad; --green:#62d1a4; --amber:#ffb547; --rose:#ff6b85; --violet:#a99bf0; --paper:#171d25;
  --display:"Fraunces",Georgia,serif; --body:"IBM Plex Sans",system-ui,sans-serif; --mono:"IBM Plex Mono",ui-monospace,monospace; color-scheme:dark; }
html { background:var(--night); } html, body { overflow-x:clip; }
body { background:var(--night); color:var(--ink); font:15px/1.55 var(--body); margin:0; padding-left:max(16px, env(safe-area-inset-left,0px)); padding-right:max(16px, env(safe-area-inset-right,0px)); }
.wrap { max-width:1120px; margin:0 auto; padding-block:40px 64px; display:flex; flex-direction:column; gap:44px; }
.eyebrow { font:600 11px/1 var(--mono); letter-spacing:.18em; text-transform:uppercase; color:var(--amber); }
h1 { font:600 clamp(32px,6vw,50px)/1.05 var(--display); margin:10px 0 12px; text-wrap:balance; }
h2 { font:600 26px/1.2 var(--display); margin:0 0 6px; }
h3 { font:600 15px/1.3 var(--body); margin:18px 0 8px; }
p { max-width:68ch; }
.lede { color:var(--muted); max-width:66ch; margin:0 0 12px; }
.stats { display:flex; flex-wrap:wrap; gap:8px 22px; margin-top:14px; font:13px var(--mono); color:var(--muted); } .stats b { color:var(--ink); }
.legend { display:flex; flex-wrap:wrap; gap:6px 14px; font-size:12px; color:var(--muted); margin-top:14px; }
.legend span { display:inline-flex; align-items:center; gap:6px; }
.lg { width:14px; height:14px; border-radius:4px; border:2px solid; display:inline-block; }
.lg.choice{border-color:var(--green)} .lg.interaction{border-color:var(--rose)} .lg.cinematic{border-color:#8796a6} .lg.ending{border-color:var(--amber)} .lg.love{border-color:var(--violet)} .lg.lgnote{background:var(--paper); border-color:var(--amber); border-width:0 0 0 3px; border-radius:2px}
.lg.dash { border:0; border-top:2px dashed var(--rose); height:0; width:22px; border-radius:0; }
.lg.cond { border:0; border-top:2px dotted var(--amber); height:0; width:22px; border-radius:0; }
.board-sec { position:relative; width:100vw; margin-left:calc(50% - 50vw); padding-left:max(16px, env(safe-area-inset-left,0px)); padding-right:max(16px, env(safe-area-inset-right,0px)); box-sizing:border-box; }
.board-head, .board-scroll { max-width:1900px; margin-left:auto; margin-right:auto; }
.board-head { display:flex; flex-wrap:wrap; justify-content:space-between; gap:12px 24px; align-items:flex-end; margin-bottom:14px; }
.fitbtn { font:600 12px var(--mono); padding:6px 12px; border-radius:999px; border:1px solid var(--line); background:var(--panel); color:var(--ink); cursor:pointer; }
.board-scroll { overflow:auto; border:1px solid var(--line); border-radius:16px; background:radial-gradient(1200px 600px at 50% 0%, #121a22, #0a0d12); }
.board-scale { overflow:hidden; } .board-scale > .board { transform-origin:0 0; }
.board { position:relative; }
.wires { position:absolute; inset:0; pointer-events:none; }
.wires path { fill:none; stroke:rgba(232,237,241,.38); stroke-width:1.6; }
.wires path.to { stroke:var(--rose); stroke-dasharray:6 5; opacity:.85; }
.wires path.cond { stroke:var(--amber); stroke-dasharray:2 4; opacity:.75; }
.elabel { position:absolute; transform:translate(-50%,-50%); max-width:190px; padding:3px 8px; border-radius:8px; background:rgba(10,13,18,.94); border:1px solid var(--line); font-size:11px; line-height:1.3; color:var(--ink); text-align:center; pointer-events:none; z-index:2; }
.elabel.to { color:var(--rose); border-color:rgba(255,107,133,.4); }
.elabel.cond { color:var(--amber); border-color:rgba(255,181,71,.35); font-style:italic; }
.elabel.lock { border-style:dashed; border-color:rgba(255,181,71,.5); }
.node { position:absolute; display:flex; gap:${NG}px; align-items:flex-start; z-index:1; }
.card { position:relative; flex:none; width:${CW}px; height:${CH}px; padding:0; text-align:left; cursor:pointer; background:var(--panel); border:2px solid var(--line); border-radius:14px; overflow:hidden; color:var(--ink); font:inherit; box-shadow:0 10px 30px rgba(0,0,0,.4); transition:transform .15s; }
.card:hover, .card:focus-visible { transform:translateY(-3px); outline:none; }
.card.choice{border-color:rgba(98,209,164,.7)} .card.interaction{border-color:rgba(255,107,133,.8)} .card.cinematic{border-color:rgba(135,150,166,.6)} .card.ending{border-color:rgba(255,181,71,.8)} .card.love{border-color:rgba(169,155,240,.85)} .card.bridge{border-style:dashed}
.card img { display:block; width:${CW}px; height:${IH}px; object-fit:cover; }
.card .noimg { display:grid; place-items:center; width:${CW}px; height:${IH}px; color:var(--muted); font:600 11px/1.4 var(--mono); text-align:center; background:repeating-linear-gradient(45deg,#121821 0 10px,#0f141b 10px 20px); }
.card .code { position:absolute; top:8px; left:8px; font:600 13px var(--mono); padding:3px 7px; border-radius:8px; background:rgba(10,13,18,.85); color:#fff; }
.card.choice .code{color:var(--green)} .card.interaction .code{color:var(--rose)} .card.ending .code{color:var(--amber)} .card.love .code{color:var(--violet)}
.card .timer { position:absolute; top:8px; right:8px; font:600 11px var(--mono); padding:3px 6px; border-radius:8px; background:rgba(10,13,18,.85); color:var(--rose); }
.card .nb { position:absolute; top:${IH - 26}px; left:8px; font:600 10px var(--mono); padding:2px 6px; border-radius:6px; background:rgba(255,181,71,.9); color:#0a0d12; }
.card .cap { display:flex; flex-direction:column; gap:2px; padding:7px 10px 8px; }
.card .cap b { font-size:13px; font-weight:600; line-height:1.25; }
.card .cap small { font:10px var(--mono); color:var(--muted); }
.note { width:${NW}px; box-sizing:border-box; background:var(--paper); border:1px solid var(--line); border-left:3px solid var(--amber); border-radius:4px 12px 12px 4px; padding:8px 10px 10px; font-size:12px; line-height:1.35; box-shadow:0 8px 24px rgba(0,0,0,.35); position:relative; }
.note::before { content:""; position:absolute; left:-${NG + 3}px; top:22px; width:${NG}px; border-top:1px dashed rgba(255,181,71,.5); }
.note .lbl { display:block; font:600 10px var(--mono); letter-spacing:.12em; text-transform:uppercase; color:var(--muted); margin-bottom:5px; }
.note .nnote { margin:0 0 6px; font:600 11px var(--mono); color:var(--amber); }
.note ol { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:6px; }
.note li .k { display:block; font:10px var(--mono); color:var(--muted); }
.note li .k b { color:var(--ink); font-weight:600; }
.note li.b-s .k b { color:var(--amber); }
.note li.b-m { border-left:2px solid #8796a6; padding-left:6px; }
.note li.b-i { border-left:2px solid var(--green); padding-left:6px; font-style:italic; }
.note li.b-g { color:var(--rose); font-family:var(--mono); font-size:11px; }
.note .only { display:block; font-style:normal; font:10px var(--mono); color:var(--amber); margin-top:1px; }
.note .nch { margin-top:8px; padding-top:7px; border-top:1px dashed var(--line); }
.note .nch ul { margin:0; padding-left:14px; display:flex; flex-direction:column; gap:4px; }
.note .nch li { color:var(--green); }
.note .nch small { display:block; color:var(--muted); font-size:10.5px; }
.note .lk { font:normal 10px var(--mono); color:var(--amber); }
.note .redo { margin:0 0 7px; padding:5px 7px; border-radius:6px; background:rgba(255,107,133,.1); color:var(--rose); font-size:11px; }
.note .vnote { margin:0 0 7px; padding:5px 7px; border-radius:6px; background:rgba(135,150,166,.12); color:var(--muted); font-size:11px; }
.card .nb.redo { background:rgba(255,107,133,.92); }
.note .tout { margin:6px 0 0; font:10.5px var(--mono); color:var(--rose); }
.drawer { position:fixed; z-index:20; top:max(12px, env(safe-area-inset-top,0px)); right:max(12px, env(safe-area-inset-right,0px)); bottom:12px; width:min(400px, calc(100vw - 24px)); overflow-y:auto; background:rgba(13,18,24,.97); border:1px solid var(--line); border-radius:18px; padding:20px; box-shadow:0 20px 60px rgba(0,0,0,.6); }
.dclose { position:sticky; top:0; float:right; width:34px; height:34px; border-radius:50%; border:1px solid var(--line); background:var(--panel); color:var(--ink); font-size:20px; cursor:pointer; }
.dcode { font:600 22px var(--mono); color:var(--amber); }
.drawer h3 { font:600 20px/1.2 var(--display); margin:4px 0 2px; }
.dmeta { margin:0 0 12px; font:12px var(--mono); color:var(--muted); }
.dimg { width:100%; border-radius:12px; display:block; margin-bottom:12px; }
.dbeats { padding-left:20px; margin:0; display:flex; flex-direction:column; gap:8px; font-size:14px; }
.dbeats .k { display:block; font:11px var(--mono); color:var(--muted); } .dbeats .k b { color:var(--amber); }
.dbeats em { display:block; font:11px var(--mono); color:var(--amber); font-style:normal; }
.dch { list-style:none; padding:0; margin:12px 0 0; display:flex; flex-direction:column; gap:8px; }
.dch li { border:1px solid var(--line); border-radius:10px; padding:8px 10px; font-size:14px; display:flex; flex-direction:column; gap:2px; }
.dch span { color:var(--muted); font-size:13px; } .dch .to { color:var(--green); font-size:13px; }
/* ek bölümler */
section { display:grid; gap:8px; }
.scroll { overflow-x:auto; border:1px solid var(--line); border-radius:12px; background:var(--panel); }
table { border-collapse:collapse; width:100%; font-size:14px; }
th, td { text-align:left; vertical-align:top; padding:10px 12px; border-bottom:1px solid var(--line); }
th { font:600 11px/1.2 var(--mono); letter-spacing:.08em; text-transform:uppercase; color:var(--muted); }
tr:last-child td { border-bottom:0; }
td code, code { font:500 12px/1 var(--mono); padding:3px 6px; border-radius:5px; background:#1b2430; color:var(--ink); white-space:nowrap; }
.a{color:var(--amber)} .b{color:var(--green)}
.note-p, p.note { border-left:2px solid var(--line); padding:4px 0 4px 14px; color:var(--muted); }
.cols { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:16px; }
.cols .card { position:static; width:auto; height:auto; cursor:default; padding:16px; display:grid; gap:6px; border-radius:12px; overflow:visible; box-shadow:none; }
.cols .card:hover { transform:none; }
.sheet { width:100%; max-width:360px; border-radius:12px; }
.sprites { display:flex; flex-wrap:wrap; gap:10px; }
.sprites figure { margin:0; width:104px; }
.sprites img { width:104px; height:150px; object-fit:contain; border-radius:8px; display:block; background:repeating-conic-gradient(#1b2430 0 25%,#131a22 0 50%) 0 0/16px 16px; }
.sprites figcaption { font:500 11px/1.3 var(--mono); color:var(--muted); margin-top:4px; }
a { color:var(--green); }
</style>

<main class="wrap">
  <header>
    <div class="eyebrow">CİCO · Bölüm 2 · Taslak 5 · görselli akış</div>
    <h1>Sabah Zili akışı</h1>
    <p class="lede">Bölüm 1 panosu gibi: her sahne görseliyle bir kart, oklar seçenekleri gösterir. Ekranda sırayla çıkacak bütün yazılar ve seçenekler kartın yanındaki notta. Bir karta dokununca büyük görsel ve metin açılır. Yorumlarını kod ile bırakabilirsin (ör. "2A7 notu çok uzun").</p>
    <div class="stats"><span><b>${sceneCount}</b> kart</span><span><b>2</b> katman</span><span><b>12</b> son</span><span><b>2</b> jiroskop kaçışı</span><span><b>2</b> yeni köprü sahnesi</span></div>
    <div class="legend"><span><i class="lg choice"></i>Karar</span><span><i class="lg love"></i>Aşk kararı</span><span><i class="lg interaction"></i>Jiroskop</span><span><i class="lg cinematic"></i>Sinematik</span><span><i class="lg ending"></i>Son</span><span><i class="lg lgnote"></i>Ekran metni (not)</span><span><i class="lg dash"></i>Süre dolarsa</span><span><i class="lg cond"></i>Önceki karara göre</span><span>🔒 kilitli seçenek</span></div>
  </header>
  ${board('A')}
  ${board('B')}
  ${oldSections()}
</main>
<aside class="drawer" id="drawer" hidden><button class="dclose" id="dclose" aria-label="Kapat">×</button><div id="dbody"></div></aside>
<script>
const D = ${JSON.stringify(D)};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const drawer = document.getElementById('drawer'), body = document.getElementById('dbody');
function open(code) {
  const s = D[code]; if (!s) return;
  document.querySelectorAll('.card.sel').forEach((c) => c.classList.remove('sel'));
  body.innerHTML = '<div class="dcode">' + code + '</div><h3>' + esc(s.title) + '</h3><p class="dmeta">' + s.type + (s.note ? ' · ' + esc(s.note) : '') + '</p>'
    + (s.img ? '<img class="dimg" src="img/' + code + '.jpg" alt="">' : '')
    + '<ol class="dbeats">' + s.beats.map((b) => '<li><span class="k">' + b.k + (b.who ? ' · <b>' + esc(b.who) + '</b>' : '') + '</span>' + esc(b.t) + (b.only ? '<em>yalnızca: ' + esc(b.only) + '</em>' : '') + '</li>').join('') + '</ol>'
    + (s.choices.length ? '<ul class="dch">' + s.choices.map((c) => '<li>' + (c.lock ? '🔒 ' : '') + esc(c.t) + (c.sub ? '<span>' + esc(c.sub) + '</span>' : '') + (c.lock ? '<span>kilit: ' + esc(c.lock) + '</span>' : '') + '<span class="to">→ ' + c.to + (D[c.to] ? ' ' + esc(D[c.to].title) : '') + '</span></li>').join('') + '</ul>' : '');
  drawer.hidden = false;
}
document.querySelectorAll('.board .card').forEach((c) => c.addEventListener('click', () => { open(c.dataset.code); c.classList.add('sel'); }));
document.getElementById('dclose').addEventListener('click', () => { drawer.hidden = true; });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') drawer.hidden = true; });
// Sığdır / gerçek boyut
const fit = {};
function apply(key) {
  const sc = document.getElementById('scale-' + key), b = sc.firstElementChild;
  const w = b.offsetWidth, h = b.offsetHeight;
  const avail = sc.parentElement.clientWidth;
  const k = fit[key] !== false ? Math.min(1, avail / w) : 1;
  b.style.transform = k < 1 ? 'scale(' + k + ')' : '';
  sc.style.width = (w * k) + 'px'; sc.style.height = (h * k) + 'px';
  const btn = document.querySelector('[data-fit="' + key + '"]');
  btn.textContent = k < 1 ? 'Gerçek boyut' : 'Sığdır';
  btn.hidden = avail >= w;
}
document.querySelectorAll('[data-fit]').forEach((btn) => btn.addEventListener('click', () => { const k = btn.dataset.fit; fit[k] = fit[k] === false; apply(k); }));
const all = () => ['A', 'B'].forEach(apply);
window.addEventListener('resize', all); all();
</script>
`;
fs.writeFileSync(OUT, page);
console.log('yazıldı:', OUT, sceneCount, 'sahne');
