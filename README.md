# CİCO

Mobil FMV / video tabanlı interaktif macera. Bu depo **Bölüm 1: "Gece Vardiyası"** için oynanabilir **metin tabanlı demoyu** içerir.
Amaç, videolar üretilmeden önce hikâyenin dallanmasını ve seçimlerin işe yarayıp yaramadığını test etmek.

## Çalıştırma

Gereken: Node.js 18+ (bağımlılık yok, `npm install` gerekmez).

```bash
npm start          # http://localhost:8080 — tarayıcı demosu
npm run play       # terminalde oyna (npm run play -- en : İngilizce)
npm test           # tüm testler
npm run validate   # hikâye raporu: sahne/seçim sayısı, tüm yollar, sonlara dağılım
npm run flow       # docs/story-flow.md içindeki Mermaid şemasını veriden yeniden üret
```

`index.html` dosyasını tarayıcıda doğrudan açmak da çalışır (derleme adımı yok).

### Kontroller

Mobil oyun, dikey, tek el. **Ekrana dokun:** sıradaki vuruş / devam. **Kartlara dokun:** seçim. **Sağ üst duraklat (II):** defter, akış, dil, süreli seçimler, titreşim, yeniden başlat, geliştirici. Masaüstünde oyun bir telefon çerçevesinde açılır. Telefonda "Ana ekrana ekle" ile uygulama gibi tam ekran çalışır (`manifest.webmanifest`).
Telefonda denemek için: bilgisayarda `npm start`, telefonda aynı Wi-Fi'den `http://<bilgisayarın-yerel-IP'si>:8080`.
Masaüstünde: `Boşluk/Enter` devam · `1–3` seçim · `Esc` duraklat.

## Yapı

```
index.html               giriş noktası (script sırası: motor → veri → diller → arayüz)
src/story/chapter1.js    TEK DOĞRULUK KAYNAĞI: sahneler, seçimler, koşullar, etkiler, medya alanları
src/i18n/tr.js, en.js    tüm oyuncuya görünen metinler (sahne verisinde metin yok)
src/engine/engine.js     dallanma motoru (DOM'suz; tarayıcı, CLI ve testler aynı kodu kullanır)
src/engine/validate.js   doğrulayıcı + tüm yolları gezen simülatör
src/engine/i18n.js       çeviri yardımcıları
src/ui/                  arayüz (app.js), medya katmanı (media.js), akış şeması (flowchart.js), stil
tools/                   yerel sunucu, CLI oynatıcı, doğrulama, Mermaid üretici
tests/                   node:test testleri
docs/                    hikâye akışı, seçim tasarımı, görsel devamlılık, video hattı
```

**Neden bu teknoloji?** Depo boştu. Hedef önce tarayıcıda oynanan bir FMV prototipi. HTML5 `<video>` + saf JavaScript en az bağımlılıkla en kısa yol: derleme yok, framework yok, her yerde açılır.
Motor DOM'dan bağımsız olduğu için ileride bir oyun motoruna (ör. Unity/Godot) taşınırken sahne verisi ve testler korunabilir.

## Testler neyi doğruluyor

- Sahne ID'leri benzersiz, her hedef sahne var, kilitsiz en az bir seçenek her düğümde mevcut.
- Başlangıçtan erişilemeyen sahne yok. Bu, hem grafik üzerinden hem **gerçek koşullarla tüm 59 oynanış** simüle edilerek kontrol edilir.
- İstenmeyen döngü yok; her yol bir sona ulaşıyor; 5 sonun her biri ulaşılabilir.
- İki katman ilk seçimden sonra asla birleşmez; her katmanın her ana kolu oynanır (paket: aç/açma, teslim/kaç/yüzleş, kabul/reddet, basamak/pasaj · ilaç: fotoğraf/sil, kal/kovala, Kabile/gazeteci, gir/kaç).
- Her oynanışın oyun sonu metni seçimleri doğru yansıtır (tek bir son parçası, açılış ve kapanış).
- Dört zaman aşımı davranışı ayrı ayrı test edilir.
- Gecikmeli sonuçlar test edilir: kilitli seçeneğin açılması, açılan bandın fark edilmesi, şüpheye bağlı yakalanma, reddedilen talebin sonda dönmesi, kira hesabı.
- Yeniden başlatma durumu tamamen sıfırlar.
- Anma yalnızca oyunu bitirene gösterilir; ince göndermeler metinden düşmemiştir.
- Her dilde tüm anahtarlar var; eksik dil eklenirse validator yakalar.
- Mobil metin kuralı: her vuruş ≤ 120, her seçenek ≤ 60 karakter.
- `docs/story-flow.md` şeması sahne verisiyle güncel.

## Sahne görselleri ve seçim noktaları

- Sahnenin görseli: `image_asset: 'assets/scenes/<scene_id>.jpg'`. Görsel ekrana sığdırılır (tamamı görünür); boşluklar bulanık kopyasıyla dolar. Oran `media_aspect` (varsayılan 9:16).
- Seçenekler altta buton değil, görselin üzerindeki noktalardır: her seçenekte `hotspot: { x, y }` (görselin yüzdesi, 0–100). Şu an **geçici** değerler var.
- Koordinat bulmak için: Duraklat → Geliştirici → **Koordinat seçici**. Açıkken görsele dokununca `hotspot: { x, y }` değeri ekranda görünür (ve konsola yazılır).

## Herkese açık oyun linki

**https://grafikerkafasi.github.io/cico/** — giriş gerektirmez, telefonda doğrudan açılır (GitHub Pages, `grafikerkafasi/cico` deposu).
Güncellerken `index.html` içindeki `?v=` sürüm ekini yenileyin; aksi hâlde tarayıcılar eski dosyaları önbellekten okuyabilir.

## Claude üzerinden paylaşılan link

`npm run artifact -- <klasör>` paylaşılabilir sayfayı üretir; claude.ai Artifact olarak yayınlanır. Dosya listesi `files.json` içindedir.

## Yeni dil eklemek

1. `src/i18n/tr.js` dosyasını `src/i18n/<kod>.js` olarak kopyala; son satırdaki `.tr` ve `meta` alanını değiştir, metinleri çevir.
2. `index.html`'e `<script src="src/i18n/<kod>.js"></script>` ekle. Dil seçicide otomatik görünür.
3. `npm test` çalıştır. Testler ve araçlar `src/i18n/` klasöründeki dosyaları otomatik bulur, eksik anahtarları listeler.

Eksik bir anahtar arayüzde Türkçeye düşer, oyun çökmez.

## Video eklemek

Bkz. [docs/video-pipeline.md](docs/video-pipeline.md). Kısaca: dosyayı `media/video/<scene_id>.mp4` olarak koy, sahnenin `video_asset` alanını doldur.
Dallanma sistemine dokunmak gerekmez.

## Henüz uygulanmamış

- Gerçek video, görsel, ses (bilinçli olarak; ilk aşama metin).
- Oyun sonu metninin seslendirmesini oynatma (senaryo ve kayıt listesi hazır: `docs/epilogue-voiceover.md`).
- iOS Safari titreşimi desteklemiyor; titreşim yalnızca Android/Chrome'da çalışır.
- Rotaya göre koşullu video seçimi (`video_asset` için koşul dizisi). Tasarımı `video-pipeline.md`'de.
- Kayıt/yükleme (oyun ortasında kaydetme). Yalnızca akış şemasının "keşif" kaydı tarayıcıda tutulur.
- Dünya geneli seçim istatistikleri.
- Bölüm 2.

## Dokümanlar

- [docs/story-flow.md](docs/story-flow.md): öncül, karakterler, Mermaid akış şeması, zaman aşımları, sonlar
- [docs/choice-design.md](docs/choice-design.md): Detroit referans araştırması, merak kuralları, her seçim düğümü, değişkenler
- [docs/visual-continuity.md](docs/visual-continuity.md): Aslan ve scooter sabitleri, AI prompt bloğu
- [docs/video-pipeline.md](docs/video-pipeline.md): video formatı ve entegrasyon
- [docs/epilogue-voiceover.md](docs/epilogue-voiceover.md): oyun sonu metni, seslendirme senaryosu ve kayıt listesi

---

*Atanamadığı için kuryelik yapmak zorunda kalan ve 26 yaşında aramızdan ayrılan Sosyal Bilgiler Öğretmeni Hasan Cihan Aslan'ın anısına.*
