'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLatestPhotos } from '@/app/lib/event-actions';
import { QRCodeSVG } from 'qrcode.react';
import Marquee from 'react-fast-marquee';
import FramedImage from '@/app/components/FramedImage';

interface LiveSlideshowProps {
  initialPhotos: any[];
  slug: string;
  eventName: string;
  qrCodeUrl: string;
  theme: string;
  frameStyle?: 'none' | 'polaroid' | 'gradient' | 'minimal' | 'corners' | 'cinema' | 'vintage' | 'gold' | 'neon' | 'floral';
}

export default function LiveSlideshow({ initialPhotos, slug, eventName, qrCodeUrl, theme, frameStyle = 'none' }: LiveSlideshowProps) {
  const [allPhotos, setAllPhotos] = useState<any[]>(initialPhotos);
  const [spotlightBatch, setSpotlightBatch] = useState<any[]>([]);
  const [lastFetch, setLastFetch] = useState(new Date().toISOString());
  const [origin, setOrigin] = useState('');

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
                        <div key={photo.id} className={`mx-2 ${imageHeightClass} w-auto aspect-[4/3] relative group flex-shrink-0`}>
                            <FramedImage 
                                src={photo.url} 
                                alt="Slide" 
                                frameStyle={frameStyle}
                                className="h-full w-full shadow-lg"
                                imageClassName="h-full w-full object-cover rounded-md"
                                flexibleFrame={true}
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
                                    imageClassName={`object-contain rounded-lg ${
                                        spotlightBatch.length === 1 ? 'max-h-[80vh]' :
                                        spotlightBatch.length === 2 ? 'max-h-[60vh]' :
                                        'max-h-[45vh]'
                                    }`}
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
    </div>
  );
}
