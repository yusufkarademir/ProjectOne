'use client';

import { TemplateProps } from './types';
import Link from 'next/link';
import { Camera, Images, MapPin, Calendar, Clock, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CorporateTemplate({ event }: TemplateProps) {
  const schedule = (event.schedule as any[]) || [];
  const announcements = (event.announcements as any[]) || [];

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* Header / Hero */}
      <div className="bg-gray-900 text-white pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <motion.span 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-block px-3 py-1 bg-blue-600 text-xs font-bold tracking-wider uppercase rounded mb-4"
                    >
                        Etkinlik
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
                    >
                        {event.name}
                    </motion.h1>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-6 text-gray-400 text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        {event.location && (
                            <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                <span>{event.location}</span>
                            </div>
                        )}
                    </motion.div>
                </div>
                
                {/* Quick Actions */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-3"
                >
                    {event.isGameEnabled && (
                        <Link
                            href={`/e/${event.slug}/game`}
                            className="bg-green-600 text-white border border-green-500 px-5 py-2.5 rounded font-semibold hover:bg-green-500 transition-colors flex items-center gap-2 text-sm"
                        >
                            <Trophy size={16} />
                            Fotoğraf Avı
                        </Link>
                    )}
                    <Link
                        href={`/e/${event.slug}/upload`}
                        className="bg-white text-gray-900 px-5 py-2.5 rounded font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
                    >
                        <Camera size={16} />
                        Fotoğraf Yükle
                    </Link>
                    <Link
                        href={`/e/${event.slug}/gallery`}
                        className="bg-gray-800 text-white border border-gray-700 px-5 py-2.5 rounded font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
                    >
                        <Images size={16} />
                        Galeri
                    </Link>
                </motion.div>
            </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
                {/* Description Card */}
                {event.description && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                    >
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Hakkında</h3>
                        <p className="text-gray-600 leading-relaxed">
                            {event.description}
                        </p>
                    </motion.div>
                )}

                {/* Schedule */}
                {schedule.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                    >
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Program Akışı</h3>
                        <div className="space-y-6 relative before:absolute before:left-[5.5rem] before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                            {schedule.map((item: any, index: number) => (
                                <div key={index} className="flex gap-6 relative">
                                    <div className="w-16 text-right font-mono text-sm font-semibold text-blue-600 pt-0.5">
                                        {item.time}
                                    </div>
                                    <div className="flex-1 pt-0.5">
                                        <div className="absolute left-[5.25rem] top-1.5 w-2 h-2 rounded-full bg-blue-600 ring-4 ring-white"></div>
                                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                        {item.description && (
                                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Announcements */}
                {announcements.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-blue-50 p-6 rounded-lg border border-blue-100"
                    >
                        <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-4">Duyurular</h3>
                        <div className="space-y-4">
                            {announcements.map((ann: any) => (
                                <div key={ann.id} className="bg-white p-4 rounded border border-blue-100 shadow-sm">
                                    <h4 className="font-semibold text-blue-900 text-sm mb-1">{ann.title}</h4>
                                    <p className="text-xs text-blue-700/80">{ann.content}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Cover Image Widget */}
                {event.coverImage && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white p-2 rounded-lg shadow-sm border border-gray-200"
                    >
                        <img src={event.coverImage} alt="Cover" className="w-full h-auto rounded" />
                    </motion.div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
