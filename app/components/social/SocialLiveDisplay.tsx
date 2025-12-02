'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { getSocialFeed, getSocialStats } from '@/app/lib/social-actions';
import { getLatestPhotos } from '@/app/lib/event-actions';
import { Heart, MessageSquare, Camera, Trophy, Star, Eye, EyeOff, Projector, Theater, Monitor } from 'lucide-react';
import StageDisplay from '../stage/StageDisplay';
import StageControlModal from '../stage/StageControlModal';

interface SocialLiveDisplayProps {
  initialPhotos: any[];
  slug: string;
  eventName: string;
  qrCodeUrl: string;
  isOrganizer?: boolean;
  eventId?: string;
}

import PendingQueue from './PendingQueue';

export default function SocialLiveDisplay({ initialPhotos, slug, eventName, qrCodeUrl, isOrganizer, eventId }: SocialLiveDisplayProps) {
  const [photos, setPhotos] = useState<any[]>(initialPhotos);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [feed, setFeed] = useState<any[]>([]);
  const [origin, setOrigin] = useState('');
  
  const [panicMode, setPanicMode] = useState(false);
  const [showModPanel, setShowModPanel] = useState(false);
  const [resetting, setResetting] = useState(false);
  
  const [stats, setStats] = useState({ photos: 0, comments: 0, reactions: 0, topLiked: null as any, topCommented: null as any });
  const [showStats, setShowStats] = useState(true);
  const [forcedPhoto, setForcedPhoto] = useState<any>(null);

  // Stage Mode State
  const [stageConfig, setStageConfig] = useState<any>(null);
  const [showStageModal, setShowStageModal] = useState(false);

  // Import actions dynamically
  const { togglePanicMode, resetSocialData } = require('@/app/lib/social-actions');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Slideshow timer
  useEffect(() => {
    if (photos.length === 0 || forcedPhoto) return; // Stop slideshow if forced photo is active
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    }, 8000); // Change photo every 8 seconds
    return () => clearInterval(interval);
  }, [photos.length, forcedPhoto]);

  // Polling for new content & stats
  useEffect(() => {
    const interval = setInterval(async () => {
      const since = new Date(Date.now() - 1000 * 60 * 2).toISOString(); // Look back 2 minutes to handle clock skew

      // 1. Get new photos for slideshow
      const photoResult = await getLatestPhotos(slug, since);
      if (photoResult.success && photoResult.photos && photoResult.photos.length > 0) {
        setPhotos(prev => {
            const newPhotos = photoResult.photos.filter((newP: any) => !prev.some(prevP => prevP.id === newP.id));
            return [...newPhotos, ...prev];
        });
      }

      // 2. Get social feed
      const feedResult = await getSocialFeed(slug, since);
      
      // Check for Panic Mode (Legacy) & Stage Mode
      if (feedResult.stageConfig) {
        setStageConfig(feedResult.stageConfig);
      }
      
      if (feedResult.panicMode) {
        setPanicMode(true);
      } else {
        setPanicMode(false);
      }

      if (feedResult.success && feedResult.feed && feedResult.feed.length > 0) {
        setFeed(prev => {
            const newItems = feedResult.feed.filter((newItem: any) => !prev.some(prevItem => prevItem.data.id === newItem.data.id));
            return [...newItems, ...prev].slice(0, 20);
        });
      }

      // 3. Get Stats
      const statsResult = await getSocialStats(slug);
      if (statsResult.success && statsResult.stats) {
        setStats(statsResult.stats);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [slug]);

  const handlePanicToggle = async () => {
    await togglePanicMode(eventId, !panicMode);
    setPanicMode(!panicMode);
  };

  const handleResetData = async () => {
    if (!confirm('DİKKAT: Tüm yorumlar ve beğeniler kalıcı olarak silinecektir. Emin misiniz?')) return;
    
    setResetting(true);
    const result = await resetSocialData(eventId);
    if (result.success) {
        setFeed([]); // Clear local feed
        alert('Tüm veriler temizlendi.');
    } else {
        alert('Hata oluştu.');
    }
    setResetting(false);
  };

  const toggleForcedPhoto = () => {
    if (forcedPhoto) {
      setForcedPhoto(null);
    } else if (stats.topLiked) {
      setForcedPhoto(stats.topLiked);
    }
  };

  const activePhoto = forcedPhoto || photos[currentPhotoIndex];

  if (panicMode) {
    return (
        <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-50 p-8 text-center">
            <div className="max-w-2xl animate-pulse">
                <h1 className="text-6xl font-bold mb-8 text-red-500">⚠️ TEKNİK ARIZA</h1>
                <p className="text-2xl text-gray-300 mb-12">
                    Kısa bir ara veriyoruz. Lütfen bekleyiniz.
                </p>
                <div className="w-24 h-24 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
            </div>
            {isOrganizer && (
                <button 
                    onClick={handlePanicToggle}
                    className="mt-12 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors z-50 pointer-events-auto"
                >
                    YAYINI BAŞLAT (Normale Dön)
                </button>
            )}
        </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden flex">
      {/* Stage Mode Overlay */}
      <StageDisplay config={stageConfig} event={{ name: eventName, slug }} />
      {/* Left: Main Visual (2/3) */}
      <div className="w-2/3 relative h-full bg-gray-900 flex items-center justify-center overflow-hidden">
        {/* Background Blur */}
        <div className="absolute inset-0 opacity-30 blur-3xl scale-110">
            {activePhoto && (
                <img src={activePhoto.url} alt="" className="w-full h-full object-cover" />
            )}
        </div>

        {/* Top Stats Bar & Highlights */}
        <AnimatePresence>
            {showStats && (
                <motion.div 
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="absolute top-0 left-0 right-0 z-30 p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-start justify-between"
                >
                    {/* General Stats */}
                    <div className="flex gap-6">
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-white leading-none">{stats.photos}</span>
                            <div className="flex items-center gap-1.5 text-blue-400 mt-1">
                                <Camera size={14} />
                                <span className="text-[10px] uppercase font-bold tracking-wider">Fotoğraf</span>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-white/20"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-white leading-none">{stats.reactions}</span>
                            <div className="flex items-center gap-1.5 text-red-500 mt-1">
                                <Heart size={14} />
                                <span className="text-[10px] uppercase font-bold tracking-wider">Beğeni</span>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-white/20"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-white leading-none">{stats.comments}</span>
                            <div className="flex items-center gap-1.5 text-green-400 mt-1">
                                <MessageSquare size={14} />
                                <span className="text-[10px] uppercase font-bold tracking-wider">Yorum</span>
                            </div>
                        </div>
                    </div>

                    {/* Top Photos */}
                    <div className="flex gap-4">
                        {stats.topLiked && (
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1 text-yellow-400 mb-0.5">
                                        <Trophy size={12} />
                                        <span className="text-[10px] font-bold uppercase">En Beğenilen</span>
                                    </div>
                                    <p className="text-xs text-gray-300">{stats.topLiked._count.reactions} Beğeni</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-yellow-500/50 shadow-lg shadow-yellow-500/20">
                                    <img src={stats.topLiked.url} className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}
                        {stats.topCommented && (
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1 text-blue-400 mb-0.5">
                                        <MessageSquare size={12} />
                                        <span className="text-[10px] font-bold uppercase">En Konuşulan</span>
                                    </div>
                                    <p className="text-xs text-gray-300">{stats.topCommented._count.comments} Yorum</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-blue-500/50 shadow-lg shadow-blue-500/20">
                                    <img src={stats.topCommented.url} className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Main Image */}
        <AnimatePresence mode="wait">
            {activePhoto ? (
                <motion.div
                    key={activePhoto.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className={`relative z-10 max-h-[85vh] max-w-[90%] shadow-2xl rounded-xl overflow-hidden border-4 ${forcedPhoto ? 'border-yellow-400 shadow-yellow-500/50' : 'border-white/10'}`}
                >
                    <img 
                        src={activePhoto.url} 
                        alt="Slideshow" 
                        className="max-h-[80vh] object-contain"
                    />
                    {activePhoto.mission && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md p-4 text-center">
                            <p className="text-lg font-medium">🎯 {activePhoto.mission.text}</p>
                        </div>
                    )}
                    {forcedPhoto && (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full font-bold text-sm shadow-lg animate-pulse">
                            GECENİN YILDIZI 🌟
                        </div>
                    )}
                </motion.div>
            ) : (
                <div className="z-10 text-center">
                    <h2 className="text-4xl font-bold mb-4">Fotoğraf Bekleniyor...</h2>
                    <p className="text-xl opacity-70">QR kodu taratıp ilk fotoğrafı paylaşın!</p>
                </div>
            )}
        </AnimatePresence>


      </div>

      {/* Right: Social Feed & QR (1/3) */}
      <div className="w-1/3 h-full bg-white flex flex-col border-l border-gray-200 shadow-2xl z-20">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-green-50 opacity-50"></div>
            <div className="relative z-10 text-center w-full">
                <h1 className="text-2xl font-bold text-gray-900 truncate mx-auto">{eventName}</h1>
                <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <p className="text-sm font-medium text-green-600 uppercase tracking-wide">Canlı Sosyal Akış</p>
                </div>
            </div>
        </div>



        {/* Feed List */}
        <div className="flex-1 overflow-y-hidden relative bg-gray-50/50">
            <div className="absolute inset-0 p-4 overflow-y-auto no-scrollbar space-y-4">
                <AnimatePresence initial={false}>
                    {feed.map((item) => (
                        <motion.div
                            key={`${item.type}-${item.data.id}`}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`flex ${item.type === 'reaction' ? 'justify-end' : 'justify-start'}`}
                        >
                            {/* Reaction Bubble */}
                            {item.type === 'reaction' && (
                                <div className="bg-white p-3 rounded-2xl rounded-tr-none shadow-sm border border-red-100 max-w-[85%] ml-auto">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl animate-bounce">{item.data.type || '❤️'}</div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">Bir fotoğraf beğenildi!</p>
                                            {item.data.photo && (
                                                <div className="mt-2 flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                                                    <img src={item.data.photo.url} className="w-8 h-8 rounded object-cover" />
                                                    <span className="text-xs text-gray-500">bu fotoğrafa</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Photo/Comment Bubble */}
                            {(item.type === 'photo' || item.type === 'comment') && (
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[90%]">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-full shrink-0 ${
                                            item.type === 'photo' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                            {item.type === 'photo' && <Camera size={18} />}
                                            {item.type === 'comment' && <MessageSquare size={18} />}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            {item.type === 'photo' && (
                                                <>
                                                    <p className="font-bold text-gray-900 text-sm mb-1">Yeni Fotoğraf 📸</p>
                                                    <div className="h-32 w-full rounded-lg overflow-hidden bg-gray-100 mt-2 border border-gray-200">
                                                        <img src={item.data.url} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                </>
                                            )}

                                            {item.type === 'comment' && (
                                                <>
                                                    <p className="font-bold text-gray-900 text-sm">Fotoğrafa Yorum Yapıldı 💬</p>
                                                    
                                                    {item.data.photo && (
                                                        <div className="mt-2 mb-2 flex items-start gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                            <img src={item.data.photo.url} className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0" />
                                                            <div className="min-w-0">
                                                                <p className="text-xs text-gray-500 mb-0.5">Şu fotoğrafa:</p>
                                                                <p className="text-gray-900 text-sm font-medium leading-snug line-clamp-2">"{item.data.content}"</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {!item.data.photo && (
                                                        <p className="text-gray-700 text-sm mt-1 leading-relaxed">"{item.data.content}"</p>
                                                    )}
                                                </>
                                            )}
                                            
                                            <p className="text-[10px] text-gray-400 mt-1 text-right">
                                                {new Date(item.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                    {feed.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                            <MessageSquare size={48} className="opacity-20" />
                            <p className="text-sm font-medium">Sohbet başlamadı...</p>
                            <p className="text-xs opacity-60">İlk yorumu veya beğeniyi sen yap!</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* QR Code Footer */}
        <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="bg-white p-2 rounded-lg shadow-sm shrink-0">
                    {origin && <QRCodeSVG value={`${origin}/e/${slug}/social`} size={80} />}
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">KATILMAK İÇİN TARA</p>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">Sohbete Katıl & Paylaş</h3>
                    <p className="text-xs text-gray-500 mt-1 truncate">{origin}/e/{slug}/social</p>
                </div>
            </div>
        </div>
      </div>

      {/* Moderator Controls */}
      {isOrganizer && (
        <div className="fixed bottom-4 right-4 z-50">
            <button 
                onClick={() => setShowModPanel(!showModPanel)}
                className="bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors border border-gray-700"
                title="Moderatör Paneli"
            >
                🛡️
            </button>
            
            {showModPanel && (
                <div className="absolute bottom-14 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80 animate-in fade-in slide-in-from-bottom-4 max-h-[80vh] flex flex-col">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2 flex items-center justify-between">
                        <span>Moderatör Kontrolleri</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">v1.3</span>
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                        <button 
                            onClick={() => setShowStageModal(true)}
                            className="w-full py-2 px-3 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 bg-purple-100 text-purple-700 hover:bg-purple-200"
                        >
                            <Theater size={16} />
                            Sahne Modu
                        </button>
                        <button 
                            onClick={() => window.open(`${window.location.pathname}?mode=projector`, '_blank')}
                            className="w-full py-2 px-3 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200"
                        >
                            <Monitor size={16} />
                            Yansıtma Modu (Temiz)
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <button 
                              onClick={() => setShowStats(!showStats)}
                              className={`py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                                showStats ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                              }`}
                          >
                              {showStats ? <Eye size={14} /> : <EyeOff size={14} />}
                              İstatistik
                          </button>

                          <button 
                              onClick={toggleForcedPhoto}
                              disabled={!stats.topLiked}
                              className={`py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                                forcedPhoto ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                              }`}
                          >
                              <Projector size={14} />
                              {forcedPhoto ? 'Yansıtmayı Durdur' : 'Yıldızı Yansıt'}
                          </button>
                        </div>

                        <button 
                            onClick={handleResetData}
                            disabled={resetting}
                            className="w-full py-2 px-3 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                            {resetting ? 'Siliniyor...' : '🗑️ Verileri Sıfırla'}
                        </button>
                    </div>

                    {/* Pending Comments Queue */}
                    <div className="flex-1 overflow-hidden flex flex-col border-t border-gray-100 pt-3">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                            Onay Bekleyenler
                            <span className="bg-yellow-100 text-yellow-700 px-1.5 rounded-full text-[10px]">Canlı</span>
                        </h4>
                        <PendingQueue eventId={eventId} />
                    </div>
                </div>
            )}
        </div>
      )}

      {/* Stage Control Modal */}
      <AnimatePresence>
        {showStageModal && (
            <StageControlModal 
                isOpen={showStageModal} 
                onClose={() => setShowStageModal(false)} 
                eventId={eventId || ''}
                slug={slug}
                initialConfig={stageConfig}
            />
        )}
      </AnimatePresence>
    </div>
  );
}
