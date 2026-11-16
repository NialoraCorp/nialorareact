# DEPLOY — nialora.com'u Plesk (Windows/IIS) üzerinde yayına alma

Site statik bir React build'idir: sunucu tarafı kod yok, veritabanı yok. Yayına almak = `dist/` içeriğini
alan adının kök dizinine kopyalamak. Alan adı Hostinger'da, barındırma Plesk'li Windows sunucuda.

## 0. Hazırlık (yerelde)
```bash
cd nialora-app
npm run build          # → dist/  (index.html, assets/, brand/, web.config, robots.txt, sitemap.xml …)
```
Teslim için zip: `dist/` içeriği (eski `bg*.mp4|webm|gif` hariç) → `nialora-site-build.zip`.
`web.config` dist'e otomatik gelir (public/web.config): IIS için MIME türleri (webp, mp4, svg), önbellek, sıkıştırma.

## 1. Hostinger — DNS (alan adını sunucuya yönlendir)
Mevcut durum (18 Ekim 2026): kayıtlar eski Netlify yayınını gösteriyor →
`A @ 75.2.60.5` (Netlify) ve `CNAME www nialora.netlify.app`. Plesk'e geçişte bu ikisi değişecek.
1. hPanel → **Domains** → nialora.com → **DNS / Nameservers** → DNS kayıtları.
2. `A @ 75.2.60.5` kaydını **düzenle**: içerik → Plesk sunucusunun IPv4'ü. `CNAME www → nialora.netlify.app` kaydını
   **sil** ve yerine `A www → aynı IP` ekle (ya da CNAME'in hedefini `nialora.com` yap).
3. Ekle:
   | Tür | Ad | Değer | TTL |
   |---|---|---|---|
   | A | @ | `<Plesk sunucusunun IPv4 adresi>` | 3600 |
   | A | www | `<aynı IP>` | 3600 |
   (IPv6 varsa `AAAA` kayıtlarını da aynı şekilde ekle; yoksa AAAA ekleme.)
4. E-posta kullanıyorsan **MX / TXT (SPF, DKIM)** kayıtlarına dokunma.
5. Nameserver'ları değiştirme; DNS Hostinger'da kalsın (daha basit). Yayılma genelde dakikalar, en fazla 24–48 saat.
   Kontrol: `dig nialora.com +short` ya da https://dnschecker.org.

Sunucu IP'si: Plesk → **Tools & Settings → IP Addresses** (ya da alan adı eklerken "IP address" alanı).

## 2. Plesk — alan adını ekle
1. Plesk → **Websites & Domains → Add Domain** → "Blank website".
2. Domain name: `nialora.com`. "www" alt alanı otomatik gelir (gelmezse **Add Subdomain** değil, **Hosting Settings**'te "www" seçeneğini aç).
3. Hosting type: **Website hosting**. Document root: `httpdocs` (varsayılan). PHP gerekmez.
4. **Hosting Settings** (alan adı kartından):
   - **Preferred domain:** `nialora.com` (www'siz) → www otomatik 301 ile buna döner.
   - **Permanent SEO-safe 301 redirect from HTTP to HTTPS:** sertifika kurulduktan sonra aç (adım 4).
   - Web scripting: Hepsi kapalı olabilir (ASP.NET, PHP gerekmez).

## 3. Dosyaları yükle
1. Plesk → alan adı → **File Manager** → `httpdocs`.
2. `httpdocs` içindeki örnek dosyaları (index.html, img/, css/ vb.) sil.
3. **Upload** → `nialora-site-build.zip` → yüklendikten sonra dosyanın sağındaki menüden **Extract Files**.
4. Sonuç tam olarak şöyle olmalı (klasör içinde klasör olmamalı):
   ```
   httpdocs/
     index.html
     web.config
     robots.txt
     sitemap.xml
     favicon.svg
     apple-touch-icon.png
     og-image.jpg
     assets/   (index-*.js, index-*.css)
     brand/    (görseller, filmler)
   ```
   Zip'in içinden bir üst klasör çıktıysa içeriğini `httpdocs` köküne taşı.
5. FTP tercih edersen: Plesk → **FTP Access** ile kullanıcı oluştur, FileZilla ile `httpdocs`'a aynı yapıyı at.

## 4. SSL (Let's Encrypt, ücretsiz)
DNS sunucuya yönlendikten SONRA:
1. Plesk → alan adı → **SSL/TLS Certificates** → **Install** (Let's Encrypt).
2. "Secure the domain name" + **"Include the www subdomain"** işaretle, e-posta gir → Get it free.
3. Aynı sayfada **"Keep websites secured"** (otomatik yenileme) açık kalsın.
4. **Hosting Settings → "Permanent SEO-safe 301 redirect from HTTP to HTTPS"** → aç.
5. SSL/TLS Certificates sayfasında **HSTS** istersen açabilirsin (önce her şeyin https'te çalıştığından emin ol).

## 5. IIS kontrolleri (genelde hazır gelir)
- `web.config` dist ile geldi; IIS onu otomatik okur. Eğer site 500 verirse `web.config` içindeki `<rewrite>` yoktur,
  sorun MIME satırlarıdır: Plesk → alan adı → **IIS Settings → MIME types** bölümünde `.webp` zaten varsa
  `web.config`'teki `<remove>` satırları bunu çözer; yine de 500 alırsan `.webp` satırlarını `web.config`'ten sil.
- Plesk → alan adı → **IIS Settings**: Directory browsing kapalı, "Default documents" içinde `index.html` olsun.
- Sıkıştırma: `web.config` static/dynamic compression'ı açıyor; sunucuda IIS "Static Content Compression" rolü kuruluysa çalışır.
- HTTP/2: Windows Server 2016+ ve https ile otomatik.

## 6. Yayın sonrası kontrol
1. https://nialora.com ve https://www.nialora.com → ikisi de açılmalı, www olan 301 ile www'siz'e dönmeli.
2. Tarayıcı DevTools → Network: `assets/index-*.js`, `brand/tube-front.webp`, `brand/film-wide.mp4` → 200 ve doğru
   Content-Type (`image/webp`, `video/mp4`). 404 ya da `application/octet-stream` görürsen MIME ayarına bak.
3. Mobilde (gerçek telefonla) kaydırma akıcılığı ve videoların oynaması.
4. Google: https://search.google.com/search-console → alan adını **DNS TXT** ile doğrula (TXT kaydını Hostinger DNS'e ekle),
   sonra Sitemaps → `https://nialora.com/sitemap.xml` gönder. Zengin sonuç testi: https://search.google.com/test/rich-results.
5. Paylaşım önizlemesi: https://developers.facebook.com/tools/debug/ ve https://cards-dev.twitter.com/validator → og-image görünmeli.

## 7. Güncelleme yayınlamak

### 7a. Git ile (önerilen, tek komut)
Build çıktısı GitHub'daki `deploy` dalında tutulur; Plesk bu dalı `httpdocs`'a çeker.
```bash
npm run deploy      # build alır, dist/ içeriğini origin/deploy dalına yazar
```
**Bir kerelik Plesk kurulumu:** Websites & Domains → nialora.com → **Git** → Add Repository →
"Remote Git hosting like GitHub" → Repository URL `https://github.com/NialoraCorp/nialorareact.git`
(depo herkese açık, anahtar gerekmez) → **Branch: `deploy`** → Deployment path `/httpdocs` →
Deployment mode: **Automatic** (Plesk bir webhook adresi verir; GitHub'da Settings → Webhooks → Add webhook ile
bu adresi "Just the push event" olarak ekleyin) ya da Manual (Plesk'te "Pull Updates" düğmesi).
Otomatik modda her `npm run deploy` sonrası site dakikalar içinde güncellenir. Plesk ekstra dosyaları silmez;
`httpdocs` içinde eski `assets/index-*.js` birikirse zararsızdır.

### 7b. FTP ile doğrudan (Plesk Git kurmadan)
Yerel `dist/` içeriğini FTPS ile doğrudan `httpdocs`'a yazar; sunucuda hiçbir kurulum gerekmez.
```bash
cp .env.deploy.example .env.deploy   # bir kez; dosya git dışıdır
npm run deploy:ftp                   # build alır, dist/ → httpdocs (index.html en son yüklenir)
```
`.env.deploy` içine Plesk FTP hesabını **kendiniz** yazın (sohbete/commit'e asla girmez): Websites & Domains →
nialora.com → **FTP Access** (veya Hosting Settings → "System user") → kullanıcı adı ve şifre. `FTP_HOST`
sunucu IP'si (178.210.168.80), `FTP_DIR=/httpdocs`. `FTP_TLS=1` açık FTPS kullanır; sunucu TLS kabul etmezse
`FTP_TLS=0` yapın (düz FTP, şifre açık gider; mümkünse Plesk'te FTPS'i açın). Betik eski `bg*.mp4` dosyalarını
yüklemez ve var olan fazla dosyaları silmez.

### 7c. Elle (yedek yol)
```bash
npm run build
```
`dist/` içeriğini yeniden yükle (üzerine yaz). `assets/` dosya adları hash'li olduğu için eski JS/CSS önbellekten gelmez;
`index.html` için `web.config` önbelleği kapalı tutar. Eski `assets/index-*.js` dosyalarını silmek temizlik içindir, zorunlu değil.

## Tek dosya seçeneği
`npm run build:single` → `nialora.html` (her şey gömülü, ~6 MB). Birine "aç bak" diye göndermek için; yayın için
klasörlü build tercih edilir (önbellek, SEO dosyaları, daha kaliteli videolar).

## Sık sorunlar
| Belirti | Neden | Çözüm |
|---|---|---|
| Sayfa beyaz, konsolda 404 `/assets/…` | Dosyalar `httpdocs` köküne değil alt klasöre çıkarıldı | İçeriği köke taşı |
| Görseller/videolar yok, 404 | `brand/` klasörü yüklenmemiş | Zip'i yeniden çıkar |
| Videolar indiriliyor ama oynamıyor | MIME `video/mp4` yok | `web.config` MIME satırları / IIS MIME types |
| 500 Internal Server Error | `web.config` ile IIS'te çakışan MIME tanımı | `<remove>` satırları var; yine de olursa ilgili satırı sil |
| Let's Encrypt hatası | DNS henüz sunucuyu göstermiyor | `dig nialora.com` IP'yi gösterene kadar bekle |
| www açılmıyor | DNS'te `www` A kaydı yok ya da sertifika www'yi kapsamıyor | A kaydı ekle, sertifikayı www dahil yeniden al |
