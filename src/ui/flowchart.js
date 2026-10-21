/*
 * Detroit tarzı bölüm akışı: tüm düğümler görünür, keşfedilmemiş olanlar "???".
 * Yerleşim sahne verisinden hesaplanır (en uzun yol derinliği = sütun).
 */
(function (root) {
  'use strict';

  const isNode = typeof module === 'object' && module.exports;
  const engineLib = isNode ? require('../engine/engine.js') : root.CICO.engine;

  const W = 150, H = 46, GX = 54, GY = 16, PAD = 16;

  function layout(story) {
    const byId = new Map(story.scenes.map((s) => [s.scene_id, s]));
    const raw = story.scenes.flatMap((s) => engineLib.sceneEdges(s));
    const edgeMap = new Map();
    for (const e of raw) {
      const k = `${e.from}>${e.to}`;
      const cur = edgeMap.get(k) || { from: e.from, to: e.to, timeoutOnly: true };
      if (!e.timeout) cur.timeoutOnly = false;
      edgeMap.set(k, cur);
    }
    const edges = [...edgeMap.values()];
    const out = new Map();
    edges.forEach((e) => out.set(e.from, [...(out.get(e.from) || []), e.to]));

    // Uzun yol derinliği (DAG; validator döngüleri ayrıca yakalar)
    const depth = new Map([[story.start, 0]]);
    const order = [];
    const seen = new Set();
    const topo = (id) => { if (seen.has(id)) return; seen.add(id); (out.get(id) || []).forEach(topo); order.unshift(id); };
    topo(story.start);
    for (const id of order) for (const n of out.get(id) || []) depth.set(n, Math.max(depth.get(n) || 0, depth.get(id) + 1));

    const cols = [];
    story.scenes.forEach((s) => {
      const d = depth.has(s.scene_id) ? depth.get(s.scene_id) : 0;
      (cols[d] = cols[d] || []).push(s.scene_id);
    });
    const rows = Math.max(...cols.map((c) => c.length));
    const nodes = new Map();
    cols.forEach((col, d) => col.forEach((id, i) => {
      const offset = (rows - col.length) / 2;
      nodes.set(id, { id, type: byId.get(id).scene_type, x: PAD + d * (W + GX), y: PAD + (i + offset) * (H + GY) });
    }));
    return { nodes, edges, width: PAD * 2 + cols.length * (W + GX) - GX, height: PAD * 2 + rows * (H + GY) - GY };
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /*
   * opts: { t, now: {scenes:Set, edges:Set}, past: {scenes:Set, edges:Set}, current, showIds }
   * Döner: { svg, completion }
   */
  function render(story, opts) {
    const L = layout(story);
    const known = (id) => opts.now.scenes.has(id) || opts.past.scenes.has(id);
    let svg = `<svg class="flow" viewBox="0 0 ${L.width} ${L.height}" width="${L.width}" height="${L.height}" role="img">`;
    for (const e of L.edges) {
      const a = L.nodes.get(e.from), b = L.nodes.get(e.to);
      const k = `${e.from}>${e.to}`;
      const cls = opts.now.edges.has(k) ? 'now' : opts.past.edges.has(k) ? 'past' : 'unknown';
      const x1 = a.x + W, y1 = a.y + H / 2, x2 = b.x, y2 = b.y + H / 2, mx = (x1 + x2) / 2;
      svg += `<path class="edge ${cls}${e.timeoutOnly ? ' timeout' : ''}" d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}"/>`;
    }
    for (const n of L.nodes.values()) {
      const cls = opts.now.scenes.has(n.id) ? 'now' : opts.past.scenes.has(n.id) ? 'past' : 'unknown';
      const label = known(n.id) ? opts.t(`scenes.${n.id}.title`) : opts.t('ui.unknown_node');
      const cur = n.id === opts.current ? ' current' : '';
      svg += `<g class="node ${cls} ${n.type}${cur}" transform="translate(${n.x},${n.y})"><title>${esc(known(n.id) ? n.id : '?')}</title>`;
      svg += `<rect width="${W}" height="${H}" rx="${n.type === 'ending' ? 4 : 10}"/>`;
      svg += `<text x="${W / 2}" y="${opts.showIds ? H / 2 - 2 : H / 2 + 4}" text-anchor="middle">${esc(label.length > 22 ? label.slice(0, 21) + '…' : label)}</text>`;
      if (opts.showIds) svg += `<text class="id" x="${W / 2}" y="${H / 2 + 13}" text-anchor="middle">${esc(n.id)}</text>`;
      svg += `</g>`;
    }
    svg += '</svg>';
    const total = story.scenes.length;
    const found = story.scenes.filter((s) => known(s.scene_id)).length;
    return { svg, completion: Math.round((found / total) * 100) };
  }

  const api = { layout, render };
  if (isNode) module.exports = api;
  else root.CICO.flowchart = api;
})(typeof self !== 'undefined' ? self : this);
