'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import LoungeView from './views/LoungeView';
import HypeView from './views/HypeView';
import CinemaView from './views/CinemaView';

interface StageDisplayProps {
  config: any;
  event: any;
}

export default function StageDisplay({ config, event }: StageDisplayProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle Music
  useEffect(() => {
    if (config?.musicEnabled && config?.musicType && audioRef.current) {
      // In a real app, these would be actual URLs
      const musicUrls: Record<string, string> = {
        lofi: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', // Placeholder Lofi
        upbeat: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_106f780856.mp3', // Placeholder Upbeat
      };

      const url = musicUrls[config.musicType];
      if (url) {
        audioRef.current.src = url;
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(e => console.log('Audio autoplay failed:', e));
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [config?.musicEnabled, config?.musicType]);

  if (!config?.isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-black"
    >
      {/* Audio Player (Hidden) */}
      <audio ref={audioRef} loop />

      {/* View Switcher */}
      <div className="w-full h-full">
        {config.mode === 'lounge' && (
          <LoungeView config={config} eventName={event.name} />
        )}
        {config.mode === 'hype' && (
          <HypeView config={config} eventSlug={event.slug} />
        )}
        {config.mode === 'cinema' && (
          <CinemaView config={config} />
        )}
      </div>
    </motion.div>
  );
}
