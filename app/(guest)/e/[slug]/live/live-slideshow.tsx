'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLatestPhotos } from '@/app/lib/event-actions';
import { QRCodeSVG } from 'qrcode.react';
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
  const [photos, setPhotos] = useState<any[]>(initialPhotos);
  const [currentIndex, setCurrentIndex] = useState(0);
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
        // Add new photos to the beginning of the array
        setPhotos(prev => [...result.photos, ...prev]);
        setLastFetch(new Date().toISOString());
        // Optional: Jump to the newest photo immediately
        setCurrentIndex(0);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [slug, lastFetch]);

  // Slideshow timer
  useEffect(() => {
    if (photos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % photos.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [photos.length]);

  const currentPhoto = photos[currentIndex];

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

  if (!currentPhoto) {
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
    <div className={`fixed inset-0 overflow-hidden ${styles.bg}`}>
      {/* Background Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 blur-3xl scale-110 transition-all duration-1000"
        style={{ backgroundImage: `url(${currentPhoto.url})` }}
      />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        
        {/* Header */}
        <div className="p-8 flex justify-between items-start">
            <div>
                <h1 className={`text-4xl font-bold ${styles.text} drop-shadow-lg`}>{eventName}</h1>
                <p className={`text-xl opacity-80 ${styles.text} mt-2`}>#CanlıAkış</p>
            </div>
            <div className="bg-white/90 p-3 rounded-xl shadow-2xl backdrop-blur-sm">
                {origin && <QRCodeSVG value={`${origin}/e/${slug}`} size={120} />}
                <p className="text-center text-xs font-bold mt-2 text-black">Fotoğraf Yükle</p>
            </div>
        </div>

        {/* Slideshow */}
        <div className="flex-1 flex items-center justify-center p-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPhoto.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.8 }}
                    className="relative max-h-full max-w-full"
                >
                    <FramedImage 
                        src={currentPhoto.url} 
                        alt="Live slide" 
                        frameStyle={frameStyle}
                        className="max-h-[80vh] w-auto shadow-[0_0_50px_rgba(0,0,0,0.3)]"
                        imageClassName="max-h-[80vh] w-auto object-contain rounded-lg"
                    />
                    
                    {/* "New" Badge */}
                    {new Date(currentPhoto.createdAt).getTime() > Date.now() - 60000 && (
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-pulse z-20"
                        >
                            YENİ!
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 text-center">
            <p className={`text-sm opacity-60 ${styles.text}`}>
                EtkinlikQR ile anılarınızı paylaşın
            </p>
        </div>
      </div>
    </div>
  );
}
