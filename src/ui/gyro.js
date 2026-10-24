/*
 * Jiroskop kaçışı (Bölüm 2: 2A12 Köprü Kaçışı, 2B10 Sahil Yolu Kaçışı).
 *
 * Yöntem (Lou Gorenfeld, "Pseudo 3D Page"; Jake Gordon, "Javascript Racer"):
 *  - Yol, kuşbakışı ve dikişsiz tekrar eden bir doku. Ekranın ufuk altındaki her satırı bir derinliğe eşlenir
 *    (Z haritası: z = KAM / (y − ufuk)); doku satırı (konum + z) ile seçilir, genişlik 1/z ile ölçeklenir.
 *    Konum her karede ilerledikçe yol akar: yakın satırlar hızlı, uzaklar yavaş.
 *  - Virajlar: yolun orta çizgisi derinlikle karesel kayar (uzakta daha keskin), ufuk ters yöne kayar.
 *  - Hareket bulanıklığı: her satırda doku, o karede geçilen mesafe kadar dikeyde örneklenip ezilir
 *    (etkisi doğal olarak yakın satırlarda görünür).
 *  - Sprite'lar (araçlar, yol kenarı lambaları) aynı Z haritasıyla ölçeklenir, uzaktan yakına çizilir.
 *  - Eğim: başlarken tutuş açısı sıfır kabul edilir, küçük sapmalar ölü bölge, girdi yumuşatılır.
 *  - Ses: Web Audio ile sentez (scooter motoru hızla yükselir, rüzgâr/yağmur, kornalar yandan, çarpma, Endurocu).
 *
 *   CICO.gyro.start({ root, set: 'A' | 'B', seconds, text, haptic, onDone(result) })  → { stop() }
 *   result: 'escape' | 'caught'
 */
(function (root) {
  'use strict';

  const BASE = 'assets/game/c2/';
  // u: dokunun yatay konumu (0 sol kenar … 1 sağ kenar). Şeritler dokudaki çizgilere göre.
  const SETS = {
    A: {
      bg: 'gA_bg.jpg', road: 'gA_road.jpg', crop: [0.085, 0.905], curve: 0.14, hz: 0.25, player: 'gA_cico.png', chaser: 'gA_enduro.png', rain: false,
      lanes: [0.29, 0.5, 0.71], props: { img: 'gA_lamp.png', u: [0.06, 0.935], every: 5, w: 0.13 },
      obstacles: [
        { img: 'gA_car.png', w: 0.26, horn: 'car' }, { img: 'gA_taxi.png', w: 0.26, horn: 'car' }, { img: 'gA_dolmus.png', w: 0.24, horn: 'car' },
        { img: 'gA_tram.png', w: 0.24, lanes: [0], oncoming: true, horn: 'tram' },
      ],
    },
    B: {
      bg: 'gB_bg.jpg', road: 'gB_road.jpg', crop: [0.13, 0.92], curve: 0.35, hz: 0.27, player: 'gB_cico.png', chaser: 'gB_enduro.png', rain: true,
      lanes: [0.36, 0.535, 0.72], props: { img: 'gB_lamp.png', u: [0.2, 0.9], every: 5.5, w: 0.13 },
      obstacles: [
        { img: 'gB_truck.png', w: 0.26, horn: 'truck' }, { img: 'gB_bus.png', w: 0.26, horn: 'truck' }, { img: 'gB_taxi.png', w: 0.26, horn: 'car' },
        { img: 'gB_puddle.png', w: 0.24, slip: true, ground: true },
      ],
    },
  };

  const ROAD_W = 1.75;   // dokunun dünya genişliği (en alt satırda ekran genişliğinin katı)
  const TILE_Z = 3.0;    // bir doku döşemesinin dünya derinliği
  const FAR = 34;        // çizim mesafesi
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const cache = {};
  function load(src) {
    if (!src) return Promise.resolve(null);
    if (!cache[src]) cache[src] = new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = BASE + src; });
    return cache[src];
  }
  const assetList = (s) => [s.bg, s.road, s.player, s.chaser, s.props && s.props.img, ...s.obstacles.map((o) => o.img)];
  function preload(set) { return Promise.all(assetList(SETS[set] || SETS.A).map(load)); }

  // ── Ses (Web Audio sentezi; dosya yok) ──
  function createSound(rainy) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const ac = new AC();
    const out = ac.createGain(); out.gain.value = 0.9; out.connect(ac.destination);
    const noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const nd = noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const noise = () => { const n = ac.createBufferSource(); n.buffer = noiseBuf; n.loop = true; return n; };

    // Scooter motoru: testere + kare, alçak geçiren süzgeç, "pıt pıt" genlik titreşimi
    const eng = ac.createGain(); eng.gain.value = 0;
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 3;
    const o1 = ac.createOscillator(); o1.type = 'sawtooth'; o1.frequency.value = 80;
    const o2 = ac.createOscillator(); o2.type = 'square'; o2.frequency.value = 40.6;
    const o2g = ac.createGain(); o2g.gain.value = 0.5;
    const am = ac.createGain(); am.gain.value = 0.6;
    const lfo = ac.createOscillator(); lfo.type = 'square'; lfo.frequency.value = 22;
    const lfoD = ac.createGain(); lfoD.gain.value = 0.35;
    lfo.connect(lfoD).connect(am.gain);
    o1.connect(lp); o2.connect(o2g).connect(lp); lp.connect(am).connect(eng).connect(out);
    [o1, o2, lfo].forEach((o) => o.start());

    // Rüzgâr ya da yağmur
    const air = noise(); const af = ac.createBiquadFilter();
    af.type = rainy ? 'highpass' : 'bandpass'; af.frequency.value = rainy ? 2400 : 500; af.Q.value = rainy ? 0.5 : 0.7;
    const ag = ac.createGain(); ag.gain.value = 0;
    air.connect(af).connect(ag).connect(out); air.start();

    // Endurocu: kalın, yaklaştıkça yükselen motor
    const ch = ac.createOscillator(); ch.type = 'sawtooth'; ch.frequency.value = 46;
    const chf = ac.createBiquadFilter(); chf.type = 'lowpass'; chf.frequency.value = 320;
    const chg = ac.createGain(); chg.gain.value = 0;
    ch.connect(chf).connect(chg).connect(out); ch.start();

    function tone(type, freqs, dur, vol, pan, attack = 0.01) {
      const t0 = ac.currentTime;
      const g = ac.createGain(); g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + attack); g.gain.setValueAtTime(vol, t0 + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      const p = ac.createStereoPanner ? ac.createStereoPanner() : null;
      if (p) { p.pan.value = clamp(pan, -1, 1); g.connect(p).connect(out); } else g.connect(out);
      freqs.forEach((f) => { const o = ac.createOscillator(); o.type = type; o.frequency.value = f; o.connect(g); o.start(t0); o.stop(t0 + dur + 0.05); });
    }
    return {
      resume() { if (ac.state === 'suspended') ac.resume(); out.gain.setTargetAtTime(0.9, ac.currentTime, 0.1); },
      update(speedN, near, steer) {
        const t = ac.currentTime;
        const f = 78 + speedN * 70 + Math.abs(steer) * 8;
        o1.frequency.setTargetAtTime(f, t, 0.1);
        o2.frequency.setTargetAtTime(f * 0.502, t, 0.1);
        lfo.frequency.setTargetAtTime(18 + speedN * 16, t, 0.1);
        lp.frequency.setTargetAtTime(700 + speedN * 900, t, 0.1);
        eng.gain.setTargetAtTime(0.16, t, 0.3);
        ag.gain.setTargetAtTime(rainy ? 0.07 : 0.025 + speedN * 0.05, t, 0.3);
        chg.gain.setTargetAtTime(0.02 + near * 0.16, t, 0.2);
        ch.frequency.setTargetAtTime(44 + near * 30, t, 0.2);
      },
      horn(kind, pan, vol) {
        if (kind === 'tram') { tone('sine', [988, 1480], 0.5, vol * 0.5, pan, 0.002); setTimeout(() => tone('sine', [988, 1480], 0.6, vol * 0.45, pan, 0.002), 220); }
        else if (kind === 'truck') tone('sawtooth', [196, 247], 0.7, vol * 0.35, pan, 0.03);
        else { tone('square', [392, 494], 0.32, vol * 0.3, pan); if (Math.random() < 0.4) setTimeout(() => tone('square', [392, 494], 0.18, vol * 0.3, pan), 380); }
      },
      crash() {
        const t0 = ac.currentTime;
        const n = noise(); const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1800;
        const g = ac.createGain(); g.gain.setValueAtTime(0.5, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.45);
        n.connect(f).connect(g).connect(out); n.start(t0); n.stop(t0 + 0.5);
        tone('sine', [70], 0.3, 0.5, 0, 0.002);
      },
      splash() {
        const t0 = ac.currentTime;
        const n = noise(); const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1200; f.Q.value = 0.8;
        const g = ac.createGain(); g.gain.setValueAtTime(0.3, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.5);
        n.connect(f).connect(g).connect(out); n.start(t0); n.stop(t0 + 0.55);
      },
      fadeOut() { out.gain.setTargetAtTime(0, ac.currentTime, 0.15); },
      close() { try { ac.close(); } catch (e) { /* zaten kapalı */ } },
    };
  }

  function start(opts) {
    const set = SETS[opts.set] || SETS.A;
    const T = opts.text || {};
    const dur = opts.seconds || 35;
    const haptic = opts.haptic || (() => {});
    const host = document.createElement('div');
    host.className = 'gyro';
    host.innerHTML = `
      <canvas class="gyro-canvas"></canvas>
      <div class="gyro-hud">
        <div class="gyro-bar"><i class="gyro-time"></i></div>
        <div class="gyro-gap"><span>${T.gap || 'Mesafe'}</span><b><i class="gyro-gapfill"></i></b></div>
      </div>
      <div class="gyro-panel" data-panel="intro">
        <p class="gyro-title">${T.title || 'Kaç!'}</p>
        <p class="gyro-how">${T.how || 'Telefonu sağa sola eğ. Ya da ekranın iki yanına basılı tut.'}</p>
        <button class="cta gyro-go">${T.ready || 'Hazırım'}</button>
      </div>`;
    opts.root.appendChild(host);
    const cv = host.querySelector('canvas');
    const ctx = cv.getContext('2d');
    const timeFill = host.querySelector('.gyro-time');
    const gapFill = host.querySelector('.gyro-gapfill');
    let W = 0, H = 0, dpr = 1, raf = 0, last = 0, running = false, stopped = false;
    const imgs = {};
    let st, snd = null;

    function size() {
      host.style.height = '';
      const r = host.getBoundingClientRect();
      const vis = Math.min(r.height, window.innerHeight - Math.max(0, r.top));
      if (vis > 200 && vis < r.height) host.style.height = vis + 'px';
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = vis > 200 ? vis : r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
    }

    function reset() {
      st = { t: 0, pos: 0, px: 0, camX: 0, gap: 100, objs: [], props: [], spawn: 0.3, shake: 0, slip: 0, flash: 0, curve: 0, curveT: 0, speed: 9 };
      for (let z = 2; z < FAR; z += set.props.every) set.props.u.forEach((u) => st.props.push({ u, z }));
    }

    // ── Girdi: eğim (kalibre, ölü bölge, yumuşatma), dokunma, ok tuşları ──
    let gamma = null, baseline = null, touchTarget = null, keys = 0, tiltTarget = 0;
    function onTilt(e) {
      if (e.gamma == null) return;
      const ang = (screen.orientation && screen.orientation.angle) || window.orientation || 0;
      gamma = ang === 90 ? e.beta : ang === -90 || ang === 270 ? -e.beta : e.gamma;
      if (baseline == null) return;
      let d = gamma - baseline;
      const DEAD = 2, FULL = 20;
      d = Math.abs(d) < DEAD ? 0 : (Math.abs(d) - DEAD) * Math.sign(d);
      tiltTarget = clamp(d / (FULL - DEAD), -1.2, 1.2);
    }
    function onPointer(e) {
      if (!running) return;
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      touchTarget = e.type === 'pointerup' || e.type === 'pointercancel' ? null : clamp((x - 0.5) * 2.6, -1.15, 1.15);
    }
    const onMove = (e) => { if (e.buttons || e.pointerType === 'touch') onPointer(e); };
    function onKey(e) {
      if (!running) return;
      if (e.key === 'ArrowLeft') keys = e.type === 'keydown' ? -1 : (keys === -1 ? 0 : keys);
      if (e.key === 'ArrowRight') keys = e.type === 'keydown' ? 1 : (keys === 1 ? 0 : keys);
    }
    host.addEventListener('pointerdown', onPointer);
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerup', onPointer);
    host.addEventListener('pointercancel', onPointer);
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    window.addEventListener('deviceorientation', onTilt);
    const onVis = () => { last = 0; if (snd) { if (document.hidden) snd.fadeOut(); else if (running) snd.resume(); } };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', size);

    async function askTilt() {
      const DOE = window.DeviceOrientationEvent;
      if (DOE && typeof DOE.requestPermission === 'function') {
        try { await DOE.requestPermission(); } catch (e) { /* reddedildi: dokunma ile oynanır */ }
      }
    }

    function begin() {
      host.querySelectorAll('.gyro-panel').forEach((p) => p.remove());
      reset();
      baseline = gamma; // oyuncunun o anki tutuş açısı = düz
      tiltTarget = 0;
      if (!snd) { try { snd = createSound(set.rain); } catch (e) { snd = null; } }
      if (snd) snd.resume();
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    }

    // ── Dünya ──
    const worldX = (u) => (u - 0.5) * ROAD_W;

    function spawn() {
      const k = set.obstacles[Math.floor(Math.random() * set.obstacles.length)];
      const choices = (k.lanes || [0, 1, 2]).filter((l) => !st.objs.some((o) => o.lane === l && o.z > FAR - 7));
      if (!choices.length) return;
      // Her an en az bir şerit açık kalsın
      const nearBlocked = new Set(st.objs.filter((o) => o.z > FAR - 9).map((o) => o.lane));
      const ok = choices.filter((l) => nearBlocked.size < 2 || nearBlocked.has(l));
      const pool = ok.length ? ok : choices;
      st.objs.push({ k, lane: pool[Math.floor(Math.random() * pool.length)], z: FAR, hit: false, horned: false });
    }

    function step(dt) {
      st.t += dt;
      const speedN = clamp(st.t / dur, 0, 1);
      st.speed = 9 + speedN * 5;                     // dünya birimi / sn
      st.pos += st.speed * dt;
      // Viraj: uzun dalga, yumuşak geçiş
      st.curveT += dt;
      const target = (Math.sin(st.curveT * 0.32) * 0.8 + Math.sin(st.curveT * 0.11 + 1.3) * 0.45) * (set.curve || 0.3);
      st.curve += (target - st.curve) * Math.min(1, dt * 0.8);

      const want = touchTarget != null ? touchTarget : keys ? keys * 1.1 : tiltTarget;
      const ctrl = st.slip > 0 ? -1 : 1;
      const resp = touchTarget != null || keys ? 7 : 5;
      st.px += (want * ctrl - st.px) * Math.min(1, dt * resp);
      st.px -= st.curve * dt * 0.16 * (st.speed / 12);   // virajda dışa savrulma
      st.px = clamp(st.px, -1.15, 1.15);
      st.camX = st.px * 0.42;

      st.spawn -= dt;
      if (st.spawn <= 0) { spawn(); st.spawn = (0.55 + Math.random() * 0.4) / (1 + speedN * 0.7); }
      for (const o of st.objs) {
        o.z -= st.speed * dt * (o.k.oncoming ? 2.0 : 0.55);
        const lanePos = o.lane - 1;
        if (!o.horned && o.k.horn && o.z < 9 && Math.abs(lanePos - st.px) < 1.2) {
          o.horned = true;
          if (snd && (o.k.horn === 'tram' || Math.random() < 0.65)) snd.horn(o.k.horn, (lanePos - st.px) * 0.8, clamp(1.2 - o.z / 10, 0.3, 1));
        }
        if (!o.hit && o.z < 1.25 && o.z > 0.7 && Math.abs(lanePos - st.px) < 0.55) {
          o.hit = true;
          if (o.k.slip) { st.slip = 1.1; st.gap -= 12; haptic([20, 40, 20]); if (snd) snd.splash(); }
          else { st.gap -= 30; st.shake = 0.45; st.flash = 0.3; haptic([40, 30, 60]); if (snd) snd.crash(); }
        }
      }
      st.objs = st.objs.filter((o) => o.z > 0.5);
      const loopZ = Math.ceil(FAR / set.props.every) * set.props.every;
      for (const p of st.props) { p.z -= st.speed * dt; if (p.z < 0.6) p.z += loopZ; }
      st.gap = Math.min(100, st.gap + dt * 2.2);
      st.slip = Math.max(0, st.slip - dt);
      st.shake = Math.max(0, st.shake - dt);
      st.flash = Math.max(0, st.flash - dt);
      if (snd) snd.update(speedN, clamp(1 - st.gap / 100, 0, 1), want);
      if (st.gap <= 0) return 'caught';
      if (st.t >= dur) return 'escape';
      return null;
    }

    // ── Çizim ──
    const hzY = () => set.hz * H;
    const KAM = () => H - hzY();                       // en alt satır z = 1
    const zToY = (z) => hzY() + KAM() / z;
    // Derinlikteki yol merkezi (ekran x): kamera kayması 1/z ile, viraj derinlikle karesel
    const centerX = (z) => W / 2 + (-st.camX * W) / z + st.curve * W * 0.55 * Math.pow(1 - 1 / z, 2);

    function drawSky(im) {
      const hz = hzY();
      if (!im) { ctx.fillStyle = '#0b0f14'; ctx.fillRect(0, 0, W, hz + 2); return; }
      // Zemin görselinin tamamı taban: ufuk üstü şehir, yanlarda perspektifli korkuluk/deniz.
      // Ufku oyunun ufkuyla hizala; virajda ters yöne hafifçe kay.
      const s = (hz / set.hz) / im.height * 1.0;
      const w = Math.max(W * 1.2, im.width * s), h = im.height * (w / im.width);
      const y0 = hz - h * set.hz;
      ctx.drawImage(im, (W - w) / 2 - st.curve * W * 0.07, y0, w, h);
    }

    function drawRoad(tex) {
      const hz = hzY(), kam = KAM();
      if (!tex) return;
      const TW = tex.width, TH = tex.height;
      // Bir karede geçilen mesafe kadar doku = hareket bulanıklığı (yakında belirgin, uzakta yok)
      const smear = clamp((st.speed / 60) / TILE_Z * TH * 1.15, 1, 22);
      for (let y = Math.floor(hz) + 1; y < H; y += 1) {
        const z = kam / (y - hz);
        if (z > 90) continue;
        const scale = 1 / z;
        const w = ROAD_W * W * scale;
        const cx = centerX(z);
        const v = ((((z + st.pos) / TILE_Z) % 1) + 1) % 1;   // yukarı doğru derinlik artar
        const sy = (1 - v) * TH;
        const sh = Math.min(smear, TH - 2);
        const syc = clamp(sy - sh * 0.5, 0, TH - sh);
        const [u0, u1] = set.crop || [0, 1];
        ctx.drawImage(tex, u0 * TW, syc, (u1 - u0) * TW, sh, cx - w / 2 + u0 * w, y, (u1 - u0) * w, 1.6);
      }
      // ufukta pus: yol ile gökyüzü birleşimi yumuşasın
      const g = ctx.createLinearGradient(0, hz - 4, 0, hz + kam * 0.08);
      g.addColorStop(0, 'rgba(60,46,40,.35)'); g.addColorStop(1, 'rgba(60,46,40,0)');
      ctx.fillStyle = g; ctx.fillRect(0, hz - 4, W, kam * 0.08 + 4);
    }

    function drawSprite(im, u, z, worldW, ground, alpha, flip) {
      if (!im || z < 0.55) return;
      const scale = 1 / z;
      const x = centerX(z) + worldX(u) * W * scale;
      const y = zToY(z);
      const w = worldW * W * scale * 1.6;
      const h = w * im.height / im.width;
      ctx.globalAlpha = alpha * clamp((FAR + 2 - z) / 6, 0, 1);
      if (flip) { ctx.save(); ctx.translate(x, 0); ctx.scale(-1, 1); ctx.drawImage(im, -w / 2, ground ? y - h * 0.5 : y - h, w, h); ctx.restore(); }
      else ctx.drawImage(im, x - w / 2, ground ? y - h * 0.5 : y - h, w, h);
      ctx.globalAlpha = 1;
    }

    function draw() {
      ctx.save();
      if (st.shake) ctx.translate((Math.random() - 0.5) * 10 * st.shake, (Math.random() - 0.5) * 8 * st.shake);
      drawSky(imgs.bg);
      drawRoad(imgs.road);
      // Uzaktan yakına: engeller ve yol kenarı lambaları
      const items = st.objs.map((o) => ({ z: o.z, f: () => drawSprite(imgs[o.k.img], set.lanes[o.lane], o.z, o.k.w, o.k.ground, o.hit && !o.k.slip ? 0.5 : 1) }));
      if (imgs.prop) st.props.forEach((p) => items.push({ z: p.z, f: () => drawSprite(imgs.prop, p.u, p.z, set.props.w, false, 1, p.u > 0.5) }));
      items.sort((a, b) => b.z - a.z).forEach((i) => i.f());
      if (set.rain) {
        ctx.strokeStyle = 'rgba(200,220,255,.22)'; ctx.lineWidth = 1;
        for (let i = 0; i < 70; i++) { const x = (i * 97 + st.t * 900) % W, y = (i * 53 + st.t * 1400) % H; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 4, y + 16); ctx.stroke(); }
      }
      // hız çizgileri: kenarlarda, hızla artan
      const sp = clamp(st.speed / 14, 0, 1);
      ctx.strokeStyle = `rgba(255,236,205,${0.05 + sp * 0.1})`; ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        const side = i % 2 ? 1 : -1;
        const x = W / 2 + side * (W * (0.36 + ((i * 0.137) % 0.16)));
        const y0 = ((st.pos * 90 + i * 137) % (H * 0.7)) + H * 0.3;
        ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x + side * 6, y0 + 40 + sp * 40); ctx.stroke();
      }
      // Cico: altta, hafif yatar
      const pim = imgs.player;
      if (pim) {
        const w = W * 0.26, h = w * pim.height / pim.width;
        const x = W / 2 + st.px * W * 0.13;
        ctx.save(); ctx.translate(x, H * 0.99); ctx.rotate(st.px * 0.08 + (st.slip ? Math.sin(st.t * 30) * 0.05 : 0) - st.curve * 0.03);
        ctx.drawImage(pim, -w / 2, -h, w, h); ctx.restore();
      }
      // Endurocu: arkadan far parlaması + aynada büyüyen görüntü
      const near = clamp(1 - st.gap / 100, 0, 1);
      const g = ctx.createRadialGradient(W * 0.12, H * 1.02, 0, W * 0.12, H * 1.02, W * (0.35 + near * 0.6));
      g.addColorStop(0, `rgba(255,244,214,${0.12 + near * 0.55})`); g.addColorStop(1, 'rgba(255,244,214,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const cim = imgs.chaser;
      if (cim) {
        const mw = W * 0.3, mh = mw * 0.62, mx = W - mw - 12, my = 58;
        ctx.save();
        ctx.beginPath(); ctx.ellipse(mx + mw / 2, my + mh / 2, mw / 2, mh / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(12,16,22,.8)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,220,170,.75)'; ctx.stroke(); ctx.clip();
        const chh = mh * (0.62 + near * 0.9), cw = chh * cim.width / cim.height;
        ctx.drawImage(cim, mx + mw / 2 - cw / 2, my + mh * 0.92 - chh * 0.85, cw, chh);
        ctx.restore();
      }
      if (st.flash) { ctx.fillStyle = `rgba(255,90,110,${st.flash})`; ctx.fillRect(0, 0, W, H); }
      ctx.restore();
      timeFill.style.transform = `scaleX(${clamp(st.t / dur, 0, 1)})`;
      gapFill.style.transform = `scaleX(${clamp(st.gap / 100, 0, 1)})`;
      host.classList.toggle('danger', st.gap < 35);
    }

    function loop(now) {
      if (!running || stopped) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      const res = step(dt);
      draw();
      if (res) { finish(res); return; }
      raf = requestAnimationFrame(loop);
    }

    function finish(res) {
      running = false;
      if (snd) snd.fadeOut();
      if (res === 'escape') { haptic([20, 60, 20, 60, 80]); done('escape'); return; }
      const p = document.createElement('div');
      p.className = 'gyro-panel';
      p.innerHTML = `<p class="gyro-title">${T.caught || 'Yakalandın.'}</p>
        <button class="cta gyro-retry">${T.retry || 'Tekrar dene'}</button>
        <button class="cta-2 gyro-cont"><span>${T.cont || 'Hikâyeye devam et'}</span></button>`;
      host.appendChild(p);
      p.querySelector('.gyro-retry').onclick = () => { haptic(15); begin(); };
      p.querySelector('.gyro-cont').onclick = () => { haptic(15); done('caught'); };
    }

    function done(res) { stop(); if (opts.onDone) opts.onDone(res); }

    function stop() {
      stopped = true; running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
      window.removeEventListener('deviceorientation', onTilt);
      window.removeEventListener('resize', size);
      document.removeEventListener('visibilitychange', onVis);
      if (snd) { const s = snd; s.fadeOut(); setTimeout(() => s.close(), 400); }
      host.remove();
    }

    size();
    reset();
    preload(opts.set).then((list) => {
      assetList(set).forEach((src, i) => { if (src) imgs[src] = list[i]; });
      imgs.bg = imgs[set.bg]; imgs.road = imgs[set.road]; imgs.player = imgs[set.player]; imgs.chaser = imgs[set.chaser];
      imgs.prop = set.props && imgs[set.props.img];
      draw();
    });
    host.querySelector('.gyro-go').onclick = async () => { haptic(20); await askTilt(); begin(); };
    return { stop };
  }

  const api = { start, preload, SETS };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.CICO = root.CICO || {}).gyro = api;
})(typeof self !== 'undefined' ? self : this);
