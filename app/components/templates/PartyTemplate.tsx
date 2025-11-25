'use client';

import { TemplateProps } from './types';
import Link from 'next/link';
import { Camera, Images, MapPin, Calendar, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function PartyTemplate({ event }: TemplateProps) {
  const schedule = (event.schedule as any[]) || [];

  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#110022] font-sans text-white overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#2a0a4a,transparent_70%)]"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff00ff] rounded-full blur-[128px] opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00ffff] rounded-full blur-[128px] opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="text-center mb-12"
        >
            <span className="inline-block px-4 py-2 bg-[#ff00ff]/20 text-[#ff00ff] border border-[#ff00ff]/50 rounded-full text-sm font-bold tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(255,0,255,0.3)]">
                Let's Party!
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] via-white to-[#00ffff] drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">
                {event.name}
            </h1>
            
            <div className="flex flex-wrap justify-center gap-6 text-lg font-bold text-white/80">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                    <Calendar className="text-[#00ffff]" />
                    <span>{new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
                </div>
                {event.location && (
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                        <MapPin className="text-[#ff00ff]" />
                        <span>{event.location}</span>
                    </div>
                )}
            </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-16">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                    href={`/e/${event.slug}/upload`}
                    className="flex flex-col items-center justify-center gap-4 bg-[#ff00ff] text-white p-8 rounded-3xl font-black text-xl shadow-[0_0_30px_rgba(255,0,255,0.4)] hover:shadow-[0_0_50px_rgba(255,0,255,0.6)] transition-all border-4 border-white/20"
                >
                    <Camera size={48} />
                    FOTOĞRAF YÜKLE
                </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                    href={`/e/${event.slug}/gallery`}
                    className="flex flex-col items-center justify-center gap-4 bg-[#2a0a4a] text-[#00ffff] p-8 rounded-3xl font-black text-xl border-4 border-[#00ffff]/30 hover:bg-[#3d0f6b] hover:border-[#00ffff] transition-all"
                >
                    <Images size={48} />
                    GALERİ
                </Link>
            </motion.div>
        </div>

        {/* Schedule */}
        {schedule.length > 0 && (
            <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-md bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10"
            >
                <div className="flex items-center gap-3 mb-6">
                    <Music className="text-[#ff00ff]" />
                    <h3 className="text-xl font-bold text-white">LINE UP</h3>
                </div>
                <div className="space-y-4">
                    {schedule.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-4 group">
                            <span className="text-[#00ffff] font-mono font-bold text-lg group-hover:scale-110 transition-transform">{item.time}</span>
                            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                            <span className="text-white font-bold uppercase tracking-wide group-hover:text-[#ff00ff] transition-colors">{item.title}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        )}
      </div>
    </div>
  );
}
