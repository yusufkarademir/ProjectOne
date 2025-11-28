import Link from 'next/link';
import { LayoutTemplate, ArrowRight, Check, Star, PlusCircle } from 'lucide-react';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Şık, temiz ve minimalist bir tasarım. Kurumsal etkinlikler ve düğünler için ideal.',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-400',
    features: ['Tam ekran kapak fotoğrafı', 'Grid galeri düzeni', 'Yumuşak geçişler'],
    popular: true
  },
  {
    id: 'dark',
    name: 'Gece Modu',
    description: 'Karanlık temalı, etkileyici ve premium bir görünüm. Partiler ve konserler için harika.',
    color: 'bg-gradient-to-br from-slate-900 to-slate-800',
    features: ['Koyu arka plan', 'Neon vurgular', 'Büyük yazı tipleri'],
    popular: false
  },
  {
    id: 'wedding',
    name: 'Düğün & Nişan',
    description: 'Zarif serif fontlar ve altın detaylarla süslenmiş romantik bir tema.',
    color: 'bg-gradient-to-br from-[#d4af37] to-[#f3e5ab]',
    features: ['Altın detaylar', 'Zarif tipografi', 'Romantik animasyonlar'],
    popular: true
  },
  {
    id: 'party',
    name: 'Parti & Eğlence',
    description: 'Enerjik renkler ve hareketli konfeti efektleriyle dolu eğlenceli bir tema.',
    color: 'bg-gradient-to-br from-purple-600 to-pink-500',
    features: ['Canlı renkler', 'Konfeti efektleri', 'Hareketli arka plan'],
    popular: false
  }
];

export default function TemplatesPage() {
  return (
    <div>
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-2xl mb-4">
            <PlusCircle size={32} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Yeni Etkinlik Oluştur
        </h1>
        <p className="text-lg text-gray-500">
            Başlamak için etkinliğinizin ruhuna en uygun tasarımı seçin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative">
                {template.popular && (
                    <div className="absolute top-4 right-4 z-10 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Star size={12} fill="currentColor" />
                        POPÜLER
                    </div>
                )}
                
                {/* Preview Area */}
                <div className={`h-56 ${template.color} relative flex items-center justify-center overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                    <span className="text-white/90 text-3xl font-bold tracking-widest uppercase drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                        {template.name}
                    </span>
                    
                    {/* Overlay Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                        <Link 
                            href={`/events/create?template=${template.id}`}
                            className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2"
                        >
                            Seç ve Başla <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{template.name}</h3>
                    <p className="text-gray-500 mb-6 leading-relaxed">{template.description}</p>
                    
                    <div className="space-y-3 mb-8 flex-1">
                        {template.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                                    <Check size={12} strokeWidth={3} />
                                </div>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>

                    <Link 
                        href={`/events/create?template=${template.id}`}
                        className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-900 py-4 rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300 font-bold group/btn"
                    >
                        <span>Bu Şablonu Kullan</span>
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
