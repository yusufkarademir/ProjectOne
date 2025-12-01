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
    if (config?.musicEnabled && config?.musicType && config.musicType !== 'spotify' && audioRef.current) {
      // In a real app, these would be actual URLs
      const musicUrls: Record<string, string> = {
        lofi: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        upbeat: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        jazz: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        classical: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        pop: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
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
      className="fixed inset-0 z-[100] bg-black overflow-hidden"
    >
      {/* Audio Player (Hidden) */}
      <audio ref={audioRef} loop />
      
      {/* Spotify Embed (Visible for interaction) */}
      {config?.musicEnabled && config?.musicType === 'spotify' && config?.spotifyUrl && (
        <iframe 
          src={config.spotifyUrl.replace('open.spotify.com', 'open.spotify.com/embed')} 
          width="300" 
          height="80" 
          style={{ border: 0, overflow: 'hidden' }}
          scrolling="no"
          allow="encrypted-media; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="fixed bottom-4 right-4 z-[200] rounded-xl shadow-2xl border border-white/10 bg-black/50 backdrop-blur-md transition-all hover:scale-105"
        />
      )}

      {/* Autoplay Fallback Button */}
      {config?.musicEnabled && config.musicType !== 'spotify' && (
        <button
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.play();
              // Force re-render or just rely on the play action
            }
          }}
          className="fixed bottom-4 left-4 z-[200] bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-medium backdrop-blur-md transition-all opacity-50 hover:opacity-100"
        >
          🎵 Müziği Başlat
        </button>
      )}

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
