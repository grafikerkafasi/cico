# Oyun Sonu Metni — Seslendirme Senaryosu

Bölüm bitince, özet ekranından önce, oyuncunun seçimlerinden kurulan kısa bir metin okunur.
Ekranda her satır tek başına belirir (yaklaşık 4 saniyede bir, dokununca hemen geçer). Yayın sürümünde bu satırlar dramatik bir sesle seslendirilecek.

- Kaynak: `src/story/chapter1.js` → `epilogue` (hangi satırın ne zaman okunduğu), `src/i18n/tr.js` → `epilogue` (metinler).
- Her oynanışta **6–9 satır** okunur (test edilir). Satırlar her zaman aşağıdaki sırayla gelir.
- Ses: ikinci tekil şahıs, sakin, ağır, yargılamayan. Bir anlatıcı değil, bir tanık.

## Kayıt için satırlar

Her satır **ayrı bir dosya** olarak kaydedilmeli; oyun seçimlere göre birleştirir. Dosya adı = anahtar (ör. `epilogue.open.m4a`).

| Sıra | Anahtar | Ne zaman | Metin |
|---|---|---|---|
| 1 | `open` | Her zaman | O gece Nevizade'de herkes gülüyordu. Bir kurye hariç. |
| 2 | `rota` | İlk seçimde süre doldu | İki talep vardı. Sen seçmedin. ROTA senin yerine seçti. |
| 2 | `money` | Paketi seçti | İki talep vardı. Sen parayı seçtin. Kira yanmasın diye. |
| 2 | `medicine` | İlacı seçti | İki talep vardı. Sen bir çocuğun babaannesini seçtin. Kirayı değil. |
| 3 | `opened` | A: paketi açtı | Bandı kaldırdın. Bazı şeyler bir tırnak kadar aralanır ve bir daha kapanmaz. |
| 3 | `closed` | A: paketi açmadı | Paketi açmadın. Bilmemek de insanın sırtında taşıdığı bir yüktür. |
| 3 | `photo` | B: fotoğrafı aldı | Fotoğrafı aldın. Bir çocuğun cesareti artık senin de yükün. |
| 3 | `no_photo` | B: fotoğrafı sildirdi | Fotoğrafı sildirdin. Bir çocuğu korudun, kanıtı kaybettin. |
| 4 | `stayed` | B: şefin yanında kaldı | Şefin elini bırakmadın. |
| 4 | `chased` | B: arabayı kovaladı | Şefi ambulansa bıraktın ve öfkenin peşine düştün. |
| 5 | `froze` | Bölüm içinde bir kez bile donakaldı (teklif, ikinci teklif, kaza yeri, matbaa) | Bir an durdun. O bir anda, senin yerine başkaları karar verdi. |
| 6 | `silence` | Son: Sessizlik | Parayı aldın ve sustun. Haberlerde bir kuryenin adı söylenmedi. |
| 6 | `tribe` | Son: Kabile | Kabile'ye yazdın. Bir kurye konuşunca, yollar da konuşmaya başlar. |
| 6 | `escape` | Son: Paket Bende | Kaçtın. Kanıt artık senin elinde. Ve onlar seni arıyor. |
| 6 | `fall` | Son: Düşüş | Düştün. Ama düşerken neden seçildiğini öğrendin. |
| 6 | `desk` | Son: Masa | Sıcak bir masa seçtin. Artık kuryeler senin için yeşil birer nokta. |
| 6 | `strike` | Son: Kontak Kapatma | Kabile'yi topladın. Bir gece boyunca şehirde tek bir kurye motoru çalışmadı. |
| 6 | `headline` | Son: Manşet | Kanıtı yayımladın. Artık bütün şehir aynı soruyu soruyor. |
| 6 | `blackbox` | Son: Kara Kutu | O kapıdan içeri girdin. Ve adını o ekranda gördün. |
| 6 | `evidence` | Son: Kanıt | Fotoğrafı çektin ve kaçtın. Duran noktayı artık herkes görecek. |
| 7 | `dots` | Her zaman | Her kurye bir ekranda yeşil bir noktadır. Durana kadar. |
| 8 | `on_road` | Masa dışındaki tüm sonlar | Ama sen hâlâ yoldasın, Cico. |
| 8 | `off_road` | Son: Masa | Ve sen artık yolda değilsin, Cico. |

Toplam **23 satır** kaydedilir. Bir oynanış örneği (B · fotoğraf · yanında kaldı · Kontak Kapatma):

> O gece Nevizade'de herkes gülüyordu. Bir kurye hariç.
> İki talep vardı. Sen bir çocuğun babaannesini seçtin. Kirayı değil.
> Fotoğrafı aldın. Bir çocuğun cesareti artık senin de yükün.
> Şefin elini bırakmadın.
> Kabile'yi topladın. Bir gece boyunca şehirde tek bir kurye motoru çalışmadı.
> Her kurye bir ekranda yeşil bir noktadır. Durana kadar.
> Ama sen hâlâ yoldasın, Cico.

## Kayıt önerileri

- Her satır ayrı dosya. Başında ve sonunda ~300 ms sessizlik. Satırlar arasında oyun ~0,8 sn boşluk bırakacak.
- Satır 1 ve 7–8 her oynanışta duyulur: en çok özen bunlara.
- Satır 2'deki üç çeşit ("İki talep vardı…") aynı tonla başlamalı, çünkü oyuncu tekrar oynayınca farkı duyar.
- Format: WAV 48 kHz / 24 bit kayıt, oyunda AAC (`.m4a`) 48 kHz, −16 LUFS civarı.
- İngilizce (ve ileride diğer diller) için aynı anahtarlarla ayrı bir set kaydedilir.

**Henüz uygulanmamış:** Ses dosyalarını oynatma. Satırlar şimdilik ekranda metin olarak gösteriliyor. Ses eklenince her satırın süresi, dosyanın uzunluğuna göre ayarlanacak (şu an sabit ~4 sn).
