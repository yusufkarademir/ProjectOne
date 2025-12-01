'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoungeViewProps {
  config: any;
  eventName: string;
}

export default function LoungeView({ config, eventName }: LoungeViewProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-slate-900">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-spin-slow bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-3xl" />
          <div className="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] animate-spin-slow-reverse bg-gradient-to-r from-transparent via-purple-500/20 to-transparent blur-3xl" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-12"
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white drop-shadow-lg">
            {eventName}
          </h1>
        </motion.div>

        {config.message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mb-16"
          >
            <p className="text-2xl md:text-4xl font-light tracking-wide text-blue-100/90 leading-relaxed">
              {config.message}
            </p>
          </motion.div>
        )}

        {config.showClock && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="text-7xl md:text-9xl font-mono font-bold text-white/90 tracking-widest tabular-nums">
              {time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xl text-white/50 font-light uppercase tracking-[0.5em]">
              {time.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
