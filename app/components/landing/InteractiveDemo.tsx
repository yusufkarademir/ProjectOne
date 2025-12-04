'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Check, Heart, Send, Smartphone, Monitor } from 'lucide-react';
import Image from 'next/image';

const InteractiveDemo = () => {
  const [step, setStep] = useState<'scan' | 'uploading' | 'live'>('scan');
  const [activeImage, setActiveImage] = useState(0);

  const images = [
    '/tr_wedding.png',
    '/tr_kina.png',
    '/tr_cocktail.png'
  ];

  const handleSnap = () => {
    setStep('uploading');
    setTimeout(() => {
      setStep('live');
      setTimeout(() => {
        setStep('scan');
        setActiveImage((prev) => (prev + 1) % images.length);
      }, 4000);
    }, 1500);
  };

  return (
    <div className="relative w-full aspect-[16/9] flex items-center justify-center bg-slate-50 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl shadow-indigo-200">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 flex items-center gap-4 md:gap-8 lg:gap-12 scale-[0.35] md:scale-60 lg:scale-[0.75] transition-transform origin-center">
        
        {/* PHONE MOCKUP */}
        <div className="relative">
            <motion.div 
                animate={step === 'scan' ? { scale: 1.05, y: -10 } : { scale: 1, y: 0 }}
                className="w-[280px] h-[560px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden relative z-20"
            >
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-30" />

                {/* Screen Content */}
                <div className="w-full h-full bg-white flex flex-col relative">
                    {/* Header */}
                    <div className="h-16 bg-indigo-600 flex items-center justify-center pt-6">
                        <span className="text-white font-bold text-sm">EtkinlikQR</span>
                    </div>

                    {/* Camera View / Preview */}
                    <div className="flex-1 bg-gray-100 relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {step === 'scan' ? (
                                <motion.div 
                                    key="camera"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center"
                                >
                                    <div className="w-full h-full absolute inset-0 bg-black/5">
                                        <Image 
                                            src={images[activeImage]} 
                                            alt="Camera Preview" 
                                            fill 
                                            className="object-cover opacity-50 blur-sm"
                                        />
                                    </div>
                                    <div className="w-16 h-16 border-2 border-white/50 rounded-lg flex items-center justify-center mb-4 relative z-10">
                                        <Camera className="text-white" size={32} />
                                    </div>
                                    <p className="text-white font-medium relative z-10 shadow-black drop-shadow-md">Fotoğraf Çek</p>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="preview"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0"
                                >
                                    <Image 
                                        src={images[activeImage]} 
                                        alt="Captured" 
                                        fill 
                                        className="object-cover"
                                    />
                                    {step === 'uploading' && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                            <div className="text-center">
                                                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-2 mx-auto" />
                                                <p className="text-white font-bold">Yükleniyor...</p>
                                            </div>
                                        </div>
                                    )}
                                    {step === 'live' && (
                                        <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center backdrop-blur-sm">
                                            <div className="text-center text-white">
                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-500 mx-auto mb-2 shadow-lg">
                                                    <Check size={32} strokeWidth={4} />
                                                </div>
                                                <p className="font-bold text-lg">Yayında!</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Controls */}
                    <div className="h-24 bg-white border-t border-gray-100 flex items-center justify-center p-4">
                        <button 
                            onClick={handleSnap}
                            disabled={step !== 'scan'}
                            className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all ${
                                step === 'scan' 
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600 hover:scale-110 active:scale-95' 
                                    : 'border-gray-200 bg-gray-100 text-gray-400'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-full ${step === 'scan' ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Connection Line (Mobile to Desktop) */}
            <svg className="absolute top-1/2 left-full w-24 h-12 -translate-y-1/2 z-0 hidden md:block overflow-visible">
                <path 
                    d="M0,24 C40,24 40,24 96,24" 
                    fill="none" 
                    stroke="#E2E8F0" 
                    strokeWidth="4" 
                    strokeDasharray="8 8"
                />
                {step === 'uploading' && (
                    <motion.circle 
                        r="6" 
                        fill="#6366f1"
                        initial={{ offsetDistance: "0%" }}
                        animate={{ offsetDistance: "100%" }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        style={{ offsetPath: "path('M0,24 C40,24 40,24 96,24')" }}
                    />
                )}
            </svg>
        </div>

        {/* DESKTOP MOCKUP */}
        <div className="relative hidden md:block">
            <div className="w-[500px] h-[350px] bg-gray-900 rounded-xl border-[12px] border-gray-800 shadow-2xl overflow-hidden relative z-10">
                {/* Screen Content */}
                <div className="w-full h-full bg-slate-900 p-4 relative">
                    {/* Header */}
                    <div className="absolute top-4 left-4 text-white/50 text-xs font-mono">LIVE WALL • #WEDDING</div>
                    
                    {/* Grid */}
                    <div className="grid grid-cols-3 gap-3 h-full pt-8">
                        {/* Existing Photos */}
                        <div className="col-span-2 row-span-2 relative rounded-lg overflow-hidden bg-slate-800">
                             <AnimatePresence mode="popLayout">
                                {step === 'live' && (
                                    <motion.div
                                        key="new-photo"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", bounce: 0.5 }}
                                        className="absolute inset-0 z-20"
                                    >
                                        <Image 
                                            src={images[activeImage]} 
                                            alt="Live" 
                                            fill 
                                            className="object-cover"
                                        />
                                        {/* Reaction Burst */}
                                        <motion.div 
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1.5, opacity: 0, y: -50 }}
                                            transition={{ delay: 0.2, duration: 1 }}
                                            className="absolute bottom-4 right-4 text-4xl"
                                        >
                                            ❤️
                                        </motion.div>
                                    </motion.div>
                                )}
                             </AnimatePresence>
                             <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-700">
                                <Monitor size={48} />
                             </div>
                        </div>
                        <div className="bg-slate-800 rounded-lg animate-pulse opacity-50"></div>
                        <div className="bg-slate-800 rounded-lg opacity-30"></div>
                        <div className="col-span-3 bg-slate-800/50 rounded-lg flex items-center justify-center text-slate-500 text-sm">
                            Scan QR to Join
                        </div>
                    </div>
                </div>
            </div>
            {/* Stand */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-24 h-12 bg-gray-800 rounded-b-lg shadow-lg" />
            <div className="absolute top-[calc(100%+48px)] left-1/2 -translate-x-1/2 w-48 h-4 bg-gray-800 rounded-full shadow-xl opacity-50 blur-sm" />
        </div>

      </div>

      {/* Manual Trigger Overlay (if idle) */}
      {step === 'scan' && (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-indigo-100 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform z-40"
            onClick={handleSnap}
        >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-indigo-900 font-bold text-sm">Demo: Fotoğraf Çek</span>
        </motion.div>
      )}
    </div>
  );
};

export default InteractiveDemo;
