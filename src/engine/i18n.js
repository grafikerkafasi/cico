/*
 * Basit i18n: iç içe nesnelerde nokta yolu ile arama, {yer_tutucu} doldurma,
 * eksik anahtarda yedek dile (varsayılan: tr) düşme.
 * Yeni dil eklemek için: src/i18n/tr.js'i kopyala, çevir, index.html'e ekle.
 */
(function (root) {
  'use strict';

  function lookup(obj, key) {
    return key.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), obj);
  }

  function createTranslator(locales, code, fallback = 'tr') {
    const raw = (key) => {
      const s = lookup(locales[code], key);
      return typeof s === 'string' ? s : lookup(locales[fallback], key);
    };
    function t(key, vars) {
      const s = raw(key);
      if (typeof s !== 'string') return `⟦${key}⟧`;
      return s.replace(/\{(\w+)\}/g, (m, k) => (vars && k in vars ? vars[k] : m));
    }
    // İsteğe bağlı anahtarlar için (ör. seçenek alt satırı *_sub)
    t.has = (key) => typeof raw(key) === 'string';
    return t;
  }

  // Bir dil nesnesindeki tüm yaprak anahtarları listeler (eksik çeviri kontrolü için).
  function collectKeys(obj, prefix = '') {
    return Object.entries(obj).flatMap(([k, v]) =>
      v && typeof v === 'object' ? collectKeys(v, prefix + k + '.') : [prefix + k]);
  }

  const api = { lookup, createTranslator, collectKeys };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.CICO = root.CICO || {}).i18n = api;
})(typeof self !== 'undefined' ? self : this);
