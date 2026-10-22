/*
 * Mobil oyun arayüzü. Hikâye mantığı yok: motor (engine.js) ne derse onu gösterir.
 *
 * Ekran akışı:  title → intro (bölüm kartı) → play → epilogue (seslendirme metni) → summary → memorial
 * Bir sahne:    tam ekran video (yoksa atmosfer) + kısa vuruşlar. Dokun = sıradaki vuruş.
 *               msg → üstte bildirim kartı · line/say → altta altyazı · intro → karakter tanıtım slaytı
 *               son vuruşta seçim kartları.
 * Video modu:   anlatı/konuşma videonun içinde (ileride .vtt); mesaj ve seçim kartları videonun üstünde.
 */
(function () {
  'use strict';

  const { story, engine: E, i18n, locales, validate, media, flowchart } = window.CICO;
  // Native köprü (Capacitor): tarayıcıda etkisiz bir yedekle çalışır
  const native = window.CICO.native || { isNative: false, mediaUrl: (p) => p, haptic: () => false, init() {}, exitApp() {} };

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* depolama yoksa sessizce devam */ } },
  };

  const settings = Object.assign({ lang: 'tr', timers: true, haptics: true, sound: true, dev: false }, store.get('cico.settings', {}));
  // Seçim noktası tanımlı değilse kullanılacak geçici yerler (görselin yüzdesi)
  const DEFAULT_SPOTS = [{ x: 30, y: 56 }, { x: 70, y: 64 }, { x: 50, y: 40 }];
  if (!locales[settings.lang]) settings.lang = 'tr';
  let t = i18n.createTranslator(locales, settings.lang);
  const saveSettings = () => store.set('cico.settings', settings);

  const game = E.createEngine(story);
  const validation = validate.validateStory(story, locales);
  let discovery = store.get('cico.discovery.v1', { scenes: [], edges: [] });

  const ui = {
    screen: 'title',   // 'title' | 'intro' | 'play' | 'epilogue' | 'summary' | 'memorial'
    pause: null,       // null | 'menu' | 'journal' | 'flow' | 'dev'
    modal: false,
    beat: 0,
    mode: 'text',      // 'text' | 'video'
    videoReady: false,
    videoHandle: null,
    pendingVideo: null, // video modunda: önce tanıtım slaytları, sonra video
    introQueue: [],
    notice: null,
    timer: null,
    epi: { keys: [], i: 0, timer: 0 },
    coord: false,      // geliştirici: koordinat seçici
    introTimer: 0,
  };

  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const scene = () => game.getScene();
  const blocks = () => game.textBlocks();
  const atLastBeat = () => ui.beat >= blocks().length - 1;
  const hasChoices = () => (scene().choices || []).length > 0;
  const sceneReady = () => (ui.mode === 'video' ? ui.videoReady : atLastBeat());
  const paused = () => !!ui.pause || ui.modal;
  const choicesVisible = () => ui.screen === 'play' && !game.state.ended && hasChoices() && sceneReady();

  // ── Titreşim (Android/Chrome; iOS Safari desteklemez, sessizce yok sayılır) ──
  function haptic(pattern) {
    if (!settings.haptics) return;
    if (native.haptic(pattern)) return; // uygulamada native haptics (iOS dahil)
    if (!navigator.vibrate) return;
    try { navigator.vibrate(pattern); } catch (e) { /* desteklenmiyor */ }
  }

  // ── Bildirim kuyruğu: karar bedeli, ipucu, zaman aşımı ────────────
  const toastQueue = [];
  let toastBusy = false;
  function toast(text, kind) {
    toastQueue.push({ text, kind });
    if (!toastBusy) nextToast();
  }
  function nextToast() {
    const item = toastQueue.shift();
    const box = $('#toasts');
    if (!item) { toastBusy = false; return; }
    toastBusy = true;
    const icon = { cost: '↺', clue: '✎', time: '⏱' }[item.kind] || '•';
    box.innerHTML = `<div class="toast ${item.kind}"><span class="toast-icon">${icon}</span><span>${esc(item.text)}</span></div>`;
    haptic(item.kind === 'time' ? [30, 50, 30] : 12);
    setTimeout(() => { box.innerHTML = ''; setTimeout(nextToast, 180); }, 2600);
  }

  // ── Keşif kaydı (oyunlar arası, akış şeması için) ─────────────────
  function recordDiscovery() {
    const s = new Set(discovery.scenes), e = new Set(discovery.edges);
    game.state.visited.forEach((id) => s.add(id));
    game.state.history.forEach((h) => e.add(`${h.scene}>${h.to}`));
    discovery = { scenes: [...s], edges: [...e] };
    store.set('cico.discovery.v1', discovery);
  }

  // ── Sahneye giriş ─────────────────────────────────────────────────
  function enterScene() {
    stopTimer();
    if (ui.videoHandle) ui.videoHandle.stop();
    ui.videoHandle = null;
    ui.notice = null;
    ui.beat = 0;
    ui.stingFor = null;
    recordDiscovery();
    showStamp();

    const plan = media.resolveMedia(scene(), settings.lang);
    ui.mode = plan.mode;
    ui.videoReady = false;
    ui.pendingVideo = null;
    showImage(plan.image);
    showAmbient(plan.ambient);
    // Videosu olmayan ya da videosu bitmiş sahnede görsel çok hafif yakınlaşır ve salınır (still_motion)
    $('#app').classList.toggle('drift', !plan.clip && !!scene().still_motion);
    showClip(plan.clip);
    ui.introQueue = plan.mode === 'video' ? blocks().filter((b) => b.kind === 'intro') : [];
    render();

    if (plan.mode === 'video') {
      ui.pendingVideo = plan;
      if (!ui.introQueue.length) startVideo();
    } else {
      maybeStartTimer();
    }
  }

  function startVideo() {
    const plan = ui.pendingVideo;
    ui.pendingVideo = null;
    if (!plan) return;
    {
      const ready = () => { ui.videoReady = true; render(); maybeStartTimer(); };
      ui.videoHandle = media.mountVideo($('#stage-media'), plan, {
        showChoices: ready,
        ended: ready,
        failed() {
          ui.videoHandle = null;
          ui.mode = 'text';
          ui.notice = t('ui.video_missing');
          render();
          maybeStartTimer();
        },
      });
      renderHud();
    }
  }

  // Sahne görseli: çerçevede tam görünür, arkada bulanık kopyası
  function showImage(src) {
    const holder = $('#stage-media');
    const current = holder.querySelector('img.stage-img');
    if (current && current.dataset.src === src) return;
    holder.querySelectorAll('img.stage-img').forEach((el) => el.remove());
    $('#backdrop').style.backgroundImage = src ? `url("${src}")` : '';
    $('#app').classList.toggle('has-image', !!src);
    if (!src) return;
    const img = new Image();
    img.className = 'stage-img';
    img.alt = '';
    img.dataset.src = src;
    img.onerror = () => { img.remove(); $('#backdrop').style.backgroundImage = ''; $('#app').classList.remove('has-image'); };
    img.src = src;
    holder.prepend(img);
  }

  // Ortam videosu: sessiz döngü, görselin üstünde. Oynamaya başlayınca yumuşakça belirir;
  // o zamana kadar (ya da yüklenemezse) altta görsel görünür.
  function showAmbient(src) {
    const holder = $('#stage-media');
    const current = holder.querySelector('video.stage-ambient');
    if (current && current.dataset.src === src) return;
    if (current) { current.pause(); current.removeAttribute('src'); current.load(); current.remove(); }
    if (!src) return;
    const v = document.createElement('video');
    v.className = 'stage-ambient';
    v.dataset.src = src;
    v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
    v.preload = 'auto';
    v.addEventListener('playing', () => v.classList.add('ready'), { once: true });
    v.addEventListener('error', () => v.remove(), { once: true });
    v.src = src;
    holder.appendChild(v);
    const p = v.play();
    if (p && p.catch) p.catch(() => { /* otomatik oynatma engellenirse görsel kalır */ });
  }

  // Vuruş görseli (hayal, polaroid…): yalnızca o vuruş ekrandayken sahne görselinin üstünde
  function showOverlay(src, style) {
    const holder = $('#stage-media');
    const current = holder.querySelector('.beat-overlay');
    if (current && current.dataset.src === (src || '')) return;
    if (current) { current.classList.add('out'); setTimeout(() => current.remove(), 450); }
    if (!src) return;
    const wrap = document.createElement('div');
    wrap.className = `beat-overlay ${style || ''}`;
    wrap.dataset.src = src;
    const img = new Image();
    img.alt = '';
    img.onerror = () => wrap.remove();
    img.src = src;
    wrap.appendChild(img);
    holder.appendChild(wrap);
  }

  // ── Ses: arka plan müziği (bölüm boyunca kesintisiz) + sahne kliplerinin ortam sesi ──
  // Karışım: tema müziği önde, sahne kliplerinin ortam sesi arkada bir detay olarak (%50)
  const MUSIC_VOL = 0.7;
  const CLIP_VOL = 0.5;
  const SPEAKER_ON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const SPEAKER_OFF = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  // Müzik Web Audio ile çalar: iOS'ta sesli bir <video> başlayınca/döngüye girince <audio> öğesi duraklatılabiliyor;
  // Web Audio katmanı video oynatmadan etkilenmez ve tampon döngüsü örnek-hassas (boşluksuz) döner.
  const music = { ctx: null, gain: null, src: null, buffer: null, loading: null, el: null };
  function musicGainTarget() { return settings.sound ? MUSIC_VOL : 0; }
  function applySound() {
    document.querySelectorAll('video.stage-clip').forEach((v) => { v.muted = !settings.sound; });
    if (music.gain) {
      const now = music.ctx.currentTime;
      music.gain.gain.cancelScheduledValues(now);
      music.gain.gain.setTargetAtTime(musicGainTarget(), now, 0.25);
    }
    if (music.el) music.el.muted = !settings.sound;
    const btn = $('#btn-sound');
    btn.innerHTML = settings.sound ? SPEAKER_ON : SPEAKER_OFF;
    btn.setAttribute('aria-label', t(settings.sound ? 'ui.sound_off' : 'ui.sound_on'));
    btn.setAttribute('aria-pressed', settings.sound ? 'true' : 'false');
  }
  function toggleSound() { settings.sound = !settings.sound; saveSettings(); applySound(); if (settings.sound) startMusic(); haptic(8); }
  // Müzik yalnızca bir dokunuştan sonra başlayabilir (tarayıcı kuralı); yumuşakça açılır
  function startMusic() {
    if (!story.music) return;
    // iOS 17+: sessiz anahtarı açıkken de çalsın (oyun sesi "playback" türünde)
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* desteklenmiyor */ }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return startMusicElement();
    if (!music.ctx) {
      music.ctx = new AC();
      music.gain = music.ctx.createGain();
      music.gain.gain.value = 0;
      music.gain.connect(music.ctx.destination);
    }
    if (music.ctx.state !== 'running') music.ctx.resume().catch(() => {});
    if (music.src || music.loading) { applySound(); return; }
    music.loading = fetch(story.music)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then((buf) => new Promise((res, rej) => music.ctx.decodeAudioData(buf, res, rej)))
      .then((decoded) => {
        music.buffer = decoded;
        const src = music.ctx.createBufferSource();
        src.buffer = decoded;
        src.loop = true;
        src.connect(music.gain);
        src.start();
        music.src = src;
        const now = music.ctx.currentTime;
        music.gain.gain.setValueAtTime(0, now);
        music.gain.gain.linearRampToValueAtTime(musicGainTarget(), now + 2.5);
      })
      .catch(() => { music.loading = null; startMusicElement(); });
  }
  // Karar anı efekti: kısa (≈1.4 sn), alçak frekanslı sinematik "vurgu". Dosya yok, Web Audio ile sentezlenir.
  // İyi uygulama: tutarlı tek imza, müziğin biraz altında, sert tiz yok, karar başına bir kez, müziği kısa süre kısar (ducking).
  function playChoiceSting() {
    if (!settings.sound || !music.ctx || music.ctx.state !== 'running') return;
    const ctx = music.ctx;
    const t0 = ctx.currentTime + 0.02;
    const out = ctx.createGain();
    out.gain.value = 0.42;
    out.connect(ctx.destination);
    // 1) Hava sesi: bant geçiren gürültü, açılıp kapanan
    const len = Math.floor(ctx.sampleRate * 0.9);
    const nb = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = nb.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource(); noise.buffer = nb;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.9;
    bp.frequency.setValueAtTime(280, t0); bp.frequency.exponentialRampToValueAtTime(1500, t0 + 0.32); bp.frequency.exponentialRampToValueAtTime(500, t0 + 0.8);
    const ng = ctx.createGain(); ng.gain.setValueAtTime(0.0001, t0); ng.gain.exponentialRampToValueAtTime(0.22, t0 + 0.26); ng.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.85);
    noise.connect(bp).connect(ng).connect(out); noise.start(t0); noise.stop(t0 + 0.9);
    // 2) Alçak vuruş: aşağı kayan sinüs
    const tb = t0 + 0.2;
    const boom = ctx.createOscillator(); boom.type = 'sine';
    boom.frequency.setValueAtTime(72, tb); boom.frequency.exponentialRampToValueAtTime(36, tb + 0.9);
    const bg = ctx.createGain(); bg.gain.setValueAtTime(0.0001, tb); bg.gain.exponentialRampToValueAtTime(0.9, tb + 0.012); bg.gain.exponentialRampToValueAtTime(0.0001, tb + 1.2);
    boom.connect(bg).connect(out); boom.start(tb); boom.stop(tb + 1.25);
    // 3) Karanlık tını: D3 + A3 ve çok hafif E♭4 (Hicaz rengi), alçak geçiren süzgeçle yumuşatılmış
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400;
    const tg = ctx.createGain(); tg.gain.setValueAtTime(0.0001, tb); tg.gain.exponentialRampToValueAtTime(0.09, tb + 0.06); tg.gain.exponentialRampToValueAtTime(0.0001, tb + 1.5);
    lp.connect(tg).connect(out);
    [[146.83, 1], [220, 0.8], [311.13, 0.35]].forEach(([f, a]) => {
      const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f; o.detune.value = (Math.random() - 0.5) * 8;
      const g = ctx.createGain(); g.gain.value = a; o.connect(g).connect(lp); o.start(tb); o.stop(tb + 1.55);
    });
    // 4) Müziği kısa süre kıs (ducking), sonra yumuşakça geri getir
    if (music.gain) {
      const target = musicGainTarget();
      music.gain.gain.cancelScheduledValues(t0);
      music.gain.gain.setValueAtTime(music.gain.gain.value, t0);
      music.gain.gain.linearRampToValueAtTime(target * 0.55, t0 + 0.12);
      music.gain.gain.linearRampToValueAtTime(target, t0 + 1.4);
    }
    setTimeout(() => out.disconnect(), 2200);
  }

  // Yedek: Web Audio yoksa ya da dosya çözülemezse eski <audio> yolu
  function startMusicElement() {
    const bgm = $('#bgm');
    music.el = bgm;
    if (!bgm.src) { bgm.src = story.music; bgm.volume = MUSIC_VOL; }
    bgm.muted = !settings.sound;
    const p = bgm.play();
    if (p && p.catch) p.catch(() => {});
  }
  // Uygulama arka plana geçince müzik durur, dönünce kaldığı yerden devam eder; iOS bağlamı askıya alırsa ilk dokunuşta canlanır
  document.addEventListener('visibilitychange', () => {
    if (!music.ctx) return;
    if (document.hidden) music.ctx.suspend().catch(() => {});
    else if (music.src) music.ctx.resume().catch(() => {});
  });
  document.addEventListener('pointerdown', () => {
    if (music.ctx && music.src && music.ctx.state !== 'running' && !document.hidden) music.ctx.resume().catch(() => {});
  }, { passive: true });

  // Sahne klibi: sesiyle, döngüde oynar (ilk ve son karesi sahne görseliyle aynı, döngü dikişsiz).
  // Karar anında solar ve altındaki görsel kalır (seçim noktaları görselin koordinatlarına göre).
  function showClip(src) {
    const holder = $('#stage-media');
    const current = holder.querySelector('video.stage-clip');
    if (current && current.dataset.src === src) return;
    if (current) endClip(current);
    if (!src) return;
    const v = document.createElement('video');
    v.className = 'stage-clip';
    v.dataset.src = src;
    v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
    v.preload = 'auto';
    v.muted = !settings.sound;
    v.volume = CLIP_VOL;
    // Çoğu klip dikişsiz döngüdür; clip_loop: false olanlar bir kez oynar, sonra görsel hafifçe "nefes alır"
    const loop = scene().clip_loop !== false;
    v.loop = loop;
    if (!loop) v.addEventListener('ended', () => { endClip(v); $('#app').classList.add('drift'); }, { once: true });
    v.addEventListener('playing', () => v.classList.add('ready'), { once: true });
    v.addEventListener('error', () => v.remove(), { once: true });
    v.src = native.mediaUrl(src); // uygulamada videolar sunucudan akar; bağlantı yoksa görsel kalır
    holder.appendChild(v);
    const p = v.play();
    if (p && p.catch) p.catch(() => { v.muted = true; v.play().catch(() => v.remove()); });
  }
  function endClip(v) {
    if (!v || v.classList.contains('out')) return;
    v.classList.add('out');
    setTimeout(() => { v.pause(); v.removeAttribute('src'); v.load(); v.remove(); }, 700);
  }

  // Mekân etiketi: film gibi, sahne başında birkaç saniye
  function showStamp() {
    const el = $('#stamp');
    el.innerHTML = `<span class="stamp-line"></span><span>${esc(t(`scenes.${scene().scene_id}.title`))}</span>`;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
  }

  // Dokunuş: sıradaki vuruş → seçimler / sonraki sahne / oyun sonu metni
  function tap() {
    if (paused()) return;
    if (ui.screen === 'intro') { beginPlay(); return; }
    if (ui.screen === 'epilogue') { nextEpilogueLine(); return; }
    if (ui.screen !== 'play') return;
    if (ui.introQueue.length) {
      ui.introQueue.shift();
      haptic(5);
      if (!ui.introQueue.length) startVideo();
      render();
      return;
    }
    if (!sceneReady()) {
      if (ui.mode === 'text') { ui.beat += 1; haptic(5); render(); maybeStartTimer(); }
      return;
    }
    if (game.state.ended) { startEpilogue(); return; }
    if (!hasChoices()) act('advance');
  }

  // ── Zamanlayıcı (duraklatınca durur) ──────────────────────────────
  function maybeStartTimer() {
    const s = scene();
    if (!s.timer || !settings.timers || ui.timer || !choicesVisible()) return;
    ui.timer = { total: s.timer.seconds * 1000, left: s.timer.seconds * 1000, last: performance.now(), raf: 0 };
    const tick = (now) => {
      const tm = ui.timer;
      if (!tm) return;
      if (!paused()) tm.left -= now - tm.last;
      tm.last = now;
      const bar = $('#timer-fill'), num = $('#timer-num');
      if (bar) bar.style.transform = `scaleX(${Math.max(0, tm.left / tm.total)})`;
      if (num) num.textContent = Math.max(0, Math.ceil(tm.left / 1000));
      if (tm.left <= 0) { ui.timer = null; act('timeout'); return; }
      tm.raf = requestAnimationFrame(tick);
    };
    ui.timer.raf = requestAnimationFrame(tick);
    renderChoices();
  }

  function stopTimer() {
    if (ui.timer) cancelAnimationFrame(ui.timer.raf);
    ui.timer = null;
  }

  // ── Eylemler ──────────────────────────────────────────────────────
  function act(kind, arg) {
    stopTimer();
    const fromScene = scene().scene_id;
    const cluesBefore = game.state.clues.length;
    if (kind === 'choose') game.choose(arg);
    else if (kind === 'advance') game.advance();
    else if (kind === 'timeout') game.timeout();

    if (kind === 'choose') {
      haptic(15);
      const key = `scenes.${fromScene}.choices.${arg}_toast`;
      if (t.has(key)) toast(t(key), 'cost');
    }
    if (kind === 'timeout') toast(t('ui.toast_timeout'), 'time');
    game.state.clues.slice(cluesBefore).forEach((c) => toast(`${t('ui.clue_added')} · ${t(`clues.${c}.name`)}`, 'clue'));
    enterScene();
  }

  function startGame() {
    game.restart();
    ui.pause = null;
    ui.modal = false;
    ui.screen = 'intro';
    stopTimer();
    if (ui.videoHandle) ui.videoHandle.stop();
    ui.videoHandle = null;
    render();
    clearTimeout(ui.introTimer);
    ui.introTimer = setTimeout(() => { if (ui.screen === 'intro') beginPlay(); }, 2600);
  }

  function beginPlay() {
    clearTimeout(ui.introTimer);
    startMusic();
    ui.screen = 'play';
    enterScene();
  }

  // ── Oyun sonu metni (seslendirme) ─────────────────────────────────
  function startEpilogue() {
    stopTimer();
    ui.screen = 'epilogue';
    ui.epi = { keys: game.epilogueKeys(), i: 0, timer: 0 };
    render();
    scheduleEpilogue();
  }
  function scheduleEpilogue() {
    clearTimeout(ui.epi.timer);
    if (ui.epi.i < ui.epi.keys.length - 1) ui.epi.timer = setTimeout(() => { if (!paused()) nextEpilogueLine(); else scheduleEpilogue(); }, 4200);
  }
  function nextEpilogueLine() {
    if (ui.epi.i >= ui.epi.keys.length - 1) return;
    ui.epi.i += 1;
    renderScreen();
    scheduleEpilogue();
  }

  function setLang(code) {
    settings.lang = code;
    saveSettings();
    t = i18n.createTranslator(locales, code);
    document.documentElement.lang = code;
    render();
  }

  function openPause(view) {
    ui.pause = view;
    haptic(8);
    render();
  }

  // ── Render ────────────────────────────────────────────────────────
  function render() {
    renderHud();
    renderScene();
    renderChoices();
    renderScreen();
    renderPause();
    renderModal();
  }

  function renderHud() {
    const inGame = ui.screen === 'play';
    $('#app').dataset.screen = ui.screen;
    $('#hud-chip').innerHTML = inGame ? `<span class="dot"></span>${esc(t('ui.chapter', { n: story.chapter }))}` : '';
    $('#hud-chip').hidden = !inGame;
    $('#btn-pause').hidden = !['play', 'epilogue'].includes(ui.screen);
    $('#btn-pause').setAttribute('aria-label', t('ui.menu'));
    $('#btn-pause').classList.toggle('warn', !validation.ok);
    $('#hud-scene').textContent = inGame && settings.dev ? `${scene().code || ''} · ${scene().scene_id}` : '';
    $('#stage').dataset.mood = inGame ? scene().scene_id : ui.screen;
    // Başlık ekranının arkasında açılış görseli (bulanık)
    if (ui.screen === 'title') {
      const first = story.scenes.find((s) => s.scene_id === story.start);
      $('#backdrop').style.backgroundImage = first && first.image_asset ? `url("${first.image_asset}")` : '';
      $('#app').classList.toggle('has-image', !!(first && first.image_asset));
    }
    $('#app').classList.toggle('video-on', inGame && ui.mode === 'video' && !!ui.videoHandle);
    // Son sahnelerde görsel kararır: gecenin özeti daha rahat okunur
    $('#app').classList.toggle('is-ending', inGame && scene().scene_type === 'ending');
    if (!inGame) $('#stamp').classList.remove('show');
  }

  function renderScene() {
    const notif = $('#notif'), caption = $('#caption'), hint = $('#tap-hint'), notice = $('#notice'), slide = $('#slide');
    notice.hidden = !ui.notice || ui.screen !== 'play';
    notice.textContent = ui.notice || '';
    if (ui.screen !== 'play') { notif.innerHTML = ''; caption.innerHTML = ''; hint.hidden = true; slide.hidden = true; return; }

    const all = blocks();

    // Karakter tanıtım slaytı: metin modunda o anki vuruş, video modunda videodan önceki kuyruk
    const introBlock = ui.mode === 'video' ? ui.introQueue[0] : (all[ui.beat] && all[ui.beat].kind === 'intro' ? all[ui.beat] : null);
    slide.hidden = !introBlock;
    slide.innerHTML = introBlock ? `
      <div class="slide-inner">
        <div class="slide-rule"></div>
        <div class="slide-name">${esc(t(`characters.${introBlock.who}.name`))}</div>
        <p class="slide-line">${esc(t(introBlock.key))}</p>
        <div class="slide-tap">${esc(t('ui.tap'))}</div>
      </div>` : '';
    const shown = ui.mode === 'video' ? (ui.videoReady ? all : []) : all.slice(0, ui.beat + 1);

    const msgs = shown.filter((b) => b.kind === 'msg').slice(-2);
    notif.innerHTML = msgs.map((b, i) => `
      <div class="notif${i === msgs.length - 1 ? ' latest' : ''}">
        <div class="notif-icon ${esc(b.from)}">${esc(t(`speakers.${b.from}`).charAt(0))}</div>
        <div class="notif-body">
          <div class="notif-top"><span class="notif-from">${esc(t(`speakers.${b.from}`))}</span><span class="notif-time">${i === msgs.length - 1 ? '•' : ''}</span></div>
          <div class="notif-text">${esc(t(b.key))}</div>
        </div>
      </div>`).join('');

    const cur = ui.mode === 'text' ? all[ui.beat] : null;
    showOverlay(cur && cur.overlay, cur && cur.overlay_style);
    // Seçim anında bildirim kartları çekilir: hiçbir seçim noktasının üstünü örtmesinler
    $('#app').classList.toggle('choosing', choicesVisible());
    // Seçenekler bu sahnede ilk kez göründüğünde sinematik vurgu (sahne başına bir kez)
    if (choicesVisible() && ui.stingFor !== game.state.sceneId) { ui.stingFor = game.state.sceneId; playChoiceSting(); }
    // Karar anı: klip durur, son karesiyle aynı olan görsel kalır
    if (choicesVisible()) endClip($('#stage-media video.stage-clip'));
    caption.innerHTML = cur && cur.kind !== 'msg' && cur.kind !== 'intro'
      ? `<div class="cap ${cur.kind}" data-k="${esc(cur.key)}">${cur.kind === 'say' ? `<span class="speaker">${esc(t(`speakers.${cur.from}`))}</span>` : ''}<span class="cap-text">${esc(t(cur.key))}</span></div>`
      : '';

    const waitingTap = ui.mode === 'text' ? !atLastBeat() || !hasChoices() : ui.videoReady && !hasChoices();
    hint.hidden = (!waitingTap && !choicesVisible()) || !!introBlock;
    if (choicesVisible()) { hint.innerHTML = `<span class="tap-label">${esc(t('ui.choose_hint'))}</span>`; return; }
    hint.innerHTML = `<span class="dots">${ui.mode === 'text' ? all.map((_, i) => `<i class="${i <= ui.beat ? 'on' : ''}"></i>`).join('') : ''}</span><span class="tap-label">${esc(t('ui.tap'))}</span>`;
  }

  // Seçenekler: görselin üzerinde, anlamlı noktalarda (hotspot). Altta yalnızca süre çubuğu.
  function renderChoices() {
    const box = $('#choices');
    const layer = $('#hotspots');
    if (!choicesVisible()) { box.innerHTML = ''; box.className = 'choices'; layer.innerHTML = ''; layer.className = 'hotspots'; return; }
    const s = scene();
    const urgent = s.scene_type === 'interaction';
    box.className = `choices${urgent ? ' urgent' : ''}`;
    layer.className = `hotspots${urgent ? ' urgent' : ''}`;
    const list = game.getChoices();
    box.innerHTML = s.timer && settings.timers
      ? `<div class="timer" role="timer" aria-label="${esc(t('ui.timeout_hint'))}"><div class="timer-track"><div class="timer-fill" id="timer-fill"></div></div><span class="timer-num" id="timer-num">${s.timer.seconds}</span></div>`
      : '';
    const key = (c, suffix) => `scenes.${s.scene_id}.choices.${c.id}${suffix}`;
    const lockSvg = '<svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true"><path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></svg>';
    layer.innerHTML = list.map((c, i) => {
      const h = c.hotspot || DEFAULT_SPOTS[i % DEFAULT_SPOTS.length];
      const side = h.side || (h.x > 55 ? 'left' : 'right');
      const pos = `left:${h.x}%;top:${h.y}%;--i:${i}`;
      if (c.locked) {
        return `<div class="hs locked ${side}" style="${pos}" aria-disabled="true">
          <span class="hs-dot">${lockSvg}</span>
          <span class="hs-line"></span>
          <span class="hs-chip"><span class="main">${esc(t('ui.locked'))}</span><span class="sub">${esc(t(key(c, '_hint')))}</span></span>
        </div>`;
      }
      return `<button class="hs ${side}" style="${pos}" data-choice="${c.id}" aria-label="${esc(t(key(c, '')))}">
          <span class="hs-dot"><i class="hs-ring"></i><i class="hs-core">${i + 1}</i></span>
          <span class="hs-line"></span>
          <span class="hs-chip"><span class="main">${esc(t(key(c, '')))}</span>${t.has(key(c, '_sub')) ? `<span class="sub">${esc(t(key(c, '_sub')))}</span>` : ''}</span>
        </button>`;
    }).join('');
    layer.querySelectorAll('[data-choice]').forEach((b) => {
      b.onclick = () => { b.classList.add('picked'); act('choose', b.dataset.choice); };
    });
    layoutHotspots(layer);
    if (ui.timer) {
      $('#timer-fill').style.transform = `scaleX(${Math.max(0, ui.timer.left / ui.timer.total)})`;
      $('#timer-num').textContent = Math.max(0, Math.ceil(ui.timer.left / 1000));
    }
  }

  // Seçim noktası yerleşimi: hiçbir etiket ne görselden taşar ne de başka bir etiketin/noktanın üstüne biner.
  // Her nokta için sırayla taraf denenir (verilen → karşı → alt → üst); hiçbiri olmazsa etiket dikeyde kaydırılır.
  const SIDES = ['left', 'right', 'below', 'above'];
  function layoutHotspots(layer) {
    const fr = $('#frame').getBoundingClientRect();
    const els = [...layer.querySelectorAll('.hs')];
    if (!els.length || !fr.width) return;
    els.forEach((el) => { el.style.animation = 'none'; el.querySelector('.hs-chip').style.transform = ''; }); // ölçüm, giriş animasyonundaki küçülmeden etkilenmesin
    const pad = 6;
    const rectOf = (n) => { const r = n.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom }; };
    const hit = (a, b) => a.l < b.r + pad && a.r > b.l - pad && a.t < b.b + pad && a.b > b.t - pad;
    const inside = (a) => a.l >= fr.left + 4 && a.r <= fr.right - 4 && a.t >= fr.top + 4 && a.b <= fr.bottom - 4;
    // Noktalar sabittir: önce hepsinin yeri alınır; her etiket TÜM noktalardan ve önceki etiketlerden kaçar
    const dots = els.map((el) => rectOf(el.querySelector('.hs-dot')));
    const placed = [];
    els.forEach((el, idx) => {
      const chip = el.querySelector('.hs-chip');
      const others = () => [...placed, ...dots.filter((_, k) => k !== idx)];
      const fits = () => { const c = rectOf(chip); return inside(c) && !others().some((o) => hit(c, o)); };
      const start = SIDES.find((sd) => el.classList.contains(sd));
      const order = [start, { left: 'right', right: 'left', below: 'above', above: 'below' }[start], ...SIDES].filter((v, i, arr) => v && arr.indexOf(v) === i);
      let ok = false;
      for (const sd of order) {
        el.classList.remove(...SIDES); el.classList.add(sd);
        chip.style.transform = '';
        if (sd === 'above' || sd === 'below') { // alt/üst etiket kenardan taşıyorsa içeri kaydır
          const c = rectOf(chip);
          const dx = c.r > fr.right - 4 ? fr.right - 4 - c.r : c.l < fr.left + 4 ? fr.left + 4 - c.l : 0;
          if (dx) chip.style.transform = `translateX(${dx}px)`;
        }
        if (fits()) { ok = true; break; }
      }
      if (!ok) {
        // En az çakışan tarafı seç; etiketi taşmayacak ve çakışmayacak şekilde kaydır
        el.classList.remove(...SIDES); el.classList.add(start);
        let c = rectOf(chip);
        const dx = c.r > fr.right - 4 ? fr.right - 4 - c.r : c.l < fr.left + 4 ? fr.left + 4 - c.l : 0;
        let dy = 0;
        for (let k = 0; k < 24; k++) {
          chip.style.transform = `translate(${dx}px, ${dy}px)`;
          c = rectOf(chip);
          if (!others().some((o) => hit(c, o)) && c.t >= fr.top + 4 && c.b <= fr.bottom - 4) break;
          dy = (k % 2 ? -1 : 1) * 12 * Math.ceil((k + 1) / 2);
        }
      }
      placed.push(rectOf(chip));
    });
    els.forEach((el) => { el.style.animation = ''; });
  }

  function decisionsHtml() {
    const items = game.state.history.filter((h) => h.choice).map((h) => {
      const label = h.timeout ? `— ${t('ui.timed_out')}` : t(`scenes.${h.scene}.choices.${h.choice}`);
      return `<li class="${h.timeout ? 'timeout' : ''}"><span class="d-scene">${esc(t(`scenes.${h.scene}.title`))}</span><span class="d-choice">${esc(label)}</span></li>`;
    });
    return items.length ? `<ol class="decisions">${items.join('')}</ol>` : '';
  }

  function flowOpts(showIds) {
    const now = { scenes: new Set(game.state.visited), edges: new Set(game.state.history.map((h) => `${h.scene}>${h.to}`)) };
    const past = { scenes: new Set(discovery.scenes), edges: new Set(discovery.edges) };
    return { t, now, past, current: game.state.sceneId, showIds: !!showIds };
  }

  function renderScreen() {
    const el = $('#screen');
    el.hidden = ui.screen === 'play';
    el.className = `screen ${ui.screen}`;
    if (ui.screen === 'play') { el.innerHTML = ''; return; }

    if (ui.screen === 'title') {
      el.innerHTML = `
        <div class="title-top"></div>
        <div class="title-mid">
          <h1 class="logo"><img class="logo-img" src="assets/logo.png" alt="${esc(t('ui.game_title'))}" onerror="this.replaceWith(document.createTextNode(this.alt))"></h1>
          <div class="subtitle">${esc(t('ui.chapter', { n: story.chapter }))} · ${esc(t('ui.chapter_title'))}</div>
        </div>
        <div class="title-bottom">
          <button class="cta" id="btn-start">${esc(t('ui.start'))}</button>
          <div class="title-row">
            <button class="pill" id="btn-title-lang">${esc(locales[settings.lang].meta.name)}</button>
            <button class="pill" id="btn-title-settings">${esc(t('ui.timers'))}: ${settings.timers ? '●' : '○'}</button>
          </div>
        </div>`;
      $('#btn-start').onclick = () => { haptic(20); startGame(); };
      $('#btn-title-lang').onclick = () => { const codes = Object.keys(locales); setLang(codes[(codes.indexOf(settings.lang) + 1) % codes.length]); };
      $('#btn-title-settings').onclick = () => { settings.timers = !settings.timers; saveSettings(); render(); };
      return;
    }

    if (ui.screen === 'intro') {
      el.innerHTML = `
        <div class="intro">
          <div class="intro-num">${esc(t('ui.chapter', { n: story.chapter }))}</div>
          <div class="intro-title">${esc(t('ui.chapter_title'))}</div>
          <div class="intro-line"></div>
        </div>`;
      return;
    }

    if (ui.screen === 'epilogue') {
      const { keys, i } = ui.epi;
      const last = i >= keys.length - 1;
      el.innerHTML = `
        <div class="epi">
          <div class="epi-kicker">${esc(t('ui.epilogue_kicker'))}</div>
          <p class="epi-line" data-k="${esc(keys[i])}">${esc(t(keys[i]))}</p>
          <div class="epi-progress">${keys.map((_, n) => `<i class="${n <= i ? 'on' : ''}"></i>`).join('')}</div>
        </div>
        <div class="screen-bottom">${last ? `<button class="cta" id="btn-epi-next">${esc(t('ui.continue'))}</button>` : `<div class="tap-label">${esc(t('ui.tap'))}</div>`}</div>`;
      if (last) $('#btn-epi-next').onclick = () => { ui.screen = 'summary'; render(); };
      return;
    }

    if (ui.screen === 'summary') {
      const s = scene();
      const fc = flowchart.render(story, flowOpts(false));
      el.innerHTML = `
        <div class="summary">
          <div class="kicker">${esc(t('ui.chapter_end'))}</div>
          <h2>${esc(t(`scenes.${s.scene_id}.title`))}</h2>
          <div class="stat-row">
            <div class="stat"><b>${esc(game.state.vars.earnings.toLocaleString(settings.lang))} ₺</b><span>${esc(t('ui.stat_earnings'))}</span></div>
            <div class="stat"><b>${fc.endingsFound}/${fc.endingsTotal}</b><span>${esc(t('ui.stat_endings'))}</span></div>
          </div>
          <div class="explored">${esc(t('ui.explored', { p: fc.completion }))}</div>
          <h4>${esc(t('ui.choices_made'))}</h4>
          ${decisionsHtml()}
          <div class="flow-wrap">${fc.svg}</div>
        </div>
        <div class="screen-bottom"><button class="cta" id="btn-memorial">${esc(t('ui.continue'))}</button></div>`;
      $('#btn-memorial').onclick = () => { ui.screen = 'memorial'; render(); };
      scrollFlowToCurrent(el);
      return;
    }

    // Son düğme: ne kadarının açıldığını söyler, alternatif sonlara davet eder
    function againButton() {
      const fc = flowchart.render(story, flowOpts(false));
      const all = fc.endingsFound >= fc.endingsTotal;
      return `<button class="cta cta-again" id="btn-again">
        <span class="cta-main">${esc(t(all ? 'ui.play_again_all' : 'ui.play_again_alt'))}</span>
        <span class="cta-sub">${esc(t('ui.story_unlocked', { p: fc.completion }))} · ${esc(t('ui.stat_endings'))} ${fc.endingsFound}/${fc.endingsTotal}</span>
      </button>`;
    }

    if (ui.screen === 'memorial') {
      el.innerHTML = `
        <div class="memorial">
          <div class="kicker">${esc(t('ui.memorial_kicker'))}</div>
          <p class="dedication">${esc(t('ui.dedication'))}</p>
          <p class="road">${esc(t('ui.road'))}</p>
          <p class="support">${esc(t('ui.support'))}</p>
        </div>
        <div class="screen-bottom">${againButton()}</div>`;
      $('#btn-again').onclick = startGame;
    }
  }

  // Akış şeması dar ekranda yatay kayar: açılırken bulunulan düğümü (ya da sonu) görünür yap
  function scrollFlowToCurrent(root) {
    root.querySelectorAll('.flow-wrap').forEach((wrap) => {
      const cur = wrap.querySelector('.node.current');
      if (!cur) return;
      const box = cur.getBoundingClientRect(), w = wrap.getBoundingClientRect();
      wrap.scrollLeft += box.left - w.left - (w.width - box.width) / 2;
      wrap.scrollTop += box.top - w.top - (w.height - box.height) / 2;
    });
  }

  function toggleRow(id, label, on) {
    return `<label class="row-item" for="${id}"><span>${esc(label)}</span><input type="checkbox" class="switch" id="${id}"${on ? ' checked' : ''}></label>`;
  }

  function renderPause() {
    const p = $('#pause');
    p.hidden = !ui.pause;
    if (!ui.pause) { p.innerHTML = ''; return; }
    const head = ui.pause === 'menu'
      ? `<div class="pause-head"><h3>${esc(t('ui.menu'))}</h3></div>`
      : `<div class="pause-head"><button class="back" id="p-back">‹ ${esc(t('ui.back'))}</button><h3>${esc(t({ journal: 'ui.journal', flow: 'ui.flowchart', dev: 'ui.dev' }[ui.pause]))}</h3></div>`;
    let body = '';

    if (ui.pause === 'menu') {
      body = `
        <button class="cta" id="p-resume">${esc(t('ui.resume'))}</button>
        <div class="group">
          <button class="row-item nav" data-open="journal"><span>${esc(t('ui.journal'))}</span><span class="badge">${game.state.clues.length}</span></button>
          <button class="row-item nav" data-open="flow"><span>${esc(t('ui.flowchart'))}</span><span class="chev">›</span></button>
        </div>
        <div class="group">
          <div class="row-item"><span>${esc(t('ui.language'))}</span>
            <div class="segmented">${Object.entries(locales).map(([code, l]) => `<button data-lang="${code}" class="${code === settings.lang ? 'on' : ''}">${esc(code.toUpperCase())}</button>`).join('')}</div>
          </div>
          ${toggleRow('opt-sound', t('ui.sound'), settings.sound)}
          ${toggleRow('opt-timers', t('ui.timers'), settings.timers)}
          ${toggleRow('opt-haptics', t('ui.haptics'), settings.haptics)}
        </div>
        <div class="group">
          <button class="row-item nav danger" id="p-restart"><span>${esc(t('ui.restart'))}</span></button>
          <button class="row-item nav muted${validation.ok ? '' : ' warn'}" data-open="dev"><span>${esc(t('ui.dev'))}</span><span class="chev">›</span></button>
        </div>
        <p class="hint">${esc(t('ui.keys_hint'))}</p>`;
    }

    if (ui.pause === 'journal') {
      const clues = game.state.clues;
      body = (clues.length
        ? clues.map((c) => `<div class="clue"><div class="clue-name">${esc(t(`clues.${c}.name`))}</div><p>${esc(t(`clues.${c}.text`))}</p></div>`).join('')
        : `<p class="empty">${esc(t('ui.clues_empty'))}</p>`)
        + `<div class="earn">${esc(t('ui.earnings', { n: game.state.vars.earnings.toLocaleString(settings.lang) }))}</div>`
        + `<h4>${esc(t('ui.choices_made'))}</h4>${decisionsHtml()}`;
    }

    if (ui.pause === 'flow') {
      const fc = flowchart.render(story, flowOpts(false));
      body = `<div class="legend"><span class="lg now"></span>${esc(t('ui.flow_legend_now'))}<span class="lg past"></span>${esc(t('ui.flow_legend_past'))}<span class="lg unknown"></span>${esc(t('ui.flow_legend_unknown'))}</div>
        <div class="flow-wrap">${fc.svg}</div><div class="explored">${esc(t('ui.explored', { p: fc.completion }))} · ${esc(t('ui.stat_endings'))} ${fc.endingsFound}/${fc.endingsTotal}</div>
        <button class="pill" id="btn-reset-disc">${esc(t('ui.reset_discovery'))}</button>`;
    }

    if (ui.pause === 'dev') body = devHtml();

    p.innerHTML = `<div class="pause-inner">${head}<div class="pause-body">${body}</div></div>`;
    scrollFlowToCurrent(p);
    const on = (id, fn, ev = 'onclick') => { const el = document.getElementById(id); if (el) el[ev] = fn; };
    on('p-resume', () => { ui.pause = null; render(); });
    on('p-back', () => { ui.pause = 'menu'; render(); });
    p.querySelectorAll('[data-open]').forEach((b) => { b.onclick = () => { if (b.dataset.open === 'dev') { settings.dev = true; saveSettings(); } openPause(b.dataset.open); }; });
    p.querySelectorAll('[data-lang]').forEach((b) => { b.onclick = () => setLang(b.dataset.lang); });
    on('opt-sound', (e) => { settings.sound = e.target.checked; saveSettings(); applySound(); if (settings.sound) startMusic(); haptic(8); }, 'onchange');
    on('opt-timers', (e) => { settings.timers = e.target.checked; saveSettings(); if (!settings.timers) stopTimer(); haptic(8); }, 'onchange');
    on('opt-haptics', (e) => { settings.haptics = e.target.checked; saveSettings(); haptic(8); }, 'onchange');
    on('p-restart', () => { ui.modal = true; render(); });
    on('btn-reset-disc', () => { discovery = { scenes: [], edges: [] }; store.set('cico.discovery.v1', discovery); if (ui.screen !== 'title') recordDiscovery(); render(); });
    on('btn-dev-timeout', () => { ui.pause = null; if (choicesVisible() && scene().timer) act('timeout'); else render(); });
    on('btn-dev-off', () => { settings.dev = false; saveSettings(); ui.pause = 'menu'; render(); });
    on('btn-coord', () => { ui.coord = !ui.coord; $('#coord-marker').hidden = true; ui.pause = null; render(); });
  }

  function devHtml() {
    const s = scene();
    const st = game.state;
    const fmtChange = (c) => (c.clue ? `+clue ${c.clue}` : `${c.var}: ${JSON.stringify(c.from)} → ${JSON.stringify(c.to)}`);
    const log = st.log.slice(-10).reverse().map((l) =>
      `<li><code>${esc(l.scene)}</code> <span class="muted">${esc(l.source)}</span> ${l.changes.length ? esc(l.changes.map(fmtChange).join(', ')) : '<span class="muted">—</span>'}</li>`).join('');
    const vars = Object.entries(st.vars).map(([k, v]) => `<tr><td><code>${esc(k)}</code></td><td>${esc(JSON.stringify(v))}</td></tr>`).join('');
    const fc = flowchart.render(story, flowOpts(true));
    const v = validation;
    const issues = v.errors.concat(v.warnings);
    return `
      <dl class="dev">
        <dt>kod</dt><dd><code>${esc(s.code || '—')}</code></dd>
        <dt>scene_id</dt><dd><code>${esc(s.scene_id)}</code></dd>
        <dt>scene_type</dt><dd>${esc(s.scene_type)}</dd>
        <dt>beat</dt><dd>${ui.mode === 'text' ? `${ui.beat + 1}/${blocks().length}` : 'video'}</dd>
        <dt>video_asset</dt><dd>${esc(s.video_asset || '— (text mode)')}</dd>
        <dt>timer</dt><dd>${s.timer ? `${s.timer.seconds}s → ${esc(s.timer.on_timeout)}` : '—'}</dd>
      </dl>
      <div class="pill-row">
        ${s.timer ? `<button class="pill" id="btn-dev-timeout">⏱ timeout()</button>` : ''}
        <button class="pill" id="btn-dev-off">scene_id gizle</button>
        <button class="pill${ui.coord ? ' on' : ''}" id="btn-coord">${esc(t('ui.coord_picker'))}: ${ui.coord ? '●' : '○'}</button>
      </div>
      <p class="muted">${esc(t('ui.coord_hint'))}</p>
      <div class="pill-row">
      </div>
      <h4>vars</h4><table class="vars">${vars}</table>
      <h4>clues</h4><p>${st.clues.length ? st.clues.map((c) => `<code>${esc(c)}</code>`).join(' ') : '—'}</p>
      <h4>effects log</h4><ol class="log">${log}</ol>
      <h4>notes.dev</h4><p class="muted">${esc((s.notes && s.notes.dev) || '—')}</p>
      <h4>notes.video</h4><p class="muted">${esc((s.notes && s.notes.video) || '—')}</p>
      <h4>flow</h4><div class="flow-wrap">${fc.svg}</div>
      <h4>validator</h4><p>${v.ok ? '✓ OK' : `✗ ${v.errors.length} error(s)`} · ${v.warnings.length} warning(s)</p>
      ${issues.length ? `<ul class="log">${issues.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}`;
  }

  function renderModal() {
    const m = $('#modal');
    m.hidden = !ui.modal;
    if (!ui.modal) { m.innerHTML = ''; return; }
    m.innerHTML = `<div class="alert" role="alertdialog" aria-modal="true">
      <p>${esc(t('ui.restart_confirm'))}</p>
      <div class="alert-actions"><button id="m-no">${esc(t('ui.no'))}</button><button id="m-yes" class="destructive">${esc(t('ui.yes'))}</button></div></div>`;
    $('#m-yes').onclick = startGame;
    $('#m-no').onclick = () => { ui.modal = false; render(); };
  }

  // ── Bağlantılar ───────────────────────────────────────────────────
  $('#btn-pause').onclick = () => openPause(ui.pause ? null : 'menu');
  $('#btn-sound').onclick = (e) => { e.stopPropagation(); toggleSound(); };
  applySound();

  // Geliştirici: koordinat seçici açıkken görsele dokunmak x/y yüzdesini gösterir (oyun ilerlemez)
  function pickCoord(e) {
    const r = $('#frame').getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    if (x < 0 || x > 100 || y < 0 || y > 100) return;
    const m = $('#coord-marker');
    m.hidden = false;
    m.style.left = `${x}%`;
    m.style.top = `${y}%`;
    const label = `hotspot: { x: ${Math.round(x)}, y: ${Math.round(y)} }`;
    m.dataset.label = label;
    toast(`${scene().code || scene().scene_id} · ${label}`, 'clue');
    console.log(`[CICO] ${scene().code} ${scene().scene_id} ${label}`);
  }

  // Ekranın boş bir yerine dokunmak = devam
  $('#app').addEventListener('click', (e) => {
    if (ui.coord && ui.screen === 'play' && !paused() && !e.target.closest('button, .pause, .modal')) { pickCoord(e); return; }
    if (e.target.closest('button, select, input, label, .pause, .modal, .choices')) return;
    if (e.target.closest('.screen') && !['intro', 'epilogue'].includes(ui.screen)) return;
    tap();
  });
  // Uzun basma menüsünü ve çift dokunma yakınlaştırmasını engelle
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Ekran boyutu/yönü değişince seçim etiketlerini yeniden yerleştir
  let relayout = 0;
  window.addEventListener('resize', () => { clearTimeout(relayout); relayout = setTimeout(() => { if (choicesVisible()) layoutHotspots($('#hotspots')); }, 120); });

  // Uygulama kabuğu: Android geri tuşu duraklatma menüsünü açar/kapatır, başlık ekranında uygulamadan çıkar
  native.init({
    onBack() {
      if (ui.modal) ui.modal = false;
      else if (ui.pause) ui.pause = ui.pause === 'menu' ? null : 'menu';
      else if (['play', 'epilogue'].includes(ui.screen)) ui.pause = 'menu';
      else if (ui.screen === 'title') { native.exitApp(); return; }
      else ui.screen = 'title';
      render();
    },
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === 'escape') {
      if (ui.modal) ui.modal = false;
      else if (ui.pause) ui.pause = ui.pause === 'menu' ? null : 'menu';
      else if (['play', 'epilogue'].includes(ui.screen)) ui.pause = 'menu';
      render();
      return;
    }
    if (paused()) return;
    const go = k === ' ' || k === 'enter';
    if (go) e.preventDefault();
    if (ui.screen === 'title') { if (go) startGame(); return; }
    if (ui.screen === 'epilogue' && go && ui.epi.i >= ui.epi.keys.length - 1) { ui.screen = 'summary'; render(); return; }
    if (ui.screen === 'summary') { if (go) { ui.screen = 'memorial'; render(); } return; }
    if (ui.screen === 'memorial') { if (k === 'enter') startGame(); return; }
    if (go) { tap(); return; }
    if (/^[1-9]$/.test(k) && choicesVisible()) {
      const c = game.getChoices()[Number(k) - 1];
      if (c && c.enabled) act('choose', c.id);
    }
  });

  $('#app').style.setProperty('--ar', String(story.media_aspect || 9 / 16));
  if (!validation.ok) console.warn('[CICO] Story validation errors:', validation.errors);
  document.documentElement.lang = settings.lang;
  render();
})();
