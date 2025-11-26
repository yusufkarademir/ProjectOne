'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ChevronLeft, ChevronRight, Download, Grid, List, CheckSquare, Square, Trash2, Share2 } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { deletePhotos } from '../lib/gallery-actions';
import toast from 'react-hot-toast';
import FramedImage from './FramedImage';

interface Photo {
  id: string;
  url: string;
  type?: string;
  mimeType?: string | null;
  createdAt?: Date | string;
}

interface GalleryGridProps {
    photos: Photo[];
    eventSlug: string;
    canDelete?: boolean;
    frameStyle?: 'none' | 'polaroid' | 'gradient' | 'minimal' | 'corners' | 'cinema' | 'vintage' | 'gold' | 'neon' | 'floral';
    allowDownload?: boolean;
}

export default function GalleryGrid({ photos, eventSlug, canDelete = true, frameStyle = 'none', allowDownload = true, watermarkText }: GalleryGridProps & { watermarkText?: string | null }) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const showNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % photos.length);
    }
  };

  const showPrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
    }
  };

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === photos.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(photos.map(p => p.id)));
    }
  };

  const getProxyUrl = (url: string, filename?: string, download: boolean = false) => {
      const params = new URLSearchParams({ url });
      if (filename) params.append('filename', filename);
      if (download) params.append('download', 'true');
      return `/api/proxy-image?${params.toString()}`;
  };

  const handleDownload = async (photo: Photo, e?: React.MouseEvent) => {
      e?.stopPropagation();
      const filename = `photo-${photo.id}.jpg`;
      const proxyUrl = getProxyUrl(photo.url, filename, true);
      
      const link = document.createElement('a');
      link.href = proxyUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleBulkDownload = async () => {
    if (selectedIds.size === 0) return;
    
    setIsDownloading(true);
    try {
        const zip = new JSZip();
        const folder = zip.folder("fotograflar");
        
        const selectedPhotos = photos.filter(p => selectedIds.has(p.id));
        
        const promises = selectedPhotos.map(async (photo, index) => {
            try {
                const proxyUrl = getProxyUrl(photo.url);
                const response = await fetch(proxyUrl);
                if (!response.ok) throw new Error('Network response was not ok');
                const blob = await response.blob();
                const ext = photo.url.split('.').pop() || 'jpg';
                folder?.file(`foto-${index + 1}.${ext}`, blob);
            } catch (err) {
                console.error("Failed to download photo", photo.id, err);
            }
        });

        await Promise.all(promises);
        
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `${eventSlug}-fotograflar.zip`);
        
    } catch (error) {
        console.error("Zip creation failed", error);
        toast.error("İndirme sırasında bir hata oluştu.");
    } finally {
        setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
      if (selectedIds.size === 0) return;
      if (!confirm(`${selectedIds.size} fotoğrafı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return;

      const loadingToast = toast.loading('Siliniyor...');
      setIsDeleting(true);
      try {
          const result = await deletePhotos(Array.from(selectedIds), eventSlug);
          toast.dismiss(loadingToast);
          if (result.success) {
              toast.success(result.message || 'Fotoğraflar başarıyla silindi');
              setSelectedIds(new Set());
              router.refresh();
          } else {
              toast.error(result.message);
          }
      } catch (error) {
          toast.dismiss(loadingToast);
          toast.error("Silme işlemi başarısız oldu.");
      } finally {
          setIsDeleting(false);
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Toolbar */}
      <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-lg border border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4 transition-all">
        <div className="flex items-center gap-4 w-full sm:w-auto">
            {selectedIds.size > 0 ? (
                <div className="flex items-center gap-3 w-full bg-blue-50/80 text-blue-700 px-4 py-2.5 rounded-xl border border-blue-100 transition-all">
                    <button onClick={toggleSelectAll} className="flex items-center gap-2 font-semibold hover:text-blue-900 transition-colors">
                        <CheckSquare size={20} className="text-blue-600" />
                        {selectedIds.size} seçildi
                    </button>
                    <div className="h-5 w-px bg-blue-200 mx-1"></div>
                    
                    {allowDownload && (
                        <button 
                            onClick={handleBulkDownload} 
                            disabled={isDownloading}
                            className="flex items-center gap-2 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                            title="Seçilenleri İndir"
                        >
                            {isDownloading ? <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"/> : <Download size={18} />}
                            <span className="hidden sm:inline font-medium">İndir</span>
                        </button>
                    )}

                    {canDelete && (
                        <button 
                            onClick={handleDelete} 
                            disabled={isDeleting}
                            className="flex items-center gap-2 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ml-auto sm:ml-0"
                            title="Seçilenleri Sil"
                        >
                            {isDeleting ? <div className="animate-spin w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full"/> : <Trash2 size={18} />}
                            <span className="hidden sm:inline font-medium">Sil</span>
                        </button>
                    )}
                </div>
            ) : (
                <div className="flex items-center gap-3 text-gray-600 px-2">
                    <button onClick={toggleSelectAll} className="hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all" title="Tümünü Seç">
                        <Square size={20} />
                    </button>
                    <span className="font-medium text-gray-500">{photos.length} fotoğraf</span>
                </div>
            )}
        </div>

        <div className="flex items-center bg-gray-100/80 p-1.5 rounded-xl border border-gray-200/50">
            <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600 scale-105' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                title="Grid Görünümü"
            >
                <Grid size={20} />
            </button>
            <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600 scale-105' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                title="Liste Görünümü"
            >
                <List size={20} />
            </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {photos.map((photo, index) => (
            <div 
                key={photo.id} 
                className={`group relative aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${selectedIds.has(photo.id) ? 'ring-4 ring-blue-500 ring-offset-2' : ''}`}
                onClick={() => openLightbox(index)}
                onContextMenu={(e) => { if (!allowDownload) e.preventDefault(); }}
            >
                {photo.type === 'video' ? (
                    <video 
                        src={photo.url} 
                        className={`w-full h-full object-cover transition-transform duration-700 ${selectedIds.has(photo.id) ? 'scale-105' : 'group-hover:scale-110'}`}
                        muted
                        playsInline
                    />
                ) : (
                    <FramedImage 
                        src={photo.url} 
                        alt="Event photo" 
                        frameStyle={frameStyle}
                        watermarkText={watermarkText}
                        className={`w-full h-full transition-transform duration-700 ${selectedIds.has(photo.id) ? 'scale-105' : 'group-hover:scale-110'}`}
                        imageClassName="w-full h-full object-cover"
                    />
                )}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 ${selectedIds.has(photo.id) ? 'opacity-100' : 'group-hover:opacity-100'}`} />
                
                {/* Checkbox Overlay */}
                <div 
                    className={`absolute top-3 left-3 z-10 transition-all duration-300 ${selectedIds.has(photo.id) ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'}`}
                    onClick={(e) => toggleSelection(photo.id, e)}
                >
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors shadow-sm ${selectedIds.has(photo.id) ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white/90 border-gray-300 hover:border-blue-400'}`}>
                        {selectedIds.has(photo.id) && <CheckSquare size={14} />}
                    </div>
                </div>

                {/* Quick Actions Overlay */}
                 <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    {allowDownload && (
                        <button 
                            onClick={(e) => handleDownload(photo, e)}
                            className="p-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white hover:text-blue-600 shadow-lg transition-all"
                            title="İndir"
                        >
                            <Download size={16} />
                        </button>
                    )}
                </div>
            </div>
            ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {photos.map((photo, index) => (
                  <div 
                    key={photo.id} 
                    className={`flex items-center gap-6 p-4 border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors cursor-pointer group ${selectedIds.has(photo.id) ? 'bg-blue-50/80' : ''}`}
                    onClick={() => openLightbox(index)}
                    onContextMenu={(e) => { if (!allowDownload) e.preventDefault(); }}
                  >
                      <div onClick={(e) => toggleSelection(photo.id, e)} className="cursor-pointer pl-2">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${selectedIds.has(photo.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 group-hover:border-blue-400'}`}>
                            {selectedIds.has(photo.id) && <CheckSquare size={12} />}
                        </div>
                      </div>
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm border border-gray-100">
                          <FramedImage src={photo.url} alt="" frameStyle={frameStyle} watermarkText={watermarkText} className="w-full h-full" imageClassName="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900 truncate">Fotoğraf {index + 1}</p>
                          <p className="text-sm text-gray-500 mt-1">{photo.createdAt ? new Date(photo.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Tarih yok'}</p>
                      </div>
                      <div className="flex items-center gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {allowDownload && (
                            <button 
                                onClick={(e) => handleDownload(photo, e)}
                                className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                title="İndir"
                            >
                                <Download size={20} />
                            </button>
                        )}
                        {canDelete && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if(confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) {
                                        deletePhotos([photo.id], eventSlug).then(() => router.refresh());
                                    }
                                }}
                                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                title="Sil"
                            >
                                <Trash2 size={20} />
                            </button>
                        )}
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 transition-colors z-[70] bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm"
          >
            <X size={24} />
          </button>

          <button 
            onClick={showPrev}
            className="absolute left-6 text-white/70 hover:text-white p-3 hidden md:block z-[70] transition-all bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm hover:scale-110"
          >
            <ChevronLeft size={32} />
          </button>

          <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={closeLightbox}>
             {photos[selectedIndex].type === 'video' ? (
                 <video 
                    src={photos[selectedIndex].url} 
                    controls
                    className="max-h-[85vh] max-w-full object-contain shadow-2xl rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                    onContextMenu={(e) => { if (!allowDownload) e.preventDefault(); }}
                 />
             ) : (
                 <div 
                    onClick={(e) => e.stopPropagation()} 
                    className="max-h-[85vh] max-w-full flex items-center justify-center"
                    onContextMenu={(e) => { if (!allowDownload) e.preventDefault(); }}
                 >
                    <FramedImage 
                        src={photos[selectedIndex].url} 
                        alt="Full size" 
                        frameStyle={frameStyle}
                        watermarkText={watermarkText}
                        className="max-h-[85vh] w-auto shadow-2xl"
                        imageClassName="max-h-[85vh] w-auto object-contain rounded-lg"
                    />
                 </div>
             )}
             <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4" onClick={(e) => e.stopPropagation()}>
                {allowDownload && (
                    <button 
                        onClick={(e) => handleDownload(photos[selectedIndex], e)}
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-medium hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <Download size={20} />
                        <span>İndir</span>
                    </button>
                )}
                <button 
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-medium hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: 'Etkinlik Fotoğrafı',
                                url: photos[selectedIndex].url
                            });
                        } else {
                            navigator.clipboard.writeText(photos[selectedIndex].url);
                            alert('Link kopyalandı!');
                        }
                    }}
                >
                    <Share2 size={20} />
                    <span>Paylaş</span>
                </button>
             </div>
             <div className="absolute top-6 left-6 text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                {selectedIndex + 1} / {photos.length}
             </div>
          </div>

          <button 
            onClick={showNext}
            className="absolute right-6 text-white/70 hover:text-white p-3 hidden md:block z-[70] transition-all bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm hover:scale-110"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
}
