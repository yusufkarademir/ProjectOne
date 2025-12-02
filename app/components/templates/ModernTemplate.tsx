'use client';

import { TemplateProps } from './types';
import Link from 'next/link';
import { Camera, Images, MapPin, Calendar, Megaphone, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ModernTemplate({ event }: TemplateProps) {
  const schedule = (event.schedule as any[]) || [];
  const announcements = (event.announcements as any[]) || [];
  
  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative pt-12 pb-20 px-4"
      >
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden text-center relative z-10 border border-white/50">
          
          {/* Cover Image */}
          {event.coverImage && (
            <div className="w-full h-48 relative">
              <img 
                src={event.coverImage} 
                alt={event.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          )}

          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 bg-blue-50 text-blue-600">
                Hoş Geldiniz
              </span>
              <h1 className="text-4xl font-bold mb-2 tracking-tight text-gray-900">
                {event.name}
              </h1>
              <p className="font-medium flex items-center justify-center gap-2 text-gray-500">
                <Calendar size={16} />
                {new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              </p>
              {event.location && (
                  <p className="font-medium flex items-center justify-center gap-2 mt-1 text-gray-500">
                      <MapPin size={16} />
                      {event.location}
                  </p>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <div className="mb-8 text-sm leading-relaxed text-gray-500">
                  {event.description}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4 mb-8">
              {event.isGameEnabled && (
                <Link
                  href={`/e/${event.slug}/game`}
                  className="group flex items-center justify-center gap-3 w-full font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg bg-green-600 text-white hover:bg-green-700"
                >
                  <Trophy className="w-6 h-6" />
                  <span>Fotoğraf Avı'na Başla!</span>
                </Link>
              )}

              {/* Social Wall Button */}
              {((event.socialSettings as any)?.enabled) && (
                <Link
                  href={`/e/${event.slug}/social?from=landing`}
                  className="group flex items-center justify-center gap-3 w-full font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600"
                >
                  <Megaphone className="w-6 h-6" />
                  <span>Sosyal Duvar'a Katıl</span>
                </Link>
              )}

              <Link
                href={`/e/${event.slug}/upload`}
                className="group flex items-center justify-center gap-3 w-full font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                <Camera className="w-6 h-6" />
                <span>Fotoğraf Yükle</span>
              </Link>

              <Link
                href={`/e/${event.slug}/gallery`}
                className="group flex items-center justify-center gap-3 w-full font-semibold py-4 px-6 rounded-xl border transition-all transform hover:scale-[1.02] active:scale-[0.98] bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              >
                <Images className="w-6 h-6" />
                <span>Galeriye Git</span>
              </Link>
            </div>

            {/* Announcements */}
            {announcements.length > 0 && (
              <div className="mb-8 text-left">
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-gray-500">Duyurular</h3>
                  <div className="space-y-3">
                      {announcements.map((ann: any) => (
                          <div key={ann.id} className="p-4 rounded-xl border bg-white border-gray-100">
                              <div className="flex items-start gap-3">
                                  <Megaphone className="w-5 h-5 mt-0.5 text-gray-900" />
                                  <div>
                                      <h4 className="font-medium text-sm text-gray-900">{ann.title}</h4>
                                      <p className="text-xs mt-1 text-gray-500">{ann.content}</p>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
            )}

            {/* Schedule */}
            {schedule.length > 0 && (
              <div className="text-left">
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-gray-500">Etkinlik Programı</h3>
                  <div className="rounded-xl border divide-y bg-white border-gray-100 divide-gray-200/50">
                      {schedule.map((item: any, index: number) => (
                          <div key={index} className="p-4 flex gap-4">
                              <div className="font-mono font-medium text-gray-900">
                                  {item.time}
                              </div>
                              <div>
                                  <h4 className="font-medium text-sm text-gray-900">{item.title}</h4>
                                  {item.description && (
                                      <p className="text-xs mt-0.5 text-gray-500">{item.description}</p>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
            )}

            <div className="mt-12 pt-6 border-t border-gray-200/10">
              <p className="text-xs font-medium text-gray-500">
                Powered by <span className="font-bold">EtkinlikQR</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
