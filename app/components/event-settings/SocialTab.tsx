'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Heart, Star, Tag, Save, Info } from 'lucide-react';
import { updateSocialSettings } from '../../lib/social-actions';
import toast from 'react-hot-toast';

interface SocialTabProps {
  event: any;
}

export default function SocialTab({ event }: SocialTabProps) {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    enabled: event.socialSettings?.enabled || false,
    features: {
      comments: event.socialSettings?.features?.comments || false,
      ratings: event.socialSettings?.features?.ratings || false,
      reactions: event.socialSettings?.features?.reactions || false,
      tags: event.socialSettings?.features?.tags || false,
    },
    availableTags: event.socialSettings?.availableTags || ['Eğlence', 'Yemek', 'Biz', 'Manzara'],
    requireApproval: event.socialSettings?.requireApproval || false,
    panicMode: event.socialSettings?.panicMode || false
  });

  const [newTag, setNewTag] = useState('');

  const handleToggle = (key: string, isFeature = false) => {
    if (isFeature) {
      setSettings(prev => ({
        ...prev,
        features: {
          ...prev.features,
          [key]: !prev.features[key as keyof typeof prev.features]
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [key]: !prev[key as keyof typeof prev]
      }));
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (settings.availableTags.includes(newTag.trim())) {
      toast.error('Bu etiket zaten var');
      return;
    }
    setSettings(prev => ({
      ...prev,
      availableTags: [...prev.availableTags, newTag.trim()]
    }));
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSettings(prev => ({
      ...prev,
      availableTags: prev.availableTags.filter((tag: string) => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    const result = await updateSocialSettings(event.id, settings);
    if (result.success) {
      toast.success('Sosyal duvar ayarları kaydedildi');
    } else {
      toast.error(result.message || 'Bir hata oluştu');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-medium text-blue-900">Sosyal Duvar Nedir?</h4>
          <p className="text-sm text-blue-700 mt-1">
            Etkinliğinizi interaktif bir sosyal medya platformuna dönüştürün. Misafirleriniz fotoğraflara yorum yapabilir, emoji bırakabilir ve etiketleyebilir.
          </p>
        </div>
      </div>

      {/* Main Toggle */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sosyal Duvarı Aktifleştir</h3>
            <p className="text-sm text-gray-500">Bu özellik açıldığında misafirleriniz etkileşime geçebilir.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={settings.enabled}
              onChange={() => handleToggle('enabled')}
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {settings.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Comments */}
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Yorumlar</h4>
                  <p className="text-xs text-gray-500">Misafirler yorum yazabilsin</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.features.comments}
                  onChange={() => handleToggle('comments', true)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            {/* Reactions */}
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <Heart size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Emoji Tepkileri</h4>
                  <p className="text-xs text-gray-500">Beğeni ve emoji bırakılabilsin</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.features.reactions}
                  onChange={() => handleToggle('reactions', true)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>

            {/* Ratings */}
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                  <Star size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Puanlama</h4>
                  <p className="text-xs text-gray-500">Fotoğraflara puan verilebilsin</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.features.ratings}
                  onChange={() => handleToggle('ratings', true)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </label>
            </div>

            {/* Tags */}
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Tag size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Etiketler</h4>
                  <p className="text-xs text-gray-500">Kategorilere göre filtrelenebilsin</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.features.tags}
                  onChange={() => handleToggle('tags', true)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Moderation Settings */}
      {settings.enabled && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 delay-75">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Güvenlik ve Moderasyon</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bad Word Filter */}
                <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <Info size={20} />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">Küfür Filtresi</h4>
                            <p className="text-xs text-gray-500">Kötü kelimeleri otomatik sansürle (***)</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={true} // Always on for now as per user request
                            disabled
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                </div>

                {/* Manual Approval */}
                <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                            <Save size={20} />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">Manuel Onay</h4>
                            <p className="text-xs text-gray-500">Yorumlar onaylanmadan yayınlanmaz</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={settings.requireApproval || false}
                            onChange={() => handleToggle('requireApproval', false)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        </div>
      )}

      {/* PANIC BUTTON */}
      {settings.enabled && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 delay-150">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
                        <Info size={24} />
                        ACİL DURUM MODU
                    </h3>
                    <p className="text-sm text-red-600 mt-1">
                        Bu butona bastığınızda sosyal duvar <strong>ANINDA KAPANIR</strong> ve misafirlere "Teknik Arıza" mesajı gösterilir.
                    </p>
                </div>
                <button
                    onClick={() => handleToggle('panicMode', false)}
                    className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
                        settings.panicMode 
                        ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
                        : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                    }`}
                >
                    {settings.panicMode ? 'NORMALE DÖN' : 'ACİL DURDUR'}
                </button>
            </div>
        </div>
      )}

      {/* Tag Management */}
      {settings.enabled && settings.features.tags && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 delay-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Etiket Yönetimi</h3>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Yeni etiket ekle (örn: Gelin Masası)"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAddTag}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Ekle
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {settings.availableTags.map((tag: string, index: number) => (
              <div key={index} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm group hover:bg-gray-200 transition-colors">
                <span>{tag}</span>
                <button 
                  onClick={() => handleRemoveTag(tag)}
                  className="w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  &times;
                </button>
              </div>
            ))}
            {settings.availableTags.length === 0 && (
              <p className="text-sm text-gray-500 italic">Henüz etiket eklenmemiş.</p>
            )}
          </div>
        </div>
      )}

      {/* Pending Items (Approval Queue) */}
      {settings.enabled && settings.requireApproval && (
        <PendingItemsSection eventId={event.id} />
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 font-medium"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={20} />
          )}
          Ayarları Kaydet
        </button>
      </div>
    </div>
  );
}

function PendingItemsSection({ eventId }: { eventId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Import dynamically
  const { getPendingItems, approveComment, rejectComment, approvePhoto, rejectPhoto } = require('../../lib/social-actions');

  const fetchItems = async () => {
    setLoading(true);
    const result = await getPendingItems(eventId);
    if (result.success) {
      setItems(result.items);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
    // Poll every 10 seconds
    const interval = setInterval(fetchItems, 10000);
    return () => clearInterval(interval);
  }, [eventId]);

  const handleAction = async (item: any, action: 'approve' | 'reject') => {
    setProcessingId(item.data.id);
    
    let result;
    if (item.type === 'comment') {
        if (action === 'approve') result = await approveComment(item.data.id);
        else result = await rejectComment(item.data.id);
    } else if (item.type === 'photo') {
        if (action === 'approve') result = await approvePhoto(item.data.id);
        else result = await rejectPhoto(item.data.id);
    }

    if (result?.success) {
      toast.success(action === 'approve' ? 'Onaylandı' : 'Reddedildi');
      setItems(prev => prev.filter(i => i.data.id !== item.data.id));
    } else {
      toast.error('İşlem başarısız');
    }
    setProcessingId(null);
  };

  if (loading && items.length === 0) return null;
  if (items.length === 0) return null;

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

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
        <h3 className="text-lg font-bold text-yellow-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            Onay Bekleyenler ({items.length})
        </h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
            <div key={item.data.id} className="bg-white p-4 rounded-lg border border-yellow-100 shadow-sm flex items-start gap-4">
                {item.type === 'comment' ? (
                    <>
                        {item.data.photo && (
                        <img src={item.data.photo.url} alt="Context" className="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-1 rounded mb-1 inline-block">Yorum</span>
                        <p className="text-gray-900 text-sm mb-1 line-clamp-3">"{item.data.content}"</p>
                        <p className="text-xs text-gray-400">
                            {new Date(item.createdAt).toLocaleString('tr-TR')}
                        </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div 
                            className="relative group cursor-zoom-in"
                            onMouseEnter={() => setPreviewImage(item.data.url)}
                            onMouseLeave={() => setPreviewImage(null)}
                        >
                            <img src={item.data.url} alt="Pending" className="w-24 h-24 rounded-lg object-cover bg-gray-100 flex-shrink-0 border border-gray-200 group-hover:border-purple-400 transition-colors" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[10px] uppercase font-bold text-purple-600 bg-purple-50 px-1 rounded mb-1 inline-block">Fotoğraf</span>
                            <p className="text-xs text-gray-500">Yeni yüklenen fotoğraf</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {new Date(item.createdAt).toLocaleString('tr-TR')}
                            </p>
                        </div>
                    </>
                )}
                
                <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                    onClick={() => handleAction(item, 'approve')}
                    disabled={!!processingId}
                    className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-200 transition-colors flex items-center justify-center gap-1"
                >
                    {processingId === item.data.id ? '...' : 'Onayla'}
                </button>
                <button
                    onClick={() => handleAction(item, 'reject')}
                    disabled={!!processingId}
                    className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                >
                    {processingId === item.data.id ? '...' : 'Reddet'}
                </button>
                </div>
            </div>
            ))}
        </div>
        </div>
    </>
  );
}
