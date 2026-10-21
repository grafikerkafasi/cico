# Görsel Devamlılık — Sabitler

Bu kurallar **her** AI görsel/video üretiminde değişmez. Her üretim promptuna "Karakter sabitleri" bloğu olarak eklenmelidir.
Referans: geliştiricinin karakter sayfası (önden/yandan/arkadan/üst çapraz) ve scooter sayfası (5 açı).

## Stil

**Pixar tarzı stilize 3D**, AI ile üretilmiş görseller ve videolar. Yumuşak hatlar, büyük ve ifadeli gözler, sıcak-soğuk kontrastlı sinematik ışık.
Dünya stilize ama gerçekçi dokulu: ıslak taş, sis, neon yansımaları. Gerçek kişi fotoğrafı kullanılmaz; bütün karakterler stilize.

## Aslan (Cico)

| Öğe | Sabit |
|---|---|
| Cinsiyet / yaş | Erkek, 26 |
| Yüz | Hafif kirli/seyrek sakal; yorgun ama karizmatik bakış |
| Üst | **Yeşil kapüşonlu üst** (koyu orman/petrol yeşili) |
| Rozet | **Sol omuzda net görünen "26" rozeti** (yuvarlak, açık renk zemin) |
| Kask | Çeneden **yarı açık** kask; vizör kalkık. **Kaskın arkasında dijital/ışıklı aparat YOK** |
| Alt | Koyu pantolon, koyu ayakkabı |

## Scooter

| Öğe | Sabit |
|---|---|
| Renk | **Yeşil** (kapüşonla uyumlu koyu yeşil), klasik/vespa tipi gövde |
| Çanta | **Yeşil teslimat çantası/kutusu**, arka taşıyıcıda |
| Plaka | **34 AEA 8430** |
| Marka | **Logo/marka yok**. Gövdede, çantada, kaskta yazı yok |

## Anlamlar (oyunda açıklanmaz, keşfedilir)

- **26 rozeti:** Hasan Cihan Aslan'ın aramızdan ayrıldığı yaş. Oyunda hiçbir karakter rozetin anlamını söylemez. Yalnızca görünür kalır.
- **34 AEA 8430:** Geliştiricinin kişisel göndermesi. Oyunda açıklanmaz; plaka yalnızca görünür ve hikâyede geçer (`c1_end_a_tribe`, `c1_end_a_escape`, `c1_end_b_evidence`).
- **Jargon:** Bazı kelime ve ifadeler (bkz. `choice-design.md` → "İnce göndermeler") anlayanın anlayacağı göndermelerdir. Kaynakları oyunda ya da görsellerde belirtilmez.
- **Okul:** "Galata Feneri İlkokulu" kurgusaldır. Gerçek bir okul adı kullanılmamıştır.
- **ROTA:** Kurgusal kurye uygulaması. Gerçek bir şirketin logosu/arayüzü kullanılmaz.

## Üretim kuralları

1. **Görüntüde yazı yok.** Telefon ekranları, tabelalar, mesajlar, listeler bulanık ya da okunmaz olmalı. Tüm okunacak metin UI kartlarında, dile göre gösterilir.
   (İstisna: atmosfer için okunmayan neon tabelalar. Ama oyunla ilgili bilgi taşımamalı.)
2. Plaka **yalnızca** plaka göründüğünde doğru olmalı. Plakaya yakın plan gerekirse ayrı kontrol edilmeli (AI araçları rakamları bozabilir).
3. Rozet her açıdan **sol omuzda**. Ayna görüntü/flip kullanılmamalı; flip rozeti sağa taşır.
4. Gece sahnelerinde renk paleti: koyu lacivert/siyah zemin, neon kehribar ve pembe vurgular, karakter yeşili. Okul sahnesi (`c1_a2_school`) daha soluk/desatüre ve ağır çekim.
5. Şiddet gösterilmez; düşüş (`c1_end_a_fall`) ve Kabile Şefi'nin kazası (`c1_b3_boulevard`) kesme ile anlatılır. Kan yok.
6. Yüzü belirsiz figürler: staj anısındaki çocuklar, paltolu adamın ilk görünüşü.

## Prompt bloğu (kopyala-yapıştır)

```
Style: Pixar-style stylized 3D animation, cinematic lighting.
Character constants: Aslan "Cico", 26-year-old Turkish man, light patchy stubble, tired but charismatic.
Dark forest-green hoodie with a clearly visible round "26" badge on the LEFT shoulder.
Open-face helmet, half open at the chin, visor up, NO lights or digital gadgets on the back of the helmet.
Dark trousers, dark shoes. Green classic scooter with green delivery box, licence plate "34 AEA 8430",
no brand names or logos anywhere. No readable on-screen text. Night Istanbul (Beyoğlu/Galata), fog, neon.
Vertical 9:16 frame, subject centred, safe margins top and bottom for UI cards.
```
