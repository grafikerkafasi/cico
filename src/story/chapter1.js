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
 * GÖRSEL ve SEÇİM NOKTALARI
 *   image_asset : sahnenin tam ekran görseli (video yokken). Görsel ekrana "sığdırılır" (tamamı görünür),
 *                 boşluklar bulanık kopyasıyla dolar. Oran: media_aspect (varsayılan 9:16).
 *   hotspot     : { x, y } — seçeneğin görsel ÜZERİNDEKİ yeri, görselin yüzdesi (0–100) cinsinden.
 *                 Şimdilik GEÇİCİ değerler; gerçek koordinatlar her sahne görseli gelince girilecek.
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

    scenes: [
      // ── Ortak açılış ───────────────────────────────────────────────
      {
        scene_id: 'c1_s01_nevizade',
        scene_type: 'cinematic',
        text: ['l1', 'l2', intro('cico'), 'l3', msg('kabile', 'kabile'), intro('chief'), msg('mom', 'mom')],
        next: 'c1_s02_orders',
        image_asset: 'assets/scenes/c1_s01_nevizade.jpg',
        video_asset: null,
        notes: {
          dev: 'Soğuk açılış: Nevizade Sokağı. Kira açığı (1.400 ₺) ve Kabile grubu burada ekilir.',
          video: 'Nevizade Sokağı, gece, sis, meyhane ışıkları, kahkaha ve müzik. Cico scooter\'ına yaslanmış, kollar kavuşturulmuş. Yüze yakın plan, gözler kısılır. Telefon titrer. Ekranda yazı YOK.',
        },
      },
      {
        scene_id: 'c1_s02_orders',
        scene_type: 'choice',
        text: [intro('rota'), 'l1', 'l2'],
        timer: { seconds: 15, on_timeout: 'timeout' },
        choices: [
          { id: 'envelope', hotspot: { x: 80, y: 76 }, effects: [{ set: { route: 'envelope' } }], next: 'c1_a1_printhouse' },
          { id: 'medicine', hotspot: { x: 69, y: 43 }, effects: [{ set: { route: 'medicine' }, add: { earnings: 85 } }], next: 'c1_b1_pharmacy' },
          { id: 'timeout', hidden: true, effects: [{ set: { route: 'envelope', system_chose: true } }], next: 'c1_a1_printhouse' },
        ],
        image_asset: 'assets/scenes/c1_s01_nevizade.jpg', // aynı an: Cico telefona bakıyor
        video_asset: null,
        choice_display: 'over_video',
        loop_asset: null,
        notes: {
          dev: 'İLK KRİTİK SEÇİM — hikâye burada iki katmana ayrılır ve birleşmez. Zaman aşımı → ROTA paketi atar (Katman A).',
          video: 'Telefona bakan Cico, omuz üstü; ekran içeriği görünmez. Bekleme döngüsü: ekrana bakış, nefes.',
        },
      },

      // ══ KATMAN A — PAKET ════════════════════════════════════════════
      {
        scene_id: 'c1_a1_printhouse',
        scene_type: 'choice',
        text: ['l1', 'l2', 'l3'],
        choices: [
          { id: 'open', hotspot: { x: 52, y: 60 }, effects: [{ set: { seal_broken: true }, add: { suspicion: 1 }, clue: 'drive' }], next: 'c1_a2_school' },
          { id: 'keep_closed', hotspot: { x: 30, y: 74 }, next: 'c1_a2_school' },
        ],
        video_asset: null,
        notes: {
          dev: 'Merak vs. güvenlik. Açmak bilgi verir (teklifte üçüncü seçeneği açar) ama iz bırakır (şüphe +1).',
          video: 'Tarlabaşı, tabelası sökülmüş matbaa kapısı, eldivenli el, bantlı paket yakın plan. Bandın kalkmış köşesi.',
        },
      },
      {
        scene_id: 'c1_a2_school',
        scene_type: 'cinematic',
        text: [
          'l1', 'l2', 'l3',
          line('closed', { not: { flag: 'seal_broken' } }),
          line('open', { flag: 'seal_broken' }),
        ],
        next: 'c1_a3_tower',
        video_asset: null,
        notes: {
          dev: 'Seçimsiz, nefes alan sahne. Öğretmenliğe tek ince dokunuş.',
          video: 'AĞIR ÇEKİM. Scooter "fıtı fıtı" yavaşlar. Okul parmaklıkları, ters sandalyeler. Kısa, sessiz bir an; müzik sade.',
        },
      },
      {
        scene_id: 'c1_a3_tower',
        scene_type: 'choice',
        text: ['l1', 'l2', intro('man'), say('man1', 'man'), 'l3', say('man2', 'man'), line('seal_noticed', { flag: 'seal_broken' })],
        on_enter: [{ clue: 'knows_name' }],
        timer: { seconds: 12, on_timeout: 'freeze' },
        choices: [
          { id: 'hand_over', hotspot: { x: 40, y: 55 }, effects: [{ add: { earnings: 1500 } }], next: 'c1_a4_rooftop' },
          { id: 'run', hotspot: { x: 72, y: 72 }, effects: [{ add: { suspicion: 1 } }], next: 'c1_a5_chase' },
          { id: 'confront', hotspot: { x: 56, y: 36 }, conditions: { clue: 'drive' }, show_locked: true, next: 'c1_a6_second_offer' },
          { id: 'freeze', hidden: true, effects: [{ set: { hesitated: true }, add: { earnings: 750 } }], next: 'c1_a4_rooftop' },
        ],
        video_asset: null,
        choice_display: 'over_video',
        loop_asset: null,
        notes: {
          dev: 'Ana gizem ve teklif: adam ROTA\'nın içinden biri ("Kurye 2608"). Paket açıldıysa üçüncü seçenek açılır, adam bandı fark eder.',
          video: 'Galata Kulesi\'nin dibi, boş meydan, gece. Kulenin gölgesinde uzun paltolu adam. Bekleme döngüsü: uzanan el, arkada farlar.',
        },
      },
      {
        scene_id: 'c1_a4_rooftop',
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
          { id: 'tip_off', hotspot: { x: 62, y: 56 }, effects: [{ add: { suspicion: 1 } }], next: 'c1_end_a_tribe' },
          { id: 'stay_silent', hotspot: { x: 32, y: 70 }, next: 'c1_end_a_silence' },
        ],
        video_asset: null,
        notes: {
          dev: 'Suç ortaklığından sonra vicdan: Kabile\'yi uyarmak mı, susmak mı.',
          video: 'Galata\'da bir çatı, şehir ışıkları, Cico\'nun silueti. Telefon ışığı yüzünde.',
        },
      },
      {
        scene_id: 'c1_a5_chase',
        scene_type: 'interaction',
        text: ['l1', 'l2'],
        timer: { seconds: 8, on_timeout: 'stall' },
        choices: [
          {
            id: 'stairs', hotspot: { x: 30, y: 66 },
            effects: [{ set: { escape_route: 'stairs' } }],
            next: [
              { if: { var: 'suspicion', gte: 2 }, goto: 'c1_end_a_fall' },
              { goto: 'c1_end_a_escape' },
            ],
          },
          { id: 'passage', hotspot: { x: 72, y: 48 }, effects: [{ set: { escape_route: 'passage' } }], next: 'c1_end_a_escape' },
          { id: 'stall', hidden: true, next: 'c1_end_a_fall' },
        ],
        video_asset: null,
        choice_display: 'over_video',
        loop_asset: null,
        notes: {
          dev: 'Basamaklar: şüphe ≥ 2 ise düşer. Pasaj: güvenli ama plaka görülür. Başarısızlık ayrı bir sona (Düşüş) gider.',
          video: 'Galata yokuşları, scooter kalkışı, siyah araba. İki kısa sonuç çekimi: Yüksek Kaldırım basamakları, pasaj.',
        },
      },
      {
        scene_id: 'c1_a6_second_offer',
        scene_type: 'choice',
        text: [say('cico', 'cico'), say('m1', 'man'), say('m2', 'man'), 'l1'],
        timer: { seconds: 10, on_timeout: 'silence' },
        choices: [
          { id: 'accept', hotspot: { x: 38, y: 58 }, next: 'c1_end_a_desk' },
          { id: 'refuse', hotspot: { x: 68, y: 72 }, effects: [{ add: { suspicion: 1 } }], next: 'c1_a5_chase' },
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
        scene_id: 'c1_b1_pharmacy',
        scene_type: 'cinematic',
        text: ['l1', 'l2', intro('kid'), say('kid', 'kid')],
        next: 'c1_b2_kid',
        video_asset: null,
        notes: {
          dev: 'Karakter sahnesi. Paket talebi Kabile Şefi\'ye düşer; Katman B\'nin olayı onun başına gelecek.',
          video: 'Nöbetçi eczane ışığı; Dolapdere\'de dökük merdivenler; kapıda mendilci çocuk.',
        },
      },
      {
        scene_id: 'c1_b2_kid',
        scene_type: 'choice',
        text: [say('y1', 'kid'), say('y2', 'kid'), 'photo', msg('chief', 'chief')],
        choices: [
          { id: 'take_photo', hotspot: { x: 60, y: 46 }, effects: [{ set: { kid_involved: true }, clue: 'matbaa_photo' }], next: 'c1_b3_boulevard' },
          { id: 'delete_photo', hotspot: { x: 34, y: 68 }, next: 'c1_b3_boulevard' },
        ],
        video_asset: null,
        notes: {
          dev: 'Kanıt vs. bir çocuğu korumak. Fotoğraf hastanede "gazeteci" seçeneğini açar; ama mendilci çocuk\'u riske atar.',
          video: 'Kapı eşiği, alçak sesle konuşma. Fotoğraf UI kartında, videoda okunmaz.',
        },
      },
      {
        scene_id: 'c1_b3_boulevard',
        scene_type: 'choice',
        text: ['l1', 'l2', say('t1', 'chief'), say('t2', 'chief'), msg('rota', 'rota'), 'l3'],
        on_enter: [{ clue: 'not_accident' }],
        timer: { seconds: 12, on_timeout: 'freeze' },
        choices: [
          { id: 'stay', hotspot: { x: 36, y: 64 }, effects: [{ set: { chief: 'stayed' } }], next: 'c1_b4_hospital' },
          { id: 'chase', hotspot: { x: 74, y: 44 }, effects: [{ set: { chief: 'chased' } }], next: 'c1_b5_printhouse' },
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
        scene_id: 'c1_b4_hospital',
        scene_type: 'choice',
        text: [line('froze', HESITATED), 'l1', msg('rota', 'rota'), say('chief', 'chief'), 'l2'],
        choices: [
          { id: 'strike', hotspot: { x: 34, y: 56 }, next: 'c1_end_b_strike' },
          { id: 'press', hotspot: { x: 66, y: 70 }, conditions: { clue: 'matbaa_photo' }, show_locked: true, next: 'c1_end_b_headline' },
        ],
        video_asset: null,
        notes: {
          dev: 'Dayanışma mı, kanıt mı. Gazeteci seçeneği yalnızca mendilci çocuk\'un fotoğrafı alındıysa açılır.',
          video: 'Taksim İlk Yardım koridoru, sabaha karşı. Koridorda birikmiş kuryeler, kasklar kucakta.',
        },
      },
      {
        scene_id: 'c1_b5_printhouse',
        scene_type: 'interaction',
        text: ['l1', 'l2', 'l3'],
        timer: { seconds: 10, on_timeout: 'freeze' },
        choices: [
          { id: 'enter', hotspot: { x: 52, y: 50 }, next: 'c1_end_b_blackbox' },
          { id: 'photo_run', hotspot: { x: 28, y: 72 }, next: 'c1_end_b_evidence' },
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
        scene_type: 'ending',
        text: ['l1', 'l2', ...RENT, ...NO_MEDICINE, line('@common.system_chose', { flag: 'system_chose' }), ...ROTA_HOOK],
        video_asset: null,
        notes: { dev: 'A son: Sessizlik.', video: 'Sabah kahvehane, televizyon (ekran içeriği okunmaz). c1_end_a_tribe ile aynı mekân.' },
      },
      {
        scene_id: 'c1_end_a_tribe',
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
        scene_type: 'ending',
        text: [
          line('stairs', { var: 'escape_route', eq: 'stairs' }),
          say('stairs_say', 'cico', { var: 'escape_route', eq: 'stairs' }),
          'main',
          line('not_opened', { not: { clue: 'drive' } }),
          line('opened', { clue: 'drive' }),
          line('plate', { var: 'escape_route', eq: 'passage' }),
          'dilemma',
          ...NO_MEDICINE,
          ...ROTA_HOOK,
        ],
        video_asset: null,
        notes: { dev: 'A son: Paket Bende.', video: 'Şafak, Karaköy, kapalı balıkçı tentesi, paket kucakta.' },
      },
      {
        scene_id: 'c1_end_a_fall',
        scene_type: 'ending',
        text: ['l1', 'l2', 'voice', say('fall_1', 'chief'), say('fall_2', 'chief'), 'l3', 'l4', ...NO_MEDICINE, ...ROTA_HOOK],
        on_enter: [{ clue: 'risk_list' }],
        video_asset: null,
        notes: {
          dev: 'A son: Düşüş. Başarısızlık en büyük ipucunu verir: ROTA\'nın risk listesi (ilk seçimde ROTA\'nın neden onu seçtiğini açıklar).',
          video: 'Islak basamaklar, kayma (şiddet gösterilmez, kesme ile). Yerde kâğıt; içerik UI kartında.',
        },
      },
      {
        scene_id: 'c1_end_a_desk',
        scene_type: 'ending',
        text: [line('silence', HESITATED), 'l1', 'l2', 'l3', 'l4'],
        video_asset: null,
        notes: { dev: 'A son: Masa. Karanlık son; ROTA kancası yok, kanca duran yeşil nokta.', video: 'Ofis, gece, ekranda yeşil noktalar (harita; yazı yok).' },
      },

      // ══ SONLAR — KATMAN B ══════════════════════════════════════════
      {
        scene_id: 'c1_end_b_strike',
        scene_type: 'ending',
        text: ['l1', 'l2', msg('kabile', 'kabile'), ...ROTA_HOOK],
        video_asset: null,
        notes: { dev: 'B son: Kontak Kapatma. Dayanışma kirayı da çözer.', video: 'Ertesi gece Nevizade (açılış mekânı), kurye olmayan kalabalık; park edilmiş, kontağı kapalı scooter sırası.' },
      },
      {
        scene_id: 'c1_end_b_headline',
        scene_type: 'ending',
        text: ['l1', 'l2', msg('kid', 'kid'), 'l3', ...RENT, ...ROTA_HOOK],
        video_asset: null,
        notes: { dev: 'B son: Manşet.', video: 'Sabah, hastane önü, telefonlarına bakan kuryeler (ekran içeriği okunmaz).' },
      },
      {
        scene_id: 'c1_end_b_blackbox',
        scene_type: 'ending',
        text: [line('froze', HESITATED), 'l1', 'l2', intro('man'), say('man', 'man')],
        on_enter: [{ clue: 'risk_list' }],
        video_asset: null,
        notes: { dev: 'B son: Kara Kutu. ROTA kancası yok; kanca adamın kendisi.', video: 'Matbaanın içi: ekranlar, masa, liste (içerik UI kartında). Arkada paltolu adam.' },
      },
      {
        scene_id: 'c1_end_b_evidence',
        scene_type: 'ending',
        text: ['l1', 'l2', 'l3', ...RENT, ...ROTA_HOOK],
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
