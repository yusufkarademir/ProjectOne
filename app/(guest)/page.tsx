'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Camera, 
  QrCode, 
  Share2, 
  ShieldCheck, 
  Zap, 
  Music, 
  Play,
  ArrowRight,
  Check,
  Monitor
} from 'lucide-react';


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-indigo-200 shadow-lg">
              QR
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">EtkinlikQR</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden md:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Giriş Yap
            </Link>
            <Link 
              href="/register" 
              className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Ücretsiz Dene
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Yeni: Spotify Entegrasyonu Yayında 🎵
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 mb-6 leading-[1.1]">
                Etkinliklerinizi <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Unutulmaz Kılın
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-500 mb-10 leading-relaxed max-w-lg">
                Misafirleriniz fotoğrafçınız olsun. Uygulama indirmeden, sadece QR kodu okutarak anıları toplayın ve dev ekranda canlı yayınlayın.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/register" 
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Hemen Başlayın <ArrowRight size={20} />
                </Link>
                <Link 
                  href="/login" 
                  className="bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <Play size={20} className="text-indigo-600" />
                  Demoyu İncele
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                  ))}
                </div>
                <p>1000+ Etkinlikte Kullanıldı</p>
              </div>
            </motion.div>
            
            <div className="order-1 lg:order-2">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Monitor size={28} />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Canlı Sosyal Duvar</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Etkinlik alanındaki ekranları interaktif bir şölene dönüştürün. Misafirlerinizin çektiği fotoğraflar saniyeler içinde dev ekranda aksın.
              </p>
              <ul className="space-y-4">
                {[
                  'Netflix tarzı akıcı slayt gösterisi',
                  'Yatay ve dikey fotoğraflar için akıllı yerleşim',
                  'Anlık beğeni ve yorum etkileşimi',
                  'Moderatör onayı ile güvenli yayın'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Stage Mode & Spotify */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Music size={28} />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Sahne Modu & Müzik</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Sadece fotoğraf değil, atmosferi de yönetin. Spotify listenizi bağlayın, geri sayım başlatın veya özel videolarınızı oynatın.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-4 text-indigo-600">
                    <Zap size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Hype Modu</h4>
                  <p className="text-sm text-gray-500">Enerjiyi yükselten geri sayım ve animasyonlar.</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-4 text-green-600">
                    <Music size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Spotify</h4>
                  <p className="text-sm text-gray-500">Kendi çalma listelerinizi doğrudan ekrandan yönetin.</p>
                </div>
              </div>
            </div>

            <div className="relative">
               {/* Abstract CSS Composition for Stage Mode */}
               <div className="relative bg-slate-900 rounded-3xl p-8 shadow-2xl overflow-hidden aspect-square flex flex-col justify-between">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black"></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
                  
                  {/* Mockup Content */}
                  <div className="relative z-10 text-center mt-10">
                    <h3 className="text-4xl font-black text-white mb-2 tracking-tight">GALA GECESİ</h3>
                    <p className="text-indigo-300 tracking-[0.3em] text-sm">HOŞ GELDİNİZ</p>
                  </div>

                  <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 border border-white/10">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
                        <Music size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-bold truncate">Top Hits Turkey</p>
                        <p className="text-white/60 text-xs truncate">Spotify • Şimdi Çalıyor</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"><Play size={14} fill="currentColor" /></div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
            <div className="bg-indigo-900 rounded-[3rem] p-12 md:p-24 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-30"></div>
                
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Hazır mısınız?</h2>
                    <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Etkinliğinizi bir üst seviyeye taşıyın. İlk etkinliğinizi oluşturmak tamamen ücretsiz.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link 
                            href="/register" 
                            className="bg-white text-indigo-900 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            Ücretsiz Hesap Oluştur
                        </Link>
                    </div>
                    <p className="mt-8 text-sm text-indigo-300 opacity-80">
                        Kredi kartı gerekmez • 14 gün deneme süresi
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">QR</div>
                        <span className="font-bold text-gray-900 text-lg">EtkinlikQR</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Modern etkinlikler için dijital çözüm ortağınız. Anıları toplayın, paylaşın, yaşatın.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Ürün</h4>
                    <ul className="space-y-3 text-sm text-gray-500">
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Nasıl Çalışır?</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Özellikler</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Fiyatlandırma</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Kurumsal</h4>
                    <ul className="space-y-3 text-sm text-gray-500">
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Hakkımızda</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Blog</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">İletişim</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Yasal</h4>
                    <ul className="space-y-3 text-sm text-gray-500">
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Gizlilik Politikası</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Kullanım Şartları</a></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-100 pt-8 text-center text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} EtkinlikQR. Tüm hakları saklıdır.
            </div>
        </div>
      </footer>
    </div>
  );
}
