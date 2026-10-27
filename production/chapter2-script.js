/*
 * Bölüm 2 "Sabah Zili" — ekranda çıkacak metinler (taslak, TR).
 * Akış panosu (tools/gen-c2-board.js) bu dosyadan üretilir; Bölüm 2 koda geçerken de kaynak budur.
 *
 * Vuruş türleri: n = anlatı, s = konuşma, m = mesaj, i = tanıtım. `only` = yalnızca bu koşulda görünür.
 * Sahne türleri: cinematic (seçimsiz), choice (karar), interaction (oyun / jiroskop), ending (son).
 * Seçenek: { t: metin, to: hedef, sub: etki notu, lock: kilit, timeout: true }
 */
module.exports = {
  layers: {
    A: {
      title: 'Katman A · Paket',
      entry: 'Bölüm 1: SA1–SA4 → 2A0 · SA5 → 2AI',
      grid: {
        '2A0': [1, 0], '2AI': [2, 0], '2A1': [1, 1], '2A2': [1, 2], '2A3': [2, 3], '2A4': [2, 4],
        '2A5': [1, 5], '2A5b': [1, 6], '2A6': [1, 7], '2A7': [1, 8], '2A8': [1, 9], '2A9': [1, 10],
        '2A10': [1, 11], '2A10b': [1, 12], '2A11': [1, 13], '2A12': [1, 14], '2A13a': [1, 15], '2A13b': [3, 15],
        '2SA1': [0, 16], '2SA2': [1, 16], '2SA6': [2, 16], '2SA4': [3, 16], '2SA5': [4, 16], '2SA3': [5, 16],
      },
    },
    B: {
      title: 'Katman B · İlaç',
      entry: 'Bölüm 1: SB1, SB2, SB4 → 2B0 · SB3 → 2BK',
      grid: {
        '2B0': [1, 0], '2BK': [2, 0], '2B1': [1, 1], '2B2': [1, 2], '2B2b': [1, 3], '2B3a': [1, 4], '2B3b': [2, 4],
        '2B4': [1, 5], '2B5': [1, 6], '2B6': [1, 7], '2B7': [1, 8], '2B7b': [1, 9], '2B8': [1, 10], '2B9': [1, 11],
        '2B10': [1, 12], '2B11a': [1, 13], '2B11b': [3, 13],
        '2SB1': [0, 14], '2SB2': [1, 14], '2SB6': [2, 14], '2SB4': [3, 14], '2SB5': [4, 14], '2SB3': [5, 14],
      },
    },
  },

  scenes: {
    // ───────── Katman A ─────────
    '2A0': { title: 'Uykusuz Sabah', type: 'cinematic', beats: [
      { k: 'n', t: 'Sabahın beşi. Cico hiç uyumadı.' },
      { k: 'n', t: 'Hesapta para var. İçinde bir taş.', only: 'SA1 · Sessizlik' },
      { k: 'n', t: 'Kabile grubunda yüz okunmamış mesaj. Herkes onu soruyor.', only: 'SA2 · Kabile' },
      { k: 'n', t: 'Diskler selenin altında. Her ses bir kapı vuruşu gibi.', only: 'SA3 · Paket Bende' },
      { k: 'n', t: 'Elinde sargı, cebinde o liste.', only: 'SA4 · Düşüş' },
      { k: 'm', who: 'ROTA', t: '08:00 — Galata Feneri İlkokulu. Alıcı adı boş. Paketi depodan teslim alın.' },
    ], choices: [{ to: '2A1' }] },
    '2AI': { title: 'Masa, 07:40', type: 'cinematic', note: 'Yalnızca Bölüm 1 SA5 (Masa)', beats: [
      { k: 'n', t: 'ROTA\'nın masası. Ekranda okula giden tek bir nokta.' },
      { k: 'n', t: '"Kayıtlı aileler" listesinde tanıdık bir adres: mendilci çocuğun babaannesi.' },
      { k: 's', who: 'Paltolu adam', t: 'Bunu sen götür. Yüzün güven veriyor.' },
      { k: 'n', t: 'Bugün kapüşon yok. Boynunda ROTA\'nın yaka kartı.' },
    ], choices: [{ to: '2A1' }] },
    '2A1': { title: 'Depo', type: 'cinematic', beats: [
      { k: 'n', t: 'Kasımpaşa. Şafak, beton ve floresan.' },
      { k: 'n', t: 'Üstünde tek bir yazı olmayan büyük bir koli.' },
      { k: 'n', t: 'Görevli göz göze gelmiyor. "İmza at, git."' },
    ], choices: [{ to: '2A2' }] },
    '2A2': { title: 'Okul Kapısı', type: 'choice', timer: 12, beats: [
      { k: 'n', t: '07:58. Galata Feneri İlkokulu. Dün gece önünden geçtiği okul.' },
      { k: 'i', who: 'Filiz', t: 'Ücretli öğretmen. Ders başına para alır, çocuklar için her şeyini verir.' },
      { k: 's', who: 'Filiz', t: 'Alıcı kim? Bu koli bizim listede yok.' },
    ], choices: [
      { t: 'İmzala, bırak, git', to: '2A5', sub: 'kazanç + · Filiz soğuk', after: { id: '2A2-a', t: "Koli basamakta kaldı. Filiz'in bakışı sırtında." } },
      { t: '"Birlikte açalım."', to: '2A3', after: { id: '2A2-b', t: "Bant yırtılıyor. Filiz eğiliyor: \"Bakalım.\"" } },
      { t: 'Listeyi göster', to: '2A3', lock: 'liste', sub: 'Filiz\'in güveni ++', after: { id: '2A2-c', t: "Filiz ekrana eğiliyor. İlk kez ona güvenle bakıyor." } },
      { timeout: true, to: '2A5', sub: 'ROTA "teslim edildi" işaretler', after: { id: '2A2-d', t: "ROTA onun yerine karar verdi: \"Teslim edildi.\"" } },
    ] },
    '2A3': { title: 'Sınıf', type: 'cinematic', beats: [
      { k: 'n', t: 'Koli açılıyor. Kameralar, tarayıcılar, kablolar.' },
      { k: 's', who: 'Mendilci çocuk', t: 'Hocam, paketler artık okula da gelebilecekmiş. Artık babaannemin ilacı için koşturmak yok!' },
      { k: 'n', t: 'Dün gece gelmeyen ilaç. Reddettiği talep.', only: 'Bölüm 1\'de paketi seçtiyse' },
      { k: 's', who: 'Filiz', t: 'Haritalara çok meraklı. Sen mi öğrettin?' },
      { k: 's', who: 'Cico', t: 'Öğretmen olacaktım.' },
    ], choices: [{ to: '2A4' }] },
    '2A4': { title: 'Teneffüs', type: 'choice', timer: 10, beats: [
      { k: 'm', who: 'ROTA', t: 'Teslimat onaylanmadı. Hesabınız 10 dakika içinde askıya alınacak.' },
      { k: 's', who: 'Filiz', t: 'Bunları geri götür. Çocukların yüzünü taramasın.' },
    ], choices: [
      { t: 'Kutuyu geri götür', to: '2A5', sub: 'hesap askıda · Filiz +', after: { id: '2A4-a', t: "Kutu kucağında, hesap askıda. Arkasında Filiz gülümsüyor." } },
      { t: '"Bırak, sonra konuşuruz."', to: '2A5', sub: 'kazanç +', after: { id: '2A4-b', t: "Kutuyu kapıya bırakıp uzaklaşıyor. Cebinde bir bildirim: kazanç." } },
      { timeout: true, to: '2A5', sub: 'ROTA onaylar', after: { id: '2A4-c', t: "Ekran yeşile döndü. Kutu olduğu yerde." } },
    ] },
    '2A5': { title: 'Öğle Trafiği', type: 'cinematic', beats: [
      { k: 'n', t: 'Öğle. Karaköy\'de korna, martı, sıcak asfalt.' },
      { k: 'm', who: 'Annem', t: 'Tahliye kâğıdı geldi oğlum.', only: 'kira ödenmediyse' },
      { k: 'm', who: 'Annem', t: 'Ev sahibi zam istiyor. Sen üzülme.', only: 'kira ödendiyse' },
      { k: 'n', t: 'Para hep bir sipariş uzakta.' },
    ], choices: [{ to: '2A5b' }] },
    '2A5b': { title: 'Mola Dedikodusu', type: 'cinematic', beats: [
      { k: 'n', t: 'Karaköy\'de bir çay ocağı. Kuryeler scooter\'larının üstünde.' },
      { k: 'n', t: 'Kapıda dev bir motor duruyor. Sahibi herkesin çayını ödüyor.' },
      { k: 's', who: 'Kurye', t: 'Enduro kurye ha! Yok artık.' },
      { k: 's', who: 'Kurye', t: 'Ne taşıyor ki o motor? — Yok yahu, motor onu taşıyor.' },
      { k: 's', who: 'Kurye', t: 'Kurye çay ısmarlamaz, kurye çay bekler.' },
      { k: 'n', t: 'Gülüşüyorlar. Cico\'nun gözü motorda.' },
    ], choices: [{ to: '2A6' }] },
    '2A6': { title: 'Kahvehane', type: 'cinematic', beats: [
      { k: 'n', t: 'Akşam. Kabile\'nin kahvehanesi.' },
      { k: 'i', who: 'Endurocu', t: 'Kabile\'ye iki hafta önce katıldı. Motoru herkesinkinden büyük, cüzdanı herkesinkinden dolu.' },
      { k: 'n', t: 'Herkese çay dağıtıyor. Şef çayına dokunmuyor.' },
      { k: 'n', t: 'Kuryeler Cico\'yu alkışlıyor. Dünkü mesaj herkesi uyandırmış.', only: 'SA2 · Kabile' },
    ], video: 'Flow promptuna alkış bilgisi girilmeyecek (abartıyor).', choices: [{ to: '2A7' }] },
    '2A7': { title: 'Endurocu\'nun Sorusu', type: 'choice', beats: [
      { k: 'n', t: 'Endurocu onu kenara çekiyor.' },
      { k: 's', who: 'Endurocu', t: 'Paltolu adamı ben de tanırım. Elinde ne var?' },
    ], choices: [
      { t: 'Anlat', to: '2A8', sub: 'sızıntı: Endurocu her şeyi öğrenir', after: { id: '2A7-a', t: "Anlattıkça Endurocu gülümsüyor. Masanın altında bir ışık yanıp sönüyor." } },
      { t: 'Geçiştir', to: '2A8', after: { id: '2A7-b', t: "Cico omuz silkiyor. Endurocu'nun gözleri kısılıyor." } },
      { t: '"Şefe sor."', to: '2A8', sub: 'Şefin gözü Endurocu\'yu tutmaz', after: { id: '2A7-c', t: "Şef'in kaşı kalkıyor. Endurocu'nun gülüşü donuyor." } },
    ] },
    '2A8': { title: 'Kapıdaki Adam', type: 'cinematic', beats: [
      { k: 'n', t: '16:00. Okul dağılıyor.' },
      { k: 'n', t: 'Kapıda siyah araba. Duvarda yeni dolap, kamerası parlıyor.' },
      { k: 's', who: 'Paltolu adam', t: 'Güzel okul. Çocuklar zehir gibi…' },
    ], choices: [{ to: '2A9' }] },
    '2A9': { title: 'Teklif', type: 'choice', timer: 12, beats: [
      { k: 's', who: 'Paltolu adam', t: 'Elindekini ver ya da bizim için çalış.' },
      { k: 's', who: 'Paltolu adam', t: 'Okula bağış devam eder. Dolap yerinde kalır.' },
    ], choices: [
      { t: 'Kabul et', to: '2A10', sub: 'kabul', after: { id: '2A9-a', t: "Zarf elinde. Gözleri yerde." } },
      { t: 'Reddet', to: '2A10', sub: 'ret', after: { id: '2A9-b', t: "Cam yavaşça kapanıyor." } },
      { t: 'Kabul ediyormuş gibi yap', to: '2A10', lock: 'diskler / liste', sub: 'çift oyun', after: { id: '2A9-c', t: "El sıkışıyor. Cebinde telefon kayıtta." } },
      { t: 'Sistemden çocukların kaydını sil', to: '2A10', lock: 'içeriden', after: { id: '2A9-d', t: "Gece, ROTA'nın masası. Bir tık: çocukların adları listeden siliniyor." } },
      { timeout: true, to: '2A10', sub: 'sessizlik "evet" sayılır', after: { id: '2A9-e', t: "Adam saatine bakıyor. Araba sessizce gidiyor." } },
    ] },
    '2A10': { title: 'Merdivenler', type: 'choice', love: true, beats: [
      { k: 'n', t: 'Akşamüstü. Okulun basamakları.' },
      { k: 's', who: 'Filiz', t: 'Ben de kadrosuzum. Her eylül sözleşmemi bekliyorum.' },
      { k: 's', who: 'Filiz', t: 'Senin sınavın, benim sözleşmem. Aynı kuyruk.' },
    ], choices: [
      { t: 'Ona her şeyi anlat', to: '2A10b', sub: 'yakınlık ++ · o da tehlikede', after: { id: '2A10-a', t: "Anlattıkça Filiz'in eli ağzına gidiyor." } },
      { t: 'Sadece dinle', to: '2A10b', sub: 'yakınlık +', after: { id: '2A10-b', t: "Filiz konuşuyor. Çaylar soğuyor." } },
      { t: '"Gitmem lazım."', to: '2A10b', after: { id: '2A10-c', t: "Kalkıyor. Filiz arkasından bakıyor." } },
    ] },
    '2A10b': { title: 'Gece Çağrısı', type: 'cinematic', bridge: true, beats: [
      { k: 'n', t: 'Gece. Eve dönüyor.' },
      { k: 'm', who: 'ROTA', t: 'Son dakika: Kasımpaşa deposundan bir teslim alım.' },
      { k: 'n', t: 'Bu saatte? Bugün?' },
    ], choices: [{ to: '2A11' }] },
    '2A11': { title: 'İhanet', type: 'cinematic', beats: [
      { k: 'n', t: 'Depo. Kepenk yarı açık.' },
      { k: 'n', t: 'Önünde o dev motor. Endurocu, paltolu adamdan bir zarf alıyor.' },
      { k: 'n', t: 'Endurocu başını çeviriyor. Göz göze geliyorlar.' },
      { k: 'n', t: 'Paltolu adam bütün bilgileri Endurocu\'dan alıyormuş.', only: 'Endurocu\'ya anlattıysa' },
      { k: 'n', t: 'Teklifi kabul ettin ama Endurocu bunu bilmiyor. Gördüğün şey yüzünden peşine düşüyor.', only: 'kabul ettiyse' },
      { k: 'n', t: 'Neden kaçtığını bilmiyor. Ama kaçıyor.', only: 'sustuysa' },
    ], choices: [{ to: '2A12' }] },
    '2A12': { title: 'Köprü Kaçışı', type: 'interaction', game: true, beats: [
      { k: 'n', t: 'Galata Köprüsü. Arkada tek bir far.' },
      { k: 'n', t: 'Telefonu eğ. Arabaların, tramvayın arasından geç.' },
      { k: 'g', t: '35 sn · mesafe sıfırlanmazsa kaçarsın · iki kez yakalanırsan "Hikâyeye devam et"' },
    ], choices: [
      { t: 'Kaçtı', to: '2A13a' },
      { t: 'Yakalandı', to: '2A13b' },
    ] },
    '2A13a': { title: 'Kaçtı', type: 'cinematic', beats: [
      { k: 'n', t: 'Köprünün öbür ucu. Ara sokaklar.' },
      { k: 'n', t: 'Far ana caddeden geçip gidiyor. Görmedi.' },
      { k: 'n', t: 'Cico derin bir nefes alıyor.' },
    ], choices: [
      { t: 'reddettiyse', to: '2SA1', auto: true },
      { t: 'oynadıysa', to: '2SA2', auto: true },
      { t: 'sildiyse', to: '2SA6', auto: true },
      { t: 'kabul ettiyse', to: '2SA4', auto: true },
      { t: 'sustuysa', to: '2SA5', auto: true },
    ] },
    '2A13b': { title: 'Yakalandı', type: 'cinematic', beats: [
      { k: 'n', t: 'Scooter yerde. Teker hâlâ dönüyor.' },
      { k: 'n', t: 'Endurocu telefonu havaya kaldırıyor. Ne varsa alıyor.' },
      { k: 's', who: 'Endurocu', t: 'ROTA çekirdek ekibine hoş geldin.', only: 'kabul ettiyse' },
      { k: 'n', t: 'Alacak bir şey bulamıyor. Fotoğrafları siliyor, gidiyor.', only: 'sustuysa' },
    ], choices: [
      { t: 'reddettiyse / oynadıysa / sildiyse', to: '2SA3', auto: true },
      { t: 'kabul ettiyse', to: '2SA4', auto: true },
      { t: 'sustuysa', to: '2SA5', auto: true },
    ] },
    '2SA1': { title: 'Okul Bizim', type: 'ending', beats: [
      { k: 'n', t: 'Bir hafta sonra. Veliler dolabı söktürdü.' },
      { k: 's', who: 'Filiz', t: 'Ders başına para alıyorum. Ama bugün bedavaya mutluyum.' },
      { k: 'm', who: 'ROTA', t: 'Hesabınız kalıcı olarak kapatılmıştır.' },
      { k: 'n', t: 'Gelir yok. Kira yine eksik.' },
      { k: 'n', t: 'Gece bir haber bildirimi: ROTA aynı dolabı başka bir okulun kapısına kurmuş.' },
    ], choices: [] },
    '2SA2': { title: 'Çift Oyun', type: 'ending', beats: [
      { k: 'n', t: 'Sabah. Cico paltolu adamın elini sıkıyor.' },
      { k: 'n', t: 'Kapının aralığından Filiz bakıyor. Onu ROTA\'ya satıldı sanıyor.' },
      { k: 'n', t: 'Söyleyemez. Henüz değil.' },
      { k: 'm', who: 'Paltolu adam', t: 'İlk gerçek görevin: Kabile Şefi\'nin ev adresi.' },
    ], choices: [] },
    '2SA3': { title: 'Bedel', type: 'ending', beats: [
      { k: 'n', t: 'Ertesi sabah. Yağmur.' },
      { k: 'n', t: 'Filiz elinde bir kutuyla basamaklardan iniyor. Okul ona yol verdi.' },
      { k: 'm', who: 'Filiz', t: 'Sana kızgın değilim. Ama artık okul yok.' },
    ], choices: [] },
    '2SA4': { title: 'Suç Ortağı', type: 'ending', beats: [
      { k: 'n', t: 'Kira yattı. Altında yeni bir scooter.' },
      { k: 'n', t: 'Dolap artık yalnızca ücretli saatlerde açılıyor.' },
      { k: 'n', t: 'Sabah okul kapısında veliler sırada, ellerinde telefon, ödeme yapıyor.' },
      { k: 'n', t: 'Filiz onu görüyor. Selam vermiyor.' },
      { k: 'm', who: 'ROTA', t: 'Tebrikler! Bu haftanın primini kazandınız.' },
    ], choices: [] },
    '2SA5': { title: 'Sessiz Kalan', type: 'ending', beats: [
      { k: 'n', t: 'Ertesi gün her şey yerinde. Dolap, kamera, siyah araba.' },
      { k: 'n', t: 'Filiz kapıda el sallıyor. Cico başını eğip geçiyor.' },
      { k: 'm', who: 'ROTA', t: 'Teslimat başarılı. Puanınız: 5 yıldız.' },
      { k: 'n', t: 'Hiçbir şey olmadı. Olan da buydu.' },
    ], choices: [] },
    '2SA6': { title: 'İçerideki Adam', type: 'ending', beats: [
      { k: 'n', t: 'Sabah. ROTA\'nın ofisi.' },
      { k: 'n', t: 'Çocukların kayıtları silindi. ROTA sızıntıyı arıyor.' },
      { k: 'n', t: 'Klavyesinin üstünde bir zarf. Üstünde tek kelime: "Biliyoruz."' },
      { k: 'n', t: 'Koridorun sonunda paltolu adam.' },
    ], choices: [] },

    // ───────── Katman B ─────────
    '2B0': { title: 'Sabah Haberleri', type: 'cinematic', beats: [
      { k: 'n', t: 'Sabah. Televizyonda kuryeler.' },
      { k: 'n', t: 'Dün geceki grev haberlerde. Şehir fark etti.', only: 'SB1 · Kontak Kapatma' },
      { k: 'n', t: 'Çocuğun fotoğrafı her yerde.', only: 'SB2 · Manşet' },
      { k: 'n', t: 'Ekranların fotoğrafı telefonunda. Plakası ROTA\'nın listesinde.', only: 'SB4 · Kanıt' },
      { k: 'm', who: 'ROTA', t: 'Hesabınız incelemede. Bu teslimatı yaparsanız açılır: 08:00 — Galata Feneri İlkokulu.' },
    ], choices: [{ to: '2B1' }] },
    '2BK': { title: 'İkinci Telefon', type: 'cinematic', note: 'Yalnızca Bölüm 1 SB3 (Kara Kutu)', beats: [
      { k: 'n', t: 'Masada iki telefon. Biri onun, biri adamın.' },
      { k: 'm', who: 'Bilinmeyen numara', t: 'Kabile\'nin her adımını yaz. Yoksa çocuğun fotoğrafı da senin yüzün de haberlerde.' },
      { k: 'm', who: 'Bilinmeyen numara', t: 'İlk iş: çocuğa tableti götür.' },
    ], choices: [{ to: '2B1' }] },
    '2B1': { title: 'Okul Kapısı', type: 'cinematic', beats: [
      { k: 'n', t: '07:58. Galata Feneri İlkokulu.' },
      { k: 'i', who: 'Filiz', t: 'Ücretli öğretmen. Ders başına para alır, çocuklar için her şeyini verir.' },
      { k: 's', who: 'Mendilci çocuk', t: 'Hocam, paketler artık okula da gelebiliyormuş. Artık babaannemin ilacı için koşturmak yok!' },
      { k: 'n', t: 'Kapının yanında yeni bir dolap. Kamerası Cico\'ya bakıyor.' },
      { k: 'n', t: 'Çocuk mahallede ünlü. ROTA onu yakında tutmak istiyor.', only: 'SB2 · Manşet' },
    ], choices: [{ to: '2B2' }] },
    '2B2': { title: 'Dolap', type: 'choice', timer: 12, beats: [
      { k: 'n', t: 'Bir bölme açılıyor. Yeşil ışık.' },
      { k: 'm', who: 'ROTA', t: 'Koliyi dolaba koyun. Hesabınız açılacak.' },
      { k: 'n', t: 'Arkasında Filiz. Kenarda çocuğun kırmızı kapüşonu.' },
    ], choices: [
      { t: 'Dolaba koy', to: '2B2b', sub: 'hesap açılır · Filiz kırgın', after: { id: '2B2-a', t: "Koli dolapta. Ekran yeşil. Filiz başını çeviriyor." } },
      { t: 'Koymadan Filiz\'i uyar', to: '2B2b', sub: 'hesap kapanır · Filiz ++', after: { id: '2B2-b', t: "Koli hâlâ kucağında. Dolap bekliyor." } },
      { t: 'Ekranı ve kamerayı fotoğrafla', to: '2B2b', lock: 'fotoğraf / kanıt', sub: 'veri toplama kanıtı', after: { id: '2B2-c', t: "Deklanşör. Kameranın kırmızı ışığı ona dönüyor." } },
      { timeout: true, to: '2B2b', sub: 'koli otomatik dolaba alınır', after: { id: '2B2-d', t: "Dolap kendi kendine açılıp koliyi içine çekiyor." } },
    ] },
    '2B2b': { title: 'Mola Dedikodusu', type: 'cinematic', beats: [
      { k: 'n', t: 'Grevden sonraki ilk sakin mola. Karaköy\'de çay ocağı.' },
      { k: 'n', t: 'Kapıda dev bir motor. Sahibi herkese çay ısmarlıyor, soru soruyor.' },
      { k: 's', who: 'Kurye', t: 'Enduro kurye ha! Yok artık.' },
      { k: 's', who: 'Kurye', t: 'Kaskın markasını gördünüz mü? Benim scooter kadar fiyatı.' },
      { k: 's', who: 'Kurye', t: 'Çok soru soruyor ama…' },
    ], choices: [
      { t: 'Bölüm 1: şefin yanında kaldıysa', to: '2B3a', auto: true },
      { t: 'Bölüm 1: arabayı kovaladıysa', to: '2B3b', auto: true },
    ] },
    '2B3a': { title: 'Şef · alçılı', type: 'cinematic', beats: [
      { k: 'n', t: 'Kahvehane. Şefin kolu alçıda.' },
      { k: 's', who: 'Kabile Şefi', t: 'Gel otur babuş. Dün gece sen olmasan…' },
      { k: 's', who: 'Kabile Şefi', t: 'Kabile\'ye yeni biri girdi. Endurocu diyorlar. Parası çok, sorusu çok.' },
    ], choices: [{ to: '2B4' }] },
    '2B3b': { title: 'Şef · hastanede', type: 'cinematic', beats: [
      { k: 'n', t: 'Hastane. Şef camdan dışarı bakıyor.' },
      { k: 's', who: 'Kabile Şefi', t: 'Beni yerde bıraktın, babuş.' },
      { k: 's', who: 'Kabile Şefi', t: 'Kabile\'ye yeni biri girdi. Endurocu diyorlar. Parası çok, sorusu çok. Gözün üstünde olsun.' },
    ], choices: [{ to: '2B4' }] },
    '2B4': { title: 'Köprü Altı', type: 'cinematic', beats: [
      { k: 'n', t: 'Akşamüstü. Galata Köprüsü\'nün altı, kepenkler inik.' },
      { k: 'n', t: 'Kabile ikinci eylemi planlıyor: okulun önünde veliler ve kuryeler, birlikte.' },
      { k: 'i', who: 'Endurocu', t: 'Kabile\'ye iki hafta önce katıldı. Motoru herkesinkinden büyük, cüzdanı herkesinkinden dolu.' },
      { k: 'n', t: 'Endurocu grev kasasına bir deste para uzatıyor.' },
    ], choices: [{ to: '2B5' }] },
    '2B5': { title: 'Fon', type: 'choice', beats: [
      { k: 's', who: 'Endurocu', t: 'Al kardeşim. Kabile için.' },
      { k: 'n', t: 'Şef kaşlarını çatıyor.' },
    ], choices: [
      { t: 'Al', to: '2B6', sub: 'Kabile memnun · para izlenebilir, plan sızar', after: { id: '2B5-a', t: "Para kasada. Bandın üstünde küçük bir etiket parlıyor." } },
      { t: 'Reddet', to: '2B6', sub: 'Endurocu bozulur', after: { id: '2B5-b', t: "Para geri dönüyor. Endurocu'nun yüzü geriliyor." } },
      { t: 'Geçmişini sor', to: '2B6', sub: 'şef yalanı fark eder', after: { id: '2B5-c', t: "Endurocu cevap veriyor. Gözleri kayıyor." } },
    ] },
    '2B6': { title: 'Filiz', type: 'cinematic', beats: [
      { k: 'n', t: 'Okul dağıldı. Boş sınıf, küçük sandalyeler.' },
      { k: 's', who: 'Filiz', t: 'Velilere yarın anlatırız. Önce resimle, sonra sözle.' },
      { k: 's', who: 'Filiz', t: 'Seni tanıyorum aslında. Çocuk her gün anlatıyor: yeşil scooter\'lı Hoca.' },
    ], choices: [{ to: '2B7' }] },
    '2B7': { title: 'Merdivenler', type: 'choice', love: true, beats: [
      { k: 'n', t: 'Gece. Okulun basamakları. Tek bardak çay, iki kişi.' },
      { k: 's', who: 'Filiz', t: 'Ben de kadrosuzum. Her eylül sözleşmemi bekliyorum.' },
    ], choices: [
      { t: 'Açıl', to: '2B7b', sub: 'yakınlık ++', after: { id: '2B7-a', t: "Filiz ilk kez gülümsüyor." } },
      { t: 'Dinle', to: '2B7b', sub: 'yakınlık +', after: { id: '2B7-b', t: "Sokak lambaları birer birer yanıyor." } },
      { t: 'Uzak dur', to: '2B7b', after: { id: '2B7-c', t: "Aralarında üç basamak. Kimse inmiyor." } },
      { t: 'Köstebek olduğunu itiraf et', to: '2B7b', lock: 'köstebek', sub: 'yakınlık +++ · o da artık biliyor', after: { id: '2B7-d', t: "İkinci telefon avucunda. Filiz geri çekilmiyor." } },
    ] },
    '2B7b': { title: 'Geçen Motor', type: 'cinematic', bridge: true, beats: [
      { k: 'n', t: 'Bir motor gürültüsü. Dev bir far, hızla aşağı.' },
      { k: 'n', t: 'Cico motoru tanıyor: Endurocu. Kaskını kapıyor.' },
      { k: 's', who: 'Filiz', t: 'Nereye?' },
    ], choices: [{ to: '2B8' }] },
    '2B8': { title: 'Matbaada Bir Motor', type: 'cinematic', beats: [
      { k: 'n', t: 'Tarlabaşı. Tabelası sökülmüş matbaa. Dün gece ekranları gördüğü yer.' },
      { k: 'n', t: 'Kapıda Endurocu\'nun motoru. Hâlâ sıcak.' },
    ], choices: [{ to: '2B9' }] },
    '2B9': { title: 'Şüphe', type: 'choice', timer: 10, beats: [
      { k: 'n', t: 'Kapı açılıyor. Endurocu gülerek çıkıyor. Yanında paltolu adam.' },
      { k: 'n', t: 'Adam Endurocu\'nun omzunu sıvazlıyor. Bir meslektaş gibi.' },
    ], choices: [
      { t: 'Takip et', to: '2B10', after: { id: '2B9-a', t: "Far kapalı. Arada iki lamba." } },
      { t: 'Şefe haber ver', to: '2B10', sub: 'Endurocu deşifre olduğunu anlar', after: { id: '2B9-b', t: "Şef'e fısıldıyor. Pencerede Endurocu da telefonda." } },
      { t: 'İtiraf et: Endurocu\'yu da kendini de ifşa et', to: '2B10', lock: 'köstebek', after: { id: '2B9-c', t: "Gönder. Artık geri dönüş yok." } },
      { t: 'Planı adama yaz', to: '2B10', lock: 'köstebek', after: { id: '2B9-d', t: "Mesaj gitti. Gözlerini kapatıyor." } },
      { timeout: true, to: '2B10', sub: 'Endurocu onu görür', after: { id: '2B9-e', t: "Endurocu dönüyor. Göz göze geliyorlar." } },
    ] },
    '2B10': { title: 'Sahil Yolu Kaçışı', type: 'interaction', game: true, beats: [
      { k: 'n', t: 'Yağmur. Tophane sahil yolu. Arkada tek bir far.' },
      { k: 'n', t: 'ROTA\'nın iki muhbiri birbirini tanımıyor. Endurocu onu Kabile\'den sanıyor.', only: 'planı yazdıysa' },
      { k: 'n', t: 'Telefonu eğ. Kamyonların, otobüslerin arasından. Su birikintilerinde kayma.' },
      { k: 'g', t: '35 sn · mesafe sıfırlanmazsa kaçarsın · iki kez yakalanırsan "Hikâyeye devam et"' },
    ], choices: [
      { t: 'Kaçtı', to: '2B11a' },
      { t: 'Yakalandı', to: '2B11b' },
      { t: 'planı yazdıysa', to: '2SB3', auto: true },
    ] },
    '2B11a': { title: 'Toplantıya Yetişti', type: 'cinematic', beats: [
      { k: 'n', t: 'Köprü altı. Kabile toplanmış. Cico sırılsıklam.' },
      { k: 's', who: 'Cico', t: 'Şef. Bak.' },
      { k: 'n', t: 'Telefonda Endurocu ve paltolu adam. Herkes kapıya dönüyor.' },
      { k: 'n', t: 'Endurocu orada. Donmuş.' },
    ], choices: [
      { t: 'koliyi dolaba koymadıysa', to: '2SB1', auto: true },
      { t: 'kanıtı varsa', to: '2SB2', auto: true },
      { t: 'köstebekti, itiraf etti', to: '2SB6', auto: true },
    ] },
    '2B11b': { title: 'Telefon Kırıldı', type: 'cinematic', beats: [
      { k: 'n', t: 'Scooter kaydı. Cico su birikintisinin içinde.' },
      { k: 'n', t: 'Endurocu\'nun botu telefonun üstüne iniyor. Bir kez.' },
      { k: 'n', t: 'Köprüye doğru gidiyor. Kabile\'ye ilk o varacak.' },
    ], choices: [
      { t: 'aksi hâlde', to: '2SB4', auto: true },
      { t: 'koliyi dolaba koyduysa', to: '2SB5', auto: true },
    ] },
    '2SB1': { title: 'Kabile Ayakta', type: 'ending', beats: [
      { k: 'n', t: 'Sabah. Okulun önünde veliler ve kuryeler, omuz omuza.' },
      { k: 'n', t: 'ROTA kameraları kaldırıyor. Dolapları götürüyorlar.' },
      { k: 'n', t: 'Şefin hesabı kalıcı olarak kapandı. Gülüyor yine de.' },
      { k: 'n', t: 'Akşam bir zarf geliyor, ROTA\'nın avukatından: "Kara liste."' },
    ], choices: [] },
    '2SB2': { title: 'Manşet 2', type: 'ending', beats: [
      { k: 'n', t: 'Cico\'nun çektiği fotoğraflar manşet oldu: okul dolabı velilerin adresini, saatini, alışkanlığını topluyormuş.' },
      { k: 'n', t: 'ROTA "teknik bir hata" diyor. Dolap bir haftalığına kapandı.' },
      { k: 'n', t: 'Okul çıkışı. Çocuk eve tek başına yürüyor.' },
      { k: 'n', t: 'Karşı kaldırımda siyah araba. ROTA haberin kimden çıktığını biliyor.' },
    ], choices: [] },
    '2SB3': { title: 'Köstebek', type: 'ending', beats: [
      { k: 'n', t: 'Eylem gecesi. Mavi ışıklar.' },
      { k: 'n', t: 'Şefi götürüyorlar. Bir kez dönüp bakıyor. Hiçbir şey söylemeden.' },
      { k: 'm', who: 'ROTA', t: 'Hesabınız yeniden açıldı.' },
      { k: 'n', t: 'Okul kapısında Filiz. Onu adamın arabasında gördü.' },
    ], choices: [] },
    '2SB4': { title: 'Yalnız', type: 'ending', beats: [
      { k: 'n', t: 'Kahvehanenin camı buğulu. İçeride Kabile, sırtları ona dönük.' },
      { k: 'n', t: 'Endurocu yeni şef olmuş.' },
      { k: 'm', who: 'Filiz', t: 'Ben sana inanıyorum.' },
    ], choices: [] },
    '2SB5': { title: 'Dolap', type: 'ending', beats: [
      { k: 'n', t: 'Akşam. Dolabın ekranında kırmızı bir kilit: ücretsiz saatler bitti.' },
      { k: 'n', t: 'Çocuk babaannesinin ilacını alamadan dönüyor.' },
      { k: 'n', t: 'Cico ücreti kendi cebinden ödüyor. Bölme açılıyor.' },
      { k: 's', who: 'Mendilci çocuk', t: 'Hocam, bunu her gün yapamazsın ki.' },
    ], choices: [] },
    '2SB6': { title: 'İtiraf', type: 'ending', beats: [
      { k: 'n', t: 'Köprü altı. Kabile geri çekilmiş.' },
      { k: 's', who: 'Cico', t: 'Bu telefonu bana o verdi. Ben de onlardandım. Zorla.' },
      { k: 'n', t: 'Şef telefonu alıyor. "Otur."', only: 'Bölüm 1\'de yanında kaldıysa' },
      { k: 'n', t: 'Şef telefona bakıyor. Sonra ona. Gidiyor.', only: 'Bölüm 1\'de kovaladıysa' },
      { k: 'm', who: 'Paltolu adam', t: 'Seni ben seçtim. Şimdi ben bırakıyorum.' },
    ], choices: [] },
  },
};
