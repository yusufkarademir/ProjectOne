# 🤖 Yapay Zeka (AI) Özellikleri Kullanım Kılavuzu

EtkinlikQR, misafir deneyimini artırmak ve güvenliği sağlamak için gelişmiş Yapay Zeka teknolojileri kullanır. Bu özellikler tamamen **tarayıcı tabanlıdır**, yani veriler sunucuya gönderilmeden kullanıcının cihazında işlenir. Bu sayede hem **maksimum gizlilik** sağlanır hem de **hız** artar.

---

## 1. Yüz Tanıma ile "Beni Bul" (Face Finder)

Misafirlerinizin yüzlerce fotoğraf arasından kendilerini tek tek aramasına gerek yok! "Beni Bul" özelliği ile saniyeler içinde kendi fotoğraflarına ulaşabilirler.

### 📸 Nasıl Çalışır?
1.  **Etkinlik Sayfasına Girin:** Misafirler QR kodu okutarak veya linke tıklayarak etkinliğe katılır.
2.  **"Beni Bul" Butonu:** Sağ alt köşedeki (veya menüdeki) **"Beni Bul"** butonuna tıklarlar.
3.  **Selfie Yükleme:** Sistem, referans olması için bir selfie yüklemelerini ister.
4.  **Tarama:** Yapay zeka, yüklenen selfie'yi galerideki tüm fotoğraflarla karşılaştırır.
5.  **Sonuçlar:** Sadece misafirin bulunduğu fotoğraflar listelenir.

### 🔒 Gizlilik Notları
*   **Biyometrik Veri Kaydedilmez:** Yüz analizi tamamen misafirin telefonunda/bilgisayarında yapılır. Yüz verileri sunucularımıza **asla gönderilmez ve kaydedilmez.**
*   **Geçici İşlem:** Sayfa yenilendiğinde veya kapatıldığında tüm analiz verileri silinir.

---

## 2. Akıllı İçerik Moderasyonu (AI Guard)

Etkinliğinizin kalitesini korumak ve istenmeyen görüntüleri engellemek için yükleme aşamasında yapay zeka devreye girer.

### 🛡️ Nasıl Çalışır?
1.  **Yükleme Ekranı:** Misafir fotoğraf yükleme ekranına gelir.
2.  **Otomatik Analiz:** Fotoğraf seçildiği anda, daha sunucuya yüklenmeden tarayıcıda analiz edilir.
3.  **Filtreleme:** Sistem şu içerikleri tespit ederse yüklemeyi **anında engeller**:
    *   🔞 **Pornografi:** Çıplaklık ve cinsel içerik.
    *   👙 **Aşırı Açık:** Bikini, iç çamaşırı vb. (Etkinlik türüne göre hassasiyet ayarlanabilir).
    *   🩸 **Şiddet/Kan:** (Geliştirilme aşamasında).
4.  **Uyarı:** Kullanıcıya "Uygunsuz içerik tespit edildi" uyarısı verilir.

### ⚙️ Ayarlar (Organizatörler İçin)
Bu özelliği **Yönetim Paneli > Güvenlik & Gizlilik** menüsünden açıp kapatabilirsiniz.
*   **Açık (Önerilen):** Tüm yüklemeler AI kontrolünden geçer.
*   **Kapalı:** Kontrol yapılmaz, her şey yüklenir (Manuel moderasyon açıksa onaya düşer).

---

## ❓ Sıkça Sorulan Sorular (SSS)

**S: Bu özellikler ücretli mi?**
C: Hayır, sisteminize dahildir ve ekstra bir API maliyeti yoktur.

**S: "Beni Bul" özelliği videolarda çalışır mı?**
C: Şu an için sadece fotoğraflarda çalışmaktadır.

**S: Yüklediğim selfie başkaları tarafından görülebilir mi?**
C: Hayır, yüklediğiniz selfie sadece o anki tarama işlemi için tarayıcınızın hafızasında tutulur ve işlem bitince silinir. Kimse göremez.

**S: AI bazen yanılıyor mu?**
C: Teknoloji çok gelişmiş olsa da %100 hatasız değildir.
*   **Yüz Tanıma:** Işık, açı veya aksesuarlar (gözlük, şapka) performansı etkileyebilir.
*   **Moderasyon:** Nadiren de olsa zararsız bir fotoğrafı (örn. ten rengi çok yoğunsa) engelleyebilir. Bu durumda organizatörle iletişime geçebilirsiniz.

---

## 🛠️ Sorun Giderme

*   **"AI Modeli Yükleniyor..." yazısında kalıyor:** İnternet bağlantınızı kontrol edin veya sayfayı yenileyin.
*   **"Eşleşen fotoğraf bulunamadı":** Daha net ve iyi ışık alan bir selfie yüklemeyi deneyin. Ayrıca galeride fotoğrafınızın olduğundan emin olun (henüz onaylanmamış olabilir).
*   **Yükleme butonu çalışmıyor:** AI kontrolü bitene kadar buton pasif kalır, lütfen birkaç saniye bekleyin.
