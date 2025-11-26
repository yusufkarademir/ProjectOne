'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ImageIcon, QrCode, Edit, Trash2, Copy, Download, ExternalLink, MoreVertical, Play, Eye } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { deleteEvent, duplicateEvent } from '../../lib/event-actions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Event {
  id: string;
  name: string;
  slug: string;
  date: Date | string;
  _count: {
    photos: number;
  };
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventName: string;
}

function DeleteModal({ isOpen, onClose, onConfirm, eventName }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl scale-100 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
          <Trash2 className="text-red-600" size={32} />
        </div>
        <h3 className="text-xl font-bold text-center mb-2">Etkinliği Sil</h3>
        <p className="text-gray-600 text-center mb-6">
          Bu etkinliği ve ona bağlı <strong>tüm fotoğrafları</strong> kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
        </p>
        <p className="text-sm text-gray-500 text-center mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <strong>{eventName}</strong>
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-lg shadow-red-200"
          >
            Evet, Sil
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventCard({ event }: { event: Event }) {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteEvent(event.id);
    
    if (result.success) {
      toast.success(result.message);
      setDeleteModalOpen(false);
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setIsDeleting(false);
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const loadingToast = toast.loading('Etkinlik kopyalanıyor...');
    const result = await duplicateEvent(event.id);
    toast.dismiss(loadingToast);
    
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const eventLink = origin ? `${origin}/e/${event.slug}` : '';

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (eventLink) {
        navigator.clipboard.writeText(eventLink);
        toast.success('Link kopyalandı!');
    }
  };

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('tr-TR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const isPast = eventDate < new Date();

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative h-full flex flex-col group">
            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md ${
                    isPast 
                    ? 'bg-gray-100/90 text-gray-600 border border-gray-200' 
                    : 'bg-green-100/90 text-green-700 border border-green-200'
                }`}>
                    {isPast ? 'Tamamlandı' : 'Aktif'}
                </span>
            </div>

            {/* Card Header / QR Code Area */}
            <div className="h-48 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden group-hover:from-blue-50 group-hover:to-indigo-50 transition-colors flex items-center justify-center p-6">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 transform group-hover:scale-105 transition-transform duration-300">
                    {origin && (
                        <QRCodeSVG 
                            value={eventLink} 
                            size={120}
                            level="M"
                            className="opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                    )}
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white/80 to-transparent">
                     <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">{event.name}</h3>
                     <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Calendar size={12} />
                        {formattedDate}
                     </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Link Display */}
                <div className="mb-4 p-2 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-2 group/link">
                    <div className="flex-1 text-xs text-gray-500 truncate font-mono">
                        {eventLink || 'Yükleniyor...'}
                    </div>
                    <button 
                        onClick={handleCopyLink}
                        className="p-1.5 hover:bg-white rounded-md text-gray-400 hover:text-blue-600 transition-colors shadow-sm opacity-0 group-hover/link:opacity-100"
                        title="Kopyala"
                    >
                        <Copy size={14} />
                    </button>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                        <ImageIcon size={16} />
                        {event._count.photos} Fotoğraf
                    </div>
                </div>

                {/* Main Action Button */}
                <div className="mt-auto">
                    <Link 
                        href={`/events/${event.id}`}
                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-gray-200 hover:shadow-blue-200"
                    >
                        <Edit size={18} />
                        <span>Etkinliği Yönet</span>
                    </Link>
                </div>
            </div>

            {/* Quick Actions Toolbar */}
            <div className="bg-gray-50 p-2 border-t border-gray-100 flex items-center justify-between gap-1">
                <Link 
                    href={`/e/${event.slug}`}
                    target="_blank"
                    className="flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-xs font-medium text-gray-600 hover:text-blue-600"
                    title="Misafir Sayfası"
                >
                    <ExternalLink size={16} />
                    <span>Sayfa</span>
                </Link>
                
                <Link 
                    href={`/events/${event.id}/gallery`}
                    className="flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-xs font-medium text-gray-600 hover:text-green-600"
                    title="Galeri Yönetimi"
                >
                    <ImageIcon size={16} />
                    <span>Galeri</span>
                </Link>

                <Link 
                    href={`/e/${event.slug}/live`}
                    target="_blank"
                    className="flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-xs font-medium text-gray-600 hover:text-purple-600"
                    title="Canlı Vitrin"
                >
                    <Play size={16} />
                    <span>Live</span>
                </Link>

                <div className="w-px h-8 bg-gray-200 mx-1"></div>

                <button
                    onClick={handleDuplicate}
                    className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-500 hover:text-gray-900"
                    title="Kopyala"
                >
                    <MoreVertical size={16} />
                </button>
                
                <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="p-2 rounded-lg hover:bg-red-50 hover:shadow-sm transition-all text-gray-400 hover:text-red-600"
                    title="Sil"
                >
                    <Trash2 size={16} />
                </button>
            </div>
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        eventName={event.name}
      />
    </>
  );
}
