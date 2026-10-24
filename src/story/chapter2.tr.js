/* ÜRETİLDİ — elle düzenlemeyin. Kaynak: production/chapter2-script.js · node tools/gen-chapter2.js */
(function (root) {
  'use strict';
  const part = {
 "ui": {
  "chapter2_title": "Sabah Zili",
  "c2_pick_title": "Bölüm 1'i nasıl bitirdin?",
  "c2_pick_hint": "Bölüm 2, Bölüm 1'deki sonuna göre açılır.",
  "c2_continue": "Bölüm 2 · Sabah Zili",
  "c2_new": "yeni",
  "c2_ready": "Kaçışa hazır",
  "c2_ready_sub": "Telefonu eğerek sür",
  "c2_gyro_title": "Endurocu peşinde!",
  "c2_gyro_how": "Telefonu sağa sola eğ. Ya da ekranın iki yanına basılı tut. 35 saniye dayan.",
  "c2_gyro_ready": "Hazırım",
  "c2_gyro_caught": "Yakalandın.",
  "c2_gyro_retry": "Tekrar dene",
  "c2_gyro_cont": "Hikâyeye devam et",
  "c2_gyro_gap": "Mesafe"
 },
 "speakers": {
  "teacher": "Filiz",
  "enduro": "Endurocu",
  "courier": "Kurye"
 },
 "characters": {
  "teacher": {
   "name": "Filiz",
   "line": "Ücretli öğretmen. Ders başına para alır, çocuklar için her şeyini verir."
  },
  "enduro": {
   "name": "Endurocu",
   "line": "Kabile'ye iki hafta önce katıldı. Motoru herkesinkinden büyük, cüzdanı herkesinkinden dolu."
  }
 },
 "scenes": {
  "c2_2a0": {
   "title": "Uykusuz Sabah",
   "choices": {},
   "b0": "Sabahın beşi. Cico hiç uyumadı.",
   "b1": "Hesapta para var. İçinde bir taş.",
   "b2": "Kabile grubunda yüz okunmamış mesaj. Herkes onu soruyor.",
   "b3": "Diskler selenin altında. Her ses bir kapı vuruşu gibi.",
   "b4": "Elinde sargı, cebinde o liste.",
   "b5": "08:00 — Galata Feneri İlkokulu. Alıcı adı boş. Paketi depodan teslim alın."
  },
  "c2_2ai": {
   "title": "Masa, 07:40",
   "choices": {},
   "b0": "ROTA'nın masası. Ekranda okula giden tek bir nokta.",
   "b1": "\"Kayıtlı aileler\" listesinde tanıdık bir adres: mendilci çocuğun babaannesi.",
   "b2": "Bunu sen götür. Yüzün güven veriyor.",
   "b3": "Bugün kapüşon yok. Boynunda ROTA'nın yaka kartı."
  },
  "c2_2a1": {
   "title": "Depo",
   "choices": {},
   "b0": "Kasımpaşa. Şafak, beton ve floresan.",
   "b1": "Üstünde tek bir yazı olmayan büyük bir koli.",
   "b2": "Görevli göz göze gelmiyor. \"İmza at, git.\""
  },
  "c2_2a2": {
   "title": "Okul Kapısı",
   "choices": {
    "c0": "İmzala, bırak, git",
    "c1": "\"Birlikte açalım.\"",
    "c2": "Listeyi göster"
   },
   "b0": "07:58. Galata Feneri İlkokulu. Dün gece önünden geçtiği okul.",
   "b2": "Alıcı kim? Bu koli bizim listede yok."
  },
  "c2_2a3": {
   "title": "Sınıf",
   "choices": {},
   "b0": "Koli açılıyor. Kameralar, tarayıcılar, kablolar.",
   "b1": "Hocam, paketler artık okula da gelebilecekmiş. Artık babaannemin ilacı için koşturmak yok!",
   "b2": "Dün gece gelmeyen ilaç. Reddettiği talep.",
   "b3": "Haritalara çok meraklı. Sen mi öğrettin?",
   "b4": "Öğretmen olacaktım."
  },
  "c2_2a4": {
   "title": "Teneffüs",
   "choices": {
    "c0": "Kutuyu geri götür",
    "c1": "\"Bırak, sonra konuşuruz.\""
   },
   "b0": "Teslimat onaylanmadı. Hesabınız 10 dakika içinde askıya alınacak.",
   "b1": "Bunları geri götür. Çocukların yüzünü taramasın."
  },
  "c2_2a5": {
   "title": "Öğle Trafiği",
   "choices": {},
   "b0": "Öğle. Karaköy'de korna, martı, sıcak asfalt.",
   "b1": "Tahliye kâğıdı geldi oğlum.",
   "b2": "Ev sahibi zam istiyor. Sen üzülme.",
   "b3": "Para hep bir sipariş uzakta."
  },
  "c2_2a5b": {
   "title": "Mola Dedikodusu",
   "choices": {},
   "b0": "Karaköy'de bir çay ocağı. Kuryeler scooter'larının üstünde.",
   "b1": "Kapıda dev bir motor duruyor. Sahibi herkesin çayını ödüyor.",
   "b2": "Enduro kurye ha! Yok artık.",
   "b3": "Ne taşıyor ki o motor? — Yok yahu, motor onu taşıyor.",
   "b4": "Kurye çay ısmarlamaz, kurye çay bekler.",
   "b5": "Gülüşüyorlar. Cico'nun gözü motorda."
  },
  "c2_2a6": {
   "title": "Kahvehane",
   "choices": {},
   "b0": "Akşam. Kabile'nin kahvehanesi.",
   "b2": "Herkese çay dağıtıyor. Şef çayına dokunmuyor.",
   "b3": "Kuryeler Cico'yu alkışlıyor. Dünkü mesaj herkesi uyandırmış."
  },
  "c2_2a7": {
   "title": "Endurocu'nun Sorusu",
   "choices": {
    "c0": "Anlat",
    "c1": "Geçiştir",
    "c2": "\"Şefe sor.\""
   },
   "b0": "Endurocu onu kenara çekiyor.",
   "b1": "Paltolu adamı ben de tanırım. Elinde ne var?"
  },
  "c2_2a8": {
   "title": "Kapıdaki Adam",
   "choices": {},
   "b0": "16:00. Okul dağılıyor.",
   "b1": "Kapıda siyah araba. Duvarda yeni dolap, kamerası parlıyor.",
   "b2": "Güzel okul. Çocuklar zehir gibi…"
  },
  "c2_2a9": {
   "title": "Teklif",
   "choices": {
    "c0": "Kabul et",
    "c1": "Reddet",
    "c2": "Kabul ediyormuş gibi yap",
    "c3": "Sistemden çocukların kaydını sil"
   },
   "b0": "Elindekini ver ya da bizim için çalış.",
   "b1": "Okula bağış devam eder. Dolap yerinde kalır."
  },
  "c2_2a10": {
   "title": "Merdivenler",
   "choices": {
    "c0": "Ona her şeyi anlat",
    "c1": "Sadece dinle",
    "c2": "\"Gitmem lazım.\""
   },
   "b0": "Akşamüstü. Okulun basamakları.",
   "b1": "Ben de kadrosuzum. Her eylül sözleşmemi bekliyorum.",
   "b2": "Senin sınavın, benim sözleşmem. Aynı kuyruk."
  },
  "c2_2a10b": {
   "title": "Gece Çağrısı",
   "choices": {},
   "b0": "Gece. Eve dönüyor.",
   "b1": "Son dakika: Kasımpaşa deposundan bir teslim alım.",
   "b2": "Bu saatte? Bugün?"
  },
  "c2_2a11": {
   "title": "İhanet",
   "choices": {},
   "b0": "Depo. Kepenk yarı açık.",
   "b1": "Önünde o dev motor. Endurocu, paltolu adamdan bir zarf alıyor.",
   "b2": "Endurocu başını çeviriyor. Göz göze geliyorlar.",
   "b3": "Paltolu adam bütün bilgileri Endurocu'dan alıyormuş.",
   "b4": "Teklifi kabul ettin ama Endurocu bunu bilmiyor. Gördüğün şey yüzünden peşine düşüyor.",
   "b5": "Neden kaçtığını bilmiyor. Ama kaçıyor."
  },
  "c2_2a12": {
   "title": "Köprü Kaçışı",
   "choices": {
    "escape": "Kaçtı",
    "caught": "Yakalandı"
   },
   "b0": "Galata Köprüsü. Arkada tek bir far.",
   "b1": "Telefonu eğ. Arabaların, tramvayın arasından geç.",
   "b2": "35 sn · mesafe sıfırlanmazsa kaçarsın · iki kez yakalanırsan \"Hikâyeye devam et\""
  },
  "c2_2a13a": {
   "title": "Kaçtı",
   "choices": {},
   "b0": "Köprünün öbür ucu. Ara sokaklar.",
   "b1": "Far ana caddeden geçip gidiyor. Görmedi.",
   "b2": "Cico derin bir nefes alıyor."
  },
  "c2_2a13b": {
   "title": "Yakalandı",
   "choices": {},
   "b0": "Scooter yerde. Teker hâlâ dönüyor.",
   "b1": "Endurocu telefonu havaya kaldırıyor. Ne varsa alıyor.",
   "b2": "ROTA çekirdek ekibine hoş geldin.",
   "b3": "Alacak bir şey bulamıyor. Fotoğrafları siliyor, gidiyor."
  },
  "c2_2sa1": {
   "title": "Okul Bizim",
   "choices": {},
   "b0": "Bir hafta sonra. Veliler dolabı söktürdü.",
   "b1": "Ders başına para alıyorum. Ama bugün bedavaya mutluyum.",
   "b2": "Hesabınız kalıcı olarak kapatılmıştır.",
   "b3": "Gelir yok. Kira yine eksik.",
   "b4": "Gece bir haber bildirimi: ROTA aynı dolabı başka bir okulun kapısına kurmuş."
  },
  "c2_2sa2": {
   "title": "Çift Oyun",
   "choices": {},
   "b0": "Sabah. Cico paltolu adamın elini sıkıyor.",
   "b1": "Kapının aralığından Filiz bakıyor. Onu ROTA'ya satıldı sanıyor.",
   "b2": "Söyleyemez. Henüz değil.",
   "b3": "İlk gerçek görevin: Kabile Şefi'nin ev adresi."
  },
  "c2_2sa3": {
   "title": "Bedel",
   "choices": {},
   "b0": "Ertesi sabah. Yağmur.",
   "b1": "Filiz elinde bir kutuyla basamaklardan iniyor. Okul ona yol verdi.",
   "b2": "Sana kızgın değilim. Ama artık okul yok."
  },
  "c2_2sa4": {
   "title": "Suç Ortağı",
   "choices": {},
   "b0": "Kira yattı. Altında yeni bir scooter.",
   "b1": "Dolap artık yalnızca ücretli saatlerde açılıyor.",
   "b2": "Sabah okul kapısında veliler sırada, ellerinde telefon, ödeme yapıyor.",
   "b3": "Filiz onu görüyor. Selam vermiyor.",
   "b4": "Tebrikler! Bu haftanın primini kazandınız."
  },
  "c2_2sa5": {
   "title": "Sessiz Kalan",
   "choices": {},
   "b0": "Ertesi gün her şey yerinde. Dolap, kamera, siyah araba.",
   "b1": "Filiz kapıda el sallıyor. Cico başını eğip geçiyor.",
   "b2": "Teslimat başarılı. Puanınız: 5 yıldız.",
   "b3": "Hiçbir şey olmadı. Olan da buydu."
  },
  "c2_2sa6": {
   "title": "İçerideki Adam",
   "choices": {},
   "b0": "Sabah. ROTA'nın ofisi.",
   "b1": "Çocukların kayıtları silindi. ROTA sızıntıyı arıyor.",
   "b2": "Klavyesinin üstünde bir zarf. Üstünde tek kelime: \"Biliyoruz.\"",
   "b3": "Koridorun sonunda paltolu adam."
  },
  "c2_2b0": {
   "title": "Sabah Haberleri",
   "choices": {},
   "b0": "Sabah. Televizyonda kuryeler.",
   "b1": "Dün geceki grev haberlerde. Şehir fark etti.",
   "b2": "Çocuğun fotoğrafı her yerde.",
   "b3": "Ekranların fotoğrafı telefonunda. Plakası ROTA'nın listesinde.",
   "b4": "Hesabınız incelemede. Bu teslimatı yaparsanız açılır: 08:00 — Galata Feneri İlkokulu."
  },
  "c2_2bk": {
   "title": "İkinci Telefon",
   "choices": {},
   "b0": "Masada iki telefon. Biri onun, biri adamın.",
   "b1": "Kabile'nin her adımını yaz. Yoksa çocuğun fotoğrafı da senin yüzün de haberlerde.",
   "b2": "İlk iş: çocuğa tableti götür."
  },
  "c2_2b1": {
   "title": "Okul Kapısı",
   "choices": {},
   "b0": "07:58. Galata Feneri İlkokulu.",
   "b2": "Hocam, paketler artık okula da gelebiliyormuş. Artık babaannemin ilacı için koşturmak yok!",
   "b3": "Kapının yanında yeni bir dolap. Kamerası Cico'ya bakıyor.",
   "b4": "Çocuk mahallede ünlü. ROTA onu yakında tutmak istiyor."
  },
  "c2_2b2": {
   "title": "Dolap",
   "choices": {
    "c0": "Dolaba koy",
    "c1": "Koymadan Filiz'i uyar",
    "c2": "Ekranı ve kamerayı fotoğrafla"
   },
   "b0": "Bir bölme açılıyor. Yeşil ışık.",
   "b1": "Koliyi dolaba koyun. Hesabınız açılacak.",
   "b2": "Arkasında Filiz. Kenarda çocuğun kırmızı kapüşonu."
  },
  "c2_2b2b": {
   "title": "Mola Dedikodusu",
   "choices": {},
   "b0": "Grevden sonraki ilk sakin mola. Karaköy'de çay ocağı.",
   "b1": "Kapıda dev bir motor. Sahibi herkese çay ısmarlıyor, soru soruyor.",
   "b2": "Enduro kurye ha! Yok artık.",
   "b3": "Kaskın markasını gördünüz mü? Benim scooter kadar fiyatı.",
   "b4": "Çok soru soruyor ama…"
  },
  "c2_2b3a": {
   "title": "Şef · alçılı",
   "choices": {},
   "b0": "Kahvehane. Şefin kolu alçıda.",
   "b1": "Gel otur babuş. Dün gece sen olmasan…",
   "b2": "Kabile'ye yeni biri girdi. Endurocu diyorlar. Parası çok, sorusu çok."
  },
  "c2_2b3b": {
   "title": "Şef · hastanede",
   "choices": {},
   "b0": "Hastane. Şef camdan dışarı bakıyor.",
   "b1": "Beni yerde bıraktın, babuş.",
   "b2": "Kabile'ye yeni biri girdi. Endurocu diyorlar. Parası çok, sorusu çok. Gözün üstünde olsun."
  },
  "c2_2b4": {
   "title": "Köprü Altı",
   "choices": {},
   "b0": "Akşamüstü. Galata Köprüsü'nün altı, kepenkler inik.",
   "b1": "Kabile ikinci eylemi planlıyor: okulun önünde veliler ve kuryeler, birlikte.",
   "b3": "Endurocu grev kasasına bir deste para uzatıyor."
  },
  "c2_2b5": {
   "title": "Fon",
   "choices": {
    "c0": "Al",
    "c1": "Reddet",
    "c2": "Geçmişini sor"
   },
   "b0": "Al kardeşim. Kabile için.",
   "b1": "Şef kaşlarını çatıyor."
  },
  "c2_2b6": {
   "title": "Filiz",
   "choices": {},
   "b0": "Okul dağıldı. Boş sınıf, küçük sandalyeler.",
   "b1": "Velilere yarın anlatırız. Önce resimle, sonra sözle.",
   "b2": "Seni tanıyorum aslında. Çocuk her gün anlatıyor: yeşil scooter'lı Hoca."
  },
  "c2_2b7": {
   "title": "Merdivenler",
   "choices": {
    "c0": "Açıl",
    "c1": "Dinle",
    "c2": "Uzak dur",
    "c3": "Köstebek olduğunu itiraf et"
   },
   "b0": "Gece. Okulun basamakları. Tek bardak çay, iki kişi.",
   "b1": "Ben de kadrosuzum. Her eylül sözleşmemi bekliyorum."
  },
  "c2_2b7b": {
   "title": "Geçen Motor",
   "choices": {},
   "b0": "Bir motor gürültüsü. Dev bir far, hızla aşağı.",
   "b1": "Cico motoru tanıyor: Endurocu. Kaskını kapıyor.",
   "b2": "Nereye?"
  },
  "c2_2b8": {
   "title": "Matbaada Bir Motor",
   "choices": {},
   "b0": "Tarlabaşı. Tabelası sökülmüş matbaa. Dün gece ekranları gördüğü yer.",
   "b1": "Kapıda Endurocu'nun motoru. Hâlâ sıcak."
  },
  "c2_2b9": {
   "title": "Şüphe",
   "choices": {
    "c0": "Takip et",
    "c1": "Şefe haber ver",
    "c2": "İtiraf et: Endurocu'yu da kendini de ifşa et",
    "c3": "Planı adama yaz"
   },
   "b0": "Kapı açılıyor. Endurocu gülerek çıkıyor. Yanında paltolu adam.",
   "b1": "Adam Endurocu'nun omzunu sıvazlıyor. Bir meslektaş gibi."
  },
  "c2_2b10": {
   "title": "Sahil Yolu Kaçışı",
   "choices": {
    "escape": "Kaçtı",
    "caught": "Yakalandı"
   },
   "b0": "Yağmur. Tophane sahil yolu. Arkada tek bir far.",
   "b1": "ROTA'nın iki muhbiri birbirini tanımıyor. Endurocu onu Kabile'den sanıyor.",
   "b2": "Telefonu eğ. Kamyonların, otobüslerin arasından. Su birikintilerinde kayma.",
   "b3": "35 sn · mesafe sıfırlanmazsa kaçarsın · iki kez yakalanırsan \"Hikâyeye devam et\""
  },
  "c2_2b11a": {
   "title": "Toplantıya Yetişti",
   "choices": {},
   "b0": "Köprü altı. Kabile toplanmış. Cico sırılsıklam.",
   "b1": "Şef. Bak.",
   "b2": "Telefonda Endurocu ve paltolu adam. Herkes kapıya dönüyor.",
   "b3": "Endurocu orada. Donmuş."
  },
  "c2_2b11b": {
   "title": "Telefon Kırıldı",
   "choices": {},
   "b0": "Scooter kaydı. Cico su birikintisinin içinde.",
   "b1": "Endurocu'nun botu telefonun üstüne iniyor. Bir kez.",
   "b2": "Köprüye doğru gidiyor. Kabile'ye ilk o varacak."
  },
  "c2_2sb1": {
   "title": "Kabile Ayakta",
   "choices": {},
   "b0": "Sabah. Okulun önünde veliler ve kuryeler, omuz omuza.",
   "b1": "ROTA kameraları kaldırıyor. Dolapları götürüyorlar.",
   "b2": "Şefin hesabı kalıcı olarak kapandı. Gülüyor yine de.",
   "b3": "Akşam bir zarf geliyor, ROTA'nın avukatından: \"Kara liste.\""
  },
  "c2_2sb2": {
   "title": "Manşet 2",
   "choices": {},
   "b0": "Cico'nun çektiği fotoğraflar manşet oldu: okul dolabı velilerin adresini, saatini, alışkanlığını topluyormuş.",
   "b1": "ROTA \"teknik bir hata\" diyor. Dolap bir haftalığına kapandı.",
   "b2": "Okul çıkışı. Çocuk eve tek başına yürüyor.",
   "b3": "Karşı kaldırımda siyah araba. ROTA haberin kimden çıktığını biliyor."
  },
  "c2_2sb3": {
   "title": "Köstebek",
   "choices": {},
   "b0": "Eylem gecesi. Mavi ışıklar.",
   "b1": "Şefi götürüyorlar. Bir kez dönüp bakıyor. Hiçbir şey söylemeden.",
   "b2": "Hesabınız yeniden açıldı.",
   "b3": "Okul kapısında Filiz. Onu adamın arabasında gördü."
  },
  "c2_2sb4": {
   "title": "Yalnız",
   "choices": {},
   "b0": "Kahvehanenin camı buğulu. İçeride Kabile, sırtları ona dönük.",
   "b1": "Endurocu yeni şef olmuş.",
   "b2": "Ben sana inanıyorum."
  },
  "c2_2sb5": {
   "title": "Dolap",
   "choices": {},
   "b0": "Akşam. Dolabın ekranında kırmızı bir kilit: ücretsiz saatler bitti.",
   "b1": "Çocuk babaannesinin ilacını alamadan dönüyor.",
   "b2": "Cico ücreti kendi cebinden ödüyor. Bölme açılıyor.",
   "b3": "Hocam, bunu her gün yapamazsın ki."
  },
  "c2_2sb6": {
   "title": "İtiraf",
   "choices": {},
   "b0": "Köprü altı. Kabile geri çekilmiş.",
   "b1": "Bu telefonu bana o verdi. Ben de onlardandım. Zorla.",
   "b2": "Şef telefonu alıyor. \"Otur.\"",
   "b3": "Şef telefona bakıyor. Sonra ona. Gidiyor.",
   "b4": "Seni ben seçtim. Şimdi ben bırakıyorum."
  }
 }
};
  function merge(a, b) { for (const k of Object.keys(b)) { if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) merge(a[k] = a[k] || {}, b[k]); else a[k] = b[k]; } return a; }
  if (typeof module === 'object' && module.exports) module.exports = part;
  // Diğer diller: çeviri gelene kadar Türkçe metin (yalnızca eksik anahtarlar)
  function fill(a, b) { for (const k of Object.keys(b)) { if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) fill(a[k] = a[k] || {}, b[k]); else if (!(k in a)) a[k] = b[k]; } return a; }
  if (typeof module === 'object' && module.exports) { /* node: yalnızca dışa aktar */ }
  else { const L = ((root.CICO = root.CICO || {}).locales = root.CICO.locales || {}); merge(L.tr = L.tr || {}, part); Object.keys(L).filter((c) => c !== 'tr').forEach((c) => fill(L[c], part)); }
})(typeof self !== 'undefined' ? self : this);
