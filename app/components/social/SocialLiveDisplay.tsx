'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { getSocialFeed } from '@/app/lib/social-actions';
import { getLatestPhotos } from '@/app/lib/event-actions';
import { Heart, MessageSquare, Camera } from 'lucide-react';

interface SocialLiveDisplayProps {
  initialPhotos: any[];
  slug: string;
  eventName: string;
  qrCodeUrl: string;
  isOrganizer?: boolean;
  eventId?: string;
}

export default function SocialLiveDisplay({ initialPhotos, slug, eventName, qrCodeUrl, isOrganizer, eventId }: SocialLiveDisplayProps) {
  const [photos, setPhotos] = useState<any[]>(initialPhotos);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [feed, setFeed] = useState<any[]>([]);
  const [lastFetch, setLastFetch] = useState(new Date().toISOString());
  const [origin, setOrigin] = useState('');
  
  const [panicMode, setPanicMode] = useState(false);
  const [showModPanel, setShowModPanel] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Import actions dynamically
  const { togglePanicMode, resetSocialData } = require('@/app/lib/social-actions');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Slideshow timer
  useEffect(() => {
    if (photos.length === 0) return;
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    }, 8000); // Change photo every 8 seconds
    return () => clearInterval(interval);
  }, [photos.length]);

  // Polling for new content
  useEffect(() => {
    const interval = setInterval(async () => {
      // 1. Get new photos for slideshow
      const photoResult = await getLatestPhotos(slug, lastFetch);
      if (photoResult.success && photoResult.photos && photoResult.photos.length > 0) {
        setPhotos(prev => [...photoResult.photos, ...prev]);
      }

      // 2. Get social feed
      const feedResult = await getSocialFeed(slug, lastFetch);
      
      // Check for Panic Mode
      if (feedResult.panicMode) {
        setPanicMode(true);
      } else {
        setPanicMode(false);
      }

      if (feedResult.success && feedResult.feed && feedResult.feed.length > 0) {
        setFeed(prev => [...feedResult.feed, ...prev].slice(0, 20)); // Keep last 20 items
      }

      setLastFetch(new Date().toISOString());
    }, 5000);

    return () => clearInterval(interval);
  }, [slug, lastFetch]);

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

  const currentPhoto = photos[currentPhotoIndex];

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
      {/* Left: Main Visual (2/3) */}
      <div className="w-2/3 relative h-full bg-gray-900 flex items-center justify-center overflow-hidden">
        {/* Background Blur */}
        <div className="absolute inset-0 opacity-30 blur-3xl scale-110">
            {currentPhoto && (
                <img src={currentPhoto.url} alt="" className="w-full h-full object-cover" />
            )}
        </div>

        {/* Main Image */}
        <AnimatePresence mode="wait">
            {currentPhoto ? (
                <motion.div
                    key={currentPhoto.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="relative z-10 max-h-[90vh] max-w-[90%] shadow-2xl rounded-xl overflow-hidden border-4 border-white/10"
                >
                    <img 
                        src={currentPhoto.url} 
                        alt="Slideshow" 
                        className="max-h-[85vh] object-contain"
                    />
                    {currentPhoto.mission && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md p-4 text-center">
                            <p className="text-lg font-medium">🎯 {currentPhoto.mission.text}</p>
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
            <div className="relative z-10 text-center">
                <h1 className="text-2xl font-bold text-gray-900 truncate max-w-xs mx-auto">{eventName}</h1>
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
                            className={`flex ${item.type === 'reaction' ? 'justify-center' : 'justify-start'}`}
                        >
                            {/* Reaction Bubble (Centered, Small) */}
                            {item.type === 'reaction' && (
                                <div className="bg-white border border-red-100 shadow-sm rounded-full px-4 py-2 flex items-center gap-2">
                                    <span className="text-xl">❤️</span>
                                    <span className="text-sm font-medium text-gray-600">Birisi fotoğrafı beğendi!</span>
                                </div>
                            )}

                            {/* Photo/Comment Bubble (Left Aligned) */}
                            {(item.type === 'photo' || item.type === 'comment') && (
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[90%]">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-full shrink-0 ${
                                            item.type === 'photo' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                            {item.type === 'photo' && <Camera size={18} />}
                                            {item.type === 'comment' && <MessageSquare size={18} />}
                                        </div>
                                        
                                        <div>
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
                                                    <p className="font-bold text-gray-900 text-sm">Misafir Yorumu 💬</p>
                                                    <p className="text-gray-700 text-sm mt-1 leading-relaxed">"{item.data.content}"</p>
                                                    {item.data.photo && (
                                                        <div className="mt-2 flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                                                            <img src={item.data.photo.url} className="w-8 h-8 rounded object-cover" />
                                                            <span className="text-xs text-gray-500">fotoğrafına</span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            
                                            <p className="text-[10px] text-gray-400 mt-2 text-right">
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
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">v1.1</span>
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                        <button 
                            onClick={handlePanicToggle}
                            className={`w-full py-2 px-3 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                                panicMode 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                        >
                            {panicMode ? '✅ Yayını Başlat' : '🚨 ACİL DURDUR'}
                        </button>

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
    </div>
  );
}

function PendingQueue({ eventId }: { eventId?: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Import actions dynamically
  const { getPendingItems, approveComment, rejectComment, approvePhoto, rejectPhoto } = require('@/app/lib/social-actions');

  const fetchItems = async () => {
    if (!eventId) return;
    // Silent update
    const result = await getPendingItems(eventId);
    if (result.success) {
      setItems(result.items);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
    const interval = setInterval(fetchItems, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [eventId]);

  const handleAction = async (item: any, action: 'approve' | 'reject') => {
    setProcessingId(item.data.id);
    
    if (item.type === 'comment') {
        if (action === 'approve') await approveComment(item.data.id);
        else await rejectComment(item.data.id);
    } else if (item.type === 'photo') {
        if (action === 'approve') await approvePhoto(item.data.id);
        else await rejectPhoto(item.data.id);
    }

    // Optimistic update
    setItems(prev => prev.filter(i => i.data.id !== item.data.id));
    setProcessingId(null);
  };

  if (loading) return <div className="text-xs text-gray-400 text-center py-4">Yükleniyor...</div>;
  if (items.length === 0) return <div className="text-xs text-gray-400 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">Bekleyen öğe yok</div>;

  return (
    <>
        {/* Image Preview Overlay */}
        {previewImage && (
            <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white p-2 rounded-xl shadow-2xl max-w-[80vw] max-h-[80vh]">
                    <img src={previewImage} className="max-w-full max-h-[75vh] rounded-lg object-contain" />
                </div>
            </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 min-h-[200px]">
            {items.map((item) => (
                <div key={item.data.id} className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-left">
                    {item.type === 'comment' ? (
                        <div className="mb-2">
                            <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-1 rounded">Yorum</span>
                            <p className="text-xs text-gray-900 mt-1 line-clamp-3 font-medium">"{item.data.content}"</p>
                        </div>
                    ) : (
                        <div className="mb-2 group relative">
                            <span className="text-[10px] uppercase font-bold text-purple-600 bg-purple-50 px-1 rounded">Fotoğraf</span>
                            <div 
                                className="mt-1 h-20 w-full bg-gray-100 rounded overflow-hidden cursor-zoom-in border border-gray-200 hover:border-purple-300 transition-colors"
                                onMouseEnter={() => setPreviewImage(item.data.url)}
                                onMouseLeave={() => setPreviewImage(null)}
                            >
                                <img src={item.data.url} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    )}
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleAction(item, 'approve')}
                            disabled={!!processingId}
                            className="flex-1 bg-green-500 text-white py-1.5 rounded text-xs font-bold hover:bg-green-600 transition-colors"
                        >
                            Onayla
                        </button>
                        <button 
                            onClick={() => handleAction(item, 'reject')}
                            disabled={!!processingId}
                            className="flex-1 bg-red-100 text-red-600 py-1.5 rounded text-xs font-bold hover:bg-red-200 transition-colors"
                        >
                            Reddet
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </>
  );
}
