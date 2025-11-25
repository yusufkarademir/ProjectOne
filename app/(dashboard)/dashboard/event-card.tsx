'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ImageIcon, QrCode, Edit, Trash2, Copy, Download } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
          <Trash2 className="text-red-600" size={32} />
        </div>
        <h3 className="text-xl font-bold text-center mb-2">Etkinliği Sil</h3>
        <p className="text-gray-600 text-center mb-6">
          Bu etkinliği ve ona bağlı <strong>tüm fotoğrafları</strong> kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
        </p>
        <p className="text-sm text-gray-500 text-center mb-6 bg-gray-50 p-3 rounded-lg">
          <strong>{eventName}</strong>
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
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

  const handleDuplicate = async () => {
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

  const handleCopyLink = () => {
    const link = `${window.location.origin}/e/${event.slug}`;
    navigator.clipboard.writeText(link);
    toast.success('Link kopyalandı!');
  };

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('tr-TR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={16} />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <ImageIcon size={16} />
                {event._count.photos} Fotoğraf
              </span>
            </div>
          </div>

          {/* URL */}
          <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1 font-medium">Paylaşılabilir Yükleme Linki:</p>
            <div className="flex items-center gap-2">

              <code className="flex-1 text-xs text-gray-700 truncate">
                {origin ? `${origin}/e/${event.slug}` : `/e/${event.slug}`}
              </code>
              <button
                onClick={handleCopyLink}
                className="text-gray-600 hover:text-blue-600 transition-colors"
                title="Kopyala"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex items-center justify-center bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <div className="text-center">
              <QrCode size={120} className="text-gray-900 mx-auto mb-3" />
              <div className="grid grid-cols-3 gap-2">
                <Link
                  href={`/e/${event.slug}`}
                  target="_blank"
                  className="flex items-center justify-center gap-1 bg-blue-600 text-white text-xs px-3 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Sayfa
                </Link>
                <Link
                  href={`/events/${event.id}/gallery`}
                  className="flex items-center justify-center gap-1 bg-green-600 text-white text-xs px-3 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Galeri
                </Link>
                <button className="flex items-center justify-center gap-1 bg-gray-800 text-white text-xs px-3 py-2 rounded hover:bg-gray-900 transition-colors">
                  <Download size={14} />
                  QR İndir
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href={`/events/${event.id}`}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium border border-gray-200"
            >
              <Edit size={16} />
              Yönet
            </Link>
            <button
              onClick={handleDuplicate}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium border border-gray-200"
            >
              <Copy size={16} />
              Kopyala
            </button>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium border border-red-200"
            >
              <Trash2 size={16} />
              Sil
            </button>
          </div>
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
