# Proje Durumu ve İlerleme Raporu

## 📅 Son Güncelleme: 26 Kasım 2024

Bu dosya, **EtkinlikQR** projesinin mevcut durumunu, tamamlanan özellikleri ve gelecek planlarını takip etmek için oluşturulmuştur.

## ✅ Tamamlanan Özellikler

### 1. Dashboard ve Arayüz
- [x] **Modern Dashboard Tasarımı:**
    - **Sidebar:** Kullanıcı profili, son etkinlikler listesi ve modern tasarım.
    - **EventCard:** Kapak görseli, durum rozeti, hızlı aksiyon butonları (Sayfa, Galeri, Live) ve "Yönet" butonu.
    - **Şablonlar:** Görsel ağırlıklı, detaylı ve etkileşimli şablon seçim ekranı.
- [x] **Etkinlik Kartı Özellikleri:**
    - QR Kod önizleme ve indirme.
    - Hızlı aksiyon butonları (Sayfa, Galeri, Düzenle, Kopyala, Sil).
    - Silme işlemi için onay modalı.
- [x] **Breadcrumb Navigasyonu:** Dashboard, Galeri ve Upload sayfalarında kullanıcı dostu gezinti.
- [x] **Toast Bildirim Sistemi:** Tüm işlemler (başarılı/hatalı) için `react-hot-toast` entegrasyonu.

### 2. Galeri Yönetimi (Organizer & Guest)
- [x] **Görünüm Modları:** Grid (Izgara) ve Liste görünümü seçenekleri.
- [x] **Toplu İşlemler:**
    - Çoklu fotoğraf seçimi.
    - Toplu indirme (ZIP olarak).
    - Toplu silme (Sadece Organizer için).
- [x] **Medya Desteği:** Hem fotoğraf hem de video görüntüleme desteği.
- [x] **Lightbox:** Gelişmiş medya görüntüleyici (önceki/sonraki, indir, paylaş).
- [x] **Yetki Kontrolü:** Misafirler için silme butonunun gizlenmesi.

### 3. Yükleme (Upload) Sistemi
- [x] **Gelişmiş Upload Formu:**
    - Sürükle-bırak desteği.
    - Çoklu dosya seçimi (Maksimum 10 dosya).
    - Dosya tipi (Resim/Video) ve boyut validasyonu.
- [x] **Video Desteği:** `next.config.ts` ayarlarıyla 100MB'a kadar video yükleme desteği.
- [x] **Kullanıcı Geri Bildirimi:** Yükleme durumu ve sonuçları için detaylı toast bildirimleri.
- [x] **Cloudflare R2 Entegrasyonu:** Güvenli ve hızlı medya depolama.

### 4. Altyapı ve Backend
- [x] **Server Actions:** Güvenli veri işlemleri (deleteEvent, duplicateEvent, uploadPhotos).
- [x] **Veritabanı:** Prisma şeması güncellemeleri (Video tipi desteği, UploadConfig).
### 5. Etkinlik Yönetimi ve Özelleştirme (YENİ)
- [x] **Gelişmiş Yönetim Paneli:** Sekmeli yapı ile tüm ayarların tek yerden yönetimi.
- [x] **Detaylı Etkinlik Bilgileri:**
    - Başlangıç/Bitiş tarihleri.
    - Konum bilgisi.
    - Karşılama metni ve açıklama.
- [x] **Etkinlik Programı (Schedule):** Saat, başlık ve açıklama içeren akış planlayıcı.
- [x] **Duyuru Sistemi:** Misafirlere özel duyurular ekleme.
- [x] **Gelişmiş Şablon Sistemi (YENİ):**
    - **Modern (Varsayılan):** Glassmorphism etkili, sade ve şık tasarım.
    - **Düğün (Wedding):** Serif fontlar, altın detaylar ve zarif animasyonlar.
    - **Kurumsal (Corporate):** Profesyonel ızgara düzeni, timeline görünümü.
    - **Parti (Party):** Neon renkler, konfeti animasyonları ve hareketli arka planlar.
- [x] **Canlı Vitrin (Live Wall):**
    - Etkinlik mekanında yansıtmak için otomatik akan slayt gösterisi.
    - Anlık fotoğraf güncelleme ve "YENİ" etiketi.
    - QR kod entegrasyonu ile hızlı yükleme.
- [x] **Kapak Görseli:** Etkinlikler için özel kapak görseli yükleme ve gösterme.
- [x] **QR Kod Özelleştirme:** Renk ve margin ayarları, anlık önizleme ve indirme.
- [x] **Markalı Çerçeveler (Branded Frames):**
    - 10 farklı çerçeve seçeneği (Polaroid, Cinema, Gold, Neon vb.).
    - Canlı Vitrin (Live Wall) ve Galeri entegrasyonu.
    - Orijinal fotoğrafı koruyarak görsel katman olarak uygulama.

### 6. Güvenlik ve Gizlilik (YENİ)
- [x] **Gizlilik Ayarları:**
    - Misafir galerisi erişimini açma/kapama.
    - İndirme iznini yönetme.
    - Sağ tık koruması (İndirme kapalıysa).
    - **Filigran (Watermark) Koruması:** Fotoğrafların üzerine etkinlik adını silik şekilde yazar ve ekran görüntüsü almayı zorlaştırır.
- [x] **Moderasyon Sistemi:**
    - "Moderasyon Modu" ile yüklenen fotoğrafları onaya düşürme.
    - Dashboard'da "Onay Bekleyenler" paneli.
    - Otomatik yenileme (Auto-refresh) ile anlık moderasyon.
    - Toplu onaylama ve reddetme.

### 7. Yükleme Sistemi İyileştirmeleri (YENİ)
- [x] **Sıralı Yükleme (Sequential Upload):** Büyük dosyaların ve çoklu yüklemelerin sunucuyu yormaması için teker teker yükleme.
- [x] **Yüksek Limit:** 500MB'a kadar video yükleme desteği.
- [x] **İlerleme Takibi:** Canlı yükleme durumu ve detaylı hata raporlama.

### 8. Fotoğraf Avı (Gamification) (YENİ)
- [x] **Görev Sistemi:** Organizatörler için özel fotoğraf görevleri oluşturma (örn: "Gelinle Selfie").
- [x] **Oyun Arayüzü:** Misafirler için ilerleme çubuğu ve konfeti animasyonlu oyun deneyimi.
- [x] **Entegrasyon:** Tüm temalara (Modern, Düğün, Kurumsal, Parti) "Fotoğraf Avı" butonu eklendi.
- [x] **Veri Takibi:** Misafir ilerlemesi cihaz bazlı (localStorage) takip ediliyor.
- [x] **Yönetim:** Etkinlik panelinden özelliği açıp kapatma ve görev yönetimi.

### 9. Dinamik Canlı Akış (Netflix-Style) (YENİ)
- [x] **Kayan Şeritler:** Fotoğraflar 3 satır halinde sürekli akan bir şerit (Marquee) olarak gösteriliyor.
- [x] **Spotlight Modu:** Yeni fotoğraf yüklendiğinde akış duraksamadan, yeni fotoğraf ekranın ortasında büyükçe beliriyor (Fragman modu).
- [x] **Performans:** `react-fast-marquee` ile akıcı animasyonlar.

### 10. Yapay Zeka (AI) Entegrasyonu (YENİ)
- [x] **Yüz Tanıma (Client-Side):** `face-api.js` ile misafirlerin selfie çekerek kendi fotoğraflarını bulması. Sunucu maliyeti yok, gizlilik odaklı.
- [x] **İçerik Moderasyonu:** `nsfwjs` ile tarayıcı tabanlı +18 içerik kontrolü. Uygunsuz içerikler sunucuya yüklenmeden engellenir.
- [x] **Proxy Sistemi:** CORS sorunlarını aşmak için güvenli görsel proxy altyapısı.

## 🚧 Devam Eden / İyileştirilmesi Gerekenler
- [ ] **Mobil Uyumluluk Testleri:** Farklı cihazlarda detaylı testler.
- [ ] **Performans:** Büyük galerilerde sayfalama (pagination) veya sonsuz kaydırma (infinite scroll).

## 📝 Yapılacaklar (Roadmap)

### Kısa Vadeli
- [x] **QR Kod Özelleştirme:** Tamamlandı.
- [x] **Etkinlik Temaları:** Tamamlandı.
- [ ] **Şifreli Galeri:** İsteğe bağlı şifre korumalı etkinlikler.
- [ ] **Şifreli Galeri:** İsteğe bağlı şifre korumalı etkinlikler.

### Uzun Vadeli
- [ ] **Analitik:** Görüntülenme ve indirme istatistikleri.
- [ ] **Sosyal Medya Entegrasyonu:** Doğrudan Instagram/Facebook paylaşımı.
- [ ] **AI Özellikleri:** Yüz tanıma ile fotoğraf filtreleme (Opsiyonel).

## 🐛 Bilinen Hatalar (Çözüldü)
- [x] *Upload "Unexpected end of form" hatası:* Form `encType="multipart/form-data"` eklenerek ve server action iyileştirilerek çözüldü.
- [x] *Galeri Silme Butonu:* Organizer görünümünde eksik olan silme butonu eklendi.
- [x] *Karışık Medya Yükleme:* Fotoğraf ve video karışık yüklendiğinde oluşan sorunlar giderildi.
- [x] *Prisma Senkronizasyonu:* Veritabanı şeması güncellendi ve istemci yeniden oluşturuldu.
- [x] *Dashboard Crash:* User tablosunda olmayan 'name' alanı sorgudan çıkarılarak hata giderildi.
