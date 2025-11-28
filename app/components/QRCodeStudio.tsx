'use client';

import { useEffect, useRef, useState } from 'react';
import QRCodeStyling, {
  DotType,
  CornerSquareType,
  Options,
  FileExtension
} from 'qr-code-styling';
import { X, Download, Palette, Shapes, Image as ImageIcon, LayoutTemplate, Save, Share2, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveQRConfig } from '@/app/lib/qr-actions';
import { jsPDF } from "jspdf";

interface QRCodeStudioProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  eventName: string;
  eventId: string;
  initialConfig?: any;
}

const dotTypes: { label: string; value: DotType }[] = [
  { label: 'Kare', value: 'square' },
  { label: 'Yuvarlak', value: 'rounded' },
  { label: 'Nokta', value: 'dots' },
  { label: 'Akışkan', value: 'classy' },
  { label: 'Yuvarlak-Kare', value: 'classy-rounded' },
  { label: 'Ekstra Yuvarlak', value: 'extra-rounded' },
];

const cornerTypes: { label: string; value: CornerSquareType }[] = [
  { label: 'Kare', value: 'square' },
  { label: 'Yuvarlak', value: 'extra-rounded' },
  { label: 'Nokta', value: 'dot' },
];

export default function QRCodeStudio({ isOpen, onClose, url, eventName, eventId, initialConfig }: QRCodeStudioProps) {
  const qrCode = useRef<QRCodeStyling | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'style' | 'color' | 'logo' | 'table-card'>('style');
  const [isSaving, setIsSaving] = useState(false);

  // Customization State
  const [dotType, setDotType] = useState<DotType>(initialConfig?.dotType || 'rounded');
  const [cornerType, setCornerType] = useState<CornerSquareType>(initialConfig?.cornerType || 'extra-rounded');
  const [color, setColor] = useState(initialConfig?.color || '#000000');
  const [bgColor, setBgColor] = useState(initialConfig?.bgColor || '#ffffff');
  const [logo, setLogo] = useState<string | undefined>(initialConfig?.logo || undefined);
  const [gradient, setGradient] = useState<{ type: 'linear' | 'radial', rotation: number, colorStops: { offset: number, color: string }[] } | undefined>(initialConfig?.gradient || undefined);

  const PRESETS = [
    { name: 'Klasik Siyah', color: '#000000', bg: '#ffffff' },
    { name: 'Gece Mavisi', color: '#1e3a8a', bg: '#eff6ff' },
    { name: 'Orman Yeşili', color: '#14532d', bg: '#f0fdf4' },
    { name: 'Vişne Çürüğü', color: '#881337', bg: '#fff1f2' },
    { name: 'Mor', color: '#581c87', bg: '#faf5ff' },
    { name: 'Turuncu', color: '#c2410c', bg: '#fff7ed' },
  ];

  const GRADIENTS = [
    { 
        name: 'Sunset', 
        gradient: { 
            type: 'linear', 
            rotation: 45, 
            colorStops: [{ offset: 0, color: '#f59e0b' }, { offset: 1, color: '#db2777' }] 
        } 
    },
    { 
        name: 'Ocean', 
        gradient: { 
            type: 'linear', 
            rotation: 45, 
            colorStops: [{ offset: 0, color: '#06b6d4' }, { offset: 1, color: '#3b82f6' }] 
        } 
    },
    { 
        name: 'Berry', 
        gradient: { 
            type: 'linear', 
            rotation: 45, 
            colorStops: [{ offset: 0, color: '#8b5cf6' }, { offset: 1, color: '#ec4899' }] 
        } 
    },
    { 
        name: 'Emerald', 
        gradient: { 
            type: 'linear', 
            rotation: 45, 
            colorStops: [{ offset: 0, color: '#10b981' }, { offset: 1, color: '#059669' }] 
        } 
    },
  ];

  // Initialize QR Code
  useEffect(() => {
    if (!qrCode.current) {
        qrCode.current = new QRCodeStyling({
            width: 300,
            height: 300,
            type: 'svg',
            data: url,
            image: logo,
            dotsOptions: {
                color: color,
                type: dotType,
                gradient: gradient as any,
            },
            backgroundOptions: {
                color: bgColor,
            },
            imageOptions: {
                crossOrigin: 'anonymous',
                margin: 10,
            },
            cornersSquareOptions: {
                type: cornerType,
                color: color,
                gradient: gradient as any,
            },
            cornersDotOptions: {
                type: undefined,
                color: color,
                gradient: gradient as any,
            }
        });
    }
  }, []);

  // Append to DOM
  useEffect(() => {
    if (isOpen && containerRef.current && qrCode.current) {
        containerRef.current.innerHTML = ''; // Clear previous
        qrCode.current.append(containerRef.current);
    }
  }, [isOpen]);

  // Update Options
  useEffect(() => {
    if (!qrCode.current) return;
    qrCode.current.update({
      data: url,
      image: logo,
      dotsOptions: {
        color: gradient ? undefined : color,
        type: dotType,
        gradient: gradient as any,
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        type: cornerType,
        color: gradient ? undefined : color,
        gradient: gradient as any,
      },
      cornersDotOptions: {
        color: gradient ? undefined : color,
        gradient: gradient as any,
      }
    });
  }, [url, logo, color, bgColor, dotType, cornerType, isOpen, gradient]);

  const handleDownload = (ext: 'png' | 'svg' | 'pdf') => {
    if (!qrCode.current) return;
    qrCode.current.download({
      extension: ext as FileExtension,
      name: `etkinlik-qr-${eventName.toLowerCase().replace(/\s+/g, '-')}`
    });
    toast.success(`QR Kod (${ext.toUpperCase()}) indirildi!`);
  };

  const handleSave = async () => {
      setIsSaving(true);
      try {
          const config = {
              dotType,
              cornerType,
              color,
              bgColor,
              logo,
              gradient
          };
          await saveQRConfig(eventId, config);
          toast.success('Tasarım kaydedildi!');
      } catch (error) {
          toast.error('Kaydedilirken bir hata oluştu.');
          console.error(error);
      } finally {
          setIsSaving(false);
      }
  };

  const handleShare = async () => {
      if (navigator.share) {
          try {
              await navigator.share({
                  title: eventName,
                  text: `${eventName} etkinliğine katıl!`,
                  url: url
              });
          } catch (err) {
              console.error(err);
          }
      } else {
          navigator.clipboard.writeText(url);
          toast.success('Link kopyalandı!');
      }
  };

  const handleTableCardDownload = async () => {
    if (!qrCode.current) return;

    // Get QR as blob
    const blob = await qrCode.current.getRawData('png');
    if (!blob) return;

    const reader = new FileReader();
    reader.readAsDataURL(blob as Blob);
    reader.onloadend = () => {
        const base64data = reader.result as string;
        
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a5"
        });

        // Background
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 148, 210, "F");

        // Border
        doc.setDrawColor(0);
        doc.setLineWidth(1);
        doc.rect(10, 10, 128, 190);

        // Title
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text(eventName, 74, 40, { align: "center" });

        // Subtitle
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text("Anılarınızı Paylaşın", 74, 50, { align: "center" });

        // QR Code
        doc.addImage(base64data, "PNG", 34, 60, 80, 80);

        // Instructions
        doc.setFontSize(12);
        doc.text("Kameranızı okutun ve", 74, 150, { align: "center" });
        doc.text("fotoğraflarınızı yükleyin", 74, 156, { align: "center" });

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("etkinlikqr.com", 74, 190, { align: "center" });

        doc.save(`masa-karti-${eventName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
        toast.success('Masa kartı indirildi!');
    };
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
            setLogo(event.target?.result as string);
        };
        reader.readAsDataURL(e.target.files[0]);
    }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
      setColor(preset.color);
      setBgColor(preset.bg);
      setGradient(undefined);
  };

  const applyGradient = (grad: typeof GRADIENTS[0]) => {
      setGradient(grad.gradient as any);
      setBgColor('#ffffff');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl min-h-[85vh] md:h-[85vh] h-auto flex flex-col md:flex-row overflow-hidden shadow-2xl relative">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
        >
            <X size={24} />
        </button>

        {/* Left: Preview Area */}
        <div className="w-full md:w-1/2 bg-gray-50 flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100 relative">
            <div className="absolute top-6 left-6">
                <h2 className="text-2xl font-bold text-gray-800">QR Stüdyosu <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full ml-2">v2.0</span></h2>
                <p className="text-gray-500 text-sm">Etkinliğin için mükemmel kodu tasarla.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 transform hover:scale-105 transition-transform duration-500 relative group">
                <div ref={containerRef} className="qr-code-container" />
                {/* Save Indicator */}
                <div className="absolute -bottom-12 left-0 right-0 flex justify-center">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        <Save size={16} />
                        {isSaving ? 'Kaydediliyor...' : 'Tasarımı Kaydet'}
                    </button>
                </div>
            </div>

            <div className="mt-12 flex gap-3">
                <button 
                    onClick={() => handleDownload('png')}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors font-medium shadow-lg hover:shadow-xl"
                >
                    <Download size={18} />
                    <span>PNG</span>
                </button>
                <button 
                    onClick={() => handleDownload('svg')}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                    <LayoutTemplate size={18} />
                    <span>SVG</span>
                </button>
                <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-medium"
                >
                    <Share2 size={18} />
                    <span>Paylaş</span>
                </button>
            </div>
        </div>

        {/* Right: Controls */}
        <div className="w-full md:w-1/2 flex flex-col bg-white">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('style')}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors min-w-[80px] ${activeTab === 'style' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Shapes size={18} />
                    Şekil
                </button>
                <button 
                    onClick={() => setActiveTab('color')}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors min-w-[80px] ${activeTab === 'color' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Palette size={18} />
                    Renk
                </button>
                <button 
                    onClick={() => setActiveTab('logo')}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors min-w-[80px] ${activeTab === 'logo' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <ImageIcon size={18} />
                    Logo
                </button>
                <button 
                    onClick={() => setActiveTab('table-card')}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors min-w-[100px] ${activeTab === 'table-card' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Printer size={18} />
                    Masa Kartı
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {activeTab === 'style' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Nokta Stili</label>
                            <div className="grid grid-cols-3 gap-3">
                                {dotTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setDotType(type.value)}
                                        className={`p-3 rounded-xl border text-sm transition-all ${dotType === type.value ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Köşe Stili</label>
                            <div className="grid grid-cols-3 gap-3">
                                {cornerTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setCornerType(type.value)}
                                        className={`p-3 rounded-xl border text-sm transition-all ${cornerType === type.value ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'color' && (
                    <div className="space-y-8">
                        {/* Presets */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Hazır Paletler</label>
                            <div className="grid grid-cols-3 gap-3">
                                {PRESETS.map((preset) => (
                                    <button
                                        key={preset.name}
                                        onClick={() => applyPreset(preset)}
                                        className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                                    >
                                        <div 
                                            className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
                                            style={{ backgroundColor: preset.color }}
                                        />
                                        <span className="text-xs font-medium text-gray-600 group-hover:text-blue-700">{preset.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Gradients */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Gradient (Renk Geçişi)</label>
                            <div className="grid grid-cols-2 gap-3">
                                {GRADIENTS.map((grad) => (
                                    <button
                                        key={grad.name}
                                        onClick={() => applyGradient(grad)}
                                        className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                                    >
                                        <div 
                                            className="w-8 h-6 rounded-md border border-black/10 shadow-sm"
                                            style={{ 
                                                background: `linear-gradient(45deg, ${grad.gradient.colorStops[0].color}, ${grad.gradient.colorStops[1].color})` 
                                            }}
                                        />
                                        <span className="text-xs font-medium text-gray-600 group-hover:text-blue-700">{grad.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Özel Renk</label>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-xs text-gray-500 mb-1 block">QR Rengi</span>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="color" 
                                            value={color}
                                            onChange={(e) => { setColor(e.target.value); setGradient(undefined); }}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                                        />
                                        <input 
                                            type="text" 
                                            value={color}
                                            onChange={(e) => { setColor(e.target.value); setGradient(undefined); }}
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 mb-1 block">Arka Plan</span>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="color" 
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value)}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                                        />
                                        <input 
                                            type="text" 
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'logo' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Logo Yükle</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                    <ImageIcon size={32} />
                                    <span className="text-sm">Logoyu buraya sürükleyin veya seçin</span>
                                </div>
                            </div>
                            {logo && (
                                <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <img src={logo} alt="Logo" className="w-10 h-10 object-contain rounded" />
                                    <span className="text-sm text-blue-700 font-medium flex-1">Logo Yüklendi</span>
                                    <button onClick={() => setLogo(undefined)} className="text-blue-400 hover:text-blue-600">
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'table-card' && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h3 className="font-semibold text-blue-900 mb-2">Masa Kartı Nedir?</h3>
                            <p className="text-sm text-blue-700">
                                Etkinlik masalarına koyabileceğiniz, misafirlerinizi fotoğraf yüklemeye davet eden hazır bir tasarımdır. A5 boyutunda (yarım A4) çıktı alabilirsiniz.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handleTableCardDownload}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors font-medium shadow-lg"
                            >
                                <Printer size={20} />
                                <span>Masa Kartı İndir (PDF)</span>
                            </button>
                            <p className="text-xs text-gray-500 text-center">
                                *PDF dosyasını indirdikten sonra yazıcıdan çıktı alabilirsiniz.
                            </p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Footer Tip */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                    İpucu: Tasarımınızı kaydetmeyi unutmayın!
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
