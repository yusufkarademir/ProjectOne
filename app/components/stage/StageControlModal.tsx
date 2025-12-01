'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Square, Music, Clock, QrCode, Film, Coffee, Zap } from 'lucide-react';
import { updateStageMode, toggleStageMode } from '@/app/lib/stage-actions';
import toast from 'react-hot-toast';

interface StageControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  initialConfig: any;
}

export default function StageControlModal({ isOpen, onClose, eventId, initialConfig }: StageControlModalProps) {
  const [config, setConfig] = useState(initialConfig || {
    mode: 'lounge',
    title: '',
    message: '',
    showClock: true,
    showQr: false,
    musicEnabled: false,
    musicType: 'lofi',
    countdownDuration: 5,
    videoUrl: ''
  });
  
  const [isActive, setIsActive] = useState(initialConfig?.isActive || false);
  const [loading, setLoading] = useState(false);

  // Sync state with props when modal opens or config changes
  useEffect(() => {
    if (isOpen && initialConfig) {
        setConfig((prev: any) => ({ ...prev, ...initialConfig }));
        setIsActive(initialConfig.isActive || false);
    }
  }, [isOpen, initialConfig]);

  const handleUpdate = async (newConfig: any) => {
    setConfig(newConfig);
    // Auto-save changes if active, or just update local state
    if (isActive) {
        await updateStageMode(eventId, newConfig);
    }
  };

  const handleToggle = async () => {
    setLoading(true);
    const newState = !isActive;
    
    // If turning on, save config first
    if (newState) {
        await updateStageMode(eventId, { ...config, isActive: true });
    } else {
        await toggleStageMode(eventId, false);
    }
    
    setIsActive(newState);
    setLoading(false);
    toast.success(newState ? 'Sahne Modu Aktif!' : 'Sahne Modu Kapatıldı');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            🎭 Sahne Modu Kontrolü
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Mode Selection */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => handleUpdate({ ...config, mode: 'lounge' })}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                config.mode === 'lounge' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-100 hover:border-gray-200 text-gray-600'
              }`}
            >
              <Coffee size={32} />
              <span className="font-bold">Lounge</span>
              <span className="text-xs opacity-70">Bekleme & Sohbet</span>
            </button>

            <button
              onClick={() => handleUpdate({ ...config, mode: 'hype' })}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                config.mode === 'hype' 
                  ? 'border-purple-500 bg-purple-50 text-purple-700' 
                  : 'border-gray-100 hover:border-gray-200 text-gray-600'
              }`}
            >
              <Zap size={32} />
              <span className="font-bold">Hype</span>
              <span className="text-xs opacity-70">Geri Sayım & Enerji</span>
            </button>

            <button
              onClick={() => handleUpdate({ ...config, mode: 'cinema' })}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                config.mode === 'cinema' 
                  ? 'border-red-500 bg-red-50 text-red-700' 
                  : 'border-gray-100 hover:border-gray-200 text-gray-600'
              }`}
            >
              <Film size={32} />
              <span className="font-bold">Sinema</span>
              <span className="text-xs opacity-70">Video Gösterimi</span>
            </button>
          </div>

          {/* Configuration Fields */}
          <div className="space-y-6">
            {config.mode === 'lounge' && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ekranda Görünecek Mesaj</label>
                  <input 
                    type="text" 
                    value={config.message || ''}
                    onChange={(e) => handleUpdate({ ...config, message: e.target.value })}
                    placeholder="Örn: Yemek Servisi Başlamıştır..."
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.showClock}
                      onChange={(e) => handleUpdate({ ...config, showClock: e.target.checked })}
                      className="w-5 h-5 rounded text-blue-600"
                    />
                    <span className="text-gray-700">Saat Göster</span>
                  </label>
                </div>
              </div>
            )}

            {config.mode === 'hype' && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Geri Sayım Süresi (Dakika)</label>
                  <div className="flex gap-2">
                    {[1, 5, 10, 15].map(min => (
                      <button
                        key={min}
                        onClick={() => {
                            const target = new Date(Date.now() + min * 60 * 1000).toISOString();
                            handleUpdate({ ...config, countdownDuration: min, countdownTarget: target });
                        }}
                        className={`px-4 py-2 rounded-lg border ${
                            config.countdownDuration === min 
                            ? 'bg-purple-100 border-purple-200 text-purple-700' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {min} dk
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.showQr}
                      onChange={(e) => handleUpdate({ ...config, showQr: e.target.checked })}
                      className="w-5 h-5 rounded text-purple-600"
                    />
                    <span className="text-gray-700">QR Kod Göster</span>
                  </label>
                </div>
              </div>
            )}

            {config.mode === 'cinema' && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (MP4)</label>
                  <input 
                    type="text" 
                    value={config.videoUrl || ''}
                    onChange={(e) => handleUpdate({ ...config, videoUrl: e.target.value })}
                    placeholder="https://example.com/video.mp4"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Doğrudan video dosyası bağlantısı giriniz.</p>
                </div>
              </div>
            )}

            {/* Common Settings */}
            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${config.musicEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${config.musicEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                  <input 
                    type="checkbox" 
                    checked={config.musicEnabled}
                    onChange={(e) => handleUpdate({ ...config, musicEnabled: e.target.checked })}
                    className="hidden"
                  />
                  <span className="font-medium text-gray-700 flex items-center gap-2">
                    <Music size={18} />
                    Arka Plan Müziği
                  </span>
                </label>

                {config.musicEnabled && (
                  <select 
                    value={config.musicType}
                    onChange={(e) => handleUpdate({ ...config, musicType: e.target.value })}
                    className="p-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="lofi">Lofi / Lounge</option>
                    <option value="upbeat">Upbeat / Enerjik</option>
                  </select>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Kapat
          </button>
          
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
              isActive 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
                : 'bg-green-600 hover:bg-green-700 shadow-green-200'
            }`}
          >
            {loading ? (
              <span className="animate-spin">⌛</span>
            ) : isActive ? (
              <>
                <Square size={18} fill="currentColor" />
                SAHNEYİ KAPAT
              </>
            ) : (
              <>
                <Play size={18} fill="currentColor" />
                SAHNEYİ BAŞLAT
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
