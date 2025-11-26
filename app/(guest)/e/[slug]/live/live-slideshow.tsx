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
  const [spotlightPhoto, setSpotlightPhoto] = useState<any | null>(null);
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
        // We have new photos!
        setLastFetch(new Date().toISOString());
        
        // Show the most recent one in spotlight
        // If multiple came in, we could queue them, but for now let's show the latest one
        // and add all of them to the list
        const newPhotos = result.photos;
        
        // Add to main list immediately so they are there when spotlight finishes
        setAllPhotos(prev => [...newPhotos, ...prev]);

        // Trigger spotlight for the newest one
        setSpotlightPhoto(newPhotos[0]);

        // Clear spotlight after 5 seconds
        setTimeout(() => {
            setSpotlightPhoto(null);
        }, 5000);
      }
    }, 5000); // Check every 5 seconds for faster updates

    return () => clearInterval(interval);
  }, [slug, lastFetch]);

  // Split photos into rows for the marquee
  const rows = useMemo(() => {
    if (allPhotos.length === 0) return [[], [], []];
    
    const row1: any[] = [];
    const row2: any[] = [];
    const row3: any[] = [];

    allPhotos.forEach((photo, index) => {
        if (index % 3 === 0) row1.push(photo);
        else if (index % 3 === 1) row2.push(photo);
        else row3.push(photo);
    });

    return [row1, row2, row3];
  }, [allPhotos]);

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
      {/* Header */}
      <div className="relative z-20 p-6 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
        <div>
            <h1 className={`text-4xl font-bold ${styles.text} drop-shadow-lg`}>{eventName}</h1>
            <p className={`text-xl opacity-80 ${styles.text} mt-2`}>#CanlıAkış</p>
        </div>
        <div className="bg-white/90 p-2 rounded-lg shadow-2xl backdrop-blur-sm flex flex-col items-center">
            {origin && <QRCodeSVG value={`${origin}/e/${slug}`} size={100} />}
            <p className="text-[10px] font-bold mt-1 text-black uppercase tracking-wider">Fotoğraf Yükle</p>
        </div>
      </div>

      {/* Marquee Rows */}
      <div className="flex-1 flex flex-col justify-center gap-4 py-4 relative z-10">
        
        {/* Row 1 - Left to Right */}
        {rows[0].length > 0 && (
            <div className="h-[30vh]">
                <Marquee gradient={false} speed={40} direction="right">
                    {rows[0].map((photo) => (
                        <div key={photo.id} className="mx-2 h-[28vh] w-auto aspect-[4/3] relative group">
                            <FramedImage 
                                src={photo.url} 
                                alt="Slide" 
                                frameStyle={frameStyle}
                                className="h-full w-full shadow-lg"
                                imageClassName="h-full w-full object-cover rounded-md"
                            />
                            {photo.mission && (
                                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs py-1 px-2 rounded text-center truncate">
                                    🎯 {photo.mission.text}
                                </div>
                            )}
                        </div>
                    ))}
                </Marquee>
            </div>
        )}

        {/* Row 2 - Right to Left (Faster) */}
        {rows[1].length > 0 && (
            <div className="h-[35vh]">
                <Marquee gradient={false} speed={50} direction="left">
                    {rows[1].map((photo) => (
                        <div key={photo.id} className="mx-2 h-[33vh] w-auto aspect-[4/3] relative group">
                             <FramedImage 
                                src={photo.url} 
                                alt="Slide" 
                                frameStyle={frameStyle}
                                className="h-full w-full shadow-lg"
                                imageClassName="h-full w-full object-cover rounded-md"
                            />
                             {photo.mission && (
                                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs py-1 px-2 rounded text-center truncate">
                                    🎯 {photo.mission.text}
                                </div>
                            )}
                        </div>
                    ))}
                </Marquee>
            </div>
        )}

        {/* Row 3 - Left to Right */}
        {rows[2].length > 0 && (
            <div className="h-[30vh]">
                <Marquee gradient={false} speed={35} direction="right">
                    {rows[2].map((photo) => (
                        <div key={photo.id} className="mx-2 h-[28vh] w-auto aspect-[4/3] relative group">
                             <FramedImage 
                                src={photo.url} 
                                alt="Slide" 
                                frameStyle={frameStyle}
                                className="h-full w-full shadow-lg"
                                imageClassName="h-full w-full object-cover rounded-md"
                            />
                             {photo.mission && (
                                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs py-1 px-2 rounded text-center truncate">
                                    🎯 {photo.mission.text}
                                </div>
                            )}
                        </div>
                    ))}
                </Marquee>
            </div>
        )}
      </div>

      {/* Spotlight Overlay */}
      <AnimatePresence>
        {spotlightPhoto && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-10"
            >
                <motion.div
                    initial={{ scale: 0.5, y: 100 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.5, y: -100, opacity: 0 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="relative max-h-full max-w-full"
                >
                    <FramedImage 
                        src={spotlightPhoto.url} 
                        alt="Spotlight" 
                        frameStyle={frameStyle}
                        className="max-h-[80vh] w-auto shadow-[0_0_100px_rgba(255,255,255,0.2)]"
                        imageClassName="max-h-[80vh] w-auto object-contain rounded-xl"
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute -bottom-16 left-0 right-0 text-center"
                    >
                        <span className="inline-block bg-white text-black px-6 py-2 rounded-full font-bold text-xl shadow-lg">
                            {spotlightPhoto.mission ? `🎯 ${spotlightPhoto.mission.text}` : '✨ YENİ FOTOĞRAF!'}
                        </span>
                    </motion.div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
