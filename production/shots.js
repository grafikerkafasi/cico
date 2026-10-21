/*
 * CİCO — görsel/video üretim tanımları (sahne koduna göre).
 * docs/uretim-rehberi.md bu dosyadan + sahne verisinden üretilir: `npm run bible`.
 *
 * Her sahne:
 *   location : LOCATIONS anahtarı (mekân kartı)
 *   cast     : CHARACTERS anahtarları (görünen karakterler)
 *   time     : günün saati / ışık
 *   image    : görsel promptu (İngilizce; görsel modelleri İngilizcede daha isabetli)
 *   spots    : { choiceId: 'görselde o noktada görünmesi gereken nesne' } — koordinat sahne verisindeki hotspot'tan gelir
 *   video    : Google Flow (görselden videoya) promptu
 *   loop     : true → seçim beklerken dönen döngü videosu (ilk ve son kare aynı)
 *   continuity: önceki sahneyle eşleşmesi gerekenler
 */
(function () {
  'use strict';

  const STYLE = {
    look: 'Pixar-style stylized 3D animated film still. Soft rounded shapes, expressive faces with large eyes, ' +
      'cinematic lighting with warm/cool contrast, rich but realistic textures (wet cobblestone, fog, neon reflections, worn plaster). ' +
      'Night Istanbul (Beyoğlu, Galata, Tarlabaşı). Shallow depth of field, gentle film grain.',
    frame: 'Vertical 9:16 portrait frame (e.g. 1080×1920). Main subject between 15% and 80% of the frame height.',
    rules: [
      'No readable text anywhere that carries story information: phone screens show only a soft glow, papers and lists are blurred, plates unreadable except where noted.',
      'Atmospheric neon signs may exist but must not spell game-relevant words; prefer shapes and partial letters.',
      'No logos or brand names on any vehicle, helmet, bag or clothing.',
      'No UI, captions, subtitles, watermarks or borders in the image.',
      'No blood or graphic injury. Falls and accidents are shown by aftermath and implication.',
      'No readable text in ANY language (signs, packaging, screens): the game is global. Signs are blank or show only icons/shapes.',
      'Galata Tower appears only in A3 and A6. Locations are geographically realistic Istanbul, but the RENDER STYLE always stays Pixar-like stylized 3D.',
      'Keep the top 14% (notifications, pause button) and bottom 20% (subtitles) free of important details.',
    ],
    negative: 'text overlay, captions, UI, watermark, logo, brand name, readable screen, extra fingers, distorted hands, horizontal frame, letterbox, blood, gore',
  };

  const CHARACTERS = {
    cico: {
      name: 'Cico (Aslan)',
      tr: 'Ana karakter. Değişmez sabitler — her sahnede aynı.',
      prompt: 'Cico: 26-year-old Turkish man, light patchy stubble, tired but charismatic eyes, short dark hair. ' +
        'Dark forest-green hoodie with a clearly visible round light-coloured "26" badge on his LEFT shoulder. ' +
        'Dark trousers, dark sneakers. Open-face helmet worn half-open at the chin, visor up, NO lights or gadgets on the back of the helmet. ' +
        'Always keep his light stubble and thin moustache. To keep the badge on the LEFT shoulder, show him facing the LEFT of the frame (his left side to camera); ' +
        'if seen from behind, the badge is on the shoulder on the image-left side. The licence plate is only at the REAR of the scooter.',
      ref: 'Geliştiricinin karakter sayfası (önden / yandan / arkadan / üst çapraz) — her üretimde referans olarak ekle.',
    },
    scooter: {
      name: 'Cico\'nun scooter\'ı',
      tr: 'Cico\'nun aracı. Plaka yalnızca plakaya yakın planda okunur.',
      prompt: 'Cico\'s scooter: classic vespa-style scooter, dark green, round headlight, green delivery box on the rear rack, ' +
        'licence plate "34 AEA 8430", absolutely no logos or brand marks.',
      ref: 'Geliştiricinin scooter sayfası (5 açı).',
    },
    chief: {
      name: 'Kabile Şefi',
      tr: 'Yirmi yıllık kurye, kuryelerin "şefi". Koruyucu ekipmanını hiç çıkarmaz (hikâyedeki "korumaların üstündeydi" sözü).',
      prompt: 'Tribe Chief: courier in his early 50s, broad shoulders, grey stubble and thick grey moustache, deep laugh lines, warm but tough eyes. ' +
        'Black armoured riding jacket with visible elbow and shoulder protectors, knee guards over dark jeans, worn full-face helmet covered in faded stickers ' +
        '(no readable words). Rides an older dark-blue scooter with a black delivery box.',
    },
    kid: {
      name: 'Mendilci çocuk',
      tr: 'İstiklal\'de mendil satan 11 yaşında çocuk. Cico\'ya "Hocam" der.',
      prompt: 'Tissue seller kid: 11-year-old boy, thin, messy black hair, big curious bright eyes, faded oversized red hoodie with sleeves rolled up, ' +
        'worn white sneakers, carries a small clear plastic box of tissue packets. Clever, street-smart expression.',
    },
    man: {
      name: 'Paltolu adam',
      tr: 'ROTA\'nın içinden biri. Kimse adını bilmiyor; o herkesinkini biliyor. Hiç ıslanmaz.',
      prompt: 'Man in the coat: tall man in his mid-40s, long charcoal wool coat, black leather gloves, clean-shaven, slicked-back dark hair with grey temples, ' +
        'calm unreadable half smile, perfectly dry even in rain. Stands very still. Holds a closed black umbrella.',
    },
    car: {
      name: 'Siyah araba ("demir kafes")',
      tr: 'Şebekenin aracı. Plakası okunmaz.',
      prompt: 'Black car: black sedan with fully tinted windows, no logos, plate unreadable, headlights often the only visible part, reads as a dark "iron cage".',
    },
    grandma: {
      name: 'Babaanne (yalnızca B1\'de arka planda)',
      tr: 'Yüzü net görünmez.',
      prompt: 'Elderly woman in a light headscarf sitting on a worn sofa in the background, softly out of focus.',
    },
  };

  const LOCATIONS = {
    nevizade: {
      name: 'Nevizade Sokağı',
      prompt: 'Nevizade Street, Beyoğlu at night: narrow wet cobblestone street, rows of glowing tavern and shop neon signs (döner, barber pole, café), ' +
        'warm windows, light fog, distant silhouettes of people, a moody moonlit sky between old buildings, puddles reflecting neon. Cico leans on a weathered wall on the right.',
      ref: 'O1 görseli (assets/scenes/c1_s01_nevizade.jpg) bu mekânın kanonik hâli.',
    },
    printhouse: {
      name: 'Tarlabaşı · eski matbaa',
      prompt: 'Back street in Tarlabaşı: a narrow old print shop with its sign torn off (only screw holes and a pale rectangle remain), half-raised rusty roller shutter, ' +
        'a heavy green wooden door with peeling paint, a low basement window glowing faintly blue, cracked plaster walls, a single sodium street lamp, wet asphalt.',
    },
    school: {
      name: 'Galata Feneri İlkokulu (kurgusal)',
      prompt: 'A small old primary school in Galata at night: tall iron railings, a noticeboard with children\'s crayon drawings, dark classrooms with chairs upturned on desks visible through windows, ' +
        'a single lamp, soft desaturated palette, quiet and still.',
    },
    tower: {
      name: 'Galata Kulesi meydanı',
      prompt: 'The foot of Galata Tower at night: empty cobbled square, the tower lit warm from below rising into the frame, closed café chairs stacked, wet ground reflecting the tower lights, ' +
        'narrow streets sloping away.',
    },
    rooftop: {
      name: 'Galata\'da bir çatı',
      prompt: 'A Galata rooftop at night: low parapet, satellite dishes and water tanks, the city lights of Beyoğlu and the Golden Horn below, distant tiny moving headlights of couriers on the roads.',
    },
    stairs: {
      name: 'Yüksek Kaldırım',
      prompt: 'Yüksek Kaldırım: very steep wide stone steps descending between old buildings, wet and glistening, handrails, shuttered shops, a dark arched side passage opening on the right.',
    },
    karakoy: {
      name: 'Karaköy · şafak',
      prompt: 'Karaköy waterfront at dawn: shuttered fish stalls with striped awnings, seagulls, the first blue-pink light over the Golden Horn, wet pavement.',
    },
    teahouse: {
      name: 'Kahvehane · sabah',
      prompt: 'A small old Istanbul teahouse in the morning: tulip tea glasses, worn wooden tables, a wall-mounted TV glowing (screen content unreadable), morning light through steamy windows.',
    },
    office: {
      name: 'ROTA ofisi',
      prompt: 'A dark modern control room at night: a warm desk lamp, a large wall screen with an abstract city map made of hundreds of tiny green dots (no text), glass walls, sterile and quiet.',
    },
    pharmacy: {
      name: 'Nöbetçi eczane / Dolapdere',
      prompt: 'A night pharmacy with a glowing green cross, then a crumbling Dolapdere apartment entrance with chipped stairs, a dim yellow stairwell bulb and a half-open wooden door.',
    },
    boulevard: {
      name: 'Tarlabaşı Bulvarı',
      prompt: 'Tarlabaşı Boulevard at night: wide multi-lane road, orange sodium lights, wet asphalt, a kerb and pavement, side streets disappearing into darkness, distant ambulance lights.',
    },
    hospital: {
      name: 'Taksim İlk Yardım',
      prompt: 'A hospital emergency corridor before dawn: cold fluorescent light, plastic chairs, couriers in jackets sitting and standing with helmets in their laps, a tired night shift atmosphere.',
    },
    beyoglu: {
      name: 'Beyoğlu · ıslak cadde',
      prompt: 'A narrow wet street in Beyoğlu at night: shuttered shops, warm street lamps streaking with motion blur, reflections on wet asphalt, old facades with balconies. No Galata Tower.',
    },
    tower_hill: {
      name: 'Kuleye çıkan yokuş',
      prompt: 'A steep narrow cobbled street climbing towards Galata Tower at night, wet stones, warm lamps on old facades; the tower appears only as a distant lit silhouette at the top of the slope.',
    },
    classroom: {
      name: 'Sınıf (hayal)',
      prompt: 'A bright primary school classroom in the morning: green chalkboard with a simple chalk world map and arrows (no letters), wooden desks, sunlight through tall windows, dreamy overexposed warm glow.',
    },
    printhouse_inside: {
      name: 'Matbaanın içi (ROTA\'nın gizli merkezi)',
      prompt: 'Inside the old print shop: abandoned printing presses pushed aside, a row of glowing monitors on makeshift tables showing maps of tiny green dots (no text), cables everywhere, a desk with a printed list (unreadable).',
    },
  };

  const SHOTS = {
    O1: {
      location: 'nevizade', cast: ['cico', 'scooter'], time: '23:50, gece, ıslak zemin, hafif sis',
      image: 'Cico leans against the weathered wall on the right side of Nevizade Street, arms crossed, watching people laugh and drink in the taverns. ' +
        'His green scooter is parked in the foreground lower half, mirrors catching neon. He looks tired but alert. Warm neon on the left, cool moonlight above.',
      video: 'Slow push-in towards Cico\'s face. Neon flickers, fog drifts, distant silhouettes walk and laugh, rain drops fall from a pipe. ' +
        'Near the end his eyes narrow slightly and his phone lights up his face. Ambient sound only: tavern laughter, a distant darbuka, light rain. No speech, no music. 8 seconds.',
      loop: true,
      continuity: ['Kanonik açılış görseli zaten var (O1). Video bu görselden üretilmeli.'],
    },
    O2: {
      location: 'nevizade', cast: ['cico', 'scooter'], time: 'O1 ile aynı an',
      image: 'Same framing as O1: Cico has pulled out his phone and stares at the glowing screen (screen content not visible), surprised and tempted. ' +
        'The scooter and its green delivery box are clearly visible in the lower right foreground.',
      spots: { envelope: 'telefonun üstünde süzülen paket kartı', medicine: 'telefonun sağında süzülen ilaç kartı' },
      video: 'Locked-off shot, almost still: phone glow pulses on Cico\'s face, his thumb hovers, fog drifts, neon reflections shimmer in puddles. ' +
        'Seamless loop: first and last frame identical. Ambient street sound only. 8 seconds.',
      loop: true,
      continuity: ['Kanonik görsel O1 ile aynı (oyunda O2 de bu görseli kullanıyor). İstersen yalnızca telefona daha yakın bir varyasyon üret.'],
    },
    O3: {
      location: 'beyoglu', cast: ['cico', 'scooter'], time: 'Gece yarısı',
      image: 'Dynamic low 3/4 front-side angle: Cico speeds through a wet Beyoğlu street on his green scooter towards the image-left, serious and focused; street lamps streak with motion blur behind him. No front plate.',
      video: 'Tracking shot alongside the scooter; lights streak past, water sprays from the tyres. Ambient: engine, rain hiss. 6 seconds.',
      continuity: ['İki katmanın ortak son karesi: paket ya da ilaç görünmez, yalnızca sırttaki çanta.', 'Galata Kulesi YOK.'],
    },
    A1: {
      location: 'printhouse', cast: ['cico'], time: 'Gece yarısına 5 kala',
      image: 'Close-medium shot at the green door of the old print shop: a gloved hand withdraws into the dark doorway as Cico holds a heavy sealed package with red-and-white security tape in both hands at the centre of the frame. ' +
        'One corner of the tape is visibly lifted. His scooter waits in the lower left, delivery box open.',
      spots: { open: 'Cico\'nun elindeki bantlı paket', keep_closed: 'sağ alttaki yeşil teslimat kutusu' },
      video: 'Slight handheld feel: the door slams shut, Cico looks down at the package, his thumb hesitates over the lifted tape corner. Seamless loop of his hesitation. ' +
        'Ambient: distant traffic, a dog barking. No speech. 8 seconds.',
      loop: true,
      continuity: ['Cico\'nun kıyafeti ve kask durumu O1 ile aynı (kask çenede yarı açık).', 'Zemin hâlâ ıslak; ışık sarı sokak lambası.'],
    },
    A1a: {
      location: 'printhouse', cast: ['cico', 'scooter'], time: 'A1\'den birkaç dakika sonra',
      image: 'The same print shop, now with the roller shutter fully down and the street empty. Under the street lamp Cico has opened the package: a black hard drive inside (label unreadable). ' +
        'Close-medium shot, his face clearly shocked — wide eyes, raised brows, mouth slightly open. He faces image-left so the 26 badge on his left shoulder shows.',
      video: 'Slow push-in on his face as he lifts the flap; the lamp flickers once. Ambient: rain, distant traffic. 6 seconds.',
      continuity: ['A1 ile aynı sokak; kepenk artık İNİK, gönderici yok.', 'Paket bandı kırmızı-beyaz.'],
    },
    A1b: {
      location: 'printhouse', cast: ['cico', 'scooter'], time: 'A1a\'nın hemen ardından',
      image: '3/4 rear-side view: the package is back in the rear delivery box, Cico swings a leg over his scooter, hand on the handlebar, glancing down the empty street. Rear plate 34 AEA 8430 visible.',
      video: 'He mounts, the tail light glows, the scooter pulls away down the wet street. Ambient: engine starting. 5 seconds.',
      continuity: ['A1a ile aynı sokak ve lamba.'],
    },
    A2: {
      location: 'school', cast: ['cico', 'scooter'], time: 'Gece, ağır çekim',
      image: 'Side view: Cico rides slowly past the iron railings of the dark primary school, his head turned towards the children\'s drawings. ' +
        'The package is in his rear delivery box. Desaturated palette except a faint warm lamp. Melancholic and quiet.',
      video: 'SLOW MOTION tracking shot alongside Cico as the scooter rolls past the railings ("fıtı fıtı", slow and peaceful). Drawings flutter slightly. ' +
        'A brief soft memory flash: chalk on a blackboard, a child\'s raised hand (faces not visible). Sparse soft piano is allowed here only. 8 seconds.',
      continuity: ['A1\'deki paket artık teslimat kutusunun içinde.', 'Renk paleti diğer sahnelerden daha soluk (anma anı).',
        'Hayal karesi A2f (assets/scenes/A2f_c1_a2f_flashback.jpg): "Bir zamanlar tahtanın önünde..." vuruşunda görselin üstüne yumuşakça gelir. ' +
        'Cico gündüz bir sınıfta öğretmen: gömlek ve hırka, kask ve rozet yok, tahtada yalnızca tebeşir harita (yazı yok), öğrencilerin kalkan elleri, sıcak aşırı pozlanmış ışık.'],
    },
    A3a: {
      location: 'tower_hill', cast: ['cico', 'scooter', 'man', 'car'], time: 'Gece yarısı',
      image: 'On the hill up to the tower, the long black sedan has swung across the road, headlights glaring. Cico brakes hard, one foot down. The rear door opens and the Man in the coat steps out, calm and threatening. ' +
        'Camera behind Cico\'s right side: no badge visible.',
      video: 'The car swerves in, brakes squeal, the door opens slowly; the man\'s shoe touches the wet cobbles. Ambient: idling engine, rain. 6 seconds.',
      continuity: ['Paltolu adam bu sahnede ilk kez görünüyor — karakter kartına sadık kal.', 'Kule yalnızca uzakta silüet.'],
    },
    A3: {
      location: 'tower', cast: ['cico', 'man', 'car'], time: 'Gece yarısı',
      image: 'At the foot of Galata Tower: the Man in the coat stands calmly in the centre-left holding out his gloved hand towards the viewer, face lit from below, eyes in the upper-centre of the frame. ' +
        'Cico stands in the foreground right next to his scooter, the package under his arm. Right behind the man, the long black sedan blocks the road, rear door open, headlights on — he has just cut Cico off.',
      spots: { hand_over: 'paltolu adamın uzanmış eldivenli eli (orta sol)', run: 'sağdaki scooter gidonu ve aynası (kaçış)', confront: 'adamın yüzü (üst sol-orta)' },
      video: 'Slow dolly-in on the outstretched gloved hand; the black car\'s headlights flick on behind. The man does not blink. Seamless tense loop. ' +
        'Ambient: wind, distant seagulls, a low engine idling. No speech. 8 seconds.',
      loop: true,
      continuity: ['Paket A1/A2\'deki ile aynı (kırmızı-beyaz bant).', 'Paltolu adam bu sahnede ilk kez görünüyor — karakter kartına sadık kal.'],
    },
    A4: {
      location: 'rooftop', cast: ['cico'], time: 'Gece yarısından sonra',
      image: 'Cico sits on the rooftop parapet, silhouetted against the city lights, his phone glowing in his hand at the centre-right. His helmet rests on the ledge at the lower left. ' +
        'Tiny moving lights of couriers on the roads below.',
      spots: { tip_off: 'Cico\'nun elindeki parlayan telefon (orta sağ)', stay_silent: 'sol alttaki çatı kenarında duran kask (susup eve dönmek)' },
      video: 'Very slow orbit around Cico; city lights twinkle, courier headlights crawl along the roads below. His thumb hovers over the screen. Seamless loop. ' +
        'Ambient: distant city hum, wind. 8 seconds.',
      loop: true,
      continuity: ['Paket artık yok (teslim edildi).', 'Kask kafasında değil, kenarda.'],
    },
    A5: {
      location: 'stairs', cast: ['cico', 'scooter', 'car'], time: 'Gece, kovalamaca',
      image: 'High-energy wide shot: Cico on his scooter at the top of Yüksek Kaldırım, package clutched under his arm. To the lower left the steep wet stone steps plunge down; ' +
        'to the right a dark arched passage opens, empty inside. Behind him the black car\'s doors swing open, headlights glaring.',
      spots: { stairs: 'sol alttaki dik, ıslak basamaklar', passage: 'sağ üstteki kemerli pasaj' },
      video: 'Fast handheld energy: scooter engine revs, headlights sweep across the walls, car doors open behind. Hold on the moment of decision. Seamless loop of the revving moment. ' +
        'Ambient: engine, footsteps, rain. 8 seconds. Extra outcome clips: (1) scooter descending the steps, (2) scooter vanishing into the passage.',
      loop: true,
      continuity: ['Paket hâlâ Cico\'da.', 'Kask kafasında, çenede yarı açık.'],
    },
    A5b: {
      location: 'stairs', cast: ['cico', 'scooter', 'man'], time: 'Gece',
      image: 'Aftermath at the bottom of the wet steps: the green scooter on its side, Cico sitting up, helmet on, unhurt but shaken. Up the steps, the Man in the coat walks away with the package. No paper near Cico.',
      video: 'Rain on stones, the man\'s footsteps fade up the steps. No impact shown. Ambient: rain. 6 seconds.',
      continuity: ['A5 ile aynı basamaklar.', 'Kask kafasında — "kask onu korudu".'],
    },
    A5c: {
      location: 'stairs', cast: [], time: 'A5b\'nin hemen ardından',
      image: 'Close-up: a folded envelope lying on the wet stones (nothing readable), raindrops hitting around it; the steps blurred behind. The man is gone.',
      video: 'Macro shot, a raindrop lands on the envelope; a shadow (Cico) falls over it. Ambient: rain. 5 seconds.',
      continuity: ['A5b ile aynı taşlar ve ışık.'],
    },
    A6: {
      location: 'tower', cast: ['cico', 'man'], time: 'A3 ile aynı an',
      image: 'Two-shot close-up at the foot of Galata Tower: the Man in the coat holds up a folded sheet of paper (unreadable) in his gloved hand at the centre-left, offering it. ' +
        'Cico, in the lower right, clutches the package to his chest. The city noise seems to fall silent; background softly blurred.',
      spots: { accept: 'adamın elindeki katlanmış kâğıt (orta sol)', refuse: 'Cico\'nun göğsüne bastırdığı paket (sağ alt)' },
      video: 'Slow push-in between the two faces; all background motion slows down and sound fades to near silence. Seamless loop. 8 seconds.',
      loop: false,
      continuity: ['A3 ile aynı mekân, aynı ışık; kamera daha yakın.'],
    },
    B0: {
      location: 'pharmacy', cast: ['cico', 'scooter'], time: 'Gece yarısı',
      image: 'Outside a night pharmacy: a glowing green cross sign with no letters, Cico beside his scooter holding a small white pharmacy bag, tired but kind. Wet pavement reflects the green light.',
      video: 'He tucks the bag into the box and starts the engine. Ambient: night street, the sign buzzing. 5 seconds.',
      continuity: ['Tabelada yazı YOK; yalnızca yeşil haç.'],
    },
    B1: {
      location: 'pharmacy', cast: ['cico', 'kid', 'grandma'], time: 'Gece yarısı',
      image: 'In a crumbling Dolapdere stairwell, a half-open wooden door: the tissue seller kid peeks out, surprised and happy to see Cico, who holds a small white pharmacy bag. ' +
        'Through the gap, the grandmother sits on a sofa in the soft-focus background.',
      video: 'Gentle handheld: the door creaks open, the kid\'s face lights up ("Hocam?"), Cico smiles tiredly and hands over the bag. Warm and intimate. ' +
        'Ambient: stairwell echo, a TV murmuring inside. No intelligible speech. 8 seconds.',
      continuity: ['Cico\'nun kıyafeti O1 ile aynı.', 'Çocuk bu sahnede ilk kez görünüyor — karakter kartına sadık kal.'],
    },
    B2: {
      location: 'pharmacy', cast: ['cico', 'kid'], time: 'B1 ile aynı an',
      image: 'Same doorway, closer: the kid holds up his phone towards Cico at the centre-right (screen shows only a soft glow), whispering seriously. ' +
        'The door\'s old lock and chain are visible at the lower left.',
      spots: { take_photo: 'kırmızı kapüşonlu kolun uzattığı telefon (orta)', delete_photo: 'sol alttaki pirinç kilit ve zincir (kapını kilitle)' },
      video: 'Quiet close shot, the kid glances down the stairwell nervously, phone glow on both faces. Seamless loop. Ambient: dripping, distant siren. 8 seconds.',
      loop: true,
      continuity: ['B1 ile aynı kapı ve ışık.'],
    },
    B2a: {
      location: 'boulevard', cast: ['chief', 'car'], time: 'B2 ile aynı saatler',
      image: 'Tarlabaşı Boulevard at night: the Tribe Chief rides his dark-blue scooter, one hand on the handlebar, typing on his phone with the other (screen unreadable). Behind him, the black car\'s headlights close in.',
      video: 'Tracking shot beside the chief; he glances back at the headlights. Ambient: traffic, engine. 6 seconds.',
      continuity: ['Kabile Şefi ilk kez fiziksel olarak görünüyor — koruyucu ekipmanı üzerinde.', 'Paket arka kutuda.'],
    },
    B3: {
      location: 'boulevard', cast: ['cico', 'chief', 'car'], time: 'Gece yarısından sonra',
      image: 'On Tarlabaşı Boulevard: the Tribe Chief sits on the kerb at the centre-left beside his tipped-over dark-blue scooter, helmet cracked but conscious, raising a hand to wave Cico on. ' +
        'His black delivery box lies open and empty. In the upper right, the black car\'s red tail lights turn into a dark side street. Cico has just pulled up in the foreground.',
      spots: { stay: 'kaldırımda oturan Kabile Şefi (orta sol)', chase: 'sağ üstte ara sokağa sapan siyah arabanın stop lambaları' },
      video: 'Handheld, tense: the tail lights disappear into the side street, distant ambulance lights pulse blue, the chief grimaces and gestures "go". Seamless loop. ' +
        'Ambient: traffic, distant siren, the chief\'s heavy breathing. No blood. 8 seconds.',
      loop: true,
      continuity: ['Kabile Şefi bu sahnede ilk kez fiziksel olarak görünüyor — koruyucu ekipmanı üzerinde.', 'Çanta kapağı açık, paket yok.'],
    },
    B3a: {
      location: 'boulevard', cast: ['cico', 'scooter', 'car'], time: 'B3\'ün hemen ardından',
      image: 'A Tarlabaşı back street: ahead, the black car\'s red tail lights; Cico follows at a distance with his headlight off, half hidden at a corner, eyes fixed on the car.',
      video: 'Slow creeping follow shot; the car slows and stops. Ambient: idling engines. 6 seconds.',
      continuity: ['B3 ile aynı gece; Cico\'nun farı kapalı.'],
    },
    B4: {
      location: 'hospital', cast: ['cico', 'chief'], time: 'Sabaha karşı',
      image: 'Hospital corridor: on the left, a group of couriers in jackets with helmets in their laps gathers, looking at Cico. ' +
        'The Tribe Chief sits on a plastic chair with a bandaged arm, staring at his phone. Cico stands at the lower right holding his own phone.',
      spots: { strike: 'soldaki kurye grubu (Kabile)', press: 'ortada oturan Cico' },
      video: 'Slow lateral dolly along the corridor past tired couriers; fluorescent light flickers once. Seamless loop. Ambient: hospital hum, distant beeps, murmurs. 8 seconds.',
      loop: false,
      continuity: ['Kabile Şefi B3\'teki kıyafetiyle, kolu sargılı.', 'Cico\'nun kaskı elinde.'],
    },
    B5: {
      location: 'printhouse', cast: ['cico', 'car'], time: 'Gece yarısından sonra',
      image: 'The same old print shop as A1 (same green door, torn sign, roller shutter): the black car is parked outside. The green door is slightly ajar at the centre, spilling light. ' +
        'At the lower left, the basement window glows with rows of monitors full of green dots. Cico crouches in the shadows of the foreground.',
      spots: { enter: 'ortadaki aralık yeşil kapı', photo_run: 'sol alttaki, ekranların göründüğü bodrum penceresi' },
      video: 'Slow creeping push-in towards the ajar door; monitor glow flickers in the basement window. Seamless loop. Ambient: humming electronics, distant traffic. 8 seconds.',
      loop: true,
      continuity: ['A1 ile AYNI matbaa (kapı rengi, sökülmüş tabela, kepenk). İki katmanın aynası.'],
    },
    SA1: {
      location: 'teahouse', cast: ['cico'], time: 'Sabah',
      image: 'Morning teahouse: Cico sits alone at a worn table with an untouched tulip glass of tea, staring at the wall TV (screen unreadable). Morning light, steam.',
      video: 'Static shot, steam rises from the tea, the TV glow changes, Cico does not move. Ambient: spoons clinking, muffled TV voice (unintelligible). 8 seconds.',
      continuity: ['SA2 ile aynı mekân ve kadraj.'],
    },
    SA2: {
      location: 'teahouse', cast: ['cico'], time: 'Sabah',
      image: 'Same teahouse framing as SA1: Cico\'s phone and other couriers\' phones on nearby tables light up with notifications at once (screens unreadable). His tea is getting cold.',
      video: 'Phones buzz and light up one after another across the tables; Cico looks around. Ambient: buzzing, murmurs. 8 seconds.',
      continuity: ['SA1 ile aynı mekân.'],
    },
    SA3: {
      location: 'karakoy', cast: ['cico', 'scooter'], time: 'Şafak',
      image: 'Dawn in Karaköy: Cico sits under the striped awning of a shuttered fish stall, the package OPEN in his lap with hard drives visible inside, scooter beside him, first light on the water.',
      video: 'Slow push-in, seagulls cross the frame, he looks down at the package. Ambient: water, gulls, a ferry horn. 8 seconds.',
      continuity: ['Paket A1\'deki paket.', 'Gece kıyafeti, şafak ışığı.'],
    },
    SA4: {
      location: 'stairs', cast: ['cico', 'scooter', 'man'], time: 'Gece',
      image: 'Cico sits on the wet steps reading the opened sheet from the envelope (unreadable). Close-medium shot on his face: realisation dawning — eyes widening, jaw tightening.',
      video: 'Slow push-in on his face as he reads; the rain softens. Ambient: rain. 8 seconds.',
      continuity: ['A5 ile aynı basamaklar.', 'Kask kafasında — "kask onu korudu".'],
    },
    SA5: {
      location: 'office', cast: ['cico'], time: 'Bir ay sonra, gece',
      image: 'Cico, now in a neat dark shirt (no hoodie), sits at a desk in the ROTA control room facing the wall screen of green dots. One single dot is red and still. His face is lit cold.',
      video: 'Very slow push-in on the screen; all dots move except one that stops. Cico\'s reflection in the glass. Ambient: server hum. 8 seconds.',
      continuity: ['Kapüşon YOK — artık masada (bilinçli değişim).'],
    },
    SB1: {
      location: 'nevizade', cast: ['cico', 'chief'], time: 'Ertesi gece',
      image: 'The same Nevizade Street as O1, the next night: a real strike — couriers stand together beside a long row of parked scooters with engines off, holding blank placards and raised helmets (no text anywhere). ' +
        'Green flares, fists and helmets raised, tavern guests standing and filming. Cico stands at the front, determined; the Tribe Chief, arm in a sling, beside him.',
      video: 'Slow crane-up revealing the row of silent scooters; people look at them. Ambient: crowd, no engines. 8 seconds.',
      continuity: ['O1 ile aynı sokak — açılışın aynası.'],
    },
    SB2: {
      location: 'hospital', cast: ['cico'], time: 'Sabah',
      image: 'First-person close-up: a hand holds a phone showing a news web page — the black car photo, skeleton grey bars instead of text, a small thumbnail of the kid in the corner. ' +
        'Behind, out of focus outside the hospital, happy couriers cheer.',
      video: 'Gentle handheld, morning light, the kid nudges Cico and grins. Ambient: city morning, birds. 8 seconds.',
      continuity: ['Telefonda okunabilir yazı YOK (iskelet çubuklar).', 'Babaanne ve çocuk sahnede değil; çocuk yalnızca köşedeki küçük fotoğrafta.'],
    },
    SB3: {
      location: 'printhouse_inside', cast: ['cico', 'man'], time: 'Gece',
      image: 'Inside the print shop: Cico in the foreground looks at the wall of monitors with green dots and a desk with a printed list. Behind him in the doorway, the Man in the coat stands calmly.',
      video: 'Slow push-in on Cico\'s shocked face, then rack focus to the man behind him. Ambient: electronic hum. 8 seconds.',
      continuity: ['B5\'teki matbaanın içi.', 'Paltolu adam bu katmanda ilk kez görünüyor.'],
    },
    SB4: {
      location: 'printhouse', cast: ['cico', 'scooter'], time: 'Şafak',
      image: 'Dawn in a Tarlabaşı back street: Cico sits on his scooter looking at his phone (screen unreadable), relieved but tense; behind him far away, the print shop\'s green door.',
      video: 'Slow pull-back as the first light hits the street; he pockets the phone and starts the engine. Ambient: dawn birds, scooter engine. 8 seconds.',
      continuity: ['B5\'teki sokak, şafak ışığında.',
        'Polaroid SB4p (assets/scenes/SB4p_c1_end_b_evidence_polaroid.jpg): "Kaçarken bir flaş patladı" vuruşunda üstte belirir — Cico\'nun scooter\'ı hızla kaçarken arkadan, flaşla donmuş.'],
    },
  };

  const api = { STYLE, CHARACTERS, LOCATIONS, SHOTS };
  if (typeof module === 'object' && module.exports) module.exports = api;
})();
