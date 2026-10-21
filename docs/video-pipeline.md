# Video Hattı — AI Videolarını Demoya Ekleme

**Durum:** Henüz hiçbir video yok. Tüm sahnelerde `video_asset: null`; demo metin modunda çalışır.
Video oynatma kodu (`src/ui/media.js`) yazıldı ve eksik dosyada metne düşme davranışı test edildi. **Gerçek bir video dosyasıyla henüz denenmedi.** İlk videolar geldiğinde doğrulanmalı.

## 1. Bir videoyu sahneye bağlamak

1. Dosyayı `media/video/<scene_id>.mp4` olarak koy (ör. `media/video/c1_s01_nevizade.mp4`).
2. `src/story/chapter1.js` içinde ilgili sahnede alanı doldur:

```js
{
  scene_id: 'c1_s02_orders',
  video_asset: 'media/video/c1_s02_orders.mp4',
  loop_asset: 'media/video/c1_s02_orders_loop.mp4', // isteğe bağlı: seçim beklerken döngü
  choice_display: 'over_video',  // 'after_video' (varsayılan) | 'over_video'
  choice_at: 6.5,                // over_video için: seçenekler 6.5. saniyede açılır (yoksa video başlar başlamaz)
  poster: 'media/poster/c1_s02_orders.jpg', // isteğe bağlı
  subtitles: { tr: 'media/subs/tr/c1_s02_orders.vtt', en: 'media/subs/en/c1_s02_orders.vtt' },
  ...
}
```

3. `npm start` ile sunucudan aç (`index.html`'i doğrudan açmak da çalışır, ama video için sunucu önerilir).

Dallanma, koşullar, etkiler değişmez. Yalnızca o sahnenin **gösterimi** değişir.

## Görseller ve seçim noktaları (video öncesi aşama)

- Video yokken sahne `image_asset` ile tam ekran bir görsel gösterebilir. İlk görsel: `assets/scenes/c1_s01_nevizade.jpg` (941×1672). Açılışta ve aynı anı anlatan "İki Talep" sahnesinde kullanılıyor.
- Görsel ve video ekrana **sığdırılır** (tamamı görünür, kırpılmaz). Böylece seçim noktaları her cihazda görselin aynı yerine düşer. Boşluklar bulanık kopyasıyla dolar.
- Seçim noktası (`hotspot: { x, y }`) görselin yüzdesidir. Video geldiğinde aynı koordinatlar videonun üzerinde kullanılır; bu yüzden video, görselle aynı kadrajda olmalı.
- Seçeneğin işaret ettiği nesne (telefon, teslimat kutusu, kapı…) görselde net görünmeli. Noktaların yeri görselin alt %20'sine denk gelmemeli; orada altyazı var.

## 2. Ekranda ne görünür (mobil, tam ekran)

- Video tam ekran oynar (`object-fit: cover`), üstünde yalnızca menü düğmesi vardır.
- **Metin modu (video yokken):** Sahnenin vuruşları dokundukça tek tek gelir. `line` ve `say` altyazı gibi altta, `msg` üstte bildirim kartı olarak.
- **Video modu:** Anlatı ve konuşma videonun kendisindedir (diyalog altyazısı ileride `.vtt` ile). **Telefon mesajları videoda yazı olarak yer almaz.** Bildirim kartı olarak UI'da açılırlar: video bitince ya da seçenekler göründüğü anda, sahnenin son iki mesajı.
- Seçenekler videonun üzerinde yarı saydam, buzlu cam kartlarda. Dikey ekranda alt alta, yatay ekranda yan yana.

**Henüz uygulanmamış:** Mesaj kartlarını videonun belirli bir saniyesinde açmak (ör. `at: 4.2`). Şu an video bitince veya seçenekler açılınca gösteriliyorlar.

## 3. Oynatma davranışı

| Durum | Davranış |
|---|---|
| `video_asset` boş | Metin modu: sahne kartı + seçenekler hemen. |
| Video var, `choice_display: 'after_video'` | Video oynar, sahne kartı küçülür. Video bitince seçenekler (ya da "Devam") açılır. |
| Video var, `choice_display: 'over_video'` | Seçenekler video başlarken (ya da `choice_at` saniyesinde) videonun **üstünde** açılır. Video bitince `loop_asset` varsa döngüye girer. |
| Süreli seçim | Zamanlayıcı seçenekler göründüğü an başlar, videonun başında değil. |
| Dosya yok / codec desteklenmiyor | Video kaldırılır, "Video bulunamadı, metin moduna geçildi" notu ve metin kartı gösterilir. Oyun devam eder. |
| Otomatik oynatma engellendi | Sessiz olarak yeniden dener. "Başla" düğmesi kullanıcı etkileşimi sayıldığı için normalde engellenmez. |
| "Videoyu geç" | Videonun sonuna atlar; seçenekler açılır. |

## 4. Önerilen format (hedef: web tarayıcısı, masaüstü + mobil)

Mevcut teknoloji saf HTML5 `<video>`. Bu yüzden en geniş uyumluluk için:

| Ayar | Öneri | Neden |
|---|---|---|
| Kapsayıcı / codec | **MP4 · H.264 (High) + AAC** | Tüm tarayıcılar ve iOS. İleride isteğe bağlı WebM/AV1 eklenebilir. |
| En-boy oranı | **Dikey 9:16 (1080×1920)** — mobil oyun için varsayılan (değiştirilebilir) | Oyun dikey, tek elle oynanıyor (`manifest.webmanifest` → `portrait`). Üst %15 (bildirim kartları) ve alt %35 (altyazı + seçim kartları) UI'ya ayrılır: yüz ve önemli nesneler ortadaki bantta kalmalı. |
| Çözünürlük | 1080p (seçilen orana göre), gerekirse 720p hafif kopya | Mobil veri ve depolama için 720p yedek önerilir. |
| Kare hızı | **24 fps** | Sinematik his. AI çıktısı farklıysa yeniden örneklemeden kaynak fps'te bırak. |
| Bit hızı | 1080p için ~6–8 Mbps (CRF 20–23) | Kalite/boyut dengesi. |
| Web için | `-movflags +faststart` | Video tamamen inmeden oynamaya başlar. |
| Ses | AAC 48 kHz stereo, −16 LUFS civarı | Sahneler arası ses seviyesi tutarlı olur. |
| Döngü videoları | 3–6 sn, ilk ve son kare eşleşen | Seçim beklerken dikiş yeri görünmez. |

Örnek dönüştürme:

```bash
ffmpeg -i input.mov -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p -r 24 \
       -c:a aac -b:a 160k -ar 48000 -movflags +faststart media/video/c1_s01_nevizade.mp4
```

## 5. Yazı yok, dil desteği var

- Videolarda **okunacak yazı yok** (bkz. `visual-continuity.md`). Telefon mesajları, talepler, listeler UI kartlarında gösterilir. Bu kartlar `src/i18n/<dil>.js`'ten gelir.
- Diyalog altyazıları dil başına **WebVTT** dosyası olarak verilir (`subtitles: { tr, en }`). Böylece tek video tüm dillerle çalışır.
- Seslendirme eklenirse: video sessiz ambiyansla, diyalog ise dil başına ayrı ses dosyasıyla verilebilir. Bu henüz uygulanmadı.

## 6. Üretim listesi (Bölüm 1)

İki katman birleşmediği için **her oynanış 7–9 video** görür; toplam 22 sahne videosu + 6 bekleme döngüsü.

| scene_id | Katman | Tür | Seçim gösterimi | Not |
|---|---|---|---|---|
| `c1_s01_nevizade` | ortak | sinematik | — | Nevizade, meyhaneler, Cico yakın plan, telefon titrer |
| `c1_s02_orders` | ortak | seçim | over_video + loop | Telefona bakış döngüsü |
| `c1_a1_printhouse` | A | seçim | after_video | Matbaa kapısı, bant yakın plan · **mekân B ile ortak** |
| `c1_a2_school` | A | sinematik | — | **Ağır çekim**, "fıtı fıtı" |
| `c1_a3_tower` | A | seçim | over_video + loop | Galata Kulesi dibi, paltolu adam, farlar |
| `c1_a4_rooftop` | A | seçim | after_video | Çatı, şehir ışıkları |
| `c1_a5_chase` | A | aksiyon | over_video | Kalkış; basamak ve pasaj sonuç çekimleri |
| `c1_a6_second_offer` | A | seçim | after_video | Kule dibinde iki kişilik yakın plan |
| `c1_b1_pharmacy` | B | sinematik | — | Eczane, Dolapdere kapısı, mendilci çocuk |
| `c1_b2_kid` | B | seçim | after_video | Kapı eşiği |
| `c1_b3_boulevard` | B | seçim | over_video + loop | Tarlabaşı Bulvarı, devrik scooter, Kabile Şefi oturur hâlde (kan yok) |
| `c1_b4_hospital` | B | seçim | after_video | Hastane koridoru, kuryeler |
| `c1_b5_printhouse` | B | aksiyon | over_video | Aynı matbaa, camın ardında ekranlar |
| `c1_end_a_silence` / `c1_end_a_tribe` | A | son | — | **Aynı mekân** (kahvehane) |
| `c1_end_a_escape` | A | son | — | Karaköy şafak |
| `c1_end_a_fall` | A | son | — | Düşüş (kesme ile), yerde kâğıt |
| `c1_end_a_desk` | A | son | — | Ofis, ekranda yeşil noktalar |
| `c1_end_b_strike` | B | son | — | Ertesi gece Nevizade (açılış mekânı), kontağı kapalı scooter sırası |
| `c1_end_b_headline` | B | son | — | Hastane önü sabah |
| `c1_end_b_blackbox` | B | son | — | Matbaanın içi, paltolu adam |
| `c1_end_b_evidence` | B | son | — | Şafak, Tarlabaşı |

Oyun sonu metni (epilog) video gerektirmez: siyah ekran + seslendirme (bkz. `epilogue-voiceover.md`).

**Henüz uygulanmamış:** Duruma göre farklı video seçimi (ör. paket açıldıysa farklı bir kule çekimi). Gerektiğinde `video_asset` alanı `[{ if, src }, { src }]` biçimine genişletilebilir. Motor zaten aynı koşul dilini kullanıyor.
