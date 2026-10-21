/*
 * Hikâye doğrulayıcı. Hem testlerde hem tarayıcıdaki geliştirici panelinde çalışır.
 *  - yapısal kontroller (benzersiz ID, var olan hedef, sahne tipi kuralları)
 *  - erişilebilirlik (grafik üzerinden) ve döngü tespiti
 *  - tanımsız değişken/ipucu kullanımı
 *  - çeviri eksikleri
 *  - exploreAll: gerçek koşullarla TÜM oynanış yollarını gezer
 */
(function (root) {
  'use strict';

  const isNode = typeof module === 'object' && module.exports;
  const engineLib = isNode ? require('./engine.js') : root.CICO.engine;
  const i18nLib = isNode ? require('./i18n.js') : root.CICO.i18n;

  const SCENE_TYPES = ['cinematic', 'choice', 'interaction', 'ending'];
  const TEXT_KINDS = ['line', 'say', 'msg', 'intro'];

  function walkCondition(cond, out) {
    if (!cond) return;
    if (Array.isArray(cond)) return cond.forEach((c) => walkCondition(c, out));
    ['all', 'any'].forEach((k) => cond[k] && cond[k].forEach((c) => walkCondition(c, out)));
    if (cond.not) walkCondition(cond.not, out);
    if (cond.flag) out.vars.add(cond.flag);
    if (cond.var) out.vars.add(cond.var);
    if (cond.clue) out.clues.add(cond.clue);
    if (cond.visited) out.scenes.add(cond.visited);
  }

  function walkEffects(effects, out) {
    for (const e of effects || []) {
      walkCondition(e.if, out);
      Object.keys(e.set || {}).forEach((k) => out.vars.add(k));
      Object.keys(e.add || {}).forEach((k) => out.vars.add(k));
      [].concat(e.clue || []).forEach((c) => out.clues.add(c));
    }
  }

  // Bir sahnede kullanılan tüm i18n anahtarları (koşullardan bağımsız).
  function requiredKeys(story) {
    const keys = [];
    for (const s of story.scenes) {
      const id = s.scene_id;
      keys.push(`scenes.${id}.title`);
      for (const b of s.text || []) {
        const k = typeof b === 'string' ? b : b.key;
        keys.push(k.startsWith('@') ? k.slice(1) : `scenes.${id}.${k}`);
        if (b.from) keys.push(`speakers.${b.from}`);
        if (b.who) keys.push(`characters.${b.who}.name`, `characters.${b.who}.line`);
      }
      for (const c of s.choices || []) {
        if (c.hidden) continue;
        keys.push(`scenes.${id}.choices.${c.id}`);
        if (c.show_locked) keys.push(`scenes.${id}.choices.${c.id}_hint`);
      }
    }
    Object.keys(story.clues).forEach((c) => keys.push(`clues.${c}.name`, `clues.${c}.text`));
    (story.epilogue || []).forEach((b) => keys.push(`epilogue.${typeof b === 'string' ? b : b.key}`));
    return [...new Set(keys)];
  }

  function validateStory(story, locales = {}, { referenceLocale = 'tr' } = {}) {
    const errors = [];
    const warnings = [];
    const ids = story.scenes.map((s) => s.scene_id);
    const byId = new Map();

    ids.forEach((id, i) => {
      if (ids.indexOf(id) !== i) errors.push(`Duplicate scene_id: ${id}`);
      byId.set(id, story.scenes[i]);
    });
    if (!byId.has(story.start)) errors.push(`Start scene missing: ${story.start}`);

    const used = { vars: new Set(), clues: new Set(), scenes: new Set() };
    (story.epilogue || []).forEach((b) => typeof b === 'object' && walkCondition(b.if, used));
    const edges = [];

    for (const s of story.scenes) {
      const id = s.scene_id;
      if (!SCENE_TYPES.includes(s.scene_type)) errors.push(`${id}: invalid scene_type "${s.scene_type}"`);
      if (!('video_asset' in s)) warnings.push(`${id}: video_asset field missing`);
      const choices = s.choices || [];
      const choiceIds = choices.map((c) => c.id);
      choiceIds.forEach((c, i) => choiceIds.indexOf(c) !== i && errors.push(`${id}: duplicate choice id ${c}`));

      if (s.scene_type === 'ending') {
        if (choices.length || s.next) errors.push(`${id}: ending must not have choices/next`);
      } else if (s.scene_type === 'cinematic') {
        if (choices.length) errors.push(`${id}: cinematic must not have choices (use scene_type "choice")`);
        if (!s.next) errors.push(`${id}: cinematic needs next`);
      } else {
        if (!choices.filter((c) => !c.hidden).length) errors.push(`${id}: ${s.scene_type} needs visible choices`);
        if (s.next) errors.push(`${id}: choice scene must route through choices, not next`);
        // Kilitsiz en az bir seçenek her zaman olmalı; yoksa oyuncu takılır.
        if (!choices.some((c) => !c.hidden && !c.conditions)) errors.push(`${id}: every visible choice is conditional — player may get stuck`);
      }
      if (s.timer) {
        const t = choices.find((c) => c.id === s.timer.on_timeout);
        if (!t) errors.push(`${id}: timer.on_timeout "${s.timer.on_timeout}" is not a choice`);
        else if (t.conditions) errors.push(`${id}: timeout choice must be unconditional`);
        if (!(s.timer.seconds > 0)) errors.push(`${id}: timer.seconds must be > 0`);
      }
      for (const c of choices) {
        if (c.hidden && (!s.timer || s.timer.on_timeout !== c.id)) warnings.push(`${id}: hidden choice ${c.id} is not a timeout target`);
        if (!c.hidden) {
          if (!c.hotspot) warnings.push(`${id}.${c.id}: no hotspot (falls back to default position)`);
          else if (!(c.hotspot.x >= 0 && c.hotspot.x <= 100 && c.hotspot.y >= 0 && c.hotspot.y <= 100)) errors.push(`${id}.${c.id}: hotspot must be 0–100 %`);
        }
        if (Array.isArray(c.next) && c.next[c.next.length - 1].if) errors.push(`${id}.${c.id}: conditional next needs an unconditional fallback`);
        walkCondition(c.conditions, used);
        walkEffects(c.effects, used);
        if (Array.isArray(c.next)) c.next.forEach((b) => walkCondition(b.if, used));
      }
      for (const b of s.text || []) {
        if (typeof b !== 'object') continue;
        walkCondition(b.if, used);
        if (b.kind && !TEXT_KINDS.includes(b.kind)) errors.push(`${id}: invalid text kind "${b.kind}"`);
        if ((b.kind === 'say' || b.kind === 'msg') && !b.from) errors.push(`${id}.${b.key}: "${b.kind}" needs "from"`);
        if (b.kind === 'intro' && !(story.characters || {})[b.who]) errors.push(`${id}: intro for unknown character "${b.who}"`);
      }
      walkEffects(s.on_enter, used);
      edges.push(...engineLib.sceneEdges(s));
    }

    for (const e of edges) if (!byId.has(e.to)) errors.push(`${e.from}${e.choice ? '.' + e.choice : ''}: target "${e.to}" does not exist`);
    used.vars.forEach((v) => !(v in story.variables) && errors.push(`Undeclared variable: ${v}`));
    used.clues.forEach((c) => !(c in story.clues) && errors.push(`Undeclared clue: ${c}`));
    used.scenes.forEach((id) => !byId.has(id) && errors.push(`Condition refers to unknown scene: ${id}`));
    Object.keys(story.clues).forEach((c) => !used.clues.has(c) && warnings.push(`Unused clue: ${c}`));
    Object.keys(story.variables).forEach((v) => !used.vars.has(v) && warnings.push(`Unused variable: ${v}`));

    // Grafik erişilebilirliği
    const adj = new Map(ids.map((id) => [id, []]));
    edges.forEach((e) => adj.has(e.from) && byId.has(e.to) && adj.get(e.from).push(e.to));
    const reachable = new Set();
    const stack = [story.start];
    while (stack.length) {
      const id = stack.pop();
      if (reachable.has(id) || !byId.has(id)) continue;
      reachable.add(id);
      stack.push(...adj.get(id));
    }
    const unreachable = ids.filter((id) => !reachable.has(id));
    unreachable.forEach((id) => errors.push(`Unreachable scene: ${id}`));

    // Döngü tespiti (bu bölümde kasıtlı döngü yok; eklenirse story.allowed_cycles ile işaretlenmeli)
    const cycles = [];
    const color = new Map();
    const dfs = (id, path) => {
      color.set(id, 1);
      for (const n of adj.get(id) || []) {
        if (color.get(n) === 1) cycles.push([...path, id, n].slice(path.indexOf(n) >= 0 ? path.indexOf(n) : 0));
        else if (!color.get(n)) dfs(n, [...path, id]);
      }
      color.set(id, 2);
    };
    if (byId.has(story.start)) dfs(story.start, []);
    const allowed = story.allowed_cycles || [];
    cycles.filter((c) => !allowed.some((a) => c.includes(a))).forEach((c) => errors.push(`Unintended cycle: ${c.join(' → ')}`));

    // Çeviri kontrolü
    const missing = {};
    const needed = requiredKeys(story);
    const ref = locales[referenceLocale];
    const refKeys = ref ? i18nLib.collectKeys(ref) : [];
    for (const [code, loc] of Object.entries(locales)) {
      const have = new Set(i18nLib.collectKeys(loc));
      const miss = [...new Set([...needed, ...refKeys])].filter((k) => !have.has(k));
      if (miss.length) missing[code] = miss;
    }
    Object.entries(missing).forEach(([code, m]) => errors.push(`Locale "${code}" missing ${m.length} key(s): ${m.slice(0, 5).join(', ')}${m.length > 5 ? '…' : ''}`));

    const endings = story.scenes.filter((s) => s.scene_type === 'ending').map((s) => s.scene_id);
    return { ok: errors.length === 0, errors, warnings, report: { reachable: [...reachable], unreachable, endings, cycles, missing, edges } };
  }

  /*
   * Gerçek motorla, gerçek koşullarla tüm yolları dener (her seçenek + her zaman aşımı).
   * Döner: yollar, ulaşılan sonlar/sahneler, takılma (çıkışsız) durumları.
   */
  function exploreAll(story, { maxDepth = 60 } = {}) {
    const engine = engineLib.createEngine(story);
    const paths = [];
    const stuck = [];
    const scenesHit = new Set();
    const endingsHit = {};
    const walk = (snap, trail) => {
      engine.load(snap);
      const scene = engine.getScene();
      scenesHit.add(scene.scene_id);
      if (trail.length > maxDepth) return stuck.push({ reason: 'max depth', trail });
      if (scene.scene_type === 'ending') {
        endingsHit[scene.scene_id] = (endingsHit[scene.scene_id] || 0) + 1;
        return paths.push({ trail, ending: scene.scene_id, state: engine.snapshot() });
      }
      const actions = [];
      if (!(scene.choices || []).length) actions.push(['advance']);
      engine.getChoices().filter((c) => c.enabled).forEach((c) => actions.push(['choose', c.id]));
      if (scene.timer) actions.push(['timeout']);
      if (!actions.length) return stuck.push({ reason: 'no available action', trail, scene: scene.scene_id });
      for (const [fn, arg] of actions) {
        engine.load(snap);
        engine[fn](arg);
        walk(engine.snapshot(), [...trail, `${scene.scene_id}${arg ? ':' + arg : fn === 'timeout' ? ':⏱' : ''}`]);
      }
    };
    walk(engine.snapshot(), []);
    const neverHit = story.scenes.map((s) => s.scene_id).filter((id) => !scenesHit.has(id));
    return { paths, stuck, endingsHit, neverHit };
  }

  const api = { validateStory, exploreAll, requiredKeys };
  if (isNode) module.exports = api;
  else root.CICO.validate = api;
})(typeof self !== 'undefined' ? self : this);
