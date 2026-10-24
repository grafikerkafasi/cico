/*
 * Jiroskop kaçışı (Bölüm 2: 2A12 Köprü Kaçışı, 2B10 Sahil Yolu Kaçışı).
 * Eski arcade yarışlarındaki "sözde 3D" yol: sabit zemin görseli + ufuktan yaklaşan saydam sprite'lar.
 * Kontrol: telefonun eğimi (DeviceOrientation, gamma). Eğim yoksa / izin verilmezse ekranın sol-sağ yarısına
 * basılı tut ya da sürükle; masaüstünde ok tuşları.
 * Kural: süre dolana kadar Endurocu'yla aradaki mesafe sıfırlanmazsa kaçarsın. Her çarpma mesafeyi düşürür,
 * mesafe zamanla biraz toparlanır. Yakalanınca "Tekrar dene" ya da "Hikâyeye devam et" (beceri kilitlemez).
 *
 *   CICO.gyro.start({ root, set: 'A' | 'B', seconds, text, haptic, onDone(result) })  → { stop() }
 *   result: 'escape' | 'caught'
 */
(function (root) {
  'use strict';

  const BASE = 'assets/game/c2/';
  const SETS = {
    A: {
      bg: 'gA_bg.jpg', hz: 0.25, vx: 0.56, player: 'gA_cico.png', chaser: 'gA_enduro.png', rain: false,
      obstacles: [
        { img: 'gA_car.png', w: 0.5 }, { img: 'gA_taxi.png', w: 0.5 }, { img: 'gA_dolmus.png', w: 0.42 },
        { img: 'gA_tram.png', w: 0.4, lanes: [-1], speed: 2.1 }, // karşıdan gelen tramvay, sol şeritte raylar
      ],
    },
    B: {
      bg: 'gB_bg.jpg', hz: 0.27, vx: 0.6, player: 'gB_cico.png', chaser: 'gB_enduro.png', rain: true,
      obstacles: [
        { img: 'gB_truck.png', w: 0.46 }, { img: 'gB_bus.png', w: 0.46 }, { img: 'gB_taxi.png', w: 0.5 },
        { img: 'gB_puddle.png', w: 0.42, slip: true, ground: true },
      ],
    },
  };

  const LANES = [-1, 0, 1];
  const PY = 0.84;          // oyuncu satırı (yüksekliğin oranı)
  const LANE_X = 0.3;       // şeritler arası mesafe (oyuncu satırında, genişliğin oranı)
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const cache = {};
  function load(src) {
    if (!cache[src]) cache[src] = new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = BASE + src; });
    return cache[src];
  }
  function preload(set) {
    const s = SETS[set];
    return Promise.all([s.bg, s.player, s.chaser, ...s.obstacles.map((o) => o.img)].map(load));
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
    let imgs = {};
    let st;

    function size() {
      const r = host.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function reset() {
      st = { t: 0, px: 0, target: 0, gap: 100, objs: [], spawn: 0.6, shake: 0, slip: 0, flash: 0, streak: 0, lastLanes: [] };
    }

    // ── Girdi ──
    let tiltOn = false, touchTarget = null, keys = 0;
    function onTilt(e) {
      if (e.gamma == null) return;
      tiltOn = true;
      // dikey tutuşta gamma: sola eğ → negatif
      st && (st.target = clamp(e.gamma / 22, -1.15, 1.15));
    }
    function onPointer(e) {
      if (!running) return;
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      touchTarget = e.type === 'pointerup' || e.type === 'pointercancel' ? null : clamp((x - 0.5) * 2.6, -1.15, 1.15);
    }
    function onKey(e) {
      if (!running) return;
      if (e.key === 'ArrowLeft') keys = e.type === 'keydown' ? -1 : (keys === -1 ? 0 : keys);
      if (e.key === 'ArrowRight') keys = e.type === 'keydown' ? 1 : (keys === 1 ? 0 : keys);
    }
    host.addEventListener('pointerdown', onPointer);
    host.addEventListener('pointermove', (e) => { if (e.buttons || e.pointerType === 'touch') onPointer(e); });
    host.addEventListener('pointerup', onPointer);
    host.addEventListener('pointercancel', onPointer);
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    window.addEventListener('deviceorientation', onTilt);
    const onVis = () => { if (document.hidden) last = 0; };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', size);

    async function askTilt() {
      // iOS 13+: izin yalnızca bir dokunuşla istenebilir
      const DOE = window.DeviceOrientationEvent;
      if (DOE && typeof DOE.requestPermission === 'function') {
        try { await DOE.requestPermission(); } catch (e) { /* reddedildi: dokunma ile oynanır */ }
      }
    }

    function begin() {
      host.querySelector('[data-panel]')?.remove();
      reset();
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    }

    // ── Döngü ──
    function spawn() {
      const free = LANES.filter((l) => !st.lastLanes.slice(-1).includes(l));
      const kinds = set.obstacles;
      const k = kinds[Math.floor(Math.random() * kinds.length)];
      const lanes = (k.lanes || free).filter((l) => !st.objs.some((o) => o.lane === l && o.d > 0.82));
      if (!lanes.length) return;
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      st.lastLanes.push(lane);
      st.objs.push({ k, lane, d: 1, hit: false });
    }

    function step(dt) {
      st.t += dt;
      const want = touchTarget != null ? touchTarget : keys ? keys * 1.1 : st.target;
      const ctrl = st.slip > 0 ? -1 : 1;
      st.px += (want * ctrl - st.px) * Math.min(1, dt * (tiltOn && touchTarget == null ? 7 : 9));
      st.px = clamp(st.px, -1.15, 1.15);
      const pace = 1 + st.t / dur * 0.6;
      st.spawn -= dt;
      if (st.spawn <= 0) { spawn(); st.spawn = (0.85 + Math.random() * 0.55) / pace; }
      for (const o of st.objs) {
        o.d -= dt * 0.42 * pace * (o.k.speed || 1);
        if (!o.hit && o.d < 0.07 && o.d > -0.04 && Math.abs(o.lane - st.px) < 0.55) {
          o.hit = true;
          if (o.k.slip) { st.slip = 1.1; st.gap -= 12; haptic([20, 40, 20]); }
          else { st.gap -= 30; st.shake = 0.4; st.flash = 0.3; haptic([40, 30, 60]); }
        }
      }
      st.objs = st.objs.filter((o) => o.d > -0.15);
      st.gap = Math.min(100, st.gap + dt * 2.2);
      st.slip = Math.max(0, st.slip - dt);
      st.shake = Math.max(0, st.shake - dt);
      st.flash = Math.max(0, st.flash - dt);
      st.streak = (st.streak + dt * pace * 1.6) % 1;
      if (st.gap <= 0) return 'caught';
      if (st.t >= dur) return 'escape';
      return null;
    }

    function drawCover(im) {
      if (!im) { ctx.fillStyle = '#0b0f14'; ctx.fillRect(0, 0, W, H); return; }
      const s = Math.max(W / im.width, H / im.height);
      const w = im.width * s, h = im.height * s;
      ctx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
    }

    function draw() {
      ctx.save();
      if (st.shake) ctx.translate((Math.random() - 0.5) * 10 * st.shake, (Math.random() - 0.5) * 8 * st.shake);
      drawCover(imgs.bg);
      const hz = set.hz * H, vx = set.vx * W, py = PY * H;
      // hız çizgileri ufuktan dışarı
      ctx.strokeStyle = 'rgba(255,230,190,.16)'; ctx.lineWidth = 1.5;
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI + Math.PI * 0.02;
        const r0 = ((st.streak + i * 0.37) % 1) * H * 0.9 + 40, r1 = r0 + 40 + r0 * 0.25;
        const dx = Math.cos(a), dy = Math.sin(a);
        ctx.beginPath(); ctx.moveTo(vx + dx * r0 * 1.2, hz + dy * r0); ctx.lineTo(vx + dx * r1 * 1.2, hz + dy * r1); ctx.stroke();
      }
      if (set.rain) {
        ctx.strokeStyle = 'rgba(200,220,255,.22)'; ctx.lineWidth = 1;
        for (let i = 0; i < 70; i++) { const x = (i * 97 + st.t * 900) % W, y = (i * 53 + st.t * 1400) % H; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 4, y + 16); ctx.stroke(); }
      }
      // engeller: uzaktan yakına
      const sorted = [...st.objs].sort((a, b) => b.d - a.d);
      for (const o of sorted) {
        const im = imgs[o.k.img]; if (!im) continue;
        const p = Math.pow(clamp(1 - o.d, 0, 1.2), 2.3);
        const y = hz + (py - hz) * p;
        const laneX = W * (0.5 + o.lane * LANE_X);
        const x = vx + (laneX - vx) * p;
        const w = o.k.w * W * (0.04 + 0.96 * p);
        const h = w * im.height / im.width;
        ctx.globalAlpha = clamp((1 - o.d) * 4, 0, 1) * (o.hit && !o.k.slip ? 0.55 : 1);
        ctx.drawImage(im, x - w / 2, o.k.ground ? y - h * 0.5 : y - h, w, h);
      }
      ctx.globalAlpha = 1;
      // Cico
      const pim = imgs.player;
      if (pim) {
        const w = W * 0.27, h = w * pim.height / pim.width;
        const x = W * (0.5 + st.px * LANE_X);
        ctx.save(); ctx.translate(x, H * 0.985); ctx.rotate(st.px * 0.07 + (st.slip ? Math.sin(st.t * 30) * 0.05 : 0));
        ctx.drawImage(pim, -w / 2, -h, w, h); ctx.restore();
      }
      // Endurocu: arkadan far parlaması + aynada büyüyen görüntü
      const near = clamp(1 - st.gap / 100, 0, 1);
      const g = ctx.createRadialGradient(W * 0.1, H * 1.02, 0, W * 0.1, H * 1.02, W * (0.35 + near * 0.6));
      g.addColorStop(0, `rgba(255,244,214,${0.15 + near * 0.55})`); g.addColorStop(1, 'rgba(255,244,214,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const cim = imgs.chaser;
      if (cim) {
        const mw = W * 0.3, mh = mw * 0.62, mx = W - mw - 12, my = 58;
        ctx.save();
        ctx.beginPath(); ctx.ellipse(mx + mw / 2, my + mh / 2, mw / 2, mh / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(12,16,22,.78)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,220,170,.75)'; ctx.stroke(); ctx.clip();
        const ch = mh * (0.35 + near * 1.1), cw = ch * cim.width / cim.height;
        ctx.drawImage(cim, mx + mw / 2 - cw / 2, my + mh * 0.92 - ch * 0.85, cw, ch);
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

    function done(res) { stop(); opts.onDone && opts.onDone(res); }

    function stop() {
      stopped = true; running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
      window.removeEventListener('deviceorientation', onTilt);
      window.removeEventListener('resize', size);
      document.removeEventListener('visibilitychange', onVis);
      host.remove();
    }

    size();
    reset();
    preload(opts.set).then((list) => {
      const s = set;
      [s.bg, s.player, s.chaser, ...s.obstacles.map((o) => o.img)].forEach((src, i) => { imgs[src] = list[i]; });
      imgs.bg = imgs[s.bg]; imgs.player = imgs[s.player]; imgs.chaser = imgs[s.chaser];
      draw();
    });
    host.querySelector('.gyro-go').onclick = async () => { haptic(20); await askTilt(); begin(); };
    return { stop };
  }

  const api = { start, preload, SETS };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.CICO = root.CICO || {}).gyro = api;
})(typeof self !== 'undefined' ? self : this);
