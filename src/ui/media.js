/*
 * Medya katmanı. Sahne verisindeki video_asset'e göre video veya metin modunu seçer.
 * Dallanma mantığından tamamen ayrıdır: yalnızca "seçenekleri şimdi göster" ve
 * "sahne bitti" sinyallerini UI'a iletir.
 *
 * Sahne alanları (hepsi isteğe bağlı):
 *   video_asset    : 'media/video/c1_s01_opening.mp4'
 *   loop_asset     : seçim beklerken döngüde oynatılacak kısa video
 *   choice_display : 'after_video' (varsayılan) | 'over_video'
 *   choice_at      : over_video için seçeneklerin açılacağı saniye (yoksa video başlarken)
 *   poster         : video yüklenirken gösterilecek kare
 *   subtitles      : { tr: 'media/subs/tr/c1_s01_opening.vtt', en: ... }
 *   image_asset    : video yokken gösterilen tam ekran görsel (video varsa poster olarak kullanılır)
 */
(function (root) {
  'use strict';

  function resolveMedia(scene, lang) {
    if (!scene.video_asset) return scene.image_asset ? { mode: 'text', image: scene.image_asset } : { mode: 'text' };
    return {
      mode: 'video',
      src: scene.video_asset,
      loop: scene.loop_asset || null,
      poster: scene.poster || scene.image_asset || null,
      image: scene.image_asset || null,
      choiceDisplay: scene.choice_display === 'over_video' ? 'over_video' : 'after_video',
      choiceAt: typeof scene.choice_at === 'number' ? scene.choice_at : null,
      subtitles: scene.subtitles && lang ? scene.subtitles[lang] || null : null,
    };
  }

  /*
   * Videoyu sahneye bağlar. Callback'ler:
   *   showChoices() — seçenekler artık gösterilebilir
   *   ended()       — video bitti (seçimsiz sahnede "Devam" etkinleşir)
   *   failed(err)   — dosya yok/oynatılamıyor → UI metin moduna düşer
   * Döner: { stop(), skip() }
   */
  function mountVideo(container, plan, cb) {
    const video = document.createElement('video');
    video.className = 'stage-video';
    video.playsInline = true;
    video.preload = 'auto';
    if (plan.poster) video.poster = plan.poster;
    if (plan.subtitles) {
      const track = document.createElement('track');
      track.kind = 'subtitles';
      track.src = plan.subtitles;
      track.default = true;
      video.appendChild(track);
    }
    let choicesShown = false;
    let done = false;
    let looping = false;
    const reveal = () => { if (!choicesShown) { choicesShown = true; cb.showChoices(); } };
    const fail = (err) => { if (done) return; done = true; video.remove(); cb.failed(err); };

    video.addEventListener('error', () => fail(video.error), { once: true });
    video.addEventListener('playing', () => {
      if (plan.choiceDisplay === 'over_video' && plan.choiceAt === null) reveal();
    });
    video.addEventListener('timeupdate', () => {
      if (plan.choiceDisplay === 'over_video' && plan.choiceAt !== null && video.currentTime >= plan.choiceAt) reveal();
    });
    video.addEventListener('ended', () => {
      if (done) return;
      reveal();
      if (plan.loop) {
        looping = true;
        video.src = plan.loop;
        video.loop = true;
        video.play().catch(() => {});
      } else {
        done = true;
      }
      cb.ended();
    });

    video.src = plan.src;
    container.appendChild(video);
    video.play().catch((err) => {
      // Otomatik oynatma engellenirse sesi kapatıp tekrar dene; yine olmazsa metne düş.
      if (err && err.name === 'NotAllowedError') {
        video.muted = true;
        video.play().catch(fail);
      }
    });

    return {
      stop() { done = true; video.pause(); video.removeAttribute('src'); video.load(); video.remove(); },
      skip() { if (!done && !looping) { video.currentTime = video.duration || 0; video.dispatchEvent(new Event('ended')); } },
    };
  }

  const api = { resolveMedia, mountVideo };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.CICO = root.CICO || {}).media = api;
})(typeof self !== 'undefined' ? self : this);
