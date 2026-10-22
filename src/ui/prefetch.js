/*
 * Öne doğru indirme (lookahead prefetch). Oyuncu bir sahnede metni okurken, o sahneden gidilebilecek
 * sonraki sahnelerin videolarını sessizce arka planda indirir; seçim yapıldığında video hazır olur.
 * Ayar yok, ekran yok. Tüm bölümü indirmez: yalnızca bir (sinematik ara sahnelerde iki) adım ilerisi.
 *
 *   warm(sceneId)  → sıradakileri kuyruğa alır (eski sahnenin bekleyen indirmeleri iptal edilir)
 *   videoUrl(src)  → hazırsa bellekteki kopyanın adresi (blob:), değilse normal ağ adresi
 *
 * Bellek: en fazla MAX_VIDEOS klip tutulur (klipler ~0.4–2 MB), en eskisi bırakılır.
 * Veri tasarrufu modu açıksa (Save-Data) videolar önden indirilmez, yalnızca görseller.
 */
(function (root) {
  'use strict';

  const MAX_VIDEOS = 8;

  function createPrefetcher(opts) {
    const { story, sceneEdges, mediaUrl = (p) => p } = opts;
    const byId = new Map(story.scenes.map((s) => [s.scene_id, s]));
    const ready = new Map(); // src → { url, at }
    let queue = [];
    let inflight = null; // { src, ctrl }
    const conn = root.navigator && root.navigator.connection;
    const saveData = !!(conn && conn.saveData);

    // Bir sahneden gidilebilecek sahneler: önce görünür seçenekler, sonra zaman aşımı yolları.
    // Sinematik (seçimsiz) hedeflerin bir sonrakisi de eklenir: onlar hızlı geçilir.
    function lookahead(sceneId) {
      const scene = byId.get(sceneId);
      if (!scene) return [];
      const edges = sceneEdges(scene).sort((a, b) => (a.timeout ? 1 : 0) - (b.timeout ? 1 : 0));
      const out = [];
      const add = (id) => { if (id && byId.has(id) && !out.includes(id) && id !== sceneId) out.push(id); };
      edges.forEach((e) => add(e.to));
      edges.forEach((e) => {
        const t = byId.get(e.to);
        if (t && !(t.choices || []).some((c) => !c.hidden)) sceneEdges(t).forEach((e2) => add(e2.to));
      });
      return out;
    }

    function assetsOf(id) {
      const s = byId.get(id);
      const images = [s.image_asset, ...(s.text || []).map((b) => b && b.overlay)].filter(Boolean);
      return { video: s.scene_video || null, images };
    }

    // includeSelf: başlık ekranında ilk sahnenin videosu da indirilsin (sahneye girerken onu oynatıcı zaten yükler)
    function warm(sceneId, includeSelf) {
      const ids = [sceneId, ...lookahead(sceneId)];
      const wanted = [];
      ids.forEach((id, i) => {
        const a = assetsOf(id);
        a.images.forEach((src) => { const im = new Image(); im.decoding = 'async'; im.src = src; });
        if ((i > 0 || includeSelf) && a.video && !saveData && !ready.has(a.video)) wanted.push(a.video);
      });
      // Yeni sahnede artık gerekmeyen bekleyen indirmeyi iptal et; kuyruğu yenile
      if (inflight && !wanted.includes(inflight.src) && !ids.some((id) => assetsOf(id).video === inflight.src)) {
        inflight.ctrl.abort();
        inflight = null;
      }
      queue = wanted.filter((src) => !inflight || inflight.src !== src);
      protect(ids.map((id) => assetsOf(id).video).filter(Boolean));
      pump();
    }

    function pump() {
      if (inflight || !queue.length || typeof fetch !== 'function') return;
      const src = queue.shift();
      const ctrl = typeof AbortController === 'function' ? new AbortController() : { abort() {}, signal: undefined };
      inflight = { src, ctrl };
      fetch(mediaUrl(src), { signal: ctrl.signal })
        .then((r) => { if (!r.ok) throw new Error(r.status); return r.blob(); })
        .then((blob) => {
          ready.set(src, { url: URL.createObjectURL(blob), at: Date.now() });
          trim();
        })
        .catch(() => { /* iptal ya da ağ hatası: sahne normal adresten yüklenir */ })
        .finally(() => { if (inflight && inflight.src === src) inflight = null; pump(); });
    }

    let keep = new Set();
    function protect(list) { keep = new Set(list); }
    function trim() {
      if (ready.size <= MAX_VIDEOS) return;
      const old = [...ready.entries()].filter(([src]) => !keep.has(src)).sort((a, b) => a[1].at - b[1].at);
      while (ready.size > MAX_VIDEOS && old.length) {
        const [src, v] = old.shift();
        URL.revokeObjectURL(v.url);
        ready.delete(src);
      }
    }

    function videoUrl(src) {
      const hit = ready.get(src);
      if (hit) { hit.at = Date.now(); return hit.url; }
      return mediaUrl(src);
    }

    return { warm, videoUrl, lookahead, _ready: ready };
  }

  const api = { createPrefetcher };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.CICO = root.CICO || {}).prefetch = api;
})(typeof self !== 'undefined' ? self : this);
