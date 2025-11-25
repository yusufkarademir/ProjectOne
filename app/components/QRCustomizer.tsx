'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { updateEventQRSettings } from '../lib/event-actions';
import toast from 'react-hot-toast';

interface QRCustomizerProps {
  eventId: string;
  qrCodeUrl: string;
  initialSettings?: {
    color?: {
      dark?: string;
      light?: string;
    };
    margin?: number;
  };
}

export default function QRCustomizer({ eventId, qrCodeUrl, initialSettings }: QRCustomizerProps) {
  const [settings, setSettings] = useState({
    color: {
      dark: initialSettings?.color?.dark || '#000000',
      light: initialSettings?.color?.light || '#ffffff',
    },
    margin: initialSettings?.margin !== undefined ? initialSettings.margin : 2,
  });
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    generatePreview();
  }, [settings, qrCodeUrl]);

  const generatePreview = async () => {
    try {
      const url = await QRCode.toDataURL(qrCodeUrl, {
        width: 300,
        margin: settings.margin,
        color: {
          dark: settings.color.dark,
          light: settings.color.light,
        },
      });
      setPreviewUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateEventQRSettings(eventId, settings);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadQR = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = 'event-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded shadow h-full">
      <h2 className="text-xl font-semibold mb-4">Etkinlik QR Kodu</h2>
      
      <div className="flex flex-col gap-6">
        <div className="flex justify-center bg-gray-50 p-4 rounded border">
          {previewUrl ? (
            <div className="text-center">
              <img src={previewUrl} alt="QR Preview" className="w-48 h-48 mb-2 border shadow-sm mx-auto" />
               <p className="text-xs text-gray-500 mb-2 break-all max-w-[200px]">
                {qrCodeUrl}
              </p>
              <button
                onClick={downloadQR}
                className="text-sm text-blue-600 hover:underline"
              >
                İndir (PNG)
              </button>
            </div>
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-gray-400">
              Yükleniyor...
            </div>
          )}
        </div>

        <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium text-gray-900">Özelleştir</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Ön Plan</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.color.dark}
                  onChange={(e) => setSettings({ ...settings, color: { ...settings.color, dark: e.target.value } })}
                  className="h-8 w-full p-0.5 rounded border cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Arka Plan</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.color.light}
                  onChange={(e) => setSettings({ ...settings, color: { ...settings.color, light: e.target.value } })}
                  className="h-8 w-full p-0.5 rounded border cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Kenar Boşluğu: {settings.margin}</label>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={settings.margin}
              onChange={(e) => setSettings({ ...settings, margin: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50 text-sm font-medium transition-colors"
          >
            {isSaving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}
