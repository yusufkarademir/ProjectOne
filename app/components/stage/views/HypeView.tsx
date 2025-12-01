'use client';

import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

interface HypeViewProps {
  config: any;
  eventSlug: string;
}

export default function HypeView({ config, eventSlug }: HypeViewProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!config.countdownTarget) return;

    const target = new Date(config.countdownTarget).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft('00:00');
        return;
      }

      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [config.countdownTarget]);

  const socialUrl = `${window.location.origin}/e/${eventSlug}/social`;

  return (
    <div className="relative w-full h-full flex items-center justify-center text-white overflow-hidden bg-black">
      {/* Pulse Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/50 via-black to-black animate-pulse-slow" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-16 md:gap-32 p-8">
        {/* Timer Section */}
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter tabular-nums bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 drop-shadow-2xl"
          >
            {timeLeft || '05:00'}
          </motion.div>
          <div className="text-3xl md:text-5xl font-bold text-indigo-400 uppercase tracking-widest mt-4">
            {isExpired ? 'BAŞLIYORUZ!' : 'BAŞLAMASINA KALAN'}
          </div>
        </div>

        {/* QR Section */}
        {config.showQr && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.3)] transform rotate-3"
          >
            <QRCodeSVG
              value={socialUrl}
              size={300}
              level="H"
              includeMargin={true}
              className="rounded-xl"
            />
            <div className="text-center mt-4">
              <p className="text-gray-900 font-bold text-xl">Fotoğraflarını Paylaş!</p>
              <p className="text-indigo-600 font-medium">QR Kodu Okut</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
