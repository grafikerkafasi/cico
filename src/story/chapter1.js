/*
 * CİCO — Bölüm 1: "Gece Vardiyası"
 *
 * Tek doğruluk kaynağı (single source of truth): demo, testler, CLI ve
 * docs/story-flow.md içindeki Mermaid şeması bu dosyadan üretilir.
 *
 * YAPI: Ortak açılış (2 sahne) → ilk seçimde hikâye İKİ KATMANA ayrılır ve bir daha birleşmez.
 *   Katman A — "Paket" (c1_a*): ROTA'yı içeriden görür. Teslim, teklif, kaçış.
 *   Katman B — "İlaç"  (c1_b*): ROTA'yı sokaktan görür. mendilci çocuk, Kabile Şefi'nin kazası, dayanışma.
 *
 * Bu dosyada METİN YOKTUR. Tüm oyuncuya görünen metinler src/i18n/<dil>.js içindedir:
 *   scenes.<scene_id>.title
 *   scenes.<scene_id>.<blok>             (text dizisindeki her vuruş)
 *   scenes.<scene_id>.choices.<id>       (seçenek etiketi)
 *   scenes.<scene_id>.choices.<id>_sub   (isteğe bağlı alt satır: ücret, not…)
 *   scenes.<scene_id>.choices.<id>_hint  (kilitli seçenek ipucu)
 *   scenes.<scene_id>.choices.<id>_toast (isteğe bağlı: "Bu kararın bir bedeli olacak" tipi bildirim)
 *   speakers.<from>                      (konuşan / mesaj gönderen)
 *   epilogue.<key>                       (oyun sonu seslendirme metni parçaları)
 *   "@common.x" ile başlayan bloklar → common.x (sahneler arası ortak metin)
 *
 * text = kısa VURUŞLAR (mobil: her biri tek ekran, ≤ 120 karakter; test edilir).
 *   'anahtar'                                → anlatı satırı (altyazı gibi)
 *   { key, kind: 'say', from: 'kid' }        → konuşma (konuşmacı adıyla)
 *   { key, kind: 'msg', from: 'mom' }        → telefon bildirimi kartı
 *   { kind: 'intro', who: 'chief' }          → karakter tanıtım slaytı (ilk göründüğü sahnede, bir kez)
 *   { ..., if: koşul }                       → yalnızca koşul doğruysa
 *
 * Karakterler kasıtlı olarak isimsiz (Cico ve Kabile Şefi dışında): oyuncunun aklında kalacak
 * kadar az kişi, her biri bir tanıtım slaytıyla. Metinler: characters.<who>.name / .line
 *
 * KOD: her sahnenin kısa üretim kodu (O1, A3, SB2…). Görsel/video dosyaları gönderilirken bu kod kullanılır.
 *   O = ortak açılış · A = Paket katmanı · B = İlaç katmanı · SA/SB = o katmanın sonları
 *
 * GÖRSEL ve SEÇİM NOKTALARI
 *   image_asset : sahnenin tam ekran görseli (video yokken). Görsel ekrana "sığdırılır" (tamamı görünür),
 *                 boşluklar bulanık kopyasıyla dolar. Oran: media_aspect (varsayılan 9:16).
 *   ambient_video: sahnenin arkasında sessiz döngüde oynayan video (anlatı videosu değil; vuruşlar
 *                 metin olarak sürer). Yüklenene kadar image_asset altta görünür.
 *   hotspot     : { x, y } — seçeneğin görsel ÜZERİNDEKİ yeri, görselin yüzdesi (0–100) cinsinden.
 *                 Değerler assets/scenes/ içindeki görsellere göre ayarlandı; görsel değişirse güncellenmeli.
 *                 İsteğe bağlı side: 'left' | 'right' | 'above' | 'below' — etiketin noktaya göre yeri
 *                 (yoksa otomatik: nokta sağ yarıdaysa sola, sol yarıdaysa sağa).
 *                 Geliştirici menüsündeki "Koordinat seçici" görsele dokununca x/y yüzdesini gösterir.
 *
 * Koşul dili:  { flag: 'x' } | { clue: 'id' } | { visited: 'scene_id' }
 *              { var: 'x', eq|gte|lte|gt|lt: v } | { all: [...] } | { any: [...] } | { not: {...} }
 * Etki dili:   [{ if?, set?: {}, add?: {}, clue?: 'id' | ['id'] }]
 * next:        'scene_id'  veya  [{ if, goto }, ..., { goto }]  (ilk eşleşen)
 */
(function (root) {
  'use strict';

  const say = (key, from, cond) => ({ key, kind: 'say', from, ...(cond ? { if: cond } : {}) });
  const msg = (key, from, cond) => ({ key, kind: 'msg', from, ...(cond ? { if: cond } : {}) });
  const line = (key, cond) => ({ key, ...(cond ? { if: cond } : {}) });
  const intro = (who) => ({ key: `@characters.${who}.line`, kind: 'intro', who });
  // Vuruşa özel üst görsel (hayal, polaroid…): o vuruş ekrandayken sahne görselinin üstünde belirir.
  const overlay = (block, src, style) => ({ ...(typeof block === 'string' ? { key: block } : block), overlay: src, overlay_style: style });

  const ENVELOPE = { var: 'route', eq: 'envelope' };
  const MEDICINE = { var: 'route', eq: 'medicine' };
  const HESITATED = { flag: 'hesitated' };
  const RENT = [
    msg('@common.rent_paid', 'mom', { var: 'earnings', gte: 1400 }),
    line('@common.rent_short', { var: 'earnings', lt: 1400 }),
  ];
  const NO_MEDICINE = [intro('kid'), msg('@common.no_medicine', 'kid'), '@common.no_medicine_reveal'];
  const ROTA_HOOK = [msg('@common.rota_hook', 'rota'), '@common.rota_hook_2'];

  const story = {
    id: 'chapter1',
    chapter: 1,
    start: 'c1_s01_nevizade',

    // Her değişkenin nerede değiştiği/kullanıldığı docs/choice-design.md'de.
    // Validator, burada tanımlı olmayan bir değişken kullanılırsa hata verir.
    variables: {
      route:          { initial: null,  doc: "İlk seçim → katman: 'envelope' (A, paket) | 'medicine' (B, ilaç)" },
      system_chose:   { initial: false, doc: 'İlk seçimde süre doldu, ROTA seçti' },
      seal_broken:    { initial: false, doc: 'A: paketin bandı kaldırıldı' },
      suspicion:      { initial: 0,     doc: "A: paltolu adamın Cico'ya şüphesi (0–3)" },
      escape_route:   { initial: null,  doc: "A: kaçış yolu 'stairs' | 'passage'" },
      kid_involved:   { initial: false, doc: 'B: mendilci çocuğun fotoğrafı alındı' },
      chief:          { initial: null,  doc: "B: kaza yerinde 'stayed' (şefin yanında kaldı) | 'chased' (arabayı kovaladı)" },
      earnings:       { initial: 0,     doc: 'Gece boyunca kazanılan ₺ (kira açığı: 1.400 ₺)' },
      hesitated:      { initial: false, doc: 'Kritik bir anda süre doldu (kararsızlık da bir karardır)' },
    },

    clues: {
      drive:        { doc: 'A: paketin içindeki disk, "ROTA — Kaza Kayıtları"' },
      knows_name:   { doc: "A: adam Cico'nun kurye numarasını biliyor — ROTA'nın içinden biri" },
      risk_list:    { doc: 'A/B: ROTA\'nın "riskli işi reddetmeyenler" listesi — Cico da orada' },
      matbaa_photo: { doc: 'B: mendilci çocuğun matbaa önünde çektiği fotoğraf (siyah araba, plaka)' },
      not_accident: { doc: "B: Kabile Şefi'nin kazası kaza değildi" },
    },

    // Tanıtım slaytı olan karakterler ve konuşmacı kimlikleri. Test: her karakter, konuştuğu/yazdığı
    // ilk sahnede tanıtılır ve bir oynanışta en fazla bir kez tanıtılır.
    characters: {
      cico:  { speakers: ['cico'] },
      rota:  { speakers: ['rota'] },
      chief: { speakers: ['chief', 'kabile'] },
      kid:   { speakers: ['kid'] },
      man:   { speakers: ['man'] },
    },

    constants: { rent_gap: 1400 },
    media_aspect: 9 / 16, // görsel/video oranı (genişlik / yükseklik)
    music: 'assets/audio/c1_music.mp3', // bölüm boyunca alttan çalan müzik (yoksa sessizce atlanır)

    scenes: [
      // ── Ortak açılış ───────────────────────────────────────────────
      {
        scene_id: 'c1_s01_nevizade',
        code: 'O1',
        scene_type: 'cinematic',
        text: ['l1', 'l2', intro('cico'), 'l3', msg('kabile', 'kabile'), intro('chief'), msg('mom', 'mom')],
        next: 'c1_s02_orders',
        image_asset: 'assets/scenes/c1_s01_nevizade.jpg',
        scene_video: 'assets/video/O1_c1_s01_nevizade.mp4', // Flow klibi: Cico sabit, arkada Nevizade sesi (keman, darbuka)
        video_asset: null,
        notes: {
          dev: 'Soğuk açılış: Nevizade Sokağı. Kira açığı (1.400 ₺) ve Kabile grubu burada ekilir.',
          video: 'Nevizade Sokağı, gece, sis, meyhane ışıkları, kahkaha ve müzik. Cico scooter\'ına yaslanmış, kollar kavuşturulmuş. Yüze yakın plan, gözler kısılır. Telefon titrer. Ekranda yazı YOK.',
        },
      },
      {
        scene_id: 'c1_s02_orders',
        code: 'O2',
        scene_type: 'choice',
        text: [intro('rota'), 'l1', 'l2'],
        timer: { seconds: 15, on_timeout: 'timeout' },
        choices: [
          { id: 'envelope', hotspot: { x: 52, y: 46, side: 'left' }, effects: [{ set: { route: 'envelope' } }], next: 'c1_s03_ride' },
          { id: 'medicine', hotspot: { x: 80, y: 48, side: 'below' }, effects: [{ set: { route: 'medicine' }, add: { earnings: 85 } }], next: 'c1_s03_ride' },
          { id: 'timeout', hidden: true, effects: [{ set: { route: 'envelope', system_chose: true } }], next: 'c1_s03_ride' },
        ],
        image_asset: 'assets/scenes/O2_c1_s02_orders.jpg',
        scene_video: 'assets/video/O2_c1_s02_orders.mp4',
        video_asset: null,
        choice_display: 'over_video',
        loop_asset: null,
        notes: {
          dev: 'İLK KRİTİK SEÇİM — hikâye burada iki katmana ayrılır ve birleşmez. Zaman aşımı → ROTA paketi atar (Katman A).',
          video: 'Telefona bakan Cico, omuz üstü; ekran içeriği görünmez. Bekleme döngüsü: ekrana bakış, nefes.',
        },
      },

      {
        scene_id: 'c1_s03_ride',
        code: 'O3',
        image_asset: 'assets/scenes/O3_c1_s03_ride.jpg',
        scene_video: 'assets/video/O3_c1_s03_ride.mp4',
        scene_type: 'cinematic',
        text: ['l1', 'l2'],
        next: [
          { if: ENVELOPE, goto: 'c1_a1_printhouse' },
          { goto: 'c1_b0_pharmacy' },
        ],
        video_asset: null,
        notes: {
          dev: 'Kısa yol sahnesi; iki katmanın ortak son karesi. Buradan sonra yollar ayrılır.',
          video: 'Beyoğlu, ıslak dar cadde, gece. Cico scooter\'la hızla geçer; arkada akan sokak lambaları. Galata Kulesi yok.',
        },
      },

      // ══ KATMAN A — PAKET ════════════════════════════════════════════
      {
        scene_id: 'c1_a1_printhouse',
        code: 'A1',
        image_asset: 'assets/scenes/A1_c1_a1_printhouse.jpg',
        scene_video: 'assets/video/A1_c1_a1_printhouse.mp4',
        scene_type: 'choice',
        text: ['l1', 'l2', 'l3'],
        choices: [
          { id: 'open', hotspot: { x: 47, y: 47 }, effects: [{ set: { seal_broken: true }, add: { suspicion: 1 }, clue: 'drive' }], next: 'c1_a1a_inside' },
          { id: 'keep_closed', hotspot: { x: 82, y: 65 }, next: 'c1_a1b_mount' },
        ],
        video_asset: null,
        notes: {
          dev: 'Merak vs. güvenlik. Açmak bilgi verir (teklifte üçüncü seçeneği açar) ama iz bırakır (şüphe +1).',
          video: 'Tarlabaşı, tabelası sökülmüş matbaa kapısı, eldivenli el, bantlı paket yakın plan. Bandın kalkmış köşesi.',
        },
      },
      {
        scene_id: 'c1_a1a_inside',
        code: 'A1a',
        image_asset: 'assets/scenes/A1a_c1_a1a_inside.jpg',
        scene_video: 'assets/video/A1a_c1_a1a_inside.mp4',
        scene_type: 'cinematic',
        text: ['l1', 'l2', 'l3'],
        next: 'c1_a1b_mount',
        video_asset: null,
        notes: {
          dev: 'Paket, gönderici gittikten sonra açılır: kepenk inik, sokak boş. Şok yüzden okunur.',
          video: 'Aynı matbaa, kepenk inik. Lamba altında Cico kutuyu açar: siyah sabit disk. Yüz yakın: gözler büyür.',
        },
      },
      {
        scene_id: 'c1_a1b_mount',
        code: 'A1b',
        image_asset: 'assets/scenes/A1b_c1_a1b_mount.jpg',
        scene_video: 'assets/video/A1b_c1_a1b_mount.mp4',
        scene_type: 'cinematic',
        text: [line('opened', { flag: 'seal_broken' }), line('closed', { not: { flag: 'seal_broken' } }), 'l1'],
        next: 'c1_a2_school',
        video_asset: null,
        notes: {
          dev: 'Geçiş: paket arka kutuda, Cico motora biner. Kendiliğinden A2\'ye akar.',
          video: '3/4 arkadan: bacak scooter\'ın üstünden geçer, el gidonda; arka plaka görünür. Boş sokak.',
        },
      },
      {
        scene_id: 'c1_a2_school',
        code: 'A2',
        image_asset: 'assets/scenes/A2_c1_a2_school.jpg',
        scene_video: 'assets/video/A2_c1_a2_school.mp4',
        scene_type: 'cinematic',
        text: [
          'l1', 'l2',
          overlay('l3', 'assets/scenes/A2f_c1_a2f_flashback.jpg', 'flashback'),
          line('closed', { not: { flag: 'seal_broken' } }),
          line('open', { flag: 'seal_broken' }),
        ],
        next: 'c1_a3a_cutoff',
        video_asset: null,
        notes: {
          dev: 'Seçimsiz, nefes alan sahne. Öğretmenliğe tek ince dokunuş.',
          video: 'AĞIR ÇEKİM. Scooter "fıtı fıtı" yavaşlar. Okul parmaklıkları, ters sandalyeler. Kısa, sessiz bir an; müzik sade.',
        },
      },
      {
        scene_id: 'c1_a3a_cutoff',
        code: 'A3a',
        clip_loop: false, // adam arabadan iner: bir kez oynar, sonra görsel hafifçe salınır
        image_asset: 'assets/scenes/A3a_c1_a3a_cutoff.jpg',
        scene_video: 'assets/video/A3a_c1_a3a_cutoff.mp4',
        scene_type: 'cinematic',
        text: ['l1', 'l2', intro('man')],
        next: 'c1_a3_tower',
        video_asset: null,
        notes: {
          dev: 'Paltolu adam Cico\'yu yolda durdurur: teslimat noktasına varmadan araba önünü keser.',
          video: 'Kuleye çıkan yokuş, gece. Siyah araba scooter\'ın önüne kırar; Cico sert fren. Arka kapı açılır, paltolu adam iner.',
        },
      },
      {
        scene_id: 'c1_a3_tower',
        code: 'A3',
        still_motion: true, // video yok (Flow filtresi): görsel çok hafif yakınlaşır/salınır
        image_asset: 'assets/scenes/A3_c1_a3_tower.jpg',
        scene_type: 'choice',
        text: ['l1', say('man1', 'man'), 'l3', say('man2', 'man'), line('seal_noticed', { flag: 'seal_broken' })],
        on_enter: [{ clue: 'knows_name' }],
        timer: { seconds: 12, on_timeout: 'freeze' },
        choices: [
          { id: 'hand_over', hotspot: { x: 37, y: 51 }, effects: [{ add: { earnings: 1500 } }], next: 'c1_a4_rooftop' },
          { id: 'run', hotspot: { x: 88, y: 68 }, effects: [{ add: { suspicion: 1 } }], next: 'c1_a5_chase' },
          { id: 'confront', hotspot: { x: 43, y: 24 }, conditions: { clue: 'drive' }, show_locked: true, next: 'c1_a6_second_offer' },
          { id: 'freeze', hidden: true, effects: [{ set: { hesitated: true }, add: { earnings: 750 } }], next: 'c1_a4_rooftop' },
        ],
        video_asset: null,
        choice_display: 'over_video',
        loop_asset: null,
        notes: {
          dev: 'Ana gizem ve teklif: adam ROTA\'nın içinden biri ("Kurye 2608"). Paket açıldıysa üçüncü seçenek açılır, adam bandı fark eder.',
          video: 'Galata Kulesi\'nin dibi, gece. Siyah araba scooter\'ın önünü kesmiş; paltolu adam elini uzatıp paketi istiyor. Bekleme döngüsü: uzanan el, farlar.',
        },
      },
      {
        scene_id: 'c1_a4_rooftop',
        code: 'A4',
        image_asset: 'assets/scenes/A4_c1_a4_rooftop.jpg',
        scene_video: 'assets/video/A4_c1_a4_rooftop.mp4',
        scene_type: 'choice',
        text: [
          line('paid_full', { not: HESITATED }),
          say('paid_full_say', 'man', { not: HESITATED }),
          line('paid_half', HESITATED),
          say('paid_half_say', 'man', HESITATED),
          'rooftop',
          line('seal_seen', { flag: 'seal_broken' }),
        ],
        on_enter: [{ if: { flag: 'seal_broken' }, add: { suspicion: 1 } }],
        choices: [
          { id: 'tip_off', hotspot: { x: 69, y: 52 }, effects: [{ add: { suspicion: 1 } }], next: 'c1_end_a_tribe' },
          { id: 'stay_silent', hotspot: { x: 22, y: 70 }, next: 'c1_end_a_silence' },
        ],
        video_asset: null,
        notes: {
          dev: 'Suç ortaklığından sonra vicdan: Kabile\'yi uyarmak mı, susmak mı.',
          video: 'Galata\'da bir çatı, şehir ışıkları, Cico\'nun silueti. Telefon ışığı yüzünde.',
        },
      },
      {
        scene_id: 'c1_a5_chase',
        code: 'A5',
        image_asset: 'assets/scenes/A5_c1_a5_chase.jpg',
        scene_video: 'assets/video/A5_c1_a5_chase.mp4',
        scene_type: 'interaction',
        text: ['l1', 'l2'],
        timer: { seconds: 8, on_timeout: 'stall' },
        choices: [
          {
            id: 'stairs', hotspot: { x: 19, y: 71 },
            effects: [{ set: { escape_route: 'stairs' } }],
            next: 'c1_a5b_fall', // macera her zaman düşüşle biter; asıl ipucu (risk listesi) orada
          },
          { id: 'passage', hotspot: { x: 81, y: 20 }, effects: [{ set: { escape_route: 'passage' } }], next: 'c1_end_a_escape' },
          { id: 'stall', hidden: true, next: 'c1_a5b_fall' },
        ],
        video_asset: null,
        choice_display: 'over_video',
        loop_asset: null,
        notes: {
          dev: 'Basamaklar: macera — her zaman düşüş (A5b → A5c → Düşüş, risk listesi). Pasaj: sabaha kadar saklanır → Paket Bende.',
          video: 'Galata yokuşları, scooter kalkışı, arkada siyah araba. Pasajın içi boş ve karanlık (araba yok).',
        },
      },
      {
        scene_id: 'c1_a5b_fall',
        code: 'A5b',
        image_asset: 'assets/scenes/A5b_c1_a5b_fall.jpg',
        scene_video: 'assets/video/A5b_c1_a5b_fall.mp4',
        scene_type: 'cinematic',
        text: [say('fly', 'cico'), 'l1', 'l2', 'voice', say('fall_1', 'chief'), say('fall_2', 'chief'), 'l3'],
        next: 'c1_a5c_paper',
        video_asset: null,
        notes: {
          dev: 'Düşüş anı: paltolu adam paketi alıp uzaklaşır. Cico\'nun yanında kâğıt yok.',
          video: 'Islak basamaklar, devrik scooter, yerde Cico (şiddet gösterilmez). Arkada paketle uzaklaşan paltolu adam.',
        },
      },
      {
        scene_id: 'c1_a5c_paper',
        code: 'A5c',
        image_asset: 'assets/scenes/A5c_c1_a5c_paper.jpg',
        scene_video: 'assets/video/A5c_c1_a5c_paper.mp4',
        scene_type: 'cinematic',
        text: ['l1'],
        next: 'c1_end_a_fall',
        video_asset: null,
        notes: {
          dev: 'Adam gitmiş; yerde düşürdüğü zarf. Dokununca Düşüş sonuna (Cico okur) geçilir.',
          video: 'Islak taşta zarf, yakın plan; yağmur damlaları. Arkada flu basamaklar.',
        },
      },
      {
        scene_id: 'c1_a6_second_offer',
        code: 'A6',
        image_asset: 'assets/scenes/A6_c1_a6_second_offer.jpg',
        scene_video: 'assets/video/A6_c1_a6_second_offer.mp4',
        scene_type: 'choice',
        text: [say('cico', 'cico'), say('m1', 'man'), say('m2', 'man'), 'l1'],
        timer: { seconds: 10, on_timeout: 'silence' },
        choices: [
          { id: 'accept', hotspot: { x: 44, y: 54 }, next: 'c1_end_a_desk' },
          { id: 'refuse', hotspot: { x: 63, y: 71 }, effects: [{ add: { suspicion: 1 } }], next: 'c1_a5_chase' },
          { id: 'silence', hidden: true, effects: [{ set: { hesitated: true } }], next: 'c1_end_a_desk' },
        ],
        video_asset: null,
        choice_display: 'after_video',
        notes: {
          dev: 'Katman A\'nın en ağır ikilemi: sokaktan kurtuluş (maaş, sigorta) karşılığında kayıtları gömmek.',
          video: 'Kulenin dibinde iki kişilik yakın plan. Şehir sesi kesilir.',
        },
      },

      // ══ KATMAN B — İLAÇ ════════════════════════════════════════════
      {
        scene_id: 'c1_b0_pharmacy',
        code: 'B0',
        image_asset: 'assets/scenes/B0_c1_b0_pharmacy.jpg',
        scene_video: 'assets/video/B0_c1_b0_pharmacy.mp4',
        scene_type: 'cinematic',
        text: ['l1', 'l2'],
        next: 'c1_b1_pharmacy',
        video_asset: null,
        notes: {
          dev: 'Nöbetçi eczane. Paket talebi Kabile Şefi\'ne düşer; Katman B\'nin olayı onun başına gelecek.',
          video: 'Gece, nöbetçi eczane önü; yazısız ışıklı tabela (yalnızca yeşil haç). Cico scooter\'ının yanında, elinde poşet.',
        },
      },
      {
        scene_id: 'c1_b1_pharmacy',
        code: 'B1',
        image_asset: 'assets/scenes/B1_c1_b1_pharmacy.jpg',
        scene_video: 'assets/video/B1_c1_b1_pharmacy.mp4',
        scene_type: 'cinematic',
        text: ['l1', 'l2', intro('kid'), say('kid', 'kid')],
        next: 'c1_b2_kid',
        video_asset: null,
        notes: {
          dev: 'Karakter sahnesi: mendilci çocuk.',
          video: 'Dolapdere\'de dökük merdivenler; kapıda mendilci çocuk.',
        },
      },
      {
        scene_id: 'c1_b2_kid',
        code: 'B2',
        image_asset: 'assets/scenes/B2_c1_b2_kid.jpg',
        still_motion: true, // Flow klibi tutarsızdı (Cico'nun yüzü/eli): görsel hafifçe salınır
        scene_type: 'choice',
        text: [say('y1', 'kid'), say('y2', 'kid'), 'photo'],
        choices: [
          { id: 'take_photo', hotspot: { x: 49, y: 42 }, effects: [{ set: { kid_involved: true }, clue: 'matbaa_photo' }], next: 'c1_b2a_chief' },
          { id: 'delete_photo', hotspot: { x: 17, y: 66 }, next: 'c1_b2a_chief' },
        ],
        video_asset: null,
        notes: {
          dev: 'Kanıt vs. bir çocuğu korumak. Fotoğraf hastanede "gazeteci" seçeneğini açar; ama mendilci çocuk\'u riske atar.',
          video: 'Kapı eşiği, alçak sesle konuşma. Fotoğraf UI kartında, videoda okunmaz.',
        },
      },
      {
        scene_id: 'c1_b2a_chief',
        code: 'B2a',
        image_asset: 'assets/scenes/B2a_c1_b2a_chief.jpg',
        scene_video: 'assets/video/B2a_c1_b2a_chief.mp4',
        scene_type: 'cinematic',
        text: ['l1', msg('chief', 'chief')],
        next: 'c1_b3_boulevard',
        video_asset: null,
        notes: {
          dev: 'Aynı saatlerde Kabile Şefi paketi götürüyor; tek eliyle Cico\'ya yazar. Arkasında siyah araba.',
          video: 'Tarlabaşı Bulvarı, gece. Şef motorunda, bir eli gidonda, diğeriyle telefon. Arkada yaklaşan siyah araba farları.',
        },
      },
      {
        scene_id: 'c1_b3_boulevard',
        code: 'B3',
        image_asset: 'assets/scenes/B3_c1_b3_boulevard.jpg',
        scene_video: 'assets/video/B3_c1_b3_boulevard.mp4',
        scene_type: 'choice',
        text: ['l1', 'l2', say('t1', 'chief'), say('t2', 'chief'), msg('rota', 'rota'), 'l3'],
        on_enter: [{ clue: 'not_accident' }],
        timer: { seconds: 12, on_timeout: 'freeze' },
        choices: [
          { id: 'stay', hotspot: { x: 44, y: 52 }, effects: [{ set: { chief: 'stayed' } }], next: 'c1_b4_hospital' },
          { id: 'chase', hotspot: { x: 79, y: 18 }, effects: [{ set: { chief: 'chased' } }], next: 'c1_b3a_tail' },
          { id: 'freeze', hidden: true, effects: [{ set: { chief: 'stayed', hesitated: true } }], next: 'c1_b4_hospital' },
        ],
        video_asset: null,
        choice_display: 'over_video',
        loop_asset: null,
        notes: {
          dev: 'Katman B\'nin kırılma noktası: bir dostu yerde bırakmamak mı, onu yere sereni kovalamak mı.',
          video: 'Tarlabaşı Bulvarı, gece. Yerde yeşil teslimat çantası, devrik scooter. Kabile Şefi oturur hâlde, kask çatlak (kan yok). Uzaklaşan siyah araba.',
        },
      },
      {
        scene_id: 'c1_b3a_tail',
        code: 'B3a',
        image_asset: 'assets/scenes/B3a_c1_b3a_tail.jpg',
        scene_video: 'assets/video/B3a_c1_b3a_tail.mp4',
        scene_type: 'cinematic',
        text: ['l1', 'l2'],
        next: 'c1_b5_printhouse',
        video_asset: null,
        notes: {
          dev: 'Gizli takip: Cico farlarını kapatıp siyah arabayı ara sokaklarda izler.',
          video: 'Tarlabaşı ara sokağı, gece. Önde siyah arabanın stop lambaları; Cico mesafeli, köşeden izler.',
        },
      },
      {
        scene_id: 'c1_b4_hospital',
        code: 'B4',
        image_asset: 'assets/scenes/B4_c1_b4_hospital.jpg',
        scene_video: 'assets/video/B4_c1_b4_hospital.mp4',
        scene_type: 'choice',
        text: [line('froze', HESITATED), 'l1', msg('rota', 'rota'), say('chief', 'chief'), 'l2'],
        choices: [
          { id: 'strike', hotspot: { x: 16, y: 44 }, next: 'c1_end_b_strike' },
          { id: 'press', hotspot: { x: 50, y: 63, side: 'below' }, conditions: { clue: 'matbaa_photo' }, show_locked: true, next: 'c1_end_b_headline' },
        ],
        video_asset: null,
        notes: {
          dev: 'Dayanışma mı, kanıt mı. Gazeteci seçeneği yalnızca mendilci çocuk\'un fotoğrafı alındıysa açılır.',
          video: 'Taksim İlk Yardım koridoru, sabaha karşı. Koridorda birikmiş kuryeler, kasklar kucakta.',
        },
      },
      {
        scene_id: 'c1_b5_printhouse',
        code: 'B5',
        image_asset: 'assets/scenes/B5_c1_b5_printhouse.jpg',
        scene_video: 'assets/video/B5_c1_b5_printhouse.mp4',
        scene_type: 'interaction',
        text: ['l1', 'l2', 'l3'],
        timer: { seconds: 10, on_timeout: 'freeze' },
        choices: [
          { id: 'enter', hotspot: { x: 52, y: 36 }, next: 'c1_end_b_blackbox' },
          { id: 'photo_run', hotspot: { x: 16, y: 66 }, next: 'c1_end_b_evidence' },
          { id: 'freeze', hidden: true, effects: [{ set: { hesitated: true } }], next: 'c1_end_b_blackbox' },
        ],
        video_asset: null,
        choice_display: 'over_video',
        notes: {
          dev: 'Katman A\'nın başladığı matbaa, burada ROTA\'nın gizli merkezi olarak geri döner (mekân tekrar kullanımı + iki katmanın aynası).',
          video: 'c1_a1_printhouse ile aynı matbaa, bu kez camın ardından içerisi: ekranlarda yeşil noktalar (yazısız harita).',
        },
      },

      // ══ SONLAR — KATMAN A ══════════════════════════════════════════
      {
        scene_id: 'c1_end_a_silence',
        code: 'SA1',
        image_asset: 'assets/scenes/SA1_c1_end_a_silence.jpg',
        scene_video: 'assets/video/SA1_c1_end_a_silence.mp4',
        scene_type: 'ending',
        text: ['l1', 'l2', ...RENT, ...NO_MEDICINE, line('@common.system_chose', { flag: 'system_chose' }), ...ROTA_HOOK],
        video_asset: null,
        notes: { dev: 'A son: Sessizlik.', video: 'Sabah kahvehane, televizyon (ekran içeriği okunmaz). c1_end_a_tribe ile aynı mekân.' },
      },
      {
        scene_id: 'c1_end_a_tribe',
        code: 'SA2',
        image_asset: 'assets/scenes/SA2_c1_end_a_tribe.jpg',
        scene_video: 'assets/video/SA2_c1_end_a_tribe.mp4',
        scene_type: 'ending',
        text: [
          'l1', 'l2',
          msg('danger', 'unknown', { var: 'suspicion', gte: 2 }),
          line('safe', { var: 'suspicion', lt: 2 }),
          ...RENT, ...NO_MEDICINE,
          line('@common.system_chose', { flag: 'system_chose' }),
          ...ROTA_HOOK,
        ],
        video_asset: null,
        notes: { dev: 'A son: Kabile.', video: 'Kahvehane (c1_end_a_silence ile ortak mekân), titreyen telefonlar.' },
      },
      {
        scene_id: 'c1_end_a_escape',
        code: 'SA3',
        image_asset: 'assets/scenes/SA3_c1_end_a_escape.jpg',
        scene_video: 'assets/video/SA3_c1_end_a_escape.mp4',
        scene_type: 'ending',
        text: [
          'hid',
          'main',
          line('not_opened', { not: { clue: 'drive' } }),
          line('opened', { clue: 'drive' }),
          'dilemma',
          ...NO_MEDICINE,
          ...ROTA_HOOK,
        ],
        video_asset: null,
        notes: { dev: 'A son: Paket Bende.', video: 'Şafak, Karaköy, kapalı balıkçı tentesi; açık paket kucakta, içinde diskler görünür.' },
      },
      {
        scene_id: 'c1_end_a_fall',
        code: 'SA4',
        image_asset: 'assets/scenes/SA4_c1_end_a_fall.jpg',
        scene_video: 'assets/video/SA4_c1_end_a_fall.mp4',
        scene_type: 'ending',
        text: ['l1', 'l2', 'l3', ...NO_MEDICINE, ...ROTA_HOOK],
        on_enter: [{ clue: 'risk_list' }],
        video_asset: null,
        notes: {
          dev: 'A son: Düşüş. Başarısızlık en büyük ipucunu verir: ROTA\'nın risk listesi (ilk seçimde ROTA\'nın neden onu seçtiğini açıklar).',
          video: 'Basamaklarda oturan Cico elindeki kâğıdı okur; yüzünde aydınlanma. Kâğıdın içeriği okunmaz.',
        },
      },
      {
        scene_id: 'c1_end_a_desk',
        code: 'SA5',
        image_asset: 'assets/scenes/SA5_c1_end_a_desk.jpg',
        scene_video: 'assets/video/SA5_c1_end_a_desk.mp4',
        scene_type: 'ending',
        text: [line('silence', HESITATED), 'l1', 'l2', 'l3', 'l4'],
        video_asset: null,
        notes: { dev: 'A son: Masa. Karanlık son; ROTA kancası yok, kanca duran yeşil nokta.', video: 'Ofis, gece, ekranda yeşil noktalar (harita; yazı yok).' },
      },

      // ══ SONLAR — KATMAN B ══════════════════════════════════════════
      {
        scene_id: 'c1_end_b_strike',
        code: 'SB1',
        image_asset: 'assets/scenes/SB1_c1_end_b_strike.jpg',
        scene_video: 'assets/video/SB1_c1_end_b_strike.mp4',
        scene_type: 'ending',
        text: ['l1', 'l2', msg('kabile', 'kabile'), ...ROTA_HOOK],
        video_asset: null,
        notes: { dev: 'B son: Kontak Kapatma. Dayanışma kirayı da çözer.', video: 'Ertesi gece Nevizade (açılış mekânı), kurye olmayan kalabalık; park edilmiş, kontağı kapalı scooter sırası.' },
      },
      {
        scene_id: 'c1_end_b_headline',
        code: 'SB2',
        image_asset: 'assets/scenes/SB2_c1_end_b_headline.jpg',
        scene_video: 'assets/video/SB2_c1_end_b_headline.mp4',
        scene_type: 'ending',
        text: ['l1', 'l2', msg('kid', 'kid'), 'l3', ...RENT, ...ROTA_HOOK],
        video_asset: null,
        notes: { dev: 'B son: Manşet.', video: 'Sabah, hastane önü, telefonlarına bakan kuryeler (ekran içeriği okunmaz).' },
      },
      {
        scene_id: 'c1_end_b_blackbox',
        code: 'SB3',
        image_asset: 'assets/scenes/SB3_c1_end_b_blackbox.jpg',
        scene_video: 'assets/video/SB3_c1_end_b_blackbox.mp4',
        scene_type: 'ending',
        text: [line('froze', HESITATED), 'l1', 'l2', intro('man'), say('man', 'man'), say('man2', 'man')],
        on_enter: [{ clue: 'risk_list' }],
        video_asset: null,
        notes: { dev: 'B son: Kara Kutu. ROTA kancası yok; kanca adamın kendisi.', video: 'Matbaanın içi: ekranlar, masa, liste (içerik UI kartında). Arkada paltolu adam.' },
      },
      {
        scene_id: 'c1_end_b_evidence',
        code: 'SB4',
        image_asset: 'assets/scenes/SB4_c1_end_b_evidence.jpg',
        scene_video: 'assets/video/SB4_c1_end_b_evidence.mp4',
        scene_type: 'ending',
        text: ['l1', overlay('l2', 'assets/scenes/SB4p_c1_end_b_evidence_polaroid.jpg', 'polaroid'), 'l3', 'l4', ...RENT, ...ROTA_HOOK],
        video_asset: null,
        notes: { dev: 'B son: Kanıt.', video: 'Şafak, Tarlabaşı, scooter\'da telefona bakan Cico (ekran içeriği okunmaz).' },
      },
    ],

    // Oyun sonu SESLENDİRME metni: oyuncunun seçimlerinden kurulur, sırayla okunur.
    // Her parça ayrı kaydedilebilir (ileride: voice_asset). Metinler: epilogue.<key>
    epilogue: [
      'open',
      line('rota', { flag: 'system_chose' }),
      line('money', { all: [ENVELOPE, { not: { flag: 'system_chose' } }] }),
      line('medicine', MEDICINE),
      line('opened', { flag: 'seal_broken' }),
      line('closed', { all: [ENVELOPE, { not: { flag: 'seal_broken' } }] }),
      line('photo', { flag: 'kid_involved' }),
      line('no_photo', { all: [MEDICINE, { not: { flag: 'kid_involved' } }] }),
      line('stayed', { var: 'chief', eq: 'stayed' }),
      line('chased', { var: 'chief', eq: 'chased' }),
      line('froze', HESITATED),
      line('silence', { visited: 'c1_end_a_silence' }),
      line('tribe', { visited: 'c1_end_a_tribe' }),
      line('escape', { visited: 'c1_end_a_escape' }),
      line('fall', { visited: 'c1_end_a_fall' }),
      line('desk', { visited: 'c1_end_a_desk' }),
      line('strike', { visited: 'c1_end_b_strike' }),
      line('headline', { visited: 'c1_end_b_headline' }),
      line('blackbox', { visited: 'c1_end_b_blackbox' }),
      line('evidence', { visited: 'c1_end_b_evidence' }),
      'dots',
      line('on_road', { not: { visited: 'c1_end_a_desk' } }),
      line('off_road', { visited: 'c1_end_a_desk' }),
    ],
  };

  if (typeof module === 'object' && module.exports) module.exports = story;
  else (root.CICO = root.CICO || {}).story = story;
})(typeof self !== 'undefined' ? self : this);
