/*
 * Dallanma motoru. DOM'a dokunmaz; tarayıcıda, CLI'da ve testlerde aynı kod çalışır.
 * Sahne verisini (src/story/*.js) okur, durumu tutar, seçimleri uygular.
 */
(function (root) {
  'use strict';

  const clone = (v) => JSON.parse(JSON.stringify(v));

  function evalCondition(cond, state) {
    if (!cond) return true;
    if (Array.isArray(cond)) return cond.every((c) => evalCondition(c, state));
    if (cond.all) return cond.all.every((c) => evalCondition(c, state));
    if (cond.any) return cond.any.some((c) => evalCondition(c, state));
    if (cond.not) return !evalCondition(cond.not, state);
    if (cond.clue) return state.clues.includes(cond.clue);
    if (cond.visited) return state.visited.includes(cond.visited);
    if (cond.flag) return !!state.vars[cond.flag];
    if (cond.var) {
      const v = state.vars[cond.var];
      if ('eq' in cond) return v === cond.eq;
      if ('gte' in cond) return v >= cond.gte;
      if ('lte' in cond) return v <= cond.lte;
      if ('gt' in cond) return v > cond.gt;
      if ('lt' in cond) return v < cond.lt;
    }
    throw new Error('Unknown condition: ' + JSON.stringify(cond));
  }

  // Etkileri uygular ve geliştirici günlüğü için değişiklik listesi döndürür.
  function applyEffects(effects, state) {
    const changes = [];
    for (const e of effects || []) {
      if (e.if && !evalCondition(e.if, state)) continue;
      for (const [k, v] of Object.entries(e.set || {})) {
        changes.push({ var: k, from: state.vars[k], to: v });
        state.vars[k] = v;
      }
      for (const [k, n] of Object.entries(e.add || {})) {
        const from = state.vars[k] || 0;
        changes.push({ var: k, from, to: from + n });
        state.vars[k] = from + n;
      }
      for (const id of [].concat(e.clue || [])) {
        if (!state.clues.includes(id)) {
          state.clues.push(id);
          changes.push({ clue: id });
        }
      }
    }
    return changes;
  }

  function resolveNext(next, state) {
    if (typeof next === 'string') return next;
    if (Array.isArray(next)) {
      for (const branch of next) if (!branch.if || evalCondition(branch.if, state)) return branch.goto;
    }
    return null;
  }

  // Sahnenin vuruşlarını (duruma göre süzülmüş) döndürür: [{ key, kind, from }]
  // kind: 'line' (anlatı) | 'say' (konuşma) | 'msg' (telefon bildirimi) | 'intro' (karakter tanıtım slaytı)
  function textBlocks(scene, state) {
    const out = [];
    for (const block of scene.text || []) {
      const b = typeof block === 'string' ? { key: block } : block;
      if (b.if && !evalCondition(b.if, state)) continue;
      out.push({
        key: b.key.startsWith('@') ? b.key.slice(1) : `scenes.${scene.scene_id}.${b.key}`,
        kind: b.kind || 'line',
        from: b.from || null,
        who: b.who || null,
      });
    }
    return out;
  }

  const textKeys = (scene, state) => textBlocks(scene, state).map((b) => b.key);

  // Oyun sonu seslendirme metni: duruma göre seçilen parçaların i18n anahtarları (sırayla).
  function epilogueKeys(story, state) {
    return (story.epilogue || [])
      .map((b) => (typeof b === 'string' ? { key: b } : b))
      .filter((b) => !b.if || evalCondition(b.if, state))
      .map((b) => `epilogue.${b.key}`);
  }

  // Grafik kenarları (koşullardan bağımsız, tüm olası hedefler). Validator ve flowchart kullanır.
  function sceneEdges(scene) {
    const edges = [];
    const push = (next, extra) => {
      if (typeof next === 'string') edges.push({ from: scene.scene_id, to: next, ...extra });
      else if (Array.isArray(next)) next.forEach((b) => edges.push({ from: scene.scene_id, to: b.goto, cond: b.if || null, ...extra }));
    };
    for (const c of scene.choices || []) push(c.next, { choice: c.id, timeout: !!c.hidden, locked: !!c.conditions });
    if (scene.next) push(scene.next, { choice: null });
    return edges;
  }

  function createEngine(story) {
    const scenes = new Map(story.scenes.map((s) => [s.scene_id, s]));
    const initialVars = Object.fromEntries(Object.entries(story.variables).map(([k, d]) => [k, d.initial]));
    let state = null;

    function getScene(id = state.sceneId) {
      const scene = scenes.get(id);
      if (!scene) throw new Error('Unknown scene: ' + id);
      return scene;
    }

    function enter(id) {
      const scene = getScene(id);
      state.sceneId = id;
      state.visited.push(id);
      const changes = applyEffects(scene.on_enter, state);
      state.log.push({ scene: id, source: 'enter', changes });
      state.ended = scene.scene_type === 'ending';
    }

    // Oyuncuya gösterilecek seçenekler. Gizli (zaman aşımı) seçenekler hariç.
    function getChoices() {
      return (getScene().choices || [])
        .filter((c) => !c.hidden)
        .map((c) => {
          const enabled = evalCondition(c.conditions, state);
          return { id: c.id, enabled, locked: !enabled, visible: enabled || !!c.show_locked, hotspot: c.hotspot || null };
        })
        .filter((c) => c.visible);
    }

    function go(scene, choice, timedOut) {
      const changes = choice ? applyEffects(choice.effects, state) : [];
      const next = resolveNext(choice ? choice.next : scene.next, state);
      if (!next) throw new Error(`No next scene from ${scene.scene_id}`);
      state.log.push({ scene: scene.scene_id, source: choice ? `choice:${choice.id}` : 'advance', changes });
      state.history.push({ scene: scene.scene_id, choice: choice ? choice.id : null, timeout: !!timedOut, to: next });
      enter(next);
    }

    function choose(choiceId) {
      const scene = getScene();
      const choice = (scene.choices || []).find((c) => c.id === choiceId);
      if (!choice || choice.hidden) throw new Error(`Choice "${choiceId}" not available in ${scene.scene_id}`);
      if (!evalCondition(choice.conditions, state)) throw new Error(`Choice "${choiceId}" is locked`);
      go(scene, choice, false);
    }

    function timeout() {
      const scene = getScene();
      if (!scene.timer) throw new Error(`${scene.scene_id} has no timer`);
      go(scene, scene.choices.find((c) => c.id === scene.timer.on_timeout), true);
    }

    function advance() {
      const scene = getScene();
      if ((scene.choices || []).length) throw new Error(`${scene.scene_id} requires a choice`);
      if (scene.scene_type === 'ending') throw new Error('Story has ended');
      go(scene, null, false);
    }

    function restart() {
      state = { sceneId: null, vars: clone(initialVars), clues: [], history: [], visited: [], log: [], ended: false };
      enter(story.start);
    }

    restart();

    return {
      story,
      get state() { return state; },
      getScene,
      getChoices,
      textKeys: () => textKeys(getScene(), state),
      textBlocks: () => textBlocks(getScene(), state),
      epilogueKeys: () => epilogueKeys(story, state),
      choose,
      timeout,
      advance,
      restart,
      snapshot: () => clone(state),
      load: (s) => { state = clone(s); },
    };
  }

  const api = { evalCondition, applyEffects, resolveNext, textKeys, textBlocks, epilogueKeys, sceneEdges, createEngine };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.CICO = root.CICO || {}).engine = api;
})(typeof self !== 'undefined' ? self : this);
