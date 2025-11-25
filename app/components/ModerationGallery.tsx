'use client';

import { useState, useEffect } from 'react';
import { Check, X, CheckCircle, RefreshCw } from 'lucide-react';
import { approvePhotos, deletePhotos, getPendingPhotos } from '../lib/gallery-actions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Photo {
  id: string;
  url: string;
  type?: string;
}

export default function ModerationGallery({ photos: initialPhotos, eventSlug }: { photos: Photo[], eventSlug: string }) {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await getPendingPhotos(eventSlug);
      if (result.success) {
        // Only update if there are changes to avoid re-renders or losing selection
        // Simple check: if length is different or first ID is different
        // For a robust check, we could compare arrays, but this is usually enough for "new items"
        setPhotos(prev => {
            const isDifferent = JSON.stringify(prev) !== JSON.stringify(result.photos);
            return isDifferent ? result.photos as Photo[] : prev;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [eventSlug]);

  // Update local state when initialPhotos prop changes (e.g. from server revalidation)
  useEffect(() => {
    setPhotos(initialPhotos);
  }, [initialPhotos]);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const handleApprove = async (ids: string[]) => {
    setProcessing(true);
    const result = await approvePhotos(ids, eventSlug);
    if (result.success) {
      toast.success(result.message);
      // Optimistic update
      setPhotos(prev => prev.filter(p => !ids.includes(p.id)));
      setSelectedIds(new Set());
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setProcessing(false);
  };

  const handleReject = async (ids: string[]) => {
    if(!confirm('Seçilen fotoğrafları silmek istediğinize emin misiniz?')) return;
    setProcessing(true);
    const result = await deletePhotos(ids, eventSlug);
    if (result.success) {
      toast.success('Fotoğraflar reddedildi ve silindi.');
      // Optimistic update
      setPhotos(prev => prev.filter(p => !ids.includes(p.id)));
      setSelectedIds(new Set());
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setProcessing(false);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    const result = await getPendingPhotos(eventSlug);
    if (result.success) {
        setPhotos(result.photos as Photo[]);
        toast.success('Liste güncellendi');
    }
    setIsRefreshing(false);
  };

  if (photos.length === 0) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-xl p-8 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-green-900">Her şey yolunda!</h3>
        <p className="text-green-700 mb-4">Onay bekleyen yeni fotoğraf yok.</p>
        <button 
            onClick={handleManualRefresh}
            className="text-sm text-green-600 hover:text-green-800 flex items-center justify-center gap-1 mx-auto"
        >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            Kontrol Et
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm sticky top-4 z-10">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-gray-900">Onay Bekleyenler ({photos.length})</h2>
          {selectedIds.size > 0 && (
            <span className="text-sm text-blue-600 font-medium">{selectedIds.size} seçildi</span>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <button 
            onClick={handleManualRefresh}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mr-2"
            title="Yenile"
          >
            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          </button>

          {selectedIds.size > 0 ? (
            <>
              <button
                onClick={() => handleReject(Array.from(selectedIds))}
                disabled={processing}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                <X size={18} />
                <span className="hidden sm:inline">Reddet</span>
              </button>
              <button
                onClick={() => handleApprove(Array.from(selectedIds))}
                disabled={processing}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Check size={18} />
                <span className="hidden sm:inline">Onayla</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setSelectedIds(new Set(photos.map(p => p.id)))}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Tümünü Seç
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            className={`relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden cursor-pointer group border-2 transition-all animate-in zoom-in-50 duration-300 ${selectedIds.has(photo.id) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'}`}
            onClick={() => toggleSelection(photo.id)}
          >
            {photo.type === 'video' ? (
               <video src={photo.url} className="w-full h-full object-cover" muted />
            ) : (
               <img src={photo.url} alt="" className="w-full h-full object-cover" />
            )}
            
            <div className={`absolute inset-0 bg-black/20 transition-opacity ${selectedIds.has(photo.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
            
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <button
                 onClick={(e) => { e.stopPropagation(); handleReject([photo.id]); }}
                 className="p-1.5 bg-white text-red-600 rounded-full hover:bg-red-50 shadow-sm"
                 title="Reddet"
               >
                 <X size={16} />
               </button>
               <button
                 onClick={(e) => { e.stopPropagation(); handleApprove([photo.id]); }}
                 className="p-1.5 bg-white text-green-600 rounded-full hover:bg-green-50 shadow-sm"
                 title="Onayla"
               >
                 <Check size={16} />
               </button>
            </div>

            {selectedIds.has(photo.id) && (
              <div className="absolute top-2 left-2 bg-blue-500 text-white p-1 rounded-full shadow-sm">
                <Check size={12} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
