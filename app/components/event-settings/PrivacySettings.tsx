'use client';

import { useState } from 'react';
import { updateEventPrivacySettings } from '../../lib/event-actions';
import toast from 'react-hot-toast';
import { Shield, Lock, Eye, Download, CheckCircle, Bot } from 'lucide-react';

export default function PrivacySettings({ event }: { event: any }) {
  const privacyConfig = (event.privacyConfig as any) || {};
  
  const [settings, setSettings] = useState({
    isGalleryPublic: privacyConfig.isGalleryPublic !== false, // Default true
    allowDownload: privacyConfig.allowDownload !== false,     // Default true
    requireModeration: privacyConfig.requireModeration === true, // Default false
    isAiModerationEnabled: event.isAiModerationEnabled !== false, // Default true (from schema)
    isWatermarkEnabled: event.isWatermarkEnabled === true, // Default false (from schema)
    isPasswordProtected: event.isPasswordProtected === true,
    guestPin: event.guestPin || '',
  });
  
  const [loading, setLoading] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (settings.isPasswordProtected && (!settings.guestPin || settings.guestPin.length < 4)) {
        toast.error('Lütfen en az 4 haneli bir PIN belirleyin.');
        return;
    }

    setLoading(true);
    const result = await updateEventPrivacySettings(event.id, settings);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4 items-start">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <Shield size={24} />
        </div>
        <div>
            <h3 className="font-semibold text-blue-900">Güvenlik ve Gizlilik</h3>
            <p className="text-blue-700 mt-1 text-sm">
                Etkinliğinizin mahremiyetini yönetin. Bu ayarlar, misafirlerin galeriye erişimini ve fotoğrafları kullanımını doğrudan etkiler.
            </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Password Protection */}
        <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="flex items-start justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleToggle('isPasswordProtected')}>
                <div className="flex gap-4">
                    <div className={`p-2 rounded-lg ${settings.isPasswordProtected ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                        <Lock size={24} />
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900">Şifreli Giriş (PIN)</h4>
                        <p className="text-sm text-gray-500 mt-1">
                            Açık olduğunda, misafirler galeriye erişmek için belirlediğiniz PIN kodunu girmek zorundadır.
                        </p>
                    </div>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.isPasswordProtected ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.isPasswordProtected ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
            </div>
            
            {settings.isPasswordProtected && (
                <div className="p-4 bg-gray-50 border-t animate-in slide-in-from-top-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Misafir PIN Kodu (4-6 Haneli)
                    </label>
                    <input
                        type="text"
                        value={settings.guestPin}
                        onChange={(e) => setSettings(prev => ({ ...prev, guestPin: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                        placeholder="Örn: 1234"
                        className="w-full max-w-xs px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-lg tracking-widest"
                        maxLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Bu kodu misafirlerinizle paylaşın. Kodu bilmeyenler galeriye erişemez.
                    </p>
                </div>
            )}
        </div>

        {/* Gallery Access */}
        <div className="flex items-start justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleToggle('isGalleryPublic')}>
            <div className="flex gap-4">
                <div className={`p-2 rounded-lg ${settings.isGalleryPublic ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    <Eye size={24} />
                </div>
                <div>
                    <h4 className="font-medium text-gray-900">Misafir Galerisi Erişimi</h4>
                    <p className="text-sm text-gray-500 mt-1">
                        Açık olduğunda, QR kodu okutan herkes galeriye erişebilir ve diğer yüklenen fotoğrafları görebilir.
                        <br/>
                        <span className="text-xs text-gray-400">Kapalıysa sadece yükleme yapabilirler.</span>
                    </p>
                </div>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.isGalleryPublic ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.isGalleryPublic ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
        </div>

        {/* Download Permission */}
        <div className="flex items-start justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleToggle('allowDownload')}>
            <div className="flex gap-4">
                <div className={`p-2 rounded-lg ${settings.allowDownload ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    <Download size={24} />
                </div>
                <div>
                    <h4 className="font-medium text-gray-900">İndirmeye İzin Ver</h4>
                    <p className="text-sm text-gray-500 mt-1">
                        Açık olduğunda, misafirler galeri fotoğraflarını cihazlarına indirebilir.
                    </p>
                </div>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.allowDownload ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.allowDownload ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
        </div>

        {/* Moderation */}
        <div className="flex items-start justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleToggle('requireModeration')}>
            <div className="flex gap-4">
                <div className={`p-2 rounded-lg ${settings.requireModeration ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                    <CheckCircle size={24} />
                </div>
                <div>
                    <h4 className="font-medium text-gray-900">Moderasyon Modu</h4>
                    <p className="text-sm text-gray-500 mt-1">
                        Açık olduğunda, yüklenen fotoğraflar siz onaylayana kadar galeride ve vitrinde görünmez.
                    </p>
                </div>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.requireModeration ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.requireModeration ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
        </div>

        {/* AI Moderation */}
        <div className="flex items-start justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleToggle('isAiModerationEnabled')}>
            <div className="flex gap-4">
                <div className={`p-2 rounded-lg ${settings.isAiModerationEnabled ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                    <Bot size={24} />
                </div>
                <div>
                    <h4 className="font-medium text-gray-900">Yapay Zeka (AI) Koruması</h4>
                    <p className="text-sm text-gray-500 mt-1">
                        Açık olduğunda, yüklenen fotoğraflar yapay zeka tarafından taranır ve uygunsuz (+18) içerikler otomatik engellenir.
                    </p>
                </div>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.isAiModerationEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.isAiModerationEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
        </div>

        {/* Watermark Protection */}
        <div className="flex items-start justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleToggle('isWatermarkEnabled')}>
            <div className="flex gap-4">
                <div className={`p-2 rounded-lg ${settings.isWatermarkEnabled ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                    <Lock size={24} />
                </div>
                <div>
                    <h4 className="font-medium text-gray-900">Filigran Koruması</h4>
                    <p className="text-sm text-gray-500 mt-1">
                        Açık olduğunda, fotoğrafların üzerine etkinlik adı silik bir şekilde yazılır. Ekran görüntüsü alınmasını caydırır.
                    </p>
                </div>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.isWatermarkEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.isWatermarkEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
        >
            {loading ? (
                <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Kaydediliyor...
                </>
            ) : (
                <>
                    <Shield size={20} />
                    Ayarları Kaydet
                </>
            )}
        </button>
      </div>
    </div>
  );
}
