'use client';

import { useState } from 'react';
import { updateEventDetails } from '../../lib/event-actions';
import toast from 'react-hot-toast';
import { Image as ImageIcon } from 'lucide-react';

const THEMES = [
  { id: 'modern', name: 'Modern (Varsayılan)', type: 'modern', colors: { primary: '#2563eb', background: '#f9fafb' } },
  { id: 'wedding', name: 'Düğün / Zarif', type: 'wedding', colors: { primary: '#d4af37', background: '#fdfbf7' } },
  { id: 'corporate', name: 'Kurumsal', type: 'corporate', colors: { primary: '#1f2937', background: '#f3f4f6' } },
  { id: 'party', name: 'Parti / Neon', type: 'party', colors: { primary: '#ff00ff', background: '#110022' } },
];

const FONTS = [
  { id: 'inter', name: 'Inter (Modern)' },
  { id: 'playfair', name: 'Playfair Display (Serif)' },
  { id: 'roboto', name: 'Roboto' },
];

export default function ThemeSettings({ event }: { event: any }) {
  const [themeConfig, setThemeConfig] = useState(event.themeConfig || { theme: 'modern', font: 'inter', customColors: {} });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    // Preserve existing QR settings if any
    const currentConfig = event.themeConfig || {};
    const newConfig = { ...currentConfig, ...themeConfig };
    
    const result = await updateEventDetails(event.id, { themeConfig: newConfig });
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl space-y-8">
      
      {/* Theme/Template Selection */}
      <div>
        <h3 className="text-lg font-medium mb-4">Etkinlik Konsepti & Tema</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setThemeConfig({ ...themeConfig, theme: theme.id })}
              className={`relative p-4 rounded-xl border-2 transition-all text-left group overflow-hidden ${
                themeConfig.theme === theme.id ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div 
                className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: theme.colors.primary }}
              ></div>
              <div className="relative z-10 flex items-center gap-4">
                <div 
                    className="w-12 h-12 rounded-full shadow-sm border flex-shrink-0"
                    style={{ backgroundColor: theme.colors.background }}
                >
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
                    </div>
                </div>
                <div>
                    <p className="font-bold text-gray-900">{theme.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {theme.id === 'modern' && 'Sade ve şık, her etkinliğe uygun.'}
                        {theme.id === 'wedding' && 'Romantik detaylar, serif yazı tipleri.'}
                        {theme.id === 'corporate' && 'Profesyonel, net ve düzenli.'}
                        {theme.id === 'party' && 'Canlı renkler, konfetiler ve enerji.'}
                    </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Font Selection */}
      <div>
        <h3 className="text-lg font-medium mb-4">Yazı Tipi</h3>
        <div className="grid grid-cols-3 gap-4">
            {FONTS.map((font) => (
                <button
                    key={font.id}
                    onClick={() => setThemeConfig({ ...themeConfig, font: font.id })}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        themeConfig.font === font.id ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    {font.name}
                </button>
            ))}
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <h3 className="text-lg font-medium mb-4">Kapak Görseli</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
            {event.coverImage ? (
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden group">
                    <img src={event.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-medium">Görseli Değiştirmek İçin Yeni Dosya Seçin</p>
                    </div>
                </div>
            ) : (
                <div className="mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <ImageIcon className="text-gray-500" size={24} />
                    </div>
                    <p className="text-gray-500 text-sm">
                        Henüz kapak görseli yüklenmemiş.
                    </p>
                </div>
            )}
            
            <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append('file', file);
                    
                    const toastId = toast.loading('Görsel yükleniyor...');
                    try {
                        const { uploadCoverImage } = await import('../../lib/event-actions');
                        const result = await uploadCoverImage(event.id, formData);
                        if (result.success) {
                            toast.success(result.message, { id: toastId });
                            // Optional: Refresh local state if needed, but server action revalidates path
                        } else {
                            toast.error(result.message, { id: toastId });
                        }
                    } catch (error) {
                        toast.error('Yükleme hatası', { id: toastId });
                    }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF (Max 5MB)</p>
        </div>
      </div>

      <div className="pt-4 border-t">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Kaydediliyor...' : 'Görünüm Ayarlarını Kaydet'}
        </button>
      </div>
    </div>
  );
}
