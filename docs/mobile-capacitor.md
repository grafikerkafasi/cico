# CİCO — Mobil uygulama kabuğu (Capacitor)

Oyun HTML/JS olarak kalır; Capacitor onu native bir iOS/Android uygulamasının içine koyar.
Bu "web sitesini webview'de açmak" değildir: kod ve görseller paketin içindedir, internet gerekmez
(videolar hariç: onlar sunucudan akar, bağlantı yoksa sahne görselle devam eder).

## Uygulamada neler native?

| Özellik | Nerede |
| --- | --- |
| Titreşim (iOS dahil) | `@capacitor/haptics` → `src/ui/native.js` |
| Durum çubuğu gizli, tam ekran | `@capacitor/status-bar` |
| Açılış ekranı (oyun hazır olunca kapanır) | `@capacitor/splash-screen` |
| Android geri tuşu → duraklatma menüsü / çıkış | `@capacitor/app` |
| Videolar sunucudan, görseller+müzik paketin içinde | `tools/build-www.js` (`CICO_MEDIA_BASE`) |

Tarayıcıda `native.js` hiçbir şey yapmaz; aynı kod hem web'de hem uygulamada çalışır.

## Android (bu Mac'te)

Gerekenler: Node 20+ (var), Android SDK (var: `~/Library/Android/sdk`, platform 35), **Java 21**.
Kurulu Java 26 Android derleme araçları için fazla yeni; Java 21 gerekir.

```bash
# 1) Java 21 (Temurin) — hazır paket, derleme yok
brew install --cask temurin@21
#    (olmazsa: https://adoptium.net → Temurin 21 (LTS), macOS x64 .pkg)

# 2) Proje bağımlılıkları ve Android projesi (Cico klasöründe)
npm install
npx cap add android

# 3) Her terminal oturumunda (ya da ~/.bash_profile'a ekle)
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export ANDROID_HOME=~/Library/Android/sdk

# 4a) Telefon USB ile bağlı ve "USB hata ayıklama" açıksa: doğrudan telefonda çalıştır
npm run android

# 4b) Ya da kurulum dosyası üret ve telefona gönder
npm run android:apk
#    → android/app/build/outputs/apk/debug/app-debug.apk
#    (telefona AirDrop/Drive ile at; "bilinmeyen kaynaklardan yükleme"ye izin ver)
```

Kodda değişiklik yaptıktan sonra: `npm run cap:sync` (www/ yeniden kurulur ve kabuğa kopyalanır).

## iOS

Apple, mağazaya gönderilen uygulamaların güncel Xcode ile derlenmesini ister; güncel Xcode macOS 12'de çalışmaz.
Bu yüzden iOS derlemesi **bulutta** yapılır (Codemagic — hesabın var gibi görünüyor):

```bash
npx cap add ios --packagemanager SPM   # iOS projesini üretir (CocoaPods gerekmez)
```

`android/` ve `ios/` klasörleri repoya eklenir; Codemagic depodan derler ve TestFlight'a yükler.
TestFlight ve mağaza için **Apple Developer** hesabı gerekir (yıllık ücretli).

## Test listesi (teknik deneme)

- [ ] Açılış: logo, "Başla", müzik yumuşakça açılıyor
- [ ] O1–O3: sesli klipler oynuyor, döngüde müzik kesilmiyor
- [ ] Seçim anı: sinematik efekt + titreşim
- [ ] İnternet kapalıyken: görseller ve müzik çalışıyor, video yerine görsel kalıyor
- [ ] Android geri tuşu: duraklatma menüsü açılıp kapanıyor; başlıkta uygulamadan çıkıyor
- [ ] Uygulamayı arka plana al / geri dön: müzik duruyor ve devam ediyor
- [ ] Kayıt: uygulamayı kapatıp açınca ayarlar (ses, dil) korunuyor
