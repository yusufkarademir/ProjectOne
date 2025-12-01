'use client';

import { useState, useEffect } from 'react';
import { getPendingItems, approveComment, rejectComment, approvePhoto, rejectPhoto } from '@/app/lib/social-actions';

interface PendingQueueProps {
  eventId?: string;
  type?: 'all' | 'photo' | 'comment'; // Filter for specific types
}

export default function PendingQueue({ eventId, type = 'all' }: PendingQueueProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchItems = async () => {
    if (!eventId) return;
    // Silent update
    const result = await getPendingItems(eventId);
    if (result.success) {
      // Deduplicate items by ID
      const uniqueItems = Array.from(new Map(result.items.map((item: any) => [item.data.id, item])).values());
      // Filter based on type prop
      const filteredItems = type === 'all' 
        ? uniqueItems 
        : uniqueItems.filter((item: any) => item.type === type);
      
      setItems(filteredItems);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
    const interval = setInterval(fetchItems, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [eventId, type]);

  const handleAction = async (item: any, action: 'approve' | 'reject') => {
    setProcessingId(item.data.id);
    
    if (item.type === 'comment') {
        if (action === 'approve') await approveComment(item.data.id);
        else await rejectComment(item.data.id);
    } else if (item.type === 'photo') {
        if (action === 'approve') await approvePhoto(item.data.id);
        else await rejectPhoto(item.data.id);
    }

    // Optimistic update
    setItems(prev => prev.filter(i => i.data.id !== item.data.id));
    setProcessingId(null);
  };

  if (loading) return <div className="text-xs text-gray-400 text-center py-4">Yükleniyor...</div>;
  if (items.length === 0) return <div className="text-xs text-gray-400 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">Bekleyen öğe yok</div>;

  return (
    <>
        {/* Image Preview Overlay */}
        {previewImage && (
            <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white p-2 rounded-xl shadow-2xl max-w-[80vw] max-h-[80vh]">
                    <img src={previewImage} className="max-w-full max-h-[75vh] rounded-lg object-contain" />
                </div>
            </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 min-h-[200px]">
            {items.map((item) => (
                <div key={item.data.id} className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-left">
                    {item.type === 'comment' ? (
                        <div className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-1 rounded">Yorum</span>
                                {item.data.photo?.url && (
                                    <div 
                                        className="h-8 w-8 rounded overflow-hidden border border-gray-200 cursor-zoom-in"
                                        onMouseEnter={() => setPreviewImage(item.data.photo.url)}
                                        onMouseLeave={() => setPreviewImage(null)}
                                    >
                                        <img src={item.data.photo.url} className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-900 mt-1 line-clamp-3 font-medium">"{item.data.content}"</p>
                        </div>
                    ) : (
                        <div className="mb-2 group relative">
                            <span className="text-[10px] uppercase font-bold text-purple-600 bg-purple-50 px-1 rounded">Fotoğraf</span>
                            <div 
                                className="mt-1 h-20 w-full bg-gray-100 rounded overflow-hidden cursor-zoom-in border border-gray-200 hover:border-purple-300 transition-colors"
                                onMouseEnter={() => setPreviewImage(item.data.url)}
                                onMouseLeave={() => setPreviewImage(null)}
                            >
                                <img src={item.data.url} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    )}
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleAction(item, 'approve')}
                            disabled={!!processingId}
                            className="flex-1 bg-green-500 text-white py-1.5 rounded text-xs font-bold hover:bg-green-600 transition-colors"
                        >
                            Onayla
                        </button>
                        <button 
                            onClick={() => handleAction(item, 'reject')}
                            disabled={!!processingId}
                            className="flex-1 bg-red-100 text-red-600 py-1.5 rounded text-xs font-bold hover:bg-red-200 transition-colors"
                        >
                            Reddet
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </>
  );
}
