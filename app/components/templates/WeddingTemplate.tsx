'use client';

import { TemplateProps } from './types';
import Link from 'next/link';
import { Camera, Images, MapPin, Calendar, Clock, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WeddingTemplate({ event }: TemplateProps) {
  const schedule = (event.schedule as any[]) || [];
  
  return (
    <div className="min-h-screen bg-[#fdfbf7] font-serif text-[#4a4a4a] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-[#f4efe6] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#f9f4e8] rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-50 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative min-h-screen flex flex-col items-center justify-center p-6"
      >
        <div className="max-w-lg w-full bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e6dcc8] text-center relative">
            
            {/* Ornamental Border */}
            <div className="absolute inset-4 border border-[#d4af37] opacity-20 rounded-[1.5rem] pointer-events-none" />

            {/* Header */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mb-10"
            >
                <span className="text-[#d4af37] text-sm tracking-[0.2em] uppercase mb-4 block">Hoş Geldiniz</span>
                <h1 className="text-5xl md:text-6xl font-script text-[#2c2c2c] mb-6 leading-tight">
                    {event.name}
                </h1>
                
                <div className="flex flex-col items-center gap-2 text-[#8c8577] font-medium">
                    <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-[#d4af37]" />
                        <span>{new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    {event.location && (
                        <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-[#d4af37]" />
                            <span>{event.location}</span>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Description */}
            {event.description && (
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-[#6b6b6b] italic mb-10 leading-relaxed max-w-sm mx-auto"
                >
                    "{event.description}"
                </motion.p>
            )}

            {/* Actions */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col gap-4 mb-12"
            >
                {event.isGameEnabled && (
                    <Link
                        href={`/e/${event.slug}/game`}
                        className="bg-[#d4af37] text-white px-8 py-4 rounded-full font-medium tracking-wide hover:bg-[#c5a028] transition-all shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-3"
                    >
                        <Trophy size={20} />
                        Fotoğraf Avı'na Başla
                    </Link>
                )}
                <Link
                    href={`/e/${event.slug}/upload`}
                    className="bg-[#d4af37] text-white px-8 py-4 rounded-full font-medium tracking-wide hover:bg-[#c5a028] transition-all shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-3"
                >
                    <Camera size={20} />
                    Fotoğraf Paylaş
                </Link>
                <Link
                    href={`/e/${event.slug}/gallery`}
                    className="bg-transparent text-[#8c8577] border border-[#d4af37] px-8 py-4 rounded-full font-medium tracking-wide hover:bg-[#f9f4e8] transition-all flex items-center justify-center gap-3"
                >
                    <Images size={20} />
                    Galeriye Göz At
                </Link>
            </motion.div>

            {/* Simple Schedule */}
            {schedule.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="border-t border-[#e6dcc8] pt-8"
                >
                    <h3 className="text-[#d4af37] text-xs tracking-[0.2em] uppercase mb-6">Akış</h3>
                    <div className="space-y-4 text-left max-w-xs mx-auto">
                        {schedule.map((item: any, index: number) => (
                            <div key={index} className="flex gap-4 items-baseline">
                                <span className="text-[#d4af37] font-bold text-sm min-w-[3rem]">{item.time}</span>
                                <div>
                                    <span className="text-[#4a4a4a] font-medium block">{item.title}</span>
                                    {item.description && <span className="text-[#8c8577] text-xs">{item.description}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            <div className="mt-12 text-[#d4af37]/40 text-xs tracking-widest uppercase">
                EtkinlikQR
            </div>
        </div>
      </motion.div>
    </div>
  );
}
