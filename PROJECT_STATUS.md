# Proje Durumu: Etkinlik QR & Sosyal Duvar (v1.3.0)

## 📅 Son Güncelleme: 01 Aralık 2025

## 🚀 Genel Bakış
Proje, etkinlikler için QR tabanlı fotoğraf paylaşımı, canlı sosyal duvar, moderasyon ve **gelişmiş sahne yönetimi** özelliklerini içeren kapsamlı bir platform haline gelmiştir. Tüm temel özellikler tamamlanmış, test edilmiş ve kullanıma hazırdır.

## ✅ Tamamlanan Özellikler

### 1. Temel Etkinlik Yönetimi
- Etkinlik oluşturma, düzenleme, silme
- QR kod oluşturma ve özelleştirme (QR Studio)
- Masa kartı tasarımı ve PDF çıktısı
- **Kullanıcı Rehberi (v1.3.0):** Yeni kullanıcılar için adım adım interaktif tur.
- **Akıllı İpuçları (v1.3.0):** Özelliklerin yanında açıklayıcı bilgi kutucukları.

### 2. Misafir Deneyimi
- QR ile hızlı erişim (Uygulama gerektirmez)
- Fotoğraf ve video yükleme
- Galeri görüntüleme ve indirme
- Beğeni ve yorum yapma

### 3. Sosyal Duvar (Live)
- **Netflix Tarzı Vitrin:** `/live` rotasında akan fotoğraf slayt gösterisi.
- **Gelişmiş Görünüm:** Yatay ve dikey fotoğraflar için optimize edilmiş, boşluksuz ve kesilmesiz akıllı yerleşim.
- **Canlı Etkileşim:** Anlık gelen yorumlar ve beğeniler.
- **Animasyonlar:** Yeni içerik geldiğinde dinamik geçişler.
- **Yansıtma Modu (v1.3.0):** `?mode=projector` ile moderatör paneli gizlenmiş temiz ekran.

### 4. Sahne Modu (v1.3.0)
- **Lounge Modu:** Şık bekleme ekranı (Logo, Saat, Mesaj).
- **Hype Modu:** Enerji yükseltici geri sayım ve hareketli arka plan.
- **Sinema Modu:** YouTube video ve oynatma listesi desteği.
- **Merkezi Kontrol:** Tüm ekranları tek bir panelden yönetme.

### 5. Güvenlik ve Moderasyon
- **Küfür Filtresi:** Yorumlarda otomatik yıldızlama (***).
- **Manuel Onay Modu:** Yorumlar ve fotoğraflar moderatör onayına düşer.
- **Canlı Moderasyon Paneli:** `/social-live` ekranında sağ altta gizli panel.
- **Panic Button:** Acil durumlarda yayını durdurma.
- **Veri Sıfırlama:** Test verilerini tek tıkla temizleme.
- **Fotoğraf Önizleme:** Onay bekleyen fotoğraflar için "Hover Zoom" özelliği.

## 🛠️ Teknik Altyapı
- **Framework:** Next.js 15 (App Router)
- **Veritabanı:** PostgreSQL + Prisma ORM
- **Depolama:** Cloudflare R2
- **UI:** Tailwind CSS + Framer Motion
- **Real-time:** Polling (5sn aralıklarla)

## 🔜 Gelecek Planları (Roadmap)
- [ ] **WebSocket:** Polling yerine gerçek zamanlı soket bağlantısı.
- [ ] **AI Moderasyon:** Fotoğrafların otomatik analizi (NSFW tespiti).
- [ ] **Çoklu Dil:** İngilizce/Almanca desteği.
- [ ] **Tema Marketi:** Farklı etkinlik temaları.

## 📝 Notlar
- Proje şu an **Production Ready** (Canlıya Hazır) durumdadır.
- `.env` dosyasındaki `DATABASE_URL` ve `R2_` ayarlarının doğruluğundan emin olun.
