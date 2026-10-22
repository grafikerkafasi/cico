/*
 * Native köprü (Capacitor). Tarayıcıda hiçbir şey yapmaz; uygulama kabuğunun içindeyken
 * native özellikleri açar. Eklentiler Capacitor tarafından çalışma anında enjekte edilir
 * (window.Capacitor.Plugins.*), bu yüzden web katmanında paketleyiciye gerek yok.
 *
 *   - Titreşim: iOS'ta da native haptics (web'in vibrate API'si iOS'ta yok)
 *   - Durum çubuğu gizli, açılış ekranı oyun hazır olunca kapanır
 *   - Android geri tuşu: duraklatma menüsü / başlıkta uygulamadan çıkış
 *   - Medya: uygulamada videolar sunucudan akar (CICO_MEDIA_BASE); görseller ve müzik paketin içinde
 */
(function (root) {
  'use strict';

  const cap = root.Capacitor;
  const isNative = !!(cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform());
  const P = (cap && cap.Plugins) || {};
  // Uygulama paketinde index.html'e yazılır (tools/build-www.js); tarayıcıda boş kalır → yollar göreli
  const mediaBase = root.CICO_MEDIA_BASE || '';

  function mediaUrl(path) {
    if (!path || !mediaBase || /^(https?:|blob:|data:)/.test(path)) return path;
    return /^assets\/video\//.test(path) ? mediaBase + path : path;
  }

  // true dönerse titreşim native olarak verildi; false → çağıran web yoluna (navigator.vibrate) düşer
  function haptic(pattern) {
    if (!isNative || !P.Haptics) return false;
    const total = Array.isArray(pattern) ? pattern.reduce((a, b) => a + b, 0) : pattern || 10;
    try {
      if (Array.isArray(pattern) && pattern.length > 1) P.Haptics.notification({ type: 'WARNING' });
      else P.Haptics.impact({ style: total > 20 ? 'MEDIUM' : 'LIGHT' });
    } catch (e) { /* eklenti yoksa sessiz geç */ }
    return true;
  }

  function init(handlers) {
    if (!isNative) return;
    const h = handlers || {};
    try { if (P.StatusBar) { P.StatusBar.setOverlaysWebView && P.StatusBar.setOverlaysWebView({ overlay: true }); P.StatusBar.hide(); } } catch (e) { /* yok */ }
    try { if (P.SplashScreen) setTimeout(() => P.SplashScreen.hide({ fadeOutDuration: 400 }), 300); } catch (e) { /* yok */ }
    try {
      if (P.App) {
        P.App.addListener('backButton', () => { if (h.onBack) h.onBack(); });
        P.App.addListener('pause', () => { if (h.onPause) h.onPause(); });
        P.App.addListener('resume', () => { if (h.onResume) h.onResume(); });
      }
    } catch (e) { /* yok */ }
  }

  function exitApp() { try { if (P.App) P.App.exitApp(); } catch (e) { /* yok */ } }

  const api = { isNative, platform: isNative ? cap.getPlatform() : 'web', mediaBase, mediaUrl, haptic, init, exitApp };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.CICO = root.CICO || {}).native = api;
})(typeof self !== 'undefined' ? self : this);
