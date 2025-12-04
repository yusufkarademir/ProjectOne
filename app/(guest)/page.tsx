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
  Monitor,
  Heart,
  X
} from 'lucide-react';
import HeroAnimation from '@/app/components/landing/HeroAnimation';
import Logo from '@/app/components/ui/Logo';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo />
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  İnteraktif Bir Şölene Dönüştürün
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-500 mb-10 leading-relaxed max-w-lg">
                Misafirleriniz QR kodu okutsun, çektikleri fotoğraflar saniyeler içinde dev ekranda canlansın. Uygulama indirme yok, kurulum yok. Etkinlikleriniz için geliştirilmiş, bulut tabanlı yeni nesil sosyal duvar platformu.
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
            
            {/* Hero Animation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full"
            >
              <HeroAnimation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature 1: No App Required (QR & Upload) */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
               {/* Phone Mockup - Upload Interface */}
               <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl flex flex-col overflow-hidden">
                  <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                  <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                  <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white relative">
                      {/* App Header */}
                      <div className="bg-white p-4 pt-8 flex items-center justify-between border-b border-gray-100">
                          <div className="font-bold text-lg text-gray-900">EtkinlikQR</div>
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                          </div>
                      </div>
                      
                      {/* Upload UI Simulation */}
                      <div className="p-6 flex flex-col h-full pb-20">
                          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                              <motion.div 
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4"
                              >
                                  <Camera size={48} />
                              </motion.div>
                              <div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-2">Fotoğraf Paylaş</h3>
                                  <p className="text-gray-500 text-sm">Uygulama indirmeden, anında yükle.</p>
                              </div>
                              <div className="w-full space-y-3">
                                  <div className="h-12 bg-gray-100 rounded-xl w-full animate-pulse"></div>
                                  <div className="h-12 bg-indigo-600 rounded-xl w-full shadow-lg shadow-indigo-200"></div>
                              </div>
                          </div>
                      </div>
                  </div>
               </div>
               
               {/* Floating Elements */}
               <motion.div 
                 animate={{ y: [-10, 10, -10] }}
                 transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                 className="absolute top-20 -right-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 z-10"
               >
                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Check size={20} />
                 </div>
                 <div>
                    <p className="font-bold text-gray-900">Uygulama Yok</p>
                    <p className="text-xs text-gray-500">Sadece QR okut</p>
                 </div>
               </motion.div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <QrCode size={28} />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Uygulama İndirmek Yok!</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Misafirlerinizi uygulama indirme zahmetinden kurtarın. Masadaki QR kodu okutmaları yeterli.
              </p>
              <ul className="space-y-4">
                {[
                  'App Store / Play Store gerekmez',
                  'Sadece kamera ile QR okutma',
                  'Hızlı ve kullanıcı dostu arayüz',
                  'Anında fotoğraf yükleme kolaylığı'
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

      {/* Feature 2: Live Screen Experience */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Monitor size={28} />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Büyüleyici Dev Ekran</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Etkinlik alanındaki ekranları interaktif bir şölene dönüştürün. Fotoğraflar aksın, emojiler uçuşsun.
              </p>
              <div className="space-y-6">
                  <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <Play size={24} />
                      </div>
                      <div>
                          <h4 className="font-bold text-gray-900">Otomatik Slayt</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Yeni gelen fotoğraflar, Netflix benzeri akıcı bir animasyonla ekrana düşer. Yatay ve dikey fotoğraflar akıllıca yerleştirilir.
                          </p>
                      </div>
                  </div>
                  <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                          <Heart size={24} />
                      </div>
                      <div>
                          <h4 className="font-bold text-gray-900">Sosyal Etkileşim</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Misafirleriniz fotoğrafları beğenebilir, emoji gönderebilir. Ekranınız yaşayan bir sosyal ağa dönüşsün.
                          </p>
                      </div>
                  </div>
              </div>
            </div>

            <div className="relative">
               {/* Live Screen Simulation */}
               <div className="bg-slate-900 rounded-xl p-2 shadow-2xl border-4 border-slate-800 aspect-video relative overflow-hidden group">
                  {/* Screen Content */}
                  <div className="absolute inset-0 bg-slate-900">
                      {/* Floating Photos */}
                      <div className="grid grid-cols-3 gap-2 p-4 h-full opacity-80">
                          {[1,2,3,4,5,6].map((i) => (
                              <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.2 }}
                                className="bg-gray-800 rounded-lg overflow-hidden relative aspect-square"
                              >
                                  <div className={`absolute inset-0 bg-gradient-to-br ${
                                      i % 2 === 0 ? 'from-purple-500/20 to-blue-500/20' : 'from-pink-500/20 to-orange-500/20'
                                  }`} />
                              </motion.div>
                          ))}
                      </div>
                      
                      {/* Overlay Text */}
                      <div className="absolute bottom-6 left-6 text-white">
                          <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              <span className="text-xs font-bold uppercase tracking-wider">Canlı Yayın</span>
                          </div>
                          <h3 className="text-xl font-bold">#EnMutluGünümüz</h3>
                      </div>

                      {/* Flying Emojis */}
                      <motion.div 
                        animate={{ y: [100, -200], opacity: [0, 1, 0], x: [-20, 20] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="absolute bottom-0 right-10 text-4xl"
                      >
                        ❤️
                      </motion.div>
                      <motion.div 
                        animate={{ y: [100, -200], opacity: [0, 1, 0], x: [20, -20] }}
                        transition={{ repeat: Infinity, duration: 4, delay: 1, ease: "linear" }}
                        className="absolute bottom-0 right-24 text-4xl"
                      >
                        🔥
                      </motion.div>
                  </div>
               </div>
               {/* Glow Effect */}
               <div className="absolute -inset-4 bg-purple-500/20 blur-3xl -z-10 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: Stage Management */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div className="order-2 lg:order-1 relative">
               {/* Stage Management Simulation */}
               <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl overflow-hidden aspect-square flex flex-col justify-between relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black"></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
                  
                  {/* Mockup Content */}
                  <div className="relative z-10 text-center mt-10">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <h3 className="text-5xl font-black text-white mb-2 tracking-tight">GALA GECESİ</h3>
                    </motion.div>
                    <p className="text-indigo-300 tracking-[0.3em] text-sm">HOŞ GELDİNİZ</p>
                  </div>

                  <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 border border-white/10">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20 animate-pulse"></div>
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

            <div className="order-1 lg:order-2">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap size={28} />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Sahne Yönetimi</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Sadece fotoğraf değil, atmosferi de yönetin. Spotify listenizi bağlayın, geri sayım başlatın veya özel videolarınızı oynatın.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                    <Zap size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Hype Modu</h4>
                  <p className="text-sm text-gray-500">Enerjiyi yükselten geri sayım ve animasyonlar.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4 text-green-600">
                    <Music size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Spotify</h4>
                  <p className="text-sm text-gray-500">Kendi çalma listelerinizi doğrudan ekrandan yönetin.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 4: Live Connection */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
                <Monitor size={28} />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Canlı Bağlantı</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Uzaktaki misafirlerinizi etkinliğe dahil edin. Jitsi altyapısı ile dev ekrana canlı görüntülü bağlanın.
              </p>
              <div className="space-y-6">
                  <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                          <Check size={24} />
                      </div>
                      <div>
                          <h4 className="font-bold text-gray-900">HD Görüntü Kalitesi</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Kesintisiz ve yüksek kaliteli yayın deneyimi.
                          </p>
                      </div>
                  </div>
                  <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Share2 size={24} />
                      </div>
                      <div>
                          <h4 className="font-bold text-gray-900">Kolay Katılım</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Link paylaşın, misafirleriniz tek tıkla bağlansın.
                          </p>
                      </div>
                  </div>
              </div>
            </div>

            <div className="relative">
               {/* Live Connection Simulation */}
               <div className="bg-slate-900 rounded-xl p-2 shadow-2xl border-4 border-slate-800 aspect-video relative overflow-hidden">
                  {/* Video Grid */}
                  <div className="grid grid-cols-2 gap-2 h-full">
                      <div className="bg-gray-800 rounded-lg relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                                  <span className="text-2xl">👤</span>
                              </div>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-xs">
                              Damadın Arkadaşları
                          </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                                  <span className="text-2xl">👩</span>
                              </div>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-xs">
                              Teyzeler
                          </div>
                      </div>
                  </div>
                  
                  {/* Call Controls */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg">
                          <X size={20} />
                      </div>
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white shadow-lg">
                          <Monitor size={20} />
                      </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 5: Moderation Control */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
               {/* Moderation Simulation */}
               <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-20">
                    Moderatör Paneli
                  </div>
                  
                  {/* Mockup Interface */}
                  <div className="space-y-4 relative z-10">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                          <div className="flex items-center gap-2">
                              <ShieldCheck className="text-blue-600" size={24} />
                              <span className="font-bold text-gray-900">Güvenli Yayın</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Moderasyon Modu</span>
                              <div className="w-8 h-4 bg-blue-600 rounded-full p-0.5">
                                  <div className="w-3 h-3 bg-white rounded-full translate-x-4" />
                              </div>
                          </div>
                      </div>

                      {/* Incoming Photo Card */}
                      <motion.div 
                        initial={{ x: 0, opacity: 1 }}
                        whileInView={{ x: [0, 0, 200], opacity: [1, 1, 0] }}
                        transition={{ duration: 2, delay: 2, repeat: Infinity, repeatDelay: 1 }}
                        className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                      >
                          <div className="flex gap-4">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0" />
                              <div className="flex-1">
                                  <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                                  <div className="h-3 bg-gray-100 rounded w-full" />
                              </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                              <div className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg text-center text-sm font-bold flex items-center justify-center gap-1">
                                  <X size={14} /> Reddet
                              </div>
                              <div className="flex-1 bg-gray-200 text-gray-400 py-2 rounded-lg text-center text-sm font-bold flex items-center justify-center gap-1">
                                  <Check size={14} /> Onayla
                              </div>
                          </div>
                      </motion.div>
                      
                      {/* Approved List */}
                      <div className="space-y-2 opacity-50">
                          <div className="h-12 bg-gray-50 rounded-lg border border-gray-100" />
                          <div className="h-12 bg-gray-50 rounded-lg border border-gray-100" />
                      </div>
                  </div>

                  {/* Hand Cursor Animation */}
                  <motion.div
                    animate={{ x: [100, 50, 50], y: [100, 120, 120], scale: [1, 1, 0.9] }}
                    transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 1 }}
                    className="absolute top-0 left-0 text-slate-800 z-30 drop-shadow-xl"
                  >
                      {/* Simple CSS Cursor or Icon */}
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-slate-900 stroke-white stroke-2">
                        <path d="M8 2L20 14L14 15.5L18 22L15 24L11 17.5L6 21V2Z" />
                      </svg>
                  </motion.div>
               </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={28} />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Tam Kontrol Sizde</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                İstenmeyen sürprizlere yer yok. Gelişmiş moderasyon araçlarıyla neyin yayınlanacağına siz karar verin.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                    <Check size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Tek Tıkla Onay</h4>
                  <p className="text-sm text-gray-500">Fotoğrafları yayına almadan önce inceleyin.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mb-4 text-red-600">
                    <X size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Anında Engelle</h4>
                  <p className="text-sm text-gray-500">Uygunsuz içerikleri saniyeler içinde silin.</p>
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
