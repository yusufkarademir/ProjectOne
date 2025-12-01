'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLatestPhotos } from '@/app/lib/event-actions';
import { getSocialFeed as getSocialFeedAction } from '@/app/lib/social-actions';
import { QRCodeSVG } from 'qrcode.react';
import Marquee from 'react-fast-marquee';
import FramedImage from '@/app/components/FramedImage';
import StageDisplay from '@/app/components/stage/StageDisplay';
import StageControlModal from '@/app/components/stage/StageControlModal';
import PendingQueue from '@/app/components/social/PendingQueue';
import { Shield, Theater, Camera, Monitor } from 'lucide-react';

interface LiveSlideshowProps {
  initialPhotos: any[];
  slug: string;
  eventName: string;
  qrCodeUrl: string;
  theme: string;
  frameStyle?: 'none' | 'polaroid' | 'gradient' | 'minimal' | 'corners' | 'cinema' | 'vintage' | 'gold' | 'neon' | 'floral';
  isOrganizer?: boolean;
  eventId?: string;
}

export default function LiveSlideshow({ initialPhotos, slug, eventName, qrCodeUrl, theme, frameStyle = 'none', isOrganizer, eventId }: LiveSlideshowProps) {
  const [allPhotos, setAllPhotos] = useState<any[]>(initialPhotos);
  const [spotlightBatch, setSpotlightBatch] = useState<any[]>([]);
  const [lastFetch, setLastFetch] = useState(new Date().toISOString());
  const [origin, setOrigin] = useState('');

  // Moderator State
  const [showModPanel, setShowModPanel] = useState(false);
  const [stageConfig, setStageConfig] = useState<any>(null);
  const [showStageModal, setShowStageModal] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Polling for new photos
  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await getLatestPhotos(slug, lastFetch);
      if (result.success && result.photos && result.photos.length > 0) {
        setLastFetch(new Date().toISOString());
        const newPhotos = result.photos;
        setAllPhotos(prev => [...newPhotos, ...prev]);
        
        // Take up to 4 photos for the spotlight batch
        const batch = newPhotos.slice(0, 4);
        setSpotlightBatch(batch);
        
        // Calculate duration: 6s for single, 10s for batch
        const duration = batch.length > 1 ? 10000 : 6000;
        
        setTimeout(() => {
            setSpotlightBatch([]);
        }, duration);
      }

      // Fetch Stage Config
      const feedResult = await getSocialFeedAction(slug, lastFetch);
      if (feedResult.stageConfig) {
        setStageConfig(feedResult.stageConfig);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [slug, lastFetch]);

  // Determine number of rows based on photo count
  const numRows = useMemo(() => {
    const count = allPhotos.length;
    if (count <= 10) return 1;
    if (count <= 20) return 2;
    if (count <= 30) return 3;
    return 4;
  }, [allPhotos.length]);

  // Split photos into rows dynamically
  const rows = useMemo(() => {
    if (allPhotos.length === 0) return [];
    
    // Initialize array of arrays
    const result: any[][] = Array.from({ length: numRows }, () => []);

    allPhotos.forEach((photo, index) => {
        const rowIndex = index % numRows;
        result[rowIndex].push(photo);
    });

    return result;
  }, [allPhotos, numRows]);

  // Dynamic height calculations
  const getRowHeight = () => {
    switch (numRows) {
        case 1: return 'h-[80vh]';
        case 2: return 'h-[40vh]';
        case 3: return 'h-[26vh]';
        case 4: return 'h-[20vh]';
        default: return 'h-[20vh]';
    }
  };

  const getImageHeight = () => {
    switch (numRows) {
        case 1: return 'h-[75vh]';
        case 2: return 'h-[36vh]';
        case 3: return 'h-[24vh]';
        case 4: return 'h-[18vh]';
        default: return 'h-[18vh]';
    }
  };

  const rowHeightClass = getRowHeight();
  const imageHeightClass = getImageHeight();

  // Theme styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
      case 'party':
        return { bg: 'bg-black', text: 'text-white', accent: 'text-[#ff00ff]' };
      case 'wedding':
        return { bg: 'bg-[#fdfbf7]', text: 'text-[#4a4a4a]', accent: 'text-[#d4af37]' };
      default:
        return { bg: 'bg-gray-900', text: 'text-white', accent: 'text-blue-500' };
    }
  };
  const styles = getThemeStyles();

  if (allPhotos.length === 0) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${styles.bg} ${styles.text}`}>
        <div className="bg-white p-4 rounded-xl shadow-lg mb-8">
            {origin && <QRCodeSVG value={`${origin}/e/${slug}`} size={200} />}
        </div>
        <h1 className="text-4xl font-bold mb-4">Hoş Geldiniz</h1>
        <p className="text-xl opacity-80">İlk fotoğrafı yüklemek için QR kodu taratın!</p>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 overflow-hidden ${styles.bg} flex flex-col`}>
      {/* Stage Mode Overlay */}
      <StageDisplay config={stageConfig} event={{ name: eventName, slug }} />

      {/* Header - Fixed Height */}
      <div className="relative z-20 px-6 py-4 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent flex-none h-[15vh] min-h-[100px]">
        <div>
            <h1 className={`text-4xl font-bold ${styles.text} drop-shadow-lg`}>{eventName}</h1>
            <p className={`text-xl opacity-80 ${styles.text} mt-2`}>#CanlıAkış</p>
        </div>
        <div className="bg-white/90 p-2 rounded-lg shadow-2xl backdrop-blur-sm flex flex-col items-center transform scale-90 origin-top-right">
            {origin && <QRCodeSVG value={`${origin}/e/${slug}`} size={80} />}
            <p className="text-[8px] font-bold mt-1 text-black uppercase tracking-wider">Fotoğraf Yükle</p>
        </div>
      </div>

      {/* Marquee Rows - Dynamic Layout */}
      <div className="flex-1 flex flex-col justify-center content-center gap-1 py-2 relative z-10 overflow-hidden">
        {rows.map((rowPhotos, rowIndex) => (
            <div key={rowIndex} className={`${rowHeightClass} overflow-hidden relative`}>
                <Marquee 
                    gradient={false} 
                    speed={40 + (rowIndex * 5)} // Vary speed slightly per row
                    direction={rowIndex % 2 === 0 ? "right" : "left"} 
                    className="h-full flex items-center"
                >
                    {rowPhotos.map((photo) => (
                        <div key={photo.id} className={`mx-2 ${imageHeightClass} w-auto relative group flex-shrink-0`}>
                            <FramedImage 
                                src={photo.url} 
                                alt="Slide" 
                                frameStyle={frameStyle}
                                className="h-full w-auto shadow-lg"
                                imageClassName="h-full w-auto rounded-md"
                                flexibleFrame={true}
                                objectFit="contain"
                                imageLayout="responsive"
                            />
                            {photo.mission && (
                                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] py-1 px-2 rounded text-center truncate">
                                    🎯 {photo.mission.text}
                                </div>
                            )}
                        </div>
                    ))}
                </Marquee>
            </div>
        ))}
      </div>

      {/* Spotlight Overlay */}
      <AnimatePresence>
        {spotlightBatch.length > 0 && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-10"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative max-h-full max-w-full flex flex-col items-center"
                >
                    {/* Netflix-style NEW Badge */}
                    <motion.div 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute -top-12 right-0 z-50"
                    >
                        <span className="bg-[#E50914] text-white text-xs font-bold px-3 py-1 rounded shadow-lg tracking-widest uppercase">
                            YENİ ({spotlightBatch.length})
                        </span>
                    </motion.div>

                    {/* Dynamic Grid Layout */}
                    <div className={`grid gap-4 ${
                        spotlightBatch.length === 1 ? 'grid-cols-1' :
                        spotlightBatch.length === 2 ? 'grid-cols-2' :
                        spotlightBatch.length === 3 ? 'grid-cols-3' :
                        'grid-cols-2 grid-rows-2'
                    }`}>
                        {spotlightBatch.map((photo, index) => (
                            <div key={photo.id} className="relative flex justify-center items-center">
                                <FramedImage 
                                    src={photo.url} 
                                    alt="Spotlight" 
                                    frameStyle={frameStyle}
                                    className={`shadow-2xl ${
                                        spotlightBatch.length === 1 ? 'max-h-[80vh] w-auto' :
                                        spotlightBatch.length === 2 ? 'max-h-[60vh] w-auto' :
                                        spotlightBatch.length <= 4 ? 'max-h-[45vh] w-auto' : ''
                                    }`}
                                    imageClassName={`rounded-lg ${
                                        spotlightBatch.length === 1 ? 'max-h-[80vh]' :
                                        spotlightBatch.length === 2 ? 'max-h-[60vh]' :
                                        'max-h-[45vh]'
                                    }`}
                                    objectFit="contain"
                                />
                                {photo.mission && (
                                    <div className="absolute bottom-4 left-0 right-0 text-center">
                                         <span className="inline-block bg-black/60 backdrop-blur-md text-white text-xs py-1 px-3 rounded-full truncate max-w-[90%]">
                                            🎯 {photo.mission.text}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8"
                    >
                        <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-full font-bold text-xl shadow-2xl">
                            {spotlightBatch.length > 1 ? `✨ ${spotlightBatch.length} YENİ FOTOĞRAF EKLENDİ` : (spotlightBatch[0]?.mission ? `🎯 GÖREV TAMAMLANDI` : '✨ YENİ FOTOĞRAF EKLENDİ')}
                        </span>
                    </motion.div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Moderator Controls */}
      {isOrganizer && (
        <div className="fixed bottom-4 right-4 z-50">
            <button 
                onClick={() => setShowModPanel(!showModPanel)}
                className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors border border-blue-500"
                title="Moderatör Paneli"
            >
                <Shield size={24} />
            </button>
            
            {showModPanel && (
                <div className="absolute bottom-14 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80 animate-in fade-in slide-in-from-bottom-4 max-h-[80vh] flex flex-col">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2 flex items-center justify-between">
                        <span>Moderatör Kontrolleri</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Slayt</span>
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
                    </div>

                    {/* Pending Photos Queue */}
                    <div className="flex-1 overflow-hidden flex flex-col border-t border-gray-100 pt-3">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                            Onay Bekleyen Fotoğraflar
                            <span className="bg-yellow-100 text-yellow-700 px-1.5 rounded-full text-[10px]">Canlı</span>
                        </h4>
                        <PendingQueue eventId={eventId} type="photo" />
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
                initialConfig={stageConfig}
            />
        )}
      </AnimatePresence>
    </div>
  );
}
