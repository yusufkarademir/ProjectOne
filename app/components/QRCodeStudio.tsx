'use client';

import { useEffect, useRef, useState } from 'react';
import QRCodeStyling, {
  DotType,
  CornerSquareType,
  Options
} from 'qr-code-styling';
import { X, Download, Palette, Shapes, Image as ImageIcon, LayoutTemplate } from 'lucide-react';
import toast from 'react-hot-toast';

interface QRCodeStudioProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  eventName: string;
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

export default function QRCodeStudio({ isOpen, onClose, url, eventName }: QRCodeStudioProps) {
  const qrCode = useRef<QRCodeStyling | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'style' | 'color' | 'logo'>('style');

  // Customization State
  const [dotType, setDotType] = useState<DotType>('rounded');
  const [cornerType, setCornerType] = useState<CornerSquareType>('extra-rounded');
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logo, setLogo] = useState<string | undefined>(undefined);

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
                color: color
            },
            cornersDotOptions: {
                type: undefined,
                color: color
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
        color: color,
        type: dotType,
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        type: cornerType,
        color: color
      },
      cornersDotOptions: {
        color: color
      }
    });
  }, [url, logo, color, bgColor, dotType, cornerType, isOpen]);

  const handleDownload = (ext: 'png' | 'svg' | 'pdf') => {
    if (!qrCode.current) return;
    qrCode.current.download({
      extension: ext,
      name: `etkinlik-qr-${eventName.toLowerCase().replace(/\s+/g, '-')}`
    });
    toast.success(`QR Kod (${ext.toUpperCase()}) indirildi!`);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex overflow-hidden shadow-2xl relative">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
        >
            <X size={24} />
        </button>

        {/* Left: Preview Area */}
        <div className="w-full md:w-1/2 bg-gray-50 flex flex-col items-center justify-center p-8 border-r border-gray-100 relative">
            <div className="absolute top-6 left-6">
                <h2 className="text-2xl font-bold text-gray-800">QR Stüdyosu</h2>
                <p className="text-gray-500 text-sm">Etkinliğin için mükemmel kodu tasarla.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 transform hover:scale-105 transition-transform duration-500">
                <div ref={containerRef} className="qr-code-container" />
            </div>

            <div className="mt-8 flex gap-3">
                <button 
                    onClick={() => handleDownload('png')}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors font-medium shadow-lg hover:shadow-xl"
                >
                    <Download size={18} />
                    <span>PNG İndir</span>
                </button>
                <button 
                    onClick={() => handleDownload('svg')}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                    <LayoutTemplate size={18} />
                    <span>SVG</span>
                </button>
            </div>
        </div>

        {/* Right: Controls */}
        <div className="w-full md:w-1/2 flex flex-col bg-white">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
                <button 
                    onClick={() => setActiveTab('style')}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'style' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Shapes size={18} />
                    Şekil
                </button>
                <button 
                    onClick={() => setActiveTab('color')}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'color' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Palette size={18} />
                    Renk
                </button>
                <button 
                    onClick={() => setActiveTab('logo')}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'logo' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <ImageIcon size={18} />
                    Logo
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
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">QR Rengi</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="color" 
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0"
                                />
                                <input 
                                    type="text" 
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Arka Plan Rengi</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="color" 
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0"
                                />
                                <input 
                                    type="text" 
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
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
            </div>
            
            {/* Footer Tip */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                    İpucu: Açık renkli bir arka plan üzerinde koyu renkli bir QR kod her zaman daha iyi çalışır.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
