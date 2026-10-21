# Seçim Tasarımı — Bölüm 1

Bu belge her seçim düğümünü, durum değişkenlerini ve merak/bağlılık kurallarını açıklar.
Kaynak veri: `src/story/chapter1.js`. Metinler: `src/i18n/tr.js`.

---

## 1. Referans araştırması: *Detroit: Become Human*

**Erişim durumu (dürüst not):** Claude in Chrome uzantısı bu oturumda bağlı değildi. Sayfalar WebFetch ile metin olarak okundu.

| Kaynak | Durum | Çıkarılan bilgi |
|---|---|---|
| [Quantic Dream flowchart sayfası](https://www.quanticdream.com/en/detroit-become-human/flowcharts) | Erişildi, **ama akış şemaları metin olarak gelmedi** (görsel/JS içerik). Sayfa yalnızca genel tanıtım metni verdi. | "Küçük kararlar da sonucu etkiler", "bir karakter ölse de hikâye devam eder", tekrar oynanabilirlik. |
| [PlayStation Blog — ilk 30 dakika](https://blog.playstation.com/archive/2018/04/23/7-things-youll-notice-in-your-first-30-minutes-of-detroit-become-human) | Erişildi | Her sahne sonunda akış şeması: izlenen yol + seçilmeyen dallar. **Dalların nereye gittiği gösterilmez.** Bu tekrar oynamayı teşvik eder. İpucu toplamak "zamanında" yapılmazsa sahne doğaçlamaya döner; başarısızlık da bir yoldur. Merak, ek diyalog ve eylemleri açar. |
| [PlayStation Blog — çıkış duyurusu](https://blog.playstation.com/2018/03/01/detroit-become-human-launches-may-25/) | Erişildi | Bazı sahneler kaçırılabilir; müttefikler sona kadar yardım edebilir ya da erken ölebilir. Ana karakterler her an kaybedilebilir. |
| Tamamlayıcı arama ([Wikipedia](https://en.wikipedia.org/wiki/Detroit:_Become_Human), inceleme yazıları) | Arama sonuçları | Gidilmemiş yollar gri görünür, tamamlanma yüzdesi gösterilir, dünya geneli seçim istatistikleri vardır. GameSpot şemanın sürükleyiciliği kırabildiğini not eder. |

Quantic Dream'in akış şeması tasarımı üzerine bir geliştirici konuşması (GDC vb.) bulunamadı. Aşağıdaki ilkeler yukarıdaki oyuncuya dönük kaynaklardan ve genel anlatı tasarımı pratiğinden uyarlanmıştır.
Detroit'ten hiçbir sahne, metin veya karakter kopyalanmamıştır.

## 2. Merak ve bağlılık kuralları (CİCO'da nasıl uygulandı)

| # | Kural | CİCO'daki karşılığı |
|---|---|---|
| 1 | **Soğuk açılış, gerçek bir yer, net bir baskı.** | Nevizade Sokağı; annenin bildirimi: kiraya 1.400 ₺ eksik. İlk seçimin iki tarafı bu sayıyla ölçülür. |
| 2 | **Oyuncu ne seçtiğini bilir, sonucunu bilmez.** | Sipariş kartlarında ücret ve not yazılı. "Açma, soru sorma" notu bir merak boşluğu açar. |
| 3 | **Gerçek ikilem: iki iyi ya da iki kötü.** | Para ↔ bir çocuğun babaannesi. Bilgi ↔ iz bırakmak. Kanıt ↔ çocuğu korumak. Yerdeki dost ↔ hesap sormak. |
| 4 | **İlk seçim gerçekten ayırır.** | İki katman bir daha birleşmez (test edilir). Her oynanış hikâyenin yalnızca bir yüzünü gösterir; diğeri tekrar oynatır. |
| 5 | **Her sahne sonunda cevapsız bir soru.** | A: "Kurye 2608." → "Seni bu yüzden seçtik." B: "Aslan diye bir kurye…" → "Kaza değildi." → kıpırdamayan nokta. |
| 6 | **Gecikmeli sonuç, hatırlatılarak.** | Reddedilen ilacın çocuğun olduğu A sonlarında öğrenilir. Açılan bant iki sahne sonra fark edilir. |
| 7 | **Kararın bedelini hemen hissettir, içeriğini söyleme.** | Önemli kararlardan sonra kısa bildirim: "Kabile Şefi bunu hatırlayacak.", "Birinin ilacı bu gece gecikecek." (Telltale'in "X bunu hatırlayacak" yaklaşımı; boş vaat olmasın diye her bildirimin karşılığı hikâyede var.) |
| 8 | **Kilitli seçenekleri göster.** | 🔒 "İçinde ne olduğunu biliyorum." / 🔒 Gazeteciye gönder. Kilitliyken ipucu cümlesiyle görünür. |
| 9 | **Kararsızlık da bir karardır.** | Altı süreli kararın hepsinde zaman aşımı ayrı bir anlatıdır, hata değil. |
| 10 | **Başarısızlık = başka bir hikâye.** | A: düşmek ROTA'nın risk listesini açar. B: matbaada donakalmak Kara Kutu'ya götürür. |
| 11 | **Seçimsiz sahnelerle nefes.** | Okulun önü (A), eczane ve mendilci çocuk (B). |
| 12 | **Akış şeması: yol görünür, içerik gizli.** | Keşfedilmemiş düğümler "???", keşif yüzdesi. Önceki oyunlar ayrı renkte. |
| 13 | **Sonda oyuncuya kendi hikâyesini anlat.** | Seçimlerden kurulan, seslendirilecek kapanış metni (`epilogue-voiceover.md`). |
| 14 | **Mobil: kısa vuruşlar, başparmak bölgesi, ekranda yazı yok.** | Vuruş ≤ 120, seçenek ≤ 60 karakter (test edilir). Kartlar ekranın alt üçte birinde, en az 44pt. |

**Duyarlılık:** Hikâye, ilham alınan gerçek kişinin ölüm biçimini **göstermez ve ima etmez**. Cico'nun hikâyesi onur, hafıza ve sistem üzerinedir.
Sonda kısa bir destek satırı (`ui.support`) vardır. Bu, WHO'nun intihar haberciliği/temsil ilkeleriyle uyumludur ve metni kolayca düzenlenebilir.

---

## 3. Seçim düğümleri

### Ortak

**K1 — `c1_s02_orders` · İki Talep (15 sn)** · *hikâyeyi iki katmana ayırır*
- **Bilinen:** Kiraya 1.400 ₺ eksik. Paket: 1.500 ₺, "Açma. Soru sorma." İlaç: 85 ₺, "Babaannem yalnız."
- **Kapalı paket** → Katman A (`c1_a1_printhouse`). `route = 'envelope'`. Bildirim: "Birinin ilacı bu gece gecikecek."
- **İlaç** → Katman B (`c1_b1_pharmacy`). `route = 'medicine'`, `earnings += 85`. Bildirim: "Kira bu ay da eksik kalacak."
- **Zaman aşımı** → Katman A. `system_chose = true`. Sonda ve epilogda hatırlanır.
- **Birleşme:** Yok.

### Katman A — Paket

**K2 — `c1_a1_printhouse` · Matbaa (süresiz)**
- **Bandı kaldır** → okul. `seal_broken`, `suspicion +1`, ipucu `drive`. Bildirim: "Bu bandı başkaları da görecek."
- **Dokunma** → okul.
- **Gecikmeli:** K3'te yüzleşmeyi açar; adam bandı fark eder; teslim edilirse çatıda şüphe +1; kaçışta basamaklar riskli olur.

**K3 — `c1_a3_tower` · Galata Kulesi (12 sn)**
- **Paketi ver** → çatı. `earnings += 1500`
- **Motora atla** → kovalamaca. `suspicion +1`. Bildirim: "Seni unutmayacaklar."
- **🔒 "İçinde ne olduğunu biliyorum."** (koşul: `drive`) → ikinci teklif
- **Zaman aşımı** → çatı. `hesitated`, `earnings += 750`

**K4 — `c1_a4_rooftop` · Çatı (süresiz)**
- **Kabile'ye yaz** → *Kabile*. `suspicion +1`
- **Sus** → *Sessizlik*

**K5 — `c1_a5_chase` · Yüksek Kaldırım (8 sn, aksiyon)**
- **Basamaklar** → her zaman *Düşüş* ("Uçuyorum ulan!", "limon"); macera seçeni asıl ipucunu (risk listesi) bulur
- **Pasaj** → sabaha kadar saklanır, *Paket Bende*
- **Pasaj** → *Paket Bende* (plaka görülür)
- **Zaman aşımı** → *Düşüş*

**K6 — `c1_a6_second_offer` · İkinci Teklif (10 sn)**
- **"Tamam. Nereye götürüyorum?"** → *Masa*
- **Reddet ve kaç** → kovalamaca. `suspicion +1`
- **Zaman aşımı** → *Masa* (sessizlik "evet" sayılır)

### Katman B — İlaç

**K7 — `c1_b2_kid` · mendilci çocuk (süresiz)**
- **"Fotoğrafı bana at."** → bulvar. `kid_involved`, ipucu `matbaa_photo`. Bildirim: "mendilci çocuk artık bu işin içinde."
- **"Sil onu. Kapını kilitle."** → bulvar. Bildirim: "mendilci çocuk güvende. Kanıt değil."
- **Gecikmeli:** Fotoğraf hastanede gazeteci seçeneğini açar.

**K8 — `c1_b3_boulevard` · Tarlabaşı Bulvarı (12 sn)** · *Katman B'nin kırılma noktası*
- **Kabile Şefi'nin yanında kal** → hastane. `chief = 'stayed'`. Bildirim: "Kabile Şefi bunu hatırlayacak."
- **Arabanın peşine düş** → matbaa. `chief = 'chased'`. Bildirim: "Kabile Şefi'ni yerde bıraktın."
- **Zaman aşımı** → hastane. `hesitated` (ambulans gelir, araba kaybolur)

**K9 — `c1_b4_hospital` · Taksim İlk Yardım (süresiz)**
- **Kabile'ye yaz: "Yarın gece kimse çıkmasın."** → *Kontak Kapatma*
- **🔒 Fotoğrafı gazeteciye gönder** (koşul: `matbaa_photo`) → *Manşet*

**K10 — `c1_b5_printhouse` · Matbaa (10 sn, aksiyon)**
- **İçeri gir** → *Kara Kutu* (ipucu `risk_list`)
- **Camdan fotoğraf çek ve kaç** → *Kanıt*
- **Zaman aşımı** → *Kara Kutu* (kapı arkasından açılır)

---

## 4. Durum değişkenleri

| Değişken | Katman | Değiştiği yer | Kullanıldığı yer |
|---|---|---|---|
| `route` | ortak | K1 | Katman seçimi; epilog |
| `system_chose` | ortak | K1 zaman aşımı | A sonları; epilog |
| `seal_broken` | A | K2 | Okul, kule metinleri; çatıda şüphe +1; epilog |
| `suspicion` | A | K2, K3, çatı girişi, K4, K6 | K5 basamak sonucu; Kabile sonu tehdidi |
| `escape_route` | A | K5 | Bilgi amaçlı (basamaklar → Düşüş, pasaj → Paket Bende) |
| `kid_involved` | B | K7 | Epilog |
| `chief` | B | K8 | Epilog |
| `earnings` | ortak | K1 (+85), K3 (+1500 / +750) | Sonlarda kira; özet ekranı |
| `hesitated` | ortak | K3, K6, K8, K10 zaman aşımı | Çatı, Masa, hastane, Kara Kutu metinleri; epilog |

| İpucu | Kazanıldığı yer | Etkisi |
|---|---|---|
| `drive` | K2 | K3'te yüzleşmeyi açar; Paket Bende metni |
| `knows_name` | Galata Kulesi girişi | A'nın ana gizemi: "Kurye 2608" |
| `risk_list` | Düşüş (A), Kara Kutu (B) | İlk seçimde ROTA'nın neden onu seçtiğini açıklar |
| `matbaa_photo` | K7 | K9'da gazeteci seçeneğini açar |
| `not_accident` | Tarlabaşı Bulvarı girişi | B'nin ana gizemi |

## 5. İnce göndermeler

Kaynakları oyunda hiçbir yerde açıklanmaz; anlayan anlar. `tests/media-i18n.test.js` bu ifadelerin yanlışlıkla silinmesini engeller.

| İfade | Nerede |
|---|---|
| "Kabile", "Kabile Şefi" | Kuryelerin grubu ve Kabile Şefi (açılış, B) |
| "Hayatta kalın, bir ömür boyu motosiklet sürün." | Açılışta Kabile Şefi'nin mesajı (herkes görür) |
| "arabacılar", "demir kafes" | Açılış; Galata Kulesi ve Yüksek Kaldırım'daki siyah araba (A); Kabile Şefi'u sıkıştıran araba (B) |
| "fıtı fıtı" | Okulun önünde ağır çekim (A) |
| "babuş", "Gidecek hep daha fazla yol var." | Kabile Şefi yerdeyken (B); Kabile'nin son mesajı (B); anma ekranı |
| "freni limon sıkar gibi" | Basamaklardan kaçış ve düşüş (A) |
| "Düştün babuş, olabilir. Neyse ki korumaların üstündeydi." / "Düşmeyi bilmek mi? Kel motosiklet eğitmenlerinin uydurduğu bir palavra." | Düşüş sonu (A): kask onu korur, kulağında Kabile Şefi'nin sesi |
| "Uçuyorum ulan!" | Basamaklara dalarken, düşüşten hemen önce (A) |

## 6. Anma

Anma metni (`ui.dedication`) başlık ekranında **yer almaz**. Yalnızca bir sona ulaşıp "Devam"a basan oyuncuya ayrı bir ekranda gösterilir: anma metni, "Gidecek hep daha fazla yol var." satırı ve destek satırı.

## 7. Yeni sahne/seçim ekleme

1. `src/story/chapter1.js` içine sahne nesnesini ekle (`scene_id`, `scene_type`, `text`, `choices`/`next`, `video_asset: null`, `notes`).
2. `src/i18n/tr.js` ve `en.js` içine `scenes.<id>` metinlerini ekle.
3. `npm run flow` ile şemayı güncelle, `npm test` ile doğrula. Validator şunları yakalar: olmayan hedef, ulaşılamayan sahne, tanımsız değişken, eksik çeviri, takılma.
