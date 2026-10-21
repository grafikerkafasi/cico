// Node tarafı: src/i18n/ altındaki tüm dil dosyalarını otomatik yükler (yeni dil = yeni dosya).
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'src', 'i18n');
module.exports = Object.fromEntries(fs.readdirSync(dir).filter((f) => f.endsWith('.js')).sort()
  .map((f) => [path.basename(f, '.js'), require(path.join(dir, f))]));
