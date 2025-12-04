'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Image as ImageIcon, Heart, Zap, Music, Smartphone, Monitor } from 'lucide-react';

const HeroAnimation = () => {
  const [photos, setPhotos] = useState<number[]>([]);

  // Simulate incoming photos
  useEffect(() => {
    const interval = setInterval(() => {
      setPhotos(prev => {
        const newPhotos = [...prev, Date.now()];
        if (newPhotos.length > 6) return newPhotos.slice(1);
        return newPhotos;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20 flex items-center justify-center group hover:shadow-indigo-500/40 transition-shadow duration-500">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] animate-pulse delay-1000" />

      <div className="relative z-10 w-full h-full flex items-center justify-between px-4 md:px-12 lg:px-20">
        
        {/* LEFT: THE SOURCE (QR Code) */}
        <div className="relative">
            {/* Floating Phone/QR Container */}
            <motion.div 
                animate={{ y: [-15, 15, -15] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="relative z-20"
            >
                <div className="w-28 h-56 md:w-40 md:h-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] flex flex-col items-center justify-center p-6 shadow-2xl relative overflow-hidden group-hover:border-indigo-500/50 transition-colors">
                    {/* Scan Line */}
                    <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="absolute left-0 w-full h-1 bg-indigo-400 shadow-[0_0_20px_rgba(99,102,241,1)] z-30 opacity-50"
                    />
                    
                    <div className="bg-white p-3 rounded-2xl mb-6 shadow-lg">
                        <QrCode className="text-slate-900 w-16 h-16 md:w-20 md:h-20" />
                    </div>
                    <div className="space-y-3 w-full opacity-50">
                        <div className="h-2 bg-white/20 rounded-full w-3/4 mx-auto" />
                        <div className="h-2 bg-white/20 rounded-full w-1/2 mx-auto" />
                    </div>

                    {/* Emitter Effect */}
                    <div className="absolute inset-0 bg-indigo-500/10 animate-pulse" />
                </div>
            </motion.div>

            {/* Floor Reflection */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-40 h-10 bg-indigo-500/30 blur-2xl rounded-full" />
        </div>

        {/* MIDDLE: THE STREAM (Particles) */}
        <div className="flex-1 h-full relative overflow-visible pointer-events-none mx-2 md:mx-8">
            <AnimatePresence>
                {photos.map((id, index) => (
                    <motion.div
                        key={id}
                        initial={{ x: '-100%', opacity: 0, scale: 0.5, rotate: -10 }}
                        animate={{ 
                            x: '120%', 
                            opacity: [0, 1, 1, 0],
                            scale: [0.5, 1.2, 1.2, 0.8],
                            rotate: [0, 10, -5, 0]
                        }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                        className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center"
                        style={{ left: 0 }}
                    >
                        <div className={`
                            w-20 h-16 md:w-32 md:h-24 rounded-xl shadow-lg border border-white/20 backdrop-blur-md flex items-center justify-center
                            ${index % 2 === 0 ? 'bg-indigo-500/60' : 'bg-purple-500/60'}
                        `}>
                            <ImageIcon className="text-white w-8 h-8 md:w-10 md:h-10" />
                        </div>
                        {/* Trail Effect */}
                        <motion.div 
                            initial={{ opacity: 0.8, scale: 1 }}
                            animate={{ opacity: 0, scale: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute -right-6 w-3 h-3 bg-white rounded-full blur-md"
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
            
            {/* Connection Path Line (Dotted) */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-white/5 -translate-y-1/2" />
        </div>

        {/* RIGHT: THE DESTINATION (Live Wall) */}
        <div className="relative perspective-1000">
            <motion.div 
                animate={{ rotateY: [-8, 8, -8], rotateX: [3, -3, 3] }}
                transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                className="relative z-20 transform-style-3d"
            >
                <div className="w-56 h-40 md:w-96 md:h-64 bg-slate-800/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 shadow-2xl grid grid-cols-3 gap-2 overflow-hidden group-hover:border-purple-500/50 transition-colors">
                    {/* Grid Content */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.2, duration: 0.5 }}
                            className="bg-white/5 rounded-lg border border-white/5 relative overflow-hidden group"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${
                                i % 2 === 0 ? 'from-indigo-500/30' : 'from-purple-500/30'
                            } to-transparent opacity-60 group-hover:opacity-100 transition-opacity`} />
                        </motion.div>
                    ))}
                    
                    {/* Floating Emojis */}
                    <div className="absolute inset-0 pointer-events-none">
                        <motion.div 
                            animate={{ y: [120, -120], opacity: [0, 1, 0], scale: [0.5, 1.5, 1] }}
                            transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                            className="absolute bottom-0 right-12 text-4xl drop-shadow-lg"
                        >
                            ❤️
                        </motion.div>
                        <motion.div 
                            animate={{ y: [120, -120], opacity: [0, 1, 0], scale: [0.5, 1.5, 1] }}
                            transition={{ repeat: Infinity, duration: 4, delay: 1.5 }}
                            className="absolute bottom-0 left-12 text-4xl drop-shadow-lg"
                        >
                            🔥
                        </motion.div>
                    </div>

                    {/* Live Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,1)]" />
                        <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider">Canlı Yayın</span>
                    </div>
                </div>
            </motion.div>

            {/* Glow Behind Screen */}
            <div className="absolute inset-0 bg-purple-500/20 blur-3xl -z-10 transform translate-z-[-40px]" />
        </div>

      </div>
    </div>
  );
};

export default HeroAnimation;
