'use client';

import Link from 'next/link';
import { 
  Shield, 
  Monitor, 
  Tv, 
  Projector, 
  Settings, 
  Play, 
  Check, 
  X, 
  ChevronRight, 
  Home, 
  Info,
  Theater,
  Camera,
  Smartphone,
  Eye,
  ImageIcon,
  Zap,
  Music
} from 'lucide-react';

export default function ModeratorGuidePage() {
  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard" className="hover:text-blue-600 flex items-center gap-1">
          <Home size={16} />
          <span>Dashboard</span>
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">Moderatör Rehberi</span>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Shield size={32} />
          </div>
          Moderatör Kullanım Rehberi
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl">
          Etkinliklerinizi yönetirken kullanacağınız araçları, canlı yayın ekranlarını ve moderasyon özelliklerini buradan öğrenebilirsiniz.
        </p>
      </div>

      <div className="grid gap-12">
        
        {/* BÖLÜM 1: ETKİNLİK KARTI */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">1</div>
            <h2 className="text-2xl font-bold text-gray-900">Etkinlik Kartı ve Canlı Ekranlar</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed">
                Dashboard üzerindeki her etkinlik kartı, o etkinliği yönetmeniz için gerekli tüm araçları içerir. Özellikle <strong>Canlı Yayın Ekranları</strong> bölümü, etkinliğiniz sırasında büyük ekrana yansıtacağınız sayfaları barındırır.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-purple-50 text-purple-700 rounded-lg shrink-0 mt-1">
                    <Monitor size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Slayt (Slide)</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Yüklenen fotoğrafların kayan bir şerit halinde gösterildiği ana ekrandır. Genellikle etkinlik alanındaki ana dev ekrana bu sayfa yansıtılır.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-pink-50 text-pink-700 rounded-lg shrink-0 mt-1">
                    <Tv size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Sosyal Duvar (Social Wall)</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Fotoğrafların ve mesajların bir arada, daha dinamik bir ızgara yapısında gösterildiği alternatif ekrandır.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-gray-100 text-gray-700 rounded-lg shrink-0 mt-1">
                    <Projector size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Yansıtma Modu (Projector Mode)</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Slayt veya Sosyal Duvar butonlarının yanındaki küçük projeksiyon ikonuna tıkladığınızda açılır. Bu mod, <strong>yönetim araçlarını ve butonları gizler</strong>, sadece içeriği gösterir. İzleyicilere yansıtmak için idealdir.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Görsel Temsil - CSS ile Etkinlik Kartı Parçası */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                Örnek Görünüm
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 max-w-sm mx-auto mt-4">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Play size={12} className="text-purple-500" />
                    Canlı Yayın Ekranları
                </div>
                <div className="space-y-2">
                    {/* Slide */}
                    <div className="grid grid-cols-[1fr_auto] gap-1">
                        <div className="flex items-center justify-center gap-2 bg-purple-50 text-purple-700 py-2 rounded-lg text-xs font-medium border border-purple-100 cursor-default">
                            <Monitor size={14} />
                            <span>Slayt</span>
                        </div>
                        <div className="flex items-center justify-center px-3 bg-purple-100 text-purple-800 rounded-lg border border-purple-200 cursor-default relative group">
                            <Projector size={14} />
                            {/* Tooltip Simulation */}
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              Yansıtma Modu
                            </div>
                        </div>
                    </div>

                    {/* Social Wall */}
                    <div className="grid grid-cols-[1fr_auto] gap-1">
                        <div className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors border bg-pink-50 text-pink-700 border-pink-100 cursor-default">
                            <Tv size={14} />
                            <span>Sosyal Duvar</span>
                        </div>
                        <div className="flex items-center justify-center px-3 rounded-lg transition-colors border bg-pink-100 text-pink-800 border-pink-200 cursor-default">
                            <Projector size={14} />
                        </div>
                    </div>
                </div>
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">
                Etkinlik kartınızda bu alanı kullanarak ilgili ekranları açabilirsiniz.
              </p>
            </div>
          </div>
        </section>

        {/* BÖLÜM 2: SOSYAL DUVAR & MODERASYON AKIŞI */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">2</div>
            <h2 className="text-2xl font-bold text-gray-900">Sosyal Duvar ve Moderasyon Akışı</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            
            {/* Sol Taraf: Açıklamalar */}
            <div className="space-y-8">
              
              {/* Adım 1: Katılımcı */}
              <div>
                <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-3">
                  <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded">ADIM 1</span>
                  Katılımcı Deneyimi
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                  <div className="flex gap-3">
                    <div className="mt-1 bg-white p-1.5 rounded shadow-sm text-gray-600">
                      <Smartphone size={16} />
                    </div>
                    <div>
                      <strong className="text-gray-900 text-sm block">QR Kod Okutma</strong>
                      <p className="text-xs text-gray-500">
                        Misafirleriniz, etkinlik alanındaki ekranlarda veya masa kartlarında bulunan QR kodu telefonlarıyla okuturlar.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-1 bg-white p-1.5 rounded shadow-sm text-gray-600">
                      <Camera size={16} />
                    </div>
                    <div>
                      <strong className="text-gray-900 text-sm block">Fotoğraf ve Mesaj Paylaşımı</strong>
                      <p className="text-xs text-gray-500">
                        Misafirleriniz fotoğraf yükleyebilir, bu fotoğraflara <strong>emoji</strong> ekleyebilir ve <strong>yorum/mesaj</strong> yazabilirler.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-1 bg-white p-1.5 rounded shadow-sm text-gray-600">
                      <Smartphone size={16} />
                    </div>
                    <div>
                      <strong className="text-gray-900 text-sm block">Sosyal Etkileşim</strong>
                      <p className="text-xs text-gray-500">
                        Sadece fotoğraf değil, diğer misafirlerin paylaşımlarını da kendi ekranlarında görüp etkileşime girebilirler. Tam bir sosyal ağ deneyimi yaşarlar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adım 2: Moderatör */}
              <div>
                <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-3">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">ADIM 2</span>
                  Moderatör Onayı (Mavi Kalkan)
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Eğer <strong>"Moderasyon Modu"</strong> açıksa, yüklenen fotoğraflar doğrudan ekrana yansımaz. Sizin onayınıza düşer.
                </p>
                
                <div className="space-y-3">
                    <div className="flex gap-3 items-start p-3 rounded-lg bg-blue-50 border border-blue-100">
                        <Shield className="text-blue-600 shrink-0 mt-0.5" size={18} />
                        <div>
                            <strong className="text-blue-900 text-sm block">Nasıl Yönetilir?</strong>
                            <p className="text-xs text-blue-800 mt-1">
                                Canlı yayın ekranının (Slayt veya Sosyal Duvar) sağ alt köşesindeki <strong>Mavi Kalkan</strong> ikonuna tıklayın. Açılan menüde "Onay Bekleyenler" listesini göreceksiniz.
                            </p>
                        </div>
                    </div>

                    <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm text-gray-700">
                            <Check size={16} className="text-green-600" />
                            <span><strong>Onayla:</strong> Fotoğraf anında dev ekranda yayınlanır.</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-700">
                            <X size={16} className="text-red-600" />
                            <span><strong>Reddet:</strong> Fotoğraf silinir ve asla yayınlanmaz.</span>
                        </li>
                    </ul>
                </div>
              </div>

            </div>

            {/* Sağ Taraf: Görsel Simülasyon */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 relative min-h-[450px] flex flex-col justify-between overflow-hidden">
               {/* Background Pattern */}
               <div className="absolute inset-0 opacity-20 flex flex-wrap content-start p-2 gap-2 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-32 h-40 bg-gray-700 rounded-lg"></div>
                  ))}
               </div>

               {/* Simulation Label */}
               <div className="absolute top-4 left-4 z-10">
                    <span className="bg-black/50 text-white text-[10px] px-2 py-1 rounded border border-white/10 backdrop-blur-md">
                        Canlı Yayın Ekranı Simülasyonu
                    </span>
               </div>

               {/* The Blue Shield Interaction */}
               <div className="relative z-10 mt-auto ml-auto">
                 {/* Menu Panel */}
                 <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-72 mb-3 origin-bottom-right">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2 flex items-center justify-between">
                        <span>Moderatör Paneli</span>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] text-gray-500 uppercase">Canlı</span>
                        </div>
                    </h3>
                    
                    {/* Toggle */}
                    <div className="flex items-center justify-between px-2 py-2 bg-gray-50 rounded-lg mb-3">
                        <span className="text-xs font-bold text-gray-700">Moderasyon Modu</span>
                        <div className="w-8 h-4 rounded-full p-0.5 bg-blue-600">
                            <div className="w-3 h-3 bg-white rounded-full shadow-sm translate-x-4" />
                        </div>
                    </div>

                    {/* Pending Photos Queue Simulation */}
                    <div className="flex-1 flex flex-col">
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                            <ImageIcon size={10} />
                            Onay Bekleyenler (1)
                        </h4>
                        
                        {/* Sample Pending Item */}
                        <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 flex gap-3 items-center mb-2">
                            <div className="w-10 h-10 bg-gray-200 rounded-md shrink-0 overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                    <Camera size={12} className="text-white" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate">Misafir Kullanıcı</p>
                                <p className="text-[10px] text-gray-500 truncate">Harika bir gece! 🥳</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                           <button className="flex-1 bg-white border border-red-200 text-red-600 text-xs font-bold py-1.5 rounded hover:bg-red-50 flex items-center justify-center gap-1">
                                <X size={12} /> Reddet
                           </button>
                           <button className="flex-1 bg-green-600 text-white text-xs font-bold py-1.5 rounded hover:bg-green-700 flex items-center justify-center gap-1 shadow-sm">
                                <Check size={12} /> Onayla
                           </button>
                        </div>
                    </div>
                 </div>

                 {/* Trigger Button */}
                 <div className="flex justify-end">
                    <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg border-2 border-white/20 hover:bg-blue-700 transition-colors">
                        <Shield size={24} />
                    </button>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* BÖLÜM 3: SAHNE YÖNETİMİ */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">3</div>
            <h2 className="text-2xl font-bold text-gray-900">Sahne Yönetimi ve Müzik</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed">
                Etkinliğin atmosferini sadece fotoğraflarla değil, müzik ve özel efektlerle de yönetebilirsiniz. <strong>Mavi Kalkan</strong> menüsündeki "Sahne Modu" sekmesinden bu özelliklere erişebilirsiniz.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-green-50 text-green-700 rounded-lg shrink-0 mt-1">
                    <Music size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Spotify Entegrasyonu</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Kendi Spotify çalma listelerinizi bağlayın. Şarkı adı ve sanatçı bilgisi, fotoğrafların altında şık bir şekilde görünür.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg shrink-0 mt-1">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Hype Modu</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Özel anlarda (pasta kesimi, giriş dansı vb.) enerjiyi yükseltmek için kullanın. Geri sayım başlatır ve ekranda konfetiler patlatır.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Görsel Temsil - Sahne Modu */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 relative min-h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                
                <div className="relative z-10 text-center w-full max-w-xs">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 mb-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                                <Music size={20} />
                            </div>
                            <div className="text-left flex-1 min-w-0">
                                <div className="h-2 bg-white/50 rounded w-3/4 mb-1.5"></div>
                                <div className="h-1.5 bg-white/30 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full w-2/3 bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                    
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-full text-white text-xs font-bold shadow-lg shadow-indigo-500/30">
                        <Zap size={14} /> Hype Modu Aktif!
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* BÖLÜM 4: CANLI BAĞLANTI */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-lg">4</div>
            <h2 className="text-2xl font-bold text-gray-900">Canlı Bağlantı (Jitsi)</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed">
                Etkinliğe gelemeyen misafirlerinizi dev ekrana taşıyın. Jitsi altyapısı ile güvenli ve yüksek kaliteli görüntülü görüşme yapabilirsiniz.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-rose-50 text-rose-700 rounded-lg shrink-0 mt-1">
                    <Monitor size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Nasıl Çalışır?</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Mavi Kalkan menüsünden "Canlı Bağlantı"yı açın. Size özel oluşturulan linki uzaktaki misafirinize gönderin.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-blue-50 text-blue-700 rounded-lg shrink-0 mt-1">
                    <Eye size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Gizlilik ve Kontrol</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Bağlantı isteği geldiğinde ekranda bildirim görürsünüz. Siz onaylamadan kimse ekrana yansımaz.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Görsel Temsil - Canlı Bağlantı */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 relative min-h-[300px] flex items-center justify-center overflow-hidden">
                <div className="grid grid-cols-2 gap-2 w-full max-w-sm opacity-80">
                    <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden border border-gray-700">
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-2xl">👤</div>
                        <div className="absolute bottom-2 left-2 text-[10px] text-white bg-black/50 px-1.5 py-0.5 rounded">Misafir 1</div>
                    </div>
                    <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden border border-gray-700">
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-2xl">👩</div>
                        <div className="absolute bottom-2 left-2 text-[10px] text-white bg-black/50 px-1.5 py-0.5 rounded">Misafir 2</div>
                    </div>
                </div>
                
                <div className="absolute bottom-6 flex gap-2">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg">
                        <X size={14} />
                    </div>
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white shadow-lg">
                        <Monitor size={14} />
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* BÖLÜM 5: İPUÇLARI */}
        <section className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Info size={24} className="text-blue-200" />
                Profesyonel İpuçları
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <h3 className="font-bold text-lg mb-2 text-blue-100">Çift Ekran Kullanımı</h3>
                    <p className="text-sm text-blue-50 leading-relaxed">
                        Bilgisayarınızda "Genişlet" (Extend) modunu kullanın. Bir ekranda yönetim panelini (Mavi Kalkanlı) açık tutun, diğer ekrana (projeksiyon) "Yansıtma Modu"nu sürükleyin.
                    </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <h3 className="font-bold text-lg mb-2 text-blue-100">QR Kod Testi</h3>
                    <p className="text-sm text-blue-50 leading-relaxed">
                        Etkinlik başlamadan önce "Misafir Önizleme" bölümünden QR kodu kendiniz taratıp fotoğraf yükleme akışını mutlaka test edin.
                    </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <h3 className="font-bold text-lg mb-2 text-blue-100">Acil Durum</h3>
                    <p className="text-sm text-blue-50 leading-relaxed">
                        İstenmeyen bir içerik yayınlanırsa, Mavi Kalkan menüsünden veya Galeri panelinden anında silip yayından kaldırabilirsiniz.
                    </p>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
}
