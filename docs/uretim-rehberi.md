# CİCO · Bölüm 1 "Gece Vardiyası" — Görsel ve Video Üretim Rehberi

> Bu dosya oyunun verisinden üretilir (`npm run bible`). Elle düzenlemeyin; promptlar `production/shots.js` içinde.

## Nasıl kullanılır

1. **ChatGPT'de yeni bir sohbet aç**, bu dosyayı yükle ve aşağıdaki talimatı ilk mesaj olarak yapıştır. Karakter ve scooter referans sayfalarını da ekle.
2. Sonra yalnızca kodu yaz: **"O1"**, **"A3"**, **"SB2"**… ChatGPT o sahnenin görselini üretir. Kısa kod ile oyundaki `scene_id` (ör. A3 = `c1_a3_tower`) aynı sahnedir; ikisini de kullanabilirsin.
3. Görseli **kodla adlandırarak** indir (ör. `A3.png`).
4. **Google Flow**'da "görselden videoya" (Frames to Video) seç, en-boy oranını **dikey 9:16** yap, görseli başlangıç karesi olarak yükle ve sahnenin **video promptunu** yapıştır. Döngü sahnelerinde, destekleniyorsa aynı görseli bitiş karesi olarak da ver.
5. Videoyu da kodla adlandır (`A3.mp4`) ve görselle birlikte bana gönder; oyuna ben eklerim.

**Önerilen üretim sırası:** önce bir katmanı baştan sona üret (O1 → O2 → A1 → … ), sonra diğerini. Böylece her görsel bir öncekine bakılarak üretilir.

### ChatGPT'ye ilk mesaj (kopyala-yapıştır)

```text
You are the production artist for "CİCO", a mobile interactive story game set in night-time Istanbul.
The attached markdown file is the production bible. It contains a global style, character sheets, location sheets and one section per scene, each identified by a short code (O1, O2, A1…A6, B1…B5, SA1…SA5, SB1…SB4).

When I send you a scene code (or its scene_id, e.g. "A3" or "c1_a3_tower" — both name the same scene):
1. Find that scene's section and generate exactly ONE image in a vertical 9:16 portrait frame, using its "Görsel promptu" block.
2. Keep every character IDENTICAL to the character sheets and to the images you already created in this chat (face, outfit, colours, the "26" badge on Cico's LEFT shoulder, the half-open helmet, the green scooter with plate 34 AEA 8430 and no logos).
3. Keep visual continuity with the scene listed as "Önceki sahne" if you created it in this chat: same lighting, weather, wardrobe state, props.
4. Place the objects listed under "Seçim noktaları" clearly visible at the given positions (percent from the left / from the top). The game puts tappable markers there.
5. Never add readable text, captions, UI, logos or watermarks. Phone screens show only a glow. Keep the top 14% and the bottom 20% free of important details.
6. After the image, write one short line in Turkish: the scene code and any continuity choice you made.
If I attach reference images, treat them as canonical.
```

## Ortak stil

```text
Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain.
Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
```

**Kurallar:**

- No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted.
- Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters.
- No logos or brand names on any vehicle, helmet, bag or clothing.
- No UI, captions, subtitles, watermarks or borders in the image.
- No blood or graphic injury. Falls and accidents are shown by aftermath and implication.
- No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes.
- Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D.
- Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.

**Kaçınılacaklar:** `text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore`

**Ekran yerleşimi (9:16):** üst %14 bildirim kartları ve duraklat düğmesi · alt %20 altyazı · seçim noktaları genelde %30–75 yükseklik arasında.

## Karakter ve araç kartları

### Cico (Aslan)

Ana karakter. Değişmez sabitler — her sahnede aynı.

*Referans:* Geliştiricinin karakter sayfası (önden / yandan / arkadan / üst çapraz) — her üretimde referans olarak ekle.

```text
Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
```

### Cico'nun scooter'ı

Cico'nun aracı. Plaka yalnızca plakaya yakın planda okunur.

*Referans:* Geliştiricinin scooter sayfası (5 açı).

```text
Cico's scooter: classic vespa-style scooter, dark green, round headlight, green delivery box on the rear rack, licence plate "34 AEA 8430", absolutely no logos or brand marks.
```

### Kabile Şefi

Yirmi yıllık kurye, kuryelerin "şefi". Koruyucu ekipmanını hiç çıkarmaz (hikâyedeki "korumaların üstündeydi" sözü).

```text
Tribe Chief: courier in his early 50s, broad shoulders, grey stubble and thick grey moustache, deep laugh lines, warm but tough eyes. Black armoured riding jacket with visible elbow and shoulder protectors, knee guards over dark jeans, worn full-face helmet covered in faded stickers (no readable words). Rides an older dark-blue scooter with a black delivery box.
```

### Mendilci çocuk

İstiklal'de mendil satan 11 yaşında çocuk. Cico'ya "Hocam" der.

```text
Tissue seller kid: 11-year-old boy, thin, messy black hair, big curious bright eyes, faded oversized red hoodie with sleeves rolled up, worn white sneakers, carries a small clear plastic box of tissue packets. Clever, street-smart expression.
```

### Paltolu adam

ROTA'nın içinden biri. Kimse adını bilmiyor; o herkesinkini biliyor. Hiç ıslanmaz.

```text
Man in the coat: tall man in his mid-40s, long charcoal wool coat, black leather gloves, clean-shaven, slicked-back dark hair with grey temples, calm unreadable half smile, perfectly dry even in rain. Stands very still. Holds a closed black umbrella.
```

### Siyah araba ("demir kafes")

Şebekenin aracı. Plakası okunmaz.

```text
Black car: black sedan with fully tinted windows, no logos, plate unreadable, headlights often the only visible part, reads as a dark "iron cage".
```

### Babaanne (yalnızca B1'de arka planda)

Yüzü net görünmez.

```text
Elderly woman in a light headscarf sitting on a worn sofa in the background, softly out of focus.
```

## Mekân kartları

### Nevizade Sokağı

*Kullanıldığı sahneler:* O1, O2, SB1

*Referans:* O1 görseli (assets/scenes/c1_s01_nevizade.jpg) bu mekânın kanonik hâli.

```text
Nevizade Street, Beyoğlu at night: narrow wet cobblestone street, rows of glowing tavern and shop neon signs (döner, barber pole, café), warm windows, light fog, distant silhouettes of people, a moody moonlit sky between old buildings, puddles reflecting neon. Cico leans on a weathered wall on the right.
```

### Tarlabaşı · eski matbaa

*Kullanıldığı sahneler:* A1, A1a, A1b, B5, SB4

```text
Back street in Tarlabaşı: a narrow old print shop with its sign torn off (only screw holes and a pale rectangle remain), half-raised rusty roller shutter, a heavy green wooden door with peeling paint, a low basement window glowing faintly blue, cracked plaster walls, a single sodium street lamp, wet asphalt.
```

### Galata Feneri İlkokulu (kurgusal)

*Kullanıldığı sahneler:* A2

```text
A small old primary school in Galata at night: tall iron railings, a noticeboard with children's crayon drawings, dark classrooms with chairs upturned on desks visible through windows, a single lamp, soft desaturated palette, quiet and still.
```

### Galata Kulesi meydanı

*Kullanıldığı sahneler:* A3, A6

```text
The foot of Galata Tower at night: empty cobbled square, the tower lit warm from below rising into the frame, closed café chairs stacked, wet ground reflecting the tower lights, narrow streets sloping away.
```

### Galata'da bir çatı

*Kullanıldığı sahneler:* A4

```text
A Galata rooftop at night: low parapet, satellite dishes and water tanks, the city lights of Beyoğlu and the Golden Horn below, distant tiny moving headlights of couriers on the roads.
```

### Yüksek Kaldırım

*Kullanıldığı sahneler:* A5, A5b, A5c, SA4

```text
Yüksek Kaldırım: very steep wide stone steps descending between old buildings, wet and glistening, handrails, shuttered shops, a dark arched side passage opening on the right.
```

### Karaköy · şafak

*Kullanıldığı sahneler:* SA3

```text
Karaköy waterfront at dawn: shuttered fish stalls with striped awnings, seagulls, the first blue-pink light over the Golden Horn, wet pavement.
```

### Kahvehane · sabah

*Kullanıldığı sahneler:* SA1, SA2

```text
A small old Istanbul teahouse in the morning: tulip tea glasses, worn wooden tables, a wall-mounted TV glowing (screen content unreadable), morning light through steamy windows.
```

### ROTA ofisi

*Kullanıldığı sahneler:* SA5

```text
A dark modern control room at night: a warm desk lamp, a large wall screen with an abstract city map made of hundreds of tiny green dots (no text), glass walls, sterile and quiet.
```

### Nöbetçi eczane / Dolapdere

*Kullanıldığı sahneler:* B0, B1, B2

```text
A night pharmacy with a glowing green cross, then a crumbling Dolapdere apartment entrance with chipped stairs, a dim yellow stairwell bulb and a half-open wooden door.
```

### Tarlabaşı Bulvarı

*Kullanıldığı sahneler:* B2a, B3, B3a

```text
Tarlabaşı Boulevard at night: wide multi-lane road, orange sodium lights, wet asphalt, a kerb and pavement, side streets disappearing into darkness, distant ambulance lights.
```

### Taksim İlk Yardım

*Kullanıldığı sahneler:* B4, SB2

```text
A hospital emergency corridor before dawn: cold fluorescent light, plastic chairs, couriers in jackets sitting and standing with helmets in their laps, a tired night shift atmosphere.
```

### Beyoğlu · ıslak cadde

*Kullanıldığı sahneler:* O3

```text
A narrow wet street in Beyoğlu at night: shuttered shops, warm street lamps streaking with motion blur, reflections on wet asphalt, old facades with balconies. No Galata Tower.
```

### Kuleye çıkan yokuş

*Kullanıldığı sahneler:* A3a

```text
A steep narrow cobbled street climbing towards Galata Tower at night, wet stones, warm lamps on old facades; the tower appears only as a distant lit silhouette at the top of the slope.
```

### Sınıf (hayal)

*Kullanıldığı sahneler:* 

```text
A bright primary school classroom in the morning: green chalkboard with a simple chalk world map and arrows (no letters), wooden desks, sunlight through tall windows, dreamy overexposed warm glow.
```

### Matbaanın içi (ROTA'nın gizli merkezi)

*Kullanıldığı sahneler:* SB3

```text
Inside the old print shop: abandoned printing presses pushed aside, a row of glowing monitors on makeshift tables showing maps of tiny green dots (no text), cables everywhere, a desk with a printed list (unreadable).
```

## Sahne dizini

| Kod | scene_id | Sahne | Önceki | Mekân |
|---|---|---|---|---|
| **O1** | `c1_s01_nevizade` | Nevizade Sokağı | — | Nevizade Sokağı |
| **O2** | `c1_s02_orders` | İki Talep | O1 | Nevizade Sokağı |
| **O3** | `c1_s03_ride` | Yolda | O2 | Beyoğlu · ıslak cadde |
| **A1** | `c1_a1_printhouse` | Matbaa | O3 | Tarlabaşı · eski matbaa |
| **A1a** | `c1_a1a_inside` | Kepenk | A1 | Tarlabaşı · eski matbaa |
| **A1b** | `c1_a1b_mount` | Yola Çıkış | A1, A1a | Tarlabaşı · eski matbaa |
| **A2** | `c1_a2_school` | Galata Feneri İlkokulu | A1b | Galata Feneri İlkokulu (kurgusal) |
| **A3a** | `c1_a3a_cutoff` | Yokuş | A2 | Kuleye çıkan yokuş |
| **A3** | `c1_a3_tower` | Galata Kulesi | A3a | Galata Kulesi meydanı |
| **A4** | `c1_a4_rooftop` | Çatı | A3 | Galata'da bir çatı |
| **A5** | `c1_a5_chase` | Yüksek Kaldırım | A3, A6 | Yüksek Kaldırım |
| **A5b** | `c1_a5b_fall` | Basamaklar | A5 | Yüksek Kaldırım |
| **A5c** | `c1_a5c_paper` | Zarf | A5b | Yüksek Kaldırım |
| **A6** | `c1_a6_second_offer` | İkinci Teklif | A3 | Galata Kulesi meydanı |
| **B0** | `c1_b0_pharmacy` | Nöbetçi Eczane | O3 | Nöbetçi eczane / Dolapdere |
| **B1** | `c1_b1_pharmacy` | Dolapdere | B0 | Nöbetçi eczane / Dolapdere |
| **B2** | `c1_b2_kid` | Mendilci Çocuk | B1 | Nöbetçi eczane / Dolapdere |
| **B2a** | `c1_b2a_chief` | Kabile Şefi | B2 | Tarlabaşı Bulvarı |
| **B3** | `c1_b3_boulevard` | Tarlabaşı Bulvarı | B2a | Tarlabaşı Bulvarı |
| **B3a** | `c1_b3a_tail` | Takip | B3 | Tarlabaşı Bulvarı |
| **B4** | `c1_b4_hospital` | Taksim İlk Yardım | B3 | Taksim İlk Yardım |
| **B5** | `c1_b5_printhouse` | Matbaa | B3a | Tarlabaşı · eski matbaa |
| **SA1** | `c1_end_a_silence` | Sessizlik | A4 | Kahvehane · sabah |
| **SA2** | `c1_end_a_tribe` | Kabile | A4 | Kahvehane · sabah |
| **SA3** | `c1_end_a_escape` | Paket Bende | A5 | Karaköy · şafak |
| **SA4** | `c1_end_a_fall` | Düşüş | A5c | Yüksek Kaldırım |
| **SA5** | `c1_end_a_desk` | Masa | A6 | ROTA ofisi |
| **SB1** | `c1_end_b_strike` | Kontak Kapatma | B4 | Nevizade Sokağı |
| **SB2** | `c1_end_b_headline` | Manşet | B4 | Taksim İlk Yardım |
| **SB3** | `c1_end_b_blackbox` | Kara Kutu | B5 | Matbaanın içi (ROTA'nın gizli merkezi) |
| **SB4** | `c1_end_b_evidence` | Kanıt | B5 | Tarlabaşı · eski matbaa |

---

## O1 · Nevizade Sokağı · `c1_s01_nevizade`

| | |
|---|---|
| Kod / scene_id | **O1** · `c1_s01_nevizade` |
| Tür | Sinematik (seçimsiz) |
| Önceki sahne | — (oyunun başı) |
| Sonraki sahne | **O2** İki Talep (`c1_s02_orders`) |
| Mekân | Nevizade Sokağı |
| Kadro | [Cico (Aslan)] + [Cico'nun scooter'ı] |
| Zaman / ışık | 23:50, gece, ıslak zemin, hafif sis |
| Dosya adı | `O1.png` (görsel) · `O1.mp4` (video) · döngü |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Soğuk açılış: Nevizade Sokağı. Kira açığı (1.400 ₺) ve Kabile grubu burada ekilir.

**Yönetmen notu (görsel / video):** Nevizade Sokağı, gece, sis, meyhane ışıkları, kahkaha ve müzik. Cico scooter'ına yaslanmış, kollar kavuşturulmuş. Yüze yakın plan, gözler kısılır. Telefon titrer. Ekranda yazı YOK.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Nevizade Sokağı. Gece yarısına az var.
- *Anlatı:* Meyhanelerden kahkaha, bir köşeden darbuka. Arabacılar demir kafeslerinde kornaya asılmış.
- *Tanıtım slaytı — Cico:* Aslan. Mahallede herkes Cico der. Yirmi altı yaşında, gece kuryesi.
- *Anlatı:* Herkes eğleniyor. Cico çalışıyor.
- *Telefon mesajı — Kabile · Kabile Şefi:* Tarlabaşı'nda arabacılar yolu kapatmış. Hayatta kalın, bir ömür boyu motosiklet sürün.
- *Tanıtım slaytı — Kabile Şefi:* Yirmi yıldır bu şehrin her yokuşunu bilir. Kuryeler ona "şef" der.
- *Telefon mesajı — Annem:* Oğlum, kiraya 1.400 lira eksik. Sen üzülme, hallederiz.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Nevizade Sokağı] Nevizade Street, Beyoğlu at night: narrow wet cobblestone street, rows of glowing tavern and shop neon signs (döner, barber pole, café), warm windows, light fog, distant silhouettes of people, a moody moonlit sky between old buildings, puddles reflecting neon. Cico leans on a weathered wall on the right.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Cico's scooter: classic vespa-style scooter, dark green, round headlight, green delivery box on the rear rack, licence plate "34 AEA 8430", absolutely no logos or brand marks.
[SCENE O1 · c1_s01_nevizade] Cico leans against the weathered wall on the right side of Nevizade Street, arms crossed, watching people laugh and drink in the taverns. His green scooter is parked in the foreground lower half, mirrors catching neon. He looks tired but alert. Warm neon on the left, cool moonlight above.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Slow push-in towards Cico's face. Neon flickers, fog drifts, distant silhouettes walk and laugh, rain drops fall from a pipe. Near the end his eyes narrow slightly and his phone lights up his face. Ambient sound only: tavern laughter, a distant darbuka, light rain. No speech, no music. 8 seconds. Start and end on the same frame so the clip loops seamlessly (use this image as both first and last frame if available).
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] Kanonik açılış görseli zaten var (O1). Video bu görselden üretilmeli.

---

## O2 · İki Talep · `c1_s02_orders`

| | |
|---|---|
| Kod / scene_id | **O2** · `c1_s02_orders` |
| Tür | Karar · ⏱ 15 sn |
| Önceki sahne | **O1** Nevizade Sokağı (`c1_s01_nevizade`) |
| Sonraki sahne | **O3** Yolda (`c1_s03_ride`) |
| Mekân | Nevizade Sokağı |
| Kadro | [Cico (Aslan)] + [Cico'nun scooter'ı] |
| Zaman / ışık | O1 ile aynı an |
| Dosya adı | `O2.png` (görsel) · `O2.mp4` (video) · döngü |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** İLK KRİTİK SEÇİM — hikâye burada iki katmana ayrılır ve birleşmez. Zaman aşımı → ROTA paketi atar (Katman A).

**Yönetmen notu (görsel / video):** Telefona bakan Cico, omuz üstü; ekran içeriği görünmez. Bekleme döngüsü: ekrana bakış, nefes.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Tanıtım slaytı — ROTA:* Kuryelerin uygulaması. Her teslimatı, her durağı, her düşüşü kaydeder.
- *Anlatı:* İki talep. Tek kurye. Seçmediği başkasına düşecek.
- *Anlatı:* Kiraya 1.400 lira eksik.

**Seçim noktaları — bu nesneler görselde bu konumlarda net görünmeli:**

| Seçenek (oyunda) | Görselde ne olmalı | Konum (görselin yüzdesi; sol üst = 0,0) |
|---|---|---|
| Kapalı paket · Galata | telefonun üstünde süzülen paket kartı | x 52% · y 46% |
| İlaç · Dolapdere | telefonun sağında süzülen ilaç kartı | x 80% · y 48% |

**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Nevizade Sokağı] Nevizade Street, Beyoğlu at night: narrow wet cobblestone street, rows of glowing tavern and shop neon signs (döner, barber pole, café), warm windows, light fog, distant silhouettes of people, a moody moonlit sky between old buildings, puddles reflecting neon. Cico leans on a weathered wall on the right.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Cico's scooter: classic vespa-style scooter, dark green, round headlight, green delivery box on the rear rack, licence plate "34 AEA 8430", absolutely no logos or brand marks.
[SCENE O2 · c1_s02_orders] Same framing as O1: Cico has pulled out his phone and stares at the glowing screen (screen content not visible), surprised and tempted. The scooter and its green delivery box are clearly visible in the lower right foreground.
[MUST BE CLEARLY VISIBLE] telefonun üstünde süzülen paket kartı at about 52% from the left and 46% from the top; telefonun sağında süzülen ilaç kartı at about 80% from the left and 48% from the top.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Locked-off shot, almost still: phone glow pulses on Cico's face, his thumb hovers, fog drifts, neon reflections shimmer in puddles. Seamless loop: first and last frame identical. Ambient street sound only. 8 seconds. Start and end on the same frame so the clip loops seamlessly (use this image as both first and last frame if available).
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] Kanonik görsel O1 ile aynı (oyunda O2 de bu görseli kullanıyor). İstersen yalnızca telefona daha yakın bir varyasyon üret.

---

## O3 · Yolda · `c1_s03_ride`

| | |
|---|---|
| Kod / scene_id | **O3** · `c1_s03_ride` |
| Tür | Sinematik (seçimsiz) |
| Önceki sahne | **O2** İki Talep (`c1_s02_orders`) |
| Sonraki sahne | **A1** Matbaa (`c1_a1_printhouse`), **B0** Nöbetçi Eczane (`c1_b0_pharmacy`) |
| Mekân | Beyoğlu · ıslak cadde |
| Kadro | [Cico (Aslan)] + [Cico'nun scooter'ı] |
| Zaman / ışık | Gece yarısı |
| Dosya adı | `O3.png` (görsel) · `O3.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Kısa yol sahnesi; iki katmanın ortak son karesi. Buradan sonra yollar ayrılır.

**Yönetmen notu (görsel / video):** Beyoğlu, ıslak dar cadde, gece. Cico scooter'la hızla geçer; arkada akan sokak lambaları. Galata Kulesi yok.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Beyoğlu'nun ıslak sokakları. Cico gaza yükleniyor.
- *Anlatı:* Ekranda ROTA'nın çizgisi kıvrılıyor. Saat işliyor.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Beyoğlu · ıslak cadde] A narrow wet street in Beyoğlu at night: shuttered shops, warm street lamps streaking with motion blur, reflections on wet asphalt, old facades with balconies. No Galata Tower.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Cico's scooter: classic vespa-style scooter, dark green, round headlight, green delivery box on the rear rack, licence plate "34 AEA 8430", absolutely no logos or brand marks.
[SCENE O3 · c1_s03_ride] Dynamic low 3/4 front-side angle: Cico speeds through a wet Beyoğlu street on his green scooter towards the image-left, serious and focused; street lamps streak with motion blur behind him. No front plate.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Tracking shot alongside the scooter; lights streak past, water sprays from the tyres. Ambient: engine, rain hiss. 6 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] İki katmanın ortak son karesi: paket ya da ilaç görünmez, yalnızca sırttaki çanta.
- [ ] Galata Kulesi YOK.

---

## A1 · Matbaa · `c1_a1_printhouse`

| | |
|---|---|
| Kod / scene_id | **A1** · `c1_a1_printhouse` |
| Tür | Karar |
| Önceki sahne | **O3** Yolda (`c1_s03_ride`) |
| Sonraki sahne | **A1a** Kepenk (`c1_a1a_inside`), **A1b** Yola Çıkış (`c1_a1b_mount`) |
| Mekân | Tarlabaşı · eski matbaa |
| Kadro | [Cico (Aslan)] |
| Zaman / ışık | Gece yarısına 5 kala |
| Dosya adı | `A1.png` (görsel) · `A1.mp4` (video) · döngü |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Merak vs. güvenlik. Açmak bilgi verir (teklifte üçüncü seçeneği açar) ama iz bırakır (şüphe +1).

**Yönetmen notu (görsel / video):** Tarlabaşı, tabelası sökülmüş matbaa kapısı, eldivenli el, bantlı paket yakın plan. Bandın kalkmış köşesi.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Tarlabaşı. Tabelası sökülmüş eski bir matbaa.
- *Anlatı:* Eldivenli bir el mühürlü bir paket uzatıyor. Kapı kapanıyor.
- *Anlatı:* Bant bir köşeden kalkmış. Bir tırnak kadar.

**Seçim noktaları — bu nesneler görselde bu konumlarda net görünmeli:**

| Seçenek (oyunda) | Görselde ne olmalı | Konum (görselin yüzdesi; sol üst = 0,0) |
|---|---|---|
| Bandı kaldır, içine bak | Cico'nun elindeki bantlı paket | x 47% · y 47% |
| Dokunma, teslim et | sağ alttaki yeşil teslimat kutusu | x 82% · y 65% |

**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Tarlabaşı · eski matbaa] Back street in Tarlabaşı: a narrow old print shop with its sign torn off (only screw holes and a pale rectangle remain), half-raised rusty roller shutter, a heavy green wooden door with peeling paint, a low basement window glowing faintly blue, cracked plaster walls, a single sodium street lamp, wet asphalt.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[SCENE A1 · c1_a1_printhouse] Close-medium shot at the green door of the old print shop: a gloved hand withdraws into the dark doorway as Cico holds a heavy sealed package with red-and-white security tape in both hands at the centre of the frame. One corner of the tape is visibly lifted. His scooter waits in the lower left, delivery box open.
[MUST BE CLEARLY VISIBLE] Cico'nun elindeki bantlı paket at about 47% from the left and 47% from the top; sağ alttaki yeşil teslimat kutusu at about 82% from the left and 65% from the top.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Slight handheld feel: the door slams shut, Cico looks down at the package, his thumb hesitates over the lifted tape corner. Seamless loop of his hesitation. Ambient: distant traffic, a dog barking. No speech. 8 seconds. Start and end on the same frame so the clip loops seamlessly (use this image as both first and last frame if available).
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] Cico'nun kıyafeti ve kask durumu O1 ile aynı (kask çenede yarı açık).
- [ ] Zemin hâlâ ıslak; ışık sarı sokak lambası.

---

## A1a · Kepenk · `c1_a1a_inside`

| | |
|---|---|
| Kod / scene_id | **A1a** · `c1_a1a_inside` |
| Tür | Sinematik (seçimsiz) |
| Önceki sahne | **A1** Matbaa (`c1_a1_printhouse`) |
| Sonraki sahne | **A1b** Yola Çıkış (`c1_a1b_mount`) |
| Mekân | Tarlabaşı · eski matbaa |
| Kadro | [Cico (Aslan)] + [Cico'nun scooter'ı] |
| Zaman / ışık | A1'den birkaç dakika sonra |
| Dosya adı | `A1a.png` (görsel) · `A1a.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Paket, gönderici gittikten sonra açılır: kepenk inik, sokak boş. Şok yüzden okunur.

**Yönetmen notu (görsel / video):** Aynı matbaa, kepenk inik. Lamba altında Cico kutuyu açar: siyah sabit disk. Yüz yakın: gözler büyür.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Kepenk indi. Sokak bomboş.
- *Anlatı:* Cico bandı kaldırıyor. İçinde bir sabit disk.
- *Anlatı:* "Kaza Kayıtları." Kimlerin kazası?



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Tarlabaşı · eski matbaa] Back street in Tarlabaşı: a narrow old print shop with its sign torn off (only screw holes and a pale rectangle remain), half-raised rusty roller shutter, a heavy green wooden door with peeling paint, a low basement window glowing faintly blue, cracked plaster walls, a single sodium street lamp, wet asphalt.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Cico's scooter: classic vespa-style scooter, dark green, round headlight, green delivery box on the rear rack, licence plate "34 AEA 8430", absolutely no logos or brand marks.
[SCENE A1a · c1_a1a_inside] The same print shop, now with the roller shutter fully down and the street empty. Under the street lamp Cico has opened the package: a black hard drive inside (label unreadable). Close-medium shot, his face clearly shocked — wide eyes, raised brows, mouth slightly open. He faces image-left so the 26 badge on his left shoulder shows.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Slow push-in on his face as he lifts the flap; the lamp flickers once. Ambient: rain, distant traffic. 6 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] A1 ile aynı sokak; kepenk artık İNİK, gönderici yok.
- [ ] Paket bandı kırmızı-beyaz.

---

## A1b · Yola Çıkış · `c1_a1b_mount`

| | |
|---|---|
| Kod / scene_id | **A1b** · `c1_a1b_mount` |
| Tür | Sinematik (seçimsiz) |
| Önceki sahne | **A1** Matbaa (`c1_a1_printhouse`), **A1a** Kepenk (`c1_a1a_inside`) |
| Sonraki sahne | **A2** Galata Feneri İlkokulu (`c1_a2_school`) |
| Mekân | Tarlabaşı · eski matbaa |
| Kadro | [Cico (Aslan)] + [Cico'nun scooter'ı] |
| Zaman / ışık | A1a'nın hemen ardından |
| Dosya adı | `A1b.png` (görsel) · `A1b.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Geçiş: paket arka kutuda, Cico motora biner. Kendiliğinden A2'ye akar.

**Yönetmen notu (görsel / video):** 3/4 arkadan: bacak scooter'ın üstünden geçer, el gidonda; arka plaka görünür. Boş sokak.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı (koşullu):* Bandı yerine bastırıyor. Kimse fark etmesin.
- *Anlatı (koşullu):* Paket arka kutuda. Kimse bakmadı, kimse sormadı.
- *Anlatı:* Teslimat adresi: Galata.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Tarlabaşı · eski matbaa] Back street in Tarlabaşı: a narrow old print shop with its sign torn off (only screw holes and a pale rectangle remain), half-raised rusty roller shutter, a heavy green wooden door with peeling paint, a low basement window glowing faintly blue, cracked plaster walls, a single sodium street lamp, wet asphalt.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Cico's scooter: classic vespa-style scooter, dark green, round headlight, green delivery box on the rear rack, licence plate "34 AEA 8430", absolutely no logos or brand marks.
[SCENE A1b · c1_a1b_mount] 3/4 rear-side view: the package is back in the rear delivery box, Cico swings a leg over his scooter, hand on the handlebar, glancing down the empty street. Rear plate 34 AEA 8430 visible.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
He mounts, the tail light glows, the scooter pulls away down the wet street. Ambient: engine starting. 5 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] A1a ile aynı sokak ve lamba.

---

## A2 · Galata Feneri İlkokulu · `c1_a2_school`

| | |
|---|---|
| Kod / scene_id | **A2** · `c1_a2_school` |
| Tür | Sinematik (seçimsiz) |
| Önceki sahne | **A1b** Yola Çıkış (`c1_a1b_mount`) |
| Sonraki sahne | **A3a** Yokuş (`c1_a3a_cutoff`) |
| Mekân | Galata Feneri İlkokulu (kurgusal) |
| Kadro | [Cico (Aslan)] + [Cico'nun scooter'ı] |
| Zaman / ışık | Gece, ağır çekim |
| Dosya adı | `A2.png` (görsel) · `A2.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Seçimsiz, nefes alan sahne. Öğretmenliğe tek ince dokunuş.

**Yönetmen notu (görsel / video):** AĞIR ÇEKİM. Scooter "fıtı fıtı" yavaşlar. Okul parmaklıkları, ters sandalyeler. Kısa, sessiz bir an; müzik sade.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Cico gazı bırakıyor. Scooter fıtı fıtı ilerliyor.
- *Anlatı:* Galata Feneri İlkokulu. Karanlık sınıflar, ters sandalyeler.
- *Anlatı:* Bir zamanlar bir tahtanın önünde durmayı hayal etmişti.
- *Anlatı (koşullu):* Çantadaki paket sırtında bir taş gibi.
- *Anlatı (koşullu):* Çantadaki disk sırtında bir taş gibi. Aklı o iki kelimede.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Galata Feneri İlkokulu (kurgusal)] A small old primary school in Galata at night: tall iron railings, a noticeboard with children's crayon drawings, dark classrooms with chairs upturned on desks visible through windows, a single lamp, soft desaturated palette, quiet and still.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Cico's scooter: classic vespa-style scooter, dark green, round headlight, green delivery box on the rear rack, licence plate "34 AEA 8430", absolutely no logos or brand marks.
[SCENE A2 · c1_a2_school] Side view: Cico rides slowly past the iron railings of the dark primary school, his head turned towards the children's drawings. The package is in his rear delivery box. Desaturated palette except a faint warm lamp. Melancholic and quiet.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
SLOW MOTION tracking shot alongside Cico as the scooter rolls past the railings ("fıtı fıtı", slow and peaceful). Drawings flutter slightly. A brief soft memory flash: chalk on a blackboard, a child's raised hand (faces not visible). Sparse soft piano is allowed here only. 8 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] A1'deki paket artık teslimat kutusunun içinde.
- [ ] Renk paleti diğer sahnelerden daha soluk (anma anı).
- [ ] Hayal karesi A2f (assets/scenes/A2f_c1_a2f_flashback.jpg): "Bir zamanlar tahtanın önünde..." vuruşunda görselin üstüne yumuşakça gelir. Cico gündüz bir sınıfta öğretmen: gömlek ve hırka, kask ve rozet yok, tahtada yalnızca tebeşir harita (yazı yok), öğrencilerin kalkan elleri, sıcak aşırı pozlanmış ışık.

---

## A3a · Yokuş · `c1_a3a_cutoff`

| | |
|---|---|
| Kod / scene_id | **A3a** · `c1_a3a_cutoff` |
| Tür | Sinematik (seçimsiz) |
| Önceki sahne | **A2** Galata Feneri İlkokulu (`c1_a2_school`) |
| Sonraki sahne | **A3** Galata Kulesi (`c1_a3_tower`) |
| Mekân | Kuleye çıkan yokuş |
| Kadro | [Cico (Aslan)] + [Cico'nun scooter'ı] + [Paltolu adam] + [Siyah araba ("demir kafes")] |
| Zaman / ışık | Gece yarısı |
| Dosya adı | `A3a.png` (görsel) · `A3a.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Paltolu adam Cico'yu yolda durdurur: teslimat noktasına varmadan araba önünü keser.

**Yönetmen notu (görsel / video):** Kuleye çıkan yokuş, gece. Siyah araba scooter'ın önüne kırar; Cico sert fren. Arka kapı açılır, paltolu adam iner.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Kuleye çıkan yokuş. Bir demir kafes önünü kesiyor.
- *Anlatı:* Cico freni sıkıyor. Arka kapı açılıyor, uzun paltolu bir adam iniyor.
- *Tanıtım slaytı — Paltolu adam:* Kimse adını bilmiyor. O herkesinkini biliyor.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Kuleye çıkan yokuş] A steep narrow cobbled street climbing towards Galata Tower at night, wet stones, warm lamps on old facades; the tower appears only as a distant lit silhouette at the top of the slope.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Cico's scooter: classic vespa-style scooter, dark green, round headlight, green delivery box on the rear rack, licence plate "34 AEA 8430", absolutely no logos or brand marks.
[CHARACTER] Man in the coat: tall man in his mid-40s, long charcoal wool coat, black leather gloves, clean-shaven, slicked-back dark hair with grey temples, calm unreadable half smile, perfectly dry even in rain. Stands very still. Holds a closed black umbrella.
[CHARACTER] Black car: black sedan with fully tinted windows, no logos, plate unreadable, headlights often the only visible part, reads as a dark "iron cage".
[SCENE A3a · c1_a3a_cutoff] On the hill up to the tower, the long black sedan has swung across the road, headlights glaring. Cico brakes hard, one foot down. The rear door opens and the Man in the coat steps out, calm and threatening. Camera behind Cico's right side: no badge visible.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
The car swerves in, brakes squeal, the door opens slowly; the man's shoe touches the wet cobbles. Ambient: idling engine, rain. 6 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] Paltolu adam bu sahnede ilk kez görünüyor — karakter kartına sadık kal.
- [ ] Kule yalnızca uzakta silüet.

---

## A3 · Galata Kulesi · `c1_a3_tower`

| | |
|---|---|
| Kod / scene_id | **A3** · `c1_a3_tower` |
| Tür | Karar · ⏱ 12 sn |
| Önceki sahne | **A3a** Yokuş (`c1_a3a_cutoff`) |
| Sonraki sahne | **A4** Çatı (`c1_a4_rooftop`), **A5** Yüksek Kaldırım (`c1_a5_chase`), **A6** İkinci Teklif (`c1_a6_second_offer`) |
| Mekân | Galata Kulesi meydanı |
| Kadro | [Cico (Aslan)] + [Paltolu adam] + [Siyah araba ("demir kafes")] |
| Zaman / ışık | Gece yarısı |
| Dosya adı | `A3.png` (görsel) · `A3.mp4` (video) · döngü |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Ana gizem ve teklif: adam ROTA'nın içinden biri ("Kurye 2608"). Paket açıldıysa üçüncü seçenek açılır, adam bandı fark eder.

**Yönetmen notu (görsel / video):** Galata Kulesi'nin dibi, gece. Siyah araba scooter'ın önünü kesmiş; paltolu adam elini uzatıp paketi istiyor. Bekleme döngüsü: uzanan el, farlar.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Galata Kulesi'nin dibi. Araba yolu kapatmış, meydan boş.
- *Konuşma — Paltolu adam:* İyi akşamlar, Kurye 2608. Yoksa Cico mu diyelim?
- *Anlatı:* Kurye numarasını yalnızca ROTA bilir.
- *Konuşma — Paltolu adam:* Paketi ver. 1.500 lira hesabında.
- *Anlatı (koşullu):* Adamın gözü kalkmış banda kayıyor. Gülümsemesi donuyor.

**Seçim noktaları — bu nesneler görselde bu konumlarda net görünmeli:**

| Seçenek (oyunda) | Görselde ne olmalı | Konum (görselin yüzdesi; sol üst = 0,0) |
|---|---|---|
| Paketi ver, parayı al | paltolu adamın uzanmış eldivenli eli (orta sol) | x 37% · y 51% |
| Paketi verme, motora atla | sağdaki scooter gidonu ve aynası (kaçış) | x 88% · y 68% |
| "İçinde ne olduğunu biliyorum." 🔒 | adamın yüzü (üst sol-orta) | x 43% · y 24% |

**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Galata Kulesi meydanı] The foot of Galata Tower at night: empty cobbled square, the tower lit warm from below rising into the frame, closed café chairs stacked, wet ground reflecting the tower lights, narrow streets sloping away.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Man in the coat: tall man in his mid-40s, long charcoal wool coat, black leather gloves, clean-shaven, slicked-back dark hair with grey temples, calm unreadable half smile, perfectly dry even in rain. Stands very still. Holds a closed black umbrella.
[CHARACTER] Black car: black sedan with fully tinted windows, no logos, plate unreadable, headlights often the only visible part, reads as a dark "iron cage".
[SCENE A3 · c1_a3_tower] At the foot of Galata Tower: the Man in the coat stands calmly in the centre-left holding out his gloved hand towards the viewer, face lit from below, eyes in the upper-centre of the frame. Cico stands in the foreground right next to his scooter, the package under his arm. Right behind the man, the long black sedan blocks the road, rear door open, headlights on — he has just cut Cico off.
[MUST BE CLEARLY VISIBLE] paltolu adamın uzanmış eldivenli eli (orta sol) at about 37% from the left and 51% from the top; sağdaki scooter gidonu ve aynası (kaçış) at about 88% from the left and 68% from the top; adamın yüzü (üst sol-orta) at about 43% from the left and 24% from the top.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Slow dolly-in on the outstretched gloved hand; the black car's headlights flick on behind. The man does not blink. Seamless tense loop. Ambient: wind, distant seagulls, a low engine idling. No speech. 8 seconds. Start and end on the same frame so the clip loops seamlessly (use this image as both first and last frame if available).
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] Paket A1/A2'deki ile aynı (kırmızı-beyaz bant).
- [ ] Paltolu adam bu sahnede ilk kez görünüyor — karakter kartına sadık kal.

---

## A4 · Çatı · `c1_a4_rooftop`

| | |
|---|---|
| Kod / scene_id | **A4** · `c1_a4_rooftop` |
| Tür | Karar |
| Önceki sahne | **A3** Galata Kulesi (`c1_a3_tower`) |
| Sonraki sahne | **SA2** Kabile (`c1_end_a_tribe`), **SA1** Sessizlik (`c1_end_a_silence`) |
| Mekân | Galata'da bir çatı |
| Kadro | [Cico (Aslan)] |
| Zaman / ışık | Gece yarısından sonra |
| Dosya adı | `A4.png` (görsel) · `A4.mp4` (video) · döngü |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Suç ortaklığından sonra vicdan: Kabile'yi uyarmak mı, susmak mı.

**Yönetmen notu (görsel / video):** Galata'da bir çatı, şehir ışıkları, Cico'nun silueti. Telefon ışığı yüzünde.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı (koşullu):* Para hesaba düşüyor. Adam karanlığa karışıyor.
- *Konuşma — Paltolu adam (koşullu):* Yarın yine ararız, Cico.
- *Anlatı (koşullu):* Cico donup kalıyor. Adam paketi elinden kendisi alıyor.
- *Konuşma — Paltolu adam (koşullu):* Kararsızlara yarı fiyat. 750 lira.
- *Anlatı:* Galata'da bir çatı. Aşağıda şehir, yollarda kuryeler.
- *Anlatı (koşullu):* Adam o kalkmış bandı gördü. Unutmayacak.

**Seçim noktaları — bu nesneler görselde bu konumlarda net görünmeli:**

| Seçenek (oyunda) | Görselde ne olmalı | Konum (görselin yüzdesi; sol üst = 0,0) |
|---|---|---|
| Kabile'ye yaz: "ROTA bir şey saklıyor." | Cico'nun elindeki parlayan telefon (orta sağ) | x 69% · y 52% |
| Telefonu kapat ve sus | sol alttaki çatı kenarında duran kask (susup eve dönmek) | x 22% · y 70% |

**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Galata'da bir çatı] A Galata rooftop at night: low parapet, satellite dishes and water tanks, the city lights of Beyoğlu and the Golden Horn below, distant tiny moving headlights of couriers on the roads.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[SCENE A4 · c1_a4_rooftop] Cico sits on the rooftop parapet, silhouetted against the city lights, his phone glowing in his hand at the centre-right. His helmet rests on the ledge at the lower left. Tiny moving lights of couriers on the roads below.
[MUST BE CLEARLY VISIBLE] Cico'nun elindeki parlayan telefon (orta sağ) at about 69% from the left and 52% from the top; sol alttaki çatı kenarında duran kask (susup eve dönmek) at about 22% from the left and 70% from the top.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Very slow orbit around Cico; city lights twinkle, courier headlights crawl along the roads below. His thumb hovers over the screen. Seamless loop. Ambient: distant city hum, wind. 8 seconds. Start and end on the same frame so the clip loops seamlessly (use this image as both first and last frame if available).
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] Paket artık yok (teslim edildi).
- [ ] Kask kafasında değil, kenarda.

---

## A5 · Yüksek Kaldırım · `c1_a5_chase`

| | |
|---|---|
| Kod / scene_id | **A5** · `c1_a5_chase` |
| Tür | Aksiyon (süreli) · ⏱ 8 sn |
| Önceki sahne | **A3** Galata Kulesi (`c1_a3_tower`), **A6** İkinci Teklif (`c1_a6_second_offer`) |
| Sonraki sahne | **A5b** Basamaklar (`c1_a5b_fall`), **SA3** Paket Bende (`c1_end_a_escape`) |
| Mekân | Yüksek Kaldırım |
| Kadro | [Cico (Aslan)] + [Cico'nun scooter'ı] + [Siyah araba ("demir kafes")] |
| Zaman / ışık | Gece, kovalamaca |
| Dosya adı | `A5.png` (görsel) · `A5.mp4` (video) · döngü |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Basamaklar: macera — her zaman düşüş (A5b → A5c → Düşüş, risk listesi). Pasaj: sabaha kadar saklanır → Paket Bende.

**Yönetmen notu (görsel / video):** Galata yokuşları, scooter kalkışı, arkada siyah araba. Pasajın içi boş ve karanlık (araba yok).

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Motor ilk denemede çalışıyor. Demir kafesin kapıları açılıyor.
- *Anlatı:* Önde Yüksek Kaldırım'ın ıslak basamakları. Solda eski bir pasaj.

**Seçim noktaları — bu nesneler görselde bu konumlarda net görünmeli:**

| Seçenek (oyunda) | Görselde ne olmalı | Konum (görselin yüzdesi; sol üst = 0,0) |
|---|---|---|
| Basamaklar | sol alttaki dik, ıslak basamaklar | x 19% · y 71% |
| Pasaja saklan, orada sabahla | sağ üstteki kemerli pasaj | x 81% · y 20% |

**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Yüksek Kaldırım] Yüksek Kaldırım: very steep wide stone steps descending between old buildings, wet and glistening, handrails, shuttered shops, a dark arched side passage opening on the right.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Cico's scooter: classic vespa-style scooter, dark green, round headlight, green delivery box on the rear rack, licence plate "34 AEA 8430", absolutely no logos or brand marks.
[CHARACTER] Black car: black sedan with fully tinted windows, no logos, plate unreadable, headlights often the only visible part, reads as a dark "iron cage".
[SCENE A5 · c1_a5_chase] High-energy wide shot: Cico on his scooter at the top of Yüksek Kaldırım, package clutched under his arm. To the lower left the steep wet stone steps plunge down; to the right a dark arched passage opens, empty inside. Behind him the black car's doors swing open, headlights glaring.
[MUST BE CLEARLY VISIBLE] sol alttaki dik, ıslak basamaklar at about 19% from the left and 71% from the top; sağ üstteki kemerli pasaj at about 81% from the left and 20% from the top.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Fast handheld energy: scooter engine revs, headlights sweep across the walls, car doors open behind. Hold on the moment of decision. Seamless loop of the revving moment. Ambient: engine, footsteps, rain. 8 seconds. Extra outcome clips: (1) scooter descending the steps, (2) scooter vanishing into the passage. Start and end on the same frame so the clip loops seamlessly (use this image as both first and last frame if available).
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] Paket hâlâ Cico'da.
- [ ] Kask kafasında, çenede yarı açık.

---

## A5b · Basamaklar · `c1_a5b_fall`

| | |
|---|---|
| Kod / scene_id | **A5b** · `c1_a5b_fall` |
| Tür | Sinematik (seçimsiz) |
| Önceki sahne | **A5** Yüksek Kaldırım (`c1_a5_chase`) |
| Sonraki sahne | **A5c** Zarf (`c1_a5c_paper`) |
| Mekân | Yüksek Kaldırım |
| Kadro | [Cico (Aslan)] + [Cico'nun scooter'ı] + [Paltolu adam] |
| Zaman / ışık | Gece |
| Dosya adı | `A5b.png` (görsel) · `A5b.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Düşüş anı: paltolu adam paketi alıp uzaklaşır. Cico'nun yanında kâğıt yok.

**Yönetmen notu (görsel / video):** Islak basamaklar, devrik scooter, yerde Cico (şiddet gösterilmez). Arkada paketle uzaklaşan paltolu adam.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Konuşma — Cico:* Uçuyorum ulan!
- *Anlatı:* Freni limon sıkar gibi sıkmalıydı. Fazla sıktı. Teker kayıyor.
- *Anlatı:* Kask onu korudu. Paltolu adam paketi alıp uzaklaşıyor.
- *Anlatı:* Kulağında Kabile Şefi'nin sesi.
- *Konuşma — Kabile Şefi:* Düştün babuş, olabilir. Neyse ki korumaların üstündeydi.
- *Konuşma — Kabile Şefi:* Düşmeyi bilmek mi? Kel motosiklet eğitmenlerinin uydurduğu bir palavra.
- *Anlatı:* Ayak sesleri uzaklaşıyor. Sonra sessizlik.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Yüksek Kaldırım] Yüksek Kaldırım: very steep wide stone steps descending between old buildings, wet and glistening, handrails, shuttered shops, a dark arched side passage opening on the right.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Cico's scooter: classic vespa-style scooter, dark green, round headlight, green delivery box on the rear rack, licence plate "34 AEA 8430", absolutely no logos or brand marks.
[CHARACTER] Man in the coat: tall man in his mid-40s, long charcoal wool coat, black leather gloves, clean-shaven, slicked-back dark hair with grey temples, calm unreadable half smile, perfectly dry even in rain. Stands very still. Holds a closed black umbrella.
[SCENE A5b · c1_a5b_fall] Aftermath at the bottom of the wet steps: the green scooter on its side, Cico sitting up, helmet on, unhurt but shaken. Up the steps, the Man in the coat walks away with the package. No paper near Cico.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Rain on stones, the man's footsteps fade up the steps. No impact shown. Ambient: rain. 6 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] A5 ile aynı basamaklar.
- [ ] Kask kafasında — "kask onu korudu".

---

## A5c · Zarf · `c1_a5c_paper`

| | |
|---|---|
| Kod / scene_id | **A5c** · `c1_a5c_paper` |
| Tür | Sinematik (seçimsiz) |
| Önceki sahne | **A5b** Basamaklar (`c1_a5b_fall`) |
| Sonraki sahne | **SA4** Düşüş (`c1_end_a_fall`) |
| Mekân | Yüksek Kaldırım |
| Kadro |  |
| Zaman / ışık | A5b'nin hemen ardından |
| Dosya adı | `A5c.png` (görsel) · `A5c.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Adam gitmiş; yerde düşürdüğü zarf. Dokununca Düşüş sonuna (Cico okur) geçilir.

**Yönetmen notu (görsel / video):** Islak taşta zarf, yakın plan; yağmur damlaları. Arkada flu basamaklar.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Adam gitti. Islak taşın üstünde, düşürdüğü bir zarf.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Yüksek Kaldırım] Yüksek Kaldırım: very steep wide stone steps descending between old buildings, wet and glistening, handrails, shuttered shops, a dark arched side passage opening on the right.
[SCENE A5c · c1_a5c_paper] Close-up: a folded envelope lying on the wet stones (nothing readable), raindrops hitting around it; the steps blurred behind. The man is gone.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Macro shot, a raindrop lands on the envelope; a shadow (Cico) falls over it. Ambient: rain. 5 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] A5b ile aynı taşlar ve ışık.

---

## A6 · İkinci Teklif · `c1_a6_second_offer`

| | |
|---|---|
| Kod / scene_id | **A6** · `c1_a6_second_offer` |
| Tür | Karar · ⏱ 10 sn |
| Önceki sahne | **A3** Galata Kulesi (`c1_a3_tower`) |
| Sonraki sahne | **SA5** Masa (`c1_end_a_desk`), **A5** Yüksek Kaldırım (`c1_a5_chase`) |
| Mekân | Galata Kulesi meydanı |
| Kadro | [Cico (Aslan)] + [Paltolu adam] |
| Zaman / ışık | A3 ile aynı an |
| Dosya adı | `A6.png` (görsel) · `A6.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Katman A'nın en ağır ikilemi: sokaktan kurtuluş (maaş, sigorta) karşılığında kayıtları gömmek.

**Yönetmen notu (görsel / video):** Kulenin dibinde iki kişilik yakın plan. Şehir sesi kesilir.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Konuşma — Cico:* İçinde ne olduğunu biliyorum.
- *Konuşma — Paltolu adam:* Biliyorum. Seni bu yüzden seçtik.
- *Konuşma — Paltolu adam:* Kayıtlar bizde kalsın. Sana sabit maaş, sigorta, sıcak bir masa.
- *Anlatı:* Bir daha yağmurda yol yok. Bir daha kira derdi yok.

**Seçim noktaları — bu nesneler görselde bu konumlarda net görünmeli:**

| Seçenek (oyunda) | Görselde ne olmalı | Konum (görselin yüzdesi; sol üst = 0,0) |
|---|---|---|
| "Tamam. Nereye götürüyorum?" | adamın elindeki katlanmış kâğıt (orta sol) | x 44% · y 54% |
| Reddet, paketi kap ve kaç | Cico'nun göğsüne bastırdığı paket (sağ alt) | x 63% · y 71% |

**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Galata Kulesi meydanı] The foot of Galata Tower at night: empty cobbled square, the tower lit warm from below rising into the frame, closed café chairs stacked, wet ground reflecting the tower lights, narrow streets sloping away.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Man in the coat: tall man in his mid-40s, long charcoal wool coat, black leather gloves, clean-shaven, slicked-back dark hair with grey temples, calm unreadable half smile, perfectly dry even in rain. Stands very still. Holds a closed black umbrella.
[SCENE A6 · c1_a6_second_offer] Two-shot close-up at the foot of Galata Tower: the Man in the coat holds up a folded sheet of paper (unreadable) in his gloved hand at the centre-left, offering it. Cico, in the lower right, clutches the package to his chest. The city noise seems to fall silent; background softly blurred.
[MUST BE CLEARLY VISIBLE] adamın elindeki katlanmış kâğıt (orta sol) at about 44% from the left and 54% from the top; Cico'nun göğsüne bastırdığı paket (sağ alt) at about 63% from the left and 71% from the top.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Slow push-in between the two faces; all background motion slows down and sound fades to near silence. Seamless loop. 8 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] A3 ile aynı mekân, aynı ışık; kamera daha yakın.

---

## B0 · Nöbetçi Eczane · `c1_b0_pharmacy`

| | |
|---|---|
| Kod / scene_id | **B0** · `c1_b0_pharmacy` |
| Tür | Sinematik (seçimsiz) |
| Önceki sahne | **O3** Yolda (`c1_s03_ride`) |
| Sonraki sahne | **B1** Dolapdere (`c1_b1_pharmacy`) |
| Mekân | Nöbetçi eczane / Dolapdere |
| Kadro | [Cico (Aslan)] + [Cico'nun scooter'ı] |
| Zaman / ışık | Gece yarısı |
| Dosya adı | `B0.png` (görsel) · `B0.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Nöbetçi eczane. Paket talebi Kabile Şefi'ne düşer; Katman B'nin olayı onun başına gelecek.

**Yönetmen notu (görsel / video):** Gece, nöbetçi eczane önü; yazısız ışıklı tabela (yalnızca yeşil haç). Cico scooter'ının yanında, elinde poşet.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Nöbetçi eczane. İlaç poşette, adres Dolapdere.
- *Anlatı:* Paket talebi Kabile Şefi'ne düştü.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Nöbetçi eczane / Dolapdere] A night pharmacy with a glowing green cross, then a crumbling Dolapdere apartment entrance with chipped stairs, a dim yellow stairwell bulb and a half-open wooden door.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Cico's scooter: classic vespa-style scooter, dark green, round headlight, green delivery box on the rear rack, licence plate "34 AEA 8430", absolutely no logos or brand marks.
[SCENE B0 · c1_b0_pharmacy] Outside a night pharmacy: a glowing green cross sign with no letters, Cico beside his scooter holding a small white pharmacy bag, tired but kind. Wet pavement reflects the green light.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
He tucks the bag into the box and starts the engine. Ambient: night street, the sign buzzing. 5 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] Tabelada yazı YOK; yalnızca yeşil haç.

---

## B1 · Dolapdere · `c1_b1_pharmacy`

| | |
|---|---|
| Kod / scene_id | **B1** · `c1_b1_pharmacy` |
| Tür | Sinematik (seçimsiz) |
| Önceki sahne | **B0** Nöbetçi Eczane (`c1_b0_pharmacy`) |
| Sonraki sahne | **B2** Mendilci Çocuk (`c1_b2_kid`) |
| Mekân | Nöbetçi eczane / Dolapdere |
| Kadro | [Cico (Aslan)] + [Mendilci çocuk] + [Babaanne (yalnızca B1'de arka planda)] |
| Zaman / ışık | Gece yarısı |
| Dosya adı | `B1.png` (görsel) · `B1.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Karakter sahnesi: mendilci çocuk.

**Yönetmen notu (görsel / video):** Dolapdere'de dökük merdivenler; kapıda mendilci çocuk.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Dolapdere. Dökük bir merdiven, üçüncü kat.
- *Anlatı:* Kapıyı bir çocuk açıyor.
- *Tanıtım slaytı — Mendilci çocuk:* İstiklal'de mendil satar. Haritayı Cico'dan öğrendi, şehri herkesten iyi bilir.
- *Konuşma — Mendilci çocuk:* Hocam?



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Nöbetçi eczane / Dolapdere] A night pharmacy with a glowing green cross, then a crumbling Dolapdere apartment entrance with chipped stairs, a dim yellow stairwell bulb and a half-open wooden door.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Tissue seller kid: 11-year-old boy, thin, messy black hair, big curious bright eyes, faded oversized red hoodie with sleeves rolled up, worn white sneakers, carries a small clear plastic box of tissue packets. Clever, street-smart expression.
[CHARACTER] Elderly woman in a light headscarf sitting on a worn sofa in the background, softly out of focus.
[SCENE B1 · c1_b1_pharmacy] In a crumbling Dolapdere stairwell, a half-open wooden door: the tissue seller kid peeks out, surprised and happy to see Cico, who holds a small white pharmacy bag. Through the gap, the grandmother sits on a sofa in the soft-focus background.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Gentle handheld: the door creaks open, the kid's face lights up ("Hocam?"), Cico smiles tiredly and hands over the bag. Warm and intimate. Ambient: stairwell echo, a TV murmuring inside. No intelligible speech. 8 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] Cico'nun kıyafeti O1 ile aynı.
- [ ] Çocuk bu sahnede ilk kez görünüyor — karakter kartına sadık kal.

---

## B2 · Mendilci Çocuk · `c1_b2_kid`

| | |
|---|---|
| Kod / scene_id | **B2** · `c1_b2_kid` |
| Tür | Karar |
| Önceki sahne | **B1** Dolapdere (`c1_b1_pharmacy`) |
| Sonraki sahne | **B2a** Kabile Şefi (`c1_b2a_chief`) |
| Mekân | Nöbetçi eczane / Dolapdere |
| Kadro | [Cico (Aslan)] + [Mendilci çocuk] |
| Zaman / ışık | B1 ile aynı an |
| Dosya adı | `B2.png` (görsel) · `B2.mp4` (video) · döngü |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Kanıt vs. bir çocuğu korumak. Fotoğraf hastanede "gazeteci" seçeneğini açar; ama mendilci çocuk'u riske atar.

**Yönetmen notu (görsel / video):** Kapı eşiği, alçak sesle konuşma. Fotoğraf UI kartında, videoda okunmaz.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Konuşma — Mendilci çocuk:* Matbaanın orada adamlar vardı. Siyah arabaya kutu yüklediler.
- *Konuşma — Mendilci çocuk:* Seni soruyorlardı Hocam. "Aslan diye bir kurye" diye.
- *Anlatı:* Çocuğun telefonunda bulanık bir fotoğraf: plaka, kutu, bir yüz.

**Seçim noktaları — bu nesneler görselde bu konumlarda net görünmeli:**

| Seçenek (oyunda) | Görselde ne olmalı | Konum (görselin yüzdesi; sol üst = 0,0) |
|---|---|---|
| "Fotoğrafı bana at." | kırmızı kapüşonlu kolun uzattığı telefon (orta) | x 49% · y 42% |
| "Sil onu. Kapını kilitle." | sol alttaki pirinç kilit ve zincir (kapını kilitle) | x 17% · y 66% |

**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Nöbetçi eczane / Dolapdere] A night pharmacy with a glowing green cross, then a crumbling Dolapdere apartment entrance with chipped stairs, a dim yellow stairwell bulb and a half-open wooden door.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Tissue seller kid: 11-year-old boy, thin, messy black hair, big curious bright eyes, faded oversized red hoodie with sleeves rolled up, worn white sneakers, carries a small clear plastic box of tissue packets. Clever, street-smart expression.
[SCENE B2 · c1_b2_kid] Same doorway, closer: the kid holds up his phone towards Cico at the centre-right (screen shows only a soft glow), whispering seriously. The door's old lock and chain are visible at the lower left.
[MUST BE CLEARLY VISIBLE] kırmızı kapüşonlu kolun uzattığı telefon (orta) at about 49% from the left and 42% from the top; sol alttaki pirinç kilit ve zincir (kapını kilitle) at about 17% from the left and 66% from the top.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Quiet close shot, the kid glances down the stairwell nervously, phone glow on both faces. Seamless loop. Ambient: dripping, distant siren. 8 seconds. Start and end on the same frame so the clip loops seamlessly (use this image as both first and last frame if available).
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] B1 ile aynı kapı ve ışık.

---

## B2a · Kabile Şefi · `c1_b2a_chief`

| | |
|---|---|
| Kod / scene_id | **B2a** · `c1_b2a_chief` |
| Tür | Sinematik (seçimsiz) |
| Önceki sahne | **B2** Mendilci Çocuk (`c1_b2_kid`) |
| Sonraki sahne | **B3** Tarlabaşı Bulvarı (`c1_b3_boulevard`) |
| Mekân | Tarlabaşı Bulvarı |
| Kadro | [Kabile Şefi] + [Siyah araba ("demir kafes")] |
| Zaman / ışık | B2 ile aynı saatler |
| Dosya adı | `B2a.png` (görsel) · `B2a.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Aynı saatlerde Kabile Şefi paketi götürüyor; tek eliyle Cico'ya yazar. Arkasında siyah araba.

**Yönetmen notu (görsel / video):** Tarlabaşı Bulvarı, gece. Şef motorunda, bir eli gidonda, diğeriyle telefon. Arkada yaklaşan siyah araba farları.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Aynı saatlerde Kabile Şefi paketi götürüyor. Arkasında farlar.
- *Telefon mesajı — Kabile Şefi:* Cico, paket işi tuhaf. Arkamda bir araba var.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Tarlabaşı Bulvarı] Tarlabaşı Boulevard at night: wide multi-lane road, orange sodium lights, wet asphalt, a kerb and pavement, side streets disappearing into darkness, distant ambulance lights.
[CHARACTER] Tribe Chief: courier in his early 50s, broad shoulders, grey stubble and thick grey moustache, deep laugh lines, warm but tough eyes. Black armoured riding jacket with visible elbow and shoulder protectors, knee guards over dark jeans, worn full-face helmet covered in faded stickers (no readable words). Rides an older dark-blue scooter with a black delivery box.
[CHARACTER] Black car: black sedan with fully tinted windows, no logos, plate unreadable, headlights often the only visible part, reads as a dark "iron cage".
[SCENE B2a · c1_b2a_chief] Tarlabaşı Boulevard at night: the Tribe Chief rides his dark-blue scooter, one hand on the handlebar, typing on his phone with the other (screen unreadable). Behind him, the black car's headlights close in.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Tracking shot beside the chief; he glances back at the headlights. Ambient: traffic, engine. 6 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] Kabile Şefi ilk kez fiziksel olarak görünüyor — koruyucu ekipmanı üzerinde.
- [ ] Paket arka kutuda.

---

## B3 · Tarlabaşı Bulvarı · `c1_b3_boulevard`

| | |
|---|---|
| Kod / scene_id | **B3** · `c1_b3_boulevard` |
| Tür | Karar · ⏱ 12 sn |
| Önceki sahne | **B2a** Kabile Şefi (`c1_b2a_chief`) |
| Sonraki sahne | **B4** Taksim İlk Yardım (`c1_b4_hospital`), **B3a** Takip (`c1_b3a_tail`) |
| Mekân | Tarlabaşı Bulvarı |
| Kadro | [Cico (Aslan)] + [Kabile Şefi] + [Siyah araba ("demir kafes")] |
| Zaman / ışık | Gece yarısından sonra |
| Dosya adı | `B3.png` (görsel) · `B3.mp4` (video) · döngü |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Katman B'nin kırılma noktası: bir dostu yerde bırakmamak mı, onu yere sereni kovalamak mı.

**Yönetmen notu (görsel / video):** Tarlabaşı Bulvarı, gece. Yerde yeşil teslimat çantası, devrik scooter. Kabile Şefi oturur hâlde, kask çatlak (kan yok). Uzaklaşan siyah araba.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Tarlabaşı Bulvarı. Yerde yeşil bir teslimat çantası. Kabile Şefi'nin.
- *Anlatı:* Bir demir kafes onu kaldırıma sıkıştırmış. Kaskı çatlak ama konuşuyor.
- *Konuşma — Kabile Şefi:* Kaza değildi babuş. Paketi aldılar.
- *Konuşma — Kabile Şefi:* Gidecek hep daha fazla yol var. Ben iyiyim, git.
- *Telefon mesajı — ROTA:* Teslimat gecikti. Hesabınız incelemeye alındı.
- *Anlatı:* Ambulans yolda. Siyah araba Tarlabaşı'nın ara sokaklarına sapıyor.

**Seçim noktaları — bu nesneler görselde bu konumlarda net görünmeli:**

| Seçenek (oyunda) | Görselde ne olmalı | Konum (görselin yüzdesi; sol üst = 0,0) |
|---|---|---|
| Şefin yanında kal | kaldırımda oturan Kabile Şefi (orta sol) | x 44% · y 52% |
| Arabanın peşine düş | sağ üstte ara sokağa sapan siyah arabanın stop lambaları | x 79% · y 18% |

**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Tarlabaşı Bulvarı] Tarlabaşı Boulevard at night: wide multi-lane road, orange sodium lights, wet asphalt, a kerb and pavement, side streets disappearing into darkness, distant ambulance lights.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Tribe Chief: courier in his early 50s, broad shoulders, grey stubble and thick grey moustache, deep laugh lines, warm but tough eyes. Black armoured riding jacket with visible elbow and shoulder protectors, knee guards over dark jeans, worn full-face helmet covered in faded stickers (no readable words). Rides an older dark-blue scooter with a black delivery box.
[CHARACTER] Black car: black sedan with fully tinted windows, no logos, plate unreadable, headlights often the only visible part, reads as a dark "iron cage".
[SCENE B3 · c1_b3_boulevard] On Tarlabaşı Boulevard: the Tribe Chief sits on the kerb at the centre-left beside his tipped-over dark-blue scooter, helmet cracked but conscious, raising a hand to wave Cico on. His black delivery box lies open and empty. In the upper right, the black car's red tail lights turn into a dark side street. Cico has just pulled up in the foreground.
[MUST BE CLEARLY VISIBLE] kaldırımda oturan Kabile Şefi (orta sol) at about 44% from the left and 52% from the top; sağ üstte ara sokağa sapan siyah arabanın stop lambaları at about 79% from the left and 18% from the top.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Handheld, tense: the tail lights disappear into the side street, distant ambulance lights pulse blue, the chief grimaces and gestures "go". Seamless loop. Ambient: traffic, distant siren, the chief's heavy breathing. No blood. 8 seconds. Start and end on the same frame so the clip loops seamlessly (use this image as both first and last frame if available).
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] Kabile Şefi bu sahnede ilk kez fiziksel olarak görünüyor — koruyucu ekipmanı üzerinde.
- [ ] Çanta kapağı açık, paket yok.

---

## B3a · Takip · `c1_b3a_tail`

| | |
|---|---|
| Kod / scene_id | **B3a** · `c1_b3a_tail` |
| Tür | Sinematik (seçimsiz) |
| Önceki sahne | **B3** Tarlabaşı Bulvarı (`c1_b3_boulevard`) |
| Sonraki sahne | **B5** Matbaa (`c1_b5_printhouse`) |
| Mekân | Tarlabaşı Bulvarı |
| Kadro | [Cico (Aslan)] + [Cico'nun scooter'ı] + [Siyah araba ("demir kafes")] |
| Zaman / ışık | B3'ün hemen ardından |
| Dosya adı | `B3a.png` (görsel) · `B3a.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Gizli takip: Cico farlarını kapatıp siyah arabayı ara sokaklarda izler.

**Yönetmen notu (görsel / video):** Tarlabaşı ara sokağı, gece. Önde siyah arabanın stop lambaları; Cico mesafeli, köşeden izler.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Cico farlarını kapatıyor. İki araba geriden izliyor.
- *Anlatı:* Siyah araba ara sokaklarda yavaşlıyor. Bir köşede duruyor.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Tarlabaşı Bulvarı] Tarlabaşı Boulevard at night: wide multi-lane road, orange sodium lights, wet asphalt, a kerb and pavement, side streets disappearing into darkness, distant ambulance lights.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Cico's scooter: classic vespa-style scooter, dark green, round headlight, green delivery box on the rear rack, licence plate "34 AEA 8430", absolutely no logos or brand marks.
[CHARACTER] Black car: black sedan with fully tinted windows, no logos, plate unreadable, headlights often the only visible part, reads as a dark "iron cage".
[SCENE B3a · c1_b3a_tail] A Tarlabaşı back street: ahead, the black car's red tail lights; Cico follows at a distance with his headlight off, half hidden at a corner, eyes fixed on the car.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Slow creeping follow shot; the car slows and stops. Ambient: idling engines. 6 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] B3 ile aynı gece; Cico'nun farı kapalı.

---

## B4 · Taksim İlk Yardım · `c1_b4_hospital`

| | |
|---|---|
| Kod / scene_id | **B4** · `c1_b4_hospital` |
| Tür | Karar |
| Önceki sahne | **B3** Tarlabaşı Bulvarı (`c1_b3_boulevard`) |
| Sonraki sahne | **SB1** Kontak Kapatma (`c1_end_b_strike`), **SB2** Manşet (`c1_end_b_headline`) |
| Mekân | Taksim İlk Yardım |
| Kadro | [Cico (Aslan)] + [Kabile Şefi] |
| Zaman / ışık | Sabaha karşı |
| Dosya adı | `B4.png` (görsel) · `B4.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Dayanışma mı, kanıt mı. Gazeteci seçeneği yalnızca mendilci çocuk'un fotoğrafı alındıysa açılır.

**Yönetmen notu (görsel / video):** Taksim İlk Yardım koridoru, sabaha karşı. Koridorda birikmiş kuryeler, kasklar kucakta.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı (koşullu):* Cico donup kaldı. Ambulans geldiğinde araba çoktan gitmişti.
- *Anlatı:* Sabaha karşı. Hastane koridorunda kuryeler birikiyor.
- *Telefon mesajı — ROTA:* Kaza nedeniyle hesabınız kapatılmıştır. Sigorta kapsamı bulunmamaktadır.
- *Konuşma — Kabile Şefi:* Yirmi yıl. Bir mesajla bitti.
- *Anlatı:* Kabile grubunda herkes aynı şeyi yazıyor: "Ne yapacağız?"

**Seçim noktaları — bu nesneler görselde bu konumlarda net görünmeli:**

| Seçenek (oyunda) | Görselde ne olmalı | Konum (görselin yüzdesi; sol üst = 0,0) |
|---|---|---|
| Kabile'ye yaz: "Yarın gece toplu grev. Mesele ciddi." | soldaki kurye grubu (Kabile) | x 17% · y 54% |
| Çocuğun fotoğrafını bir gazeteciye gönder 🔒 | ortada oturan Cico | x 52% · y 52% |

**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Taksim İlk Yardım] A hospital emergency corridor before dawn: cold fluorescent light, plastic chairs, couriers in jackets sitting and standing with helmets in their laps, a tired night shift atmosphere.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Tribe Chief: courier in his early 50s, broad shoulders, grey stubble and thick grey moustache, deep laugh lines, warm but tough eyes. Black armoured riding jacket with visible elbow and shoulder protectors, knee guards over dark jeans, worn full-face helmet covered in faded stickers (no readable words). Rides an older dark-blue scooter with a black delivery box.
[SCENE B4 · c1_b4_hospital] Hospital corridor: on the left, a group of couriers in jackets with helmets in their laps gathers, looking at Cico. The Tribe Chief sits on a plastic chair with a bandaged arm, staring at his phone. Cico stands at the lower right holding his own phone.
[MUST BE CLEARLY VISIBLE] soldaki kurye grubu (Kabile) at about 17% from the left and 54% from the top; ortada oturan Cico at about 52% from the left and 52% from the top.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Slow lateral dolly along the corridor past tired couriers; fluorescent light flickers once. Seamless loop. Ambient: hospital hum, distant beeps, murmurs. 8 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] Kabile Şefi B3'teki kıyafetiyle, kolu sargılı.
- [ ] Cico'nun kaskı elinde.

---

## B5 · Matbaa · `c1_b5_printhouse`

| | |
|---|---|
| Kod / scene_id | **B5** · `c1_b5_printhouse` |
| Tür | Aksiyon (süreli) · ⏱ 10 sn |
| Önceki sahne | **B3a** Takip (`c1_b3a_tail`) |
| Sonraki sahne | **SB3** Kara Kutu (`c1_end_b_blackbox`), **SB4** Kanıt (`c1_end_b_evidence`) |
| Mekân | Tarlabaşı · eski matbaa |
| Kadro | [Cico (Aslan)] + [Siyah araba ("demir kafes")] |
| Zaman / ışık | Gece yarısından sonra |
| Dosya adı | `B5.png` (görsel) · `B5.mp4` (video) · döngü |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** Katman A'nın başladığı matbaa, burada ROTA'nın gizli merkezi olarak geri döner (mekân tekrar kullanımı + iki katmanın aynası).

**Yönetmen notu (görsel / video):** c1_a1_printhouse ile aynı matbaa, bu kez camın ardından içerisi: ekranlarda yeşil noktalar (yazısız harita).

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Araba, tabelası sökülmüş eski bir matbaanın önünde duruyor.
- *Anlatı:* Camın ardında ekranlar. Her ekranda yüzlerce yeşil nokta.
- *Anlatı:* Biri kıpırdamıyor. Tarlabaşı Bulvarı'nda. Şef.

**Seçim noktaları — bu nesneler görselde bu konumlarda net görünmeli:**

| Seçenek (oyunda) | Görselde ne olmalı | Konum (görselin yüzdesi; sol üst = 0,0) |
|---|---|---|
| İçeri gir | ortadaki aralık yeşil kapı | x 52% · y 36% |
| Camdan fotoğraf çek ve kaç | sol alttaki, ekranların göründüğü bodrum penceresi | x 16% · y 66% |

**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Tarlabaşı · eski matbaa] Back street in Tarlabaşı: a narrow old print shop with its sign torn off (only screw holes and a pale rectangle remain), half-raised rusty roller shutter, a heavy green wooden door with peeling paint, a low basement window glowing faintly blue, cracked plaster walls, a single sodium street lamp, wet asphalt.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Black car: black sedan with fully tinted windows, no logos, plate unreadable, headlights often the only visible part, reads as a dark "iron cage".
[SCENE B5 · c1_b5_printhouse] The same old print shop as A1 (same green door, torn sign, roller shutter): the black car is parked outside. The green door is slightly ajar at the centre, spilling light. At the lower left, the basement window glows with rows of monitors full of green dots. Cico crouches in the shadows of the foreground.
[MUST BE CLEARLY VISIBLE] ortadaki aralık yeşil kapı at about 52% from the left and 36% from the top; sol alttaki, ekranların göründüğü bodrum penceresi at about 16% from the left and 66% from the top.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Slow creeping push-in towards the ajar door; monitor glow flickers in the basement window. Seamless loop. Ambient: humming electronics, distant traffic. 8 seconds. Start and end on the same frame so the clip loops seamlessly (use this image as both first and last frame if available).
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] A1 ile AYNI matbaa (kapı rengi, sökülmüş tabela, kepenk). İki katmanın aynası.

---

## SA1 · Sessizlik · `c1_end_a_silence`

| | |
|---|---|
| Kod / scene_id | **SA1** · `c1_end_a_silence` |
| Tür | Son |
| Önceki sahne | **A4** Çatı (`c1_a4_rooftop`) |
| Sonraki sahne | — (bölüm sonu) |
| Mekân | Kahvehane · sabah |
| Kadro | [Cico (Aslan)] |
| Zaman / ışık | Sabah |
| Dosya adı | `SA1.png` (görsel) · `SA1.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** A son: Sessizlik.

**Yönetmen notu (görsel / video):** Sabah kahvehane, televizyon (ekran içeriği okunmaz). c1_end_a_tribe ile aynı mekân.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Sabah. Kahvehanede televizyon açık.
- *Anlatı:* Haberlerde bir kurye kazası. İsim verilmiyor. Bir dakika sürüyor.
- *Telefon mesajı — Annem (koşullu):* Kira yattı oğlum. Allah razı olsun.
- *Anlatı (koşullu):* Kiraya yine yetmedi. Annesine ne yazacağını bilmiyor.
- *Tanıtım slaytı — Mendilci çocuk:* İstiklal'de mendil satar. Haritayı Cico'dan öğrendi, şehri herkesten iyi bilir.
- *Telefon mesajı — Mendilci çocuk:* Hocam, dün gece ilaç gelmedi. Babaannemi komşular hastaneye götürdü. İyi şimdi.
- *Anlatı:* Dün gece reddettiği talep, o çocuğunmuş.
- *Anlatı (koşullu):* Dün geceki ilk kararı o değil, ROTA verdi.
- *Telefon mesajı — ROTA:* Yarınki rotanız hazır. 08:00 — Galata Feneri İlkokulu.
- *Anlatı:* Alıcı adı boş.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Kahvehane · sabah] A small old Istanbul teahouse in the morning: tulip tea glasses, worn wooden tables, a wall-mounted TV glowing (screen content unreadable), morning light through steamy windows.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[SCENE SA1 · c1_end_a_silence] Morning teahouse: Cico sits alone at a worn table with an untouched tulip glass of tea, staring at the wall TV (screen unreadable). Morning light, steam.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Static shot, steam rises from the tea, the TV glow changes, Cico does not move. Ambient: spoons clinking, muffled TV voice (unintelligible). 8 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] SA2 ile aynı mekân ve kadraj.

---

## SA2 · Kabile · `c1_end_a_tribe`

| | |
|---|---|
| Kod / scene_id | **SA2** · `c1_end_a_tribe` |
| Tür | Son |
| Önceki sahne | **A4** Çatı (`c1_a4_rooftop`) |
| Sonraki sahne | — (bölüm sonu) |
| Mekân | Kahvehane · sabah |
| Kadro | [Cico (Aslan)] |
| Zaman / ışık | Sabah |
| Dosya adı | `SA2.png` (görsel) · `SA2.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** A son: Kabile.

**Yönetmen notu (görsel / video):** Kahvehane (c1_end_a_silence ile ortak mekân), titreyen telefonlar.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Sabah. Kabile grubunda yüzlerce okunmamış mesaj.
- *Anlatı:* Kuryeler ilk kez aynı şeyi soruyor: ROTA neyi saklıyor?
- *Telefon mesajı — Bilinmeyen numara (koşullu):* 34 AEA 8430. Ne yaptığını biliyoruz.
- *Anlatı (koşullu):* Kimse aramıyor. Henüz.
- *Telefon mesajı — Annem (koşullu):* Kira yattı oğlum. Allah razı olsun.
- *Anlatı (koşullu):* Kiraya yine yetmedi. Annesine ne yazacağını bilmiyor.
- *Tanıtım slaytı — Mendilci çocuk:* İstiklal'de mendil satar. Haritayı Cico'dan öğrendi, şehri herkesten iyi bilir.
- *Telefon mesajı — Mendilci çocuk:* Hocam, dün gece ilaç gelmedi. Babaannemi komşular hastaneye götürdü. İyi şimdi.
- *Anlatı:* Dün gece reddettiği talep, o çocuğunmuş.
- *Anlatı (koşullu):* Dün geceki ilk kararı o değil, ROTA verdi.
- *Telefon mesajı — ROTA:* Yarınki rotanız hazır. 08:00 — Galata Feneri İlkokulu.
- *Anlatı:* Alıcı adı boş.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Kahvehane · sabah] A small old Istanbul teahouse in the morning: tulip tea glasses, worn wooden tables, a wall-mounted TV glowing (screen content unreadable), morning light through steamy windows.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[SCENE SA2 · c1_end_a_tribe] Same teahouse framing as SA1: Cico's phone and other couriers' phones on nearby tables light up with notifications at once (screens unreadable). His tea is getting cold.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Phones buzz and light up one after another across the tables; Cico looks around. Ambient: buzzing, murmurs. 8 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] SA1 ile aynı mekân.

---

## SA3 · Paket Bende · `c1_end_a_escape`

| | |
|---|---|
| Kod / scene_id | **SA3** · `c1_end_a_escape` |
| Tür | Son |
| Önceki sahne | **A5** Yüksek Kaldırım (`c1_a5_chase`) |
| Sonraki sahne | — (bölüm sonu) |
| Mekân | Karaköy · şafak |
| Kadro | [Cico (Aslan)] + [Cico'nun scooter'ı] |
| Zaman / ışık | Şafak |
| Dosya adı | `SA3.png` (görsel) · `SA3.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** A son: Paket Bende.

**Yönetmen notu (görsel / video):** Şafak, Karaköy, kapalı balıkçı tentesi; açık paket kucakta, içinde diskler görünür.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Pasajın karanlığında sabaha kadar saklandı. Kimse onu bulamadı.
- *Anlatı:* Şafak. Karaköy. Paket kucağında.
- *Anlatı (koşullu):* Bandı kaldırıyor. İçinde diskler: "ROTA — Kaza Kayıtları."
- *Anlatı (koşullu):* Kanıt artık onun elinde.
- *Anlatı:* Kime verecek? Polise mi, bir gazeteciye mi, Kabile'ye mi?
- *Tanıtım slaytı — Mendilci çocuk:* İstiklal'de mendil satar. Haritayı Cico'dan öğrendi, şehri herkesten iyi bilir.
- *Telefon mesajı — Mendilci çocuk:* Hocam, dün gece ilaç gelmedi. Babaannemi komşular hastaneye götürdü. İyi şimdi.
- *Anlatı:* Dün gece reddettiği talep, o çocuğunmuş.
- *Telefon mesajı — ROTA:* Yarınki rotanız hazır. 08:00 — Galata Feneri İlkokulu.
- *Anlatı:* Alıcı adı boş.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Karaköy · şafak] Karaköy waterfront at dawn: shuttered fish stalls with striped awnings, seagulls, the first blue-pink light over the Golden Horn, wet pavement.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Cico's scooter: classic vespa-style scooter, dark green, round headlight, green delivery box on the rear rack, licence plate "34 AEA 8430", absolutely no logos or brand marks.
[SCENE SA3 · c1_end_a_escape] Dawn in Karaköy: Cico sits under the striped awning of a shuttered fish stall, the package OPEN in his lap with hard drives visible inside, scooter beside him, first light on the water.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Slow push-in, seagulls cross the frame, he looks down at the package. Ambient: water, gulls, a ferry horn. 8 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] Paket A1'deki paket.
- [ ] Gece kıyafeti, şafak ışığı.

---

## SA4 · Düşüş · `c1_end_a_fall`

| | |
|---|---|
| Kod / scene_id | **SA4** · `c1_end_a_fall` |
| Tür | Son |
| Önceki sahne | **A5c** Zarf (`c1_a5c_paper`) |
| Sonraki sahne | — (bölüm sonu) |
| Mekân | Yüksek Kaldırım |
| Kadro | [Cico (Aslan)] + [Cico'nun scooter'ı] + [Paltolu adam] |
| Zaman / ışık | Gece |
| Dosya adı | `SA4.png` (görsel) · `SA4.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** A son: Düşüş. Başarısızlık en büyük ipucunu verir: ROTA'nın risk listesi (ilk seçimde ROTA'nın neden onu seçtiğini açıklar).

**Yönetmen notu (görsel / video):** Basamaklarda oturan Cico elindeki kâğıdı okur; yüzünde aydınlanma. Kâğıdın içeriği okunmaz.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Cico zarfı açıyor. ROTA listesi: "Riskli işi reddetmeyenler."
- *Anlatı:* Dördüncü satırda: Aslan.
- *Anlatı:* Şimdi anlıyor: o paket ona tesadüfen düşmedi.
- *Tanıtım slaytı — Mendilci çocuk:* İstiklal'de mendil satar. Haritayı Cico'dan öğrendi, şehri herkesten iyi bilir.
- *Telefon mesajı — Mendilci çocuk:* Hocam, dün gece ilaç gelmedi. Babaannemi komşular hastaneye götürdü. İyi şimdi.
- *Anlatı:* Dün gece reddettiği talep, o çocuğunmuş.
- *Telefon mesajı — ROTA:* Yarınki rotanız hazır. 08:00 — Galata Feneri İlkokulu.
- *Anlatı:* Alıcı adı boş.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Yüksek Kaldırım] Yüksek Kaldırım: very steep wide stone steps descending between old buildings, wet and glistening, handrails, shuttered shops, a dark arched side passage opening on the right.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Cico's scooter: classic vespa-style scooter, dark green, round headlight, green delivery box on the rear rack, licence plate "34 AEA 8430", absolutely no logos or brand marks.
[CHARACTER] Man in the coat: tall man in his mid-40s, long charcoal wool coat, black leather gloves, clean-shaven, slicked-back dark hair with grey temples, calm unreadable half smile, perfectly dry even in rain. Stands very still. Holds a closed black umbrella.
[SCENE SA4 · c1_end_a_fall] Cico sits on the wet steps reading the opened sheet from the envelope (unreadable). Close-medium shot on his face: realisation dawning — eyes widening, jaw tightening.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Slow push-in on his face as he reads; the rain softens. Ambient: rain. 8 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] A5 ile aynı basamaklar.
- [ ] Kask kafasında — "kask onu korudu".

---

## SA5 · Masa · `c1_end_a_desk`

| | |
|---|---|
| Kod / scene_id | **SA5** · `c1_end_a_desk` |
| Tür | Son |
| Önceki sahne | **A6** İkinci Teklif (`c1_a6_second_offer`) |
| Sonraki sahne | — (bölüm sonu) |
| Mekân | ROTA ofisi |
| Kadro | [Cico (Aslan)] |
| Zaman / ışık | Bir ay sonra, gece |
| Dosya adı | `SA5.png` (görsel) · `SA5.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** A son: Masa. Karanlık son; ROTA kancası yok, kanca duran yeşil nokta.

**Yönetmen notu (görsel / video):** Ofis, gece, ekranda yeşil noktalar (harita; yazı yok).

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı (koşullu):* Cico bir şey demedi. Sessizlik "evet" sayıldı.
- *Anlatı:* Paketi verilen adrese götürüyor. Sormuyor.
- *Anlatı:* Bir ay sonra: sigortalı, sabit maaşlı, sıcak bir masa.
- *Anlatı:* Ekranda kuryeler. Her biri yeşil bir nokta.
- *Anlatı:* Bir nokta duruyor. Kıpırdamıyor.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: ROTA ofisi] A dark modern control room at night: a warm desk lamp, a large wall screen with an abstract city map made of hundreds of tiny green dots (no text), glass walls, sterile and quiet.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[SCENE SA5 · c1_end_a_desk] Cico, now in a neat dark shirt (no hoodie), sits at a desk in the ROTA control room facing the wall screen of green dots. One single dot is red and still. His face is lit cold.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Very slow push-in on the screen; all dots move except one that stops. Cico's reflection in the glass. Ambient: server hum. 8 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] Kapüşon YOK — artık masada (bilinçli değişim).

---

## SB1 · Kontak Kapatma · `c1_end_b_strike`

| | |
|---|---|
| Kod / scene_id | **SB1** · `c1_end_b_strike` |
| Tür | Son |
| Önceki sahne | **B4** Taksim İlk Yardım (`c1_b4_hospital`) |
| Sonraki sahne | — (bölüm sonu) |
| Mekân | Nevizade Sokağı |
| Kadro | [Cico (Aslan)] + [Kabile Şefi] |
| Zaman / ışık | Ertesi gece |
| Dosya adı | `SB1.png` (görsel) · `SB1.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** B son: Kontak Kapatma. Dayanışma kirayı da çözer.

**Yönetmen notu (görsel / video):** Ertesi gece Nevizade (açılış mekânı), kurye olmayan kalabalık; park edilmiş, kontağı kapalı scooter sırası.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Ertesi gece. Nevizade yine kalabalık.
- *Anlatı:* Kuryeler grevde. Hiçbir kapıya kurye gelmiyor. Şehir ilk kez onları fark ediyor.
- *Telefon mesajı — Kabile · Kabile Şefi:* Kiran için topladık babuş. Hastaneden selam var.
- *Telefon mesajı — ROTA:* Yarınki rotanız hazır. 08:00 — Galata Feneri İlkokulu.
- *Anlatı:* Alıcı adı boş.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Nevizade Sokağı] Nevizade Street, Beyoğlu at night: narrow wet cobblestone street, rows of glowing tavern and shop neon signs (döner, barber pole, café), warm windows, light fog, distant silhouettes of people, a moody moonlit sky between old buildings, puddles reflecting neon. Cico leans on a weathered wall on the right.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Tribe Chief: courier in his early 50s, broad shoulders, grey stubble and thick grey moustache, deep laugh lines, warm but tough eyes. Black armoured riding jacket with visible elbow and shoulder protectors, knee guards over dark jeans, worn full-face helmet covered in faded stickers (no readable words). Rides an older dark-blue scooter with a black delivery box.
[SCENE SB1 · c1_end_b_strike] The same Nevizade Street as O1, the next night: a real strike — couriers stand together beside a long row of parked scooters with engines off, holding blank placards and raised helmets (no text anywhere). Green flares, fists and helmets raised, tavern guests standing and filming. Cico stands at the front, determined; the Tribe Chief, arm in a sling, beside him.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Slow crane-up revealing the row of silent scooters; people look at them. Ambient: crowd, no engines. 8 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] O1 ile aynı sokak — açılışın aynası.

---

## SB2 · Manşet · `c1_end_b_headline`

| | |
|---|---|
| Kod / scene_id | **SB2** · `c1_end_b_headline` |
| Tür | Son |
| Önceki sahne | **B4** Taksim İlk Yardım (`c1_b4_hospital`) |
| Sonraki sahne | — (bölüm sonu) |
| Mekân | Taksim İlk Yardım |
| Kadro | [Cico (Aslan)] |
| Zaman / ışık | Sabah |
| Dosya adı | `SB2.png` (görsel) · `SB2.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** B son: Manşet.

**Yönetmen notu (görsel / video):** Sabah, hastane önü, telefonlarına bakan kuryeler (ekran içeriği okunmaz).

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Sabah. Bir haber sitesinde çocuğun fotoğrafı: siyah araba, plaka.
- *Anlatı:* Başlık: "Kuryeyi yoldan çıkaran araç kimin?"
- *Telefon mesajı — Mendilci çocuk:* Hocam, fotoğrafım haberlerde! Yüzüm görünmüyor, merak etme.
- *Anlatı:* Plakanın sahibi bir şirket çıkıyor. Şirketin sahibi: ROTA.
- *Telefon mesajı — Annem (koşullu):* Kira yattı oğlum. Allah razı olsun.
- *Anlatı (koşullu):* Kiraya yine yetmedi. Annesine ne yazacağını bilmiyor.
- *Telefon mesajı — ROTA:* Yarınki rotanız hazır. 08:00 — Galata Feneri İlkokulu.
- *Anlatı:* Alıcı adı boş.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Taksim İlk Yardım] A hospital emergency corridor before dawn: cold fluorescent light, plastic chairs, couriers in jackets sitting and standing with helmets in their laps, a tired night shift atmosphere.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[SCENE SB2 · c1_end_b_headline] First-person close-up: a hand holds a phone showing a news web page — the black car photo, skeleton grey bars instead of text, a small thumbnail of the kid in the corner. Behind, out of focus outside the hospital, happy couriers cheer.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Gentle handheld, morning light, the kid nudges Cico and grins. Ambient: city morning, birds. 8 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] Telefonda okunabilir yazı YOK (iskelet çubuklar).
- [ ] Babaanne ve çocuk sahnede değil; çocuk yalnızca köşedeki küçük fotoğrafta.

---

## SB3 · Kara Kutu · `c1_end_b_blackbox`

| | |
|---|---|
| Kod / scene_id | **SB3** · `c1_end_b_blackbox` |
| Tür | Son |
| Önceki sahne | **B5** Matbaa (`c1_b5_printhouse`) |
| Sonraki sahne | — (bölüm sonu) |
| Mekân | Matbaanın içi (ROTA'nın gizli merkezi) |
| Kadro | [Cico (Aslan)] + [Paltolu adam] |
| Zaman / ışık | Gece |
| Dosya adı | `SB3.png` (görsel) · `SB3.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** B son: Kara Kutu. ROTA kancası yok; kanca adamın kendisi.

**Yönetmen notu (görsel / video):** Matbaanın içi: ekranlar, masa, liste (içerik UI kartında). Arkada paltolu adam.

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı (koşullu):* Cico camın önünde donup kalıyor. Kapı arkasından açılıyor.
- *Anlatı:* İçeride ekranlar, bir masa, bir liste: "Riskli işi reddetmeyenler."
- *Anlatı:* Dördüncü satırda: Aslan. Yanında: "Bu gece seçildi."
- *Tanıtım slaytı — Paltolu adam:* Kimse adını bilmiyor. O herkesinkini biliyor.
- *Konuşma — Paltolu adam:* Hoş geldin, Kurye 2608. Geleceğini biliyorduk.
- *Konuşma — Paltolu adam:* İlk talepten beri her durağını izledik. Artık kontrol odasındasın. Hazırsın.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Matbaanın içi (ROTA'nın gizli merkezi)] Inside the old print shop: abandoned printing presses pushed aside, a row of glowing monitors on makeshift tables showing maps of tiny green dots (no text), cables everywhere, a desk with a printed list (unreadable).
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Man in the coat: tall man in his mid-40s, long charcoal wool coat, black leather gloves, clean-shaven, slicked-back dark hair with grey temples, calm unreadable half smile, perfectly dry even in rain. Stands very still. Holds a closed black umbrella.
[SCENE SB3 · c1_end_b_blackbox] Inside the print shop: Cico in the foreground looks at the wall of monitors with green dots and a desk with a printed list. Behind him in the doorway, the Man in the coat stands calmly.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Slow push-in on Cico's shocked face, then rack focus to the man behind him. Ambient: electronic hum. 8 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] B5'teki matbaanın içi.
- [ ] Paltolu adam bu katmanda ilk kez görünüyor.

---

## SB4 · Kanıt · `c1_end_b_evidence`

| | |
|---|---|
| Kod / scene_id | **SB4** · `c1_end_b_evidence` |
| Tür | Son |
| Önceki sahne | **B5** Matbaa (`c1_b5_printhouse`) |
| Sonraki sahne | — (bölüm sonu) |
| Mekân | Tarlabaşı · eski matbaa |
| Kadro | [Cico (Aslan)] + [Cico'nun scooter'ı] |
| Zaman / ışık | Şafak |
| Dosya adı | `SB4.png` (görsel) · `SB4.mp4` (video) |
| Mevcut | görsel ✓ |

**Sahnenin işlevi:** B son: Kanıt.

**Yönetmen notu (görsel / video):** Şafak, Tarlabaşı, scooter'da telefona bakan Cico (ekran içeriği okunmaz).

**Ekranda çıkan yazılar** (görsele YAZILMAZ; oyun bunları kart olarak üstüne koyar — sahnenin duygusunu anlamak için):

- *Anlatı:* Fotoğrafta ekranlar, noktalar ve kıpırdamayan bir nokta.
- *Anlatı:* Kaçarken bir flaş patladı. 34 AEA 8430 artık onların listesinde.
- *Anlatı:* Kazalar kader değil. ROTA her şeyin farkında.
- *Anlatı:* Ve Cico bunun peşini bırakacak gibi değil.
- *Telefon mesajı — Annem (koşullu):* Kira yattı oğlum. Allah razı olsun.
- *Anlatı (koşullu):* Kiraya yine yetmedi. Annesine ne yazacağını bilmiyor.
- *Telefon mesajı — ROTA:* Yarınki rotanız hazır. 08:00 — Galata Feneri İlkokulu.
- *Anlatı:* Alıcı adı boş.



**Görsel promptu (ChatGPT):**

```text
[STYLE] Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain. Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.
[LOCATION: Tarlabaşı · eski matbaa] Back street in Tarlabaşı: a narrow old print shop with its sign torn off (only screw holes and a pale rectangle remain), half-raised rusty roller shutter, a heavy green wooden door with peeling paint, a low basement window glowing faintly blue, cracked plaster walls, a single sodium street lamp, wet asphalt.
[CHARACTER] Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.
[CHARACTER] Cico's scooter: classic vespa-style scooter, dark green, round headlight, green delivery box on the rear rack, licence plate "34 AEA 8430", absolutely no logos or brand marks.
[SCENE SB4 · c1_end_b_evidence] Dawn in a Tarlabaşı back street: Cico sits on his scooter looking at his phone (screen unreadable), relieved but tense; behind him far away, the print shop's green door.
[RULES] No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted. Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters. No logos or brand names on any vehicle, helmet, bag or clothing. No UI, captions, subtitles, watermarks or borders in the image. No blood or graphic injury. Falls and accidents are shown by aftermath and implication. No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes. Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D. Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.
[AVOID] text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore
```

**Video promptu (Google Flow · görselden videoya · 9:16):**

```text
Slow pull-back as the first light hits the street; he pockets the phone and starts the engine. Ambient: dawn birds, scooter engine. 8 seconds.
```

**Devamlılık kontrolü:**

- [ ] Karakterler karakter kartlarıyla birebir aynı mı? (Cico: yeşil kapüşon, SOL omuzda 26 rozeti, çenede yarı açık kask)
- [ ] B5'teki sokak, şafak ışığında.
- [ ] Polaroid SB4p (assets/scenes/SB4p_c1_end_b_evidence_polaroid.jpg): "Kaçarken bir flaş patladı" vuruşunda üstte belirir — Cico'nun scooter'ı hızla kaçarken arkadan, flaşla donmuş.

