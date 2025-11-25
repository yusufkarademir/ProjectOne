import Link from 'next/link';
import { LayoutTemplate, ArrowRight, Check } from 'lucide-react';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Şık, temiz ve minimalist bir tasarım. Kurumsal etkinlikler ve düğünler için ideal.',
    color: 'bg-blue-500',
    features: ['Tam ekran kapak fotoğrafı', 'Grid galeri düzeni', 'Yumuşak geçişler'],
    preview: '/templates/modern-preview.jpg' // Placeholder
  },
  {
    id: 'dark',
    name: 'Gece Modu',
    description: 'Karanlık temalı, etkileyici ve premium bir görünüm. Partiler ve konserler için harika.',
    color: 'bg-slate-900',
    features: ['Koyu arka plan', 'Neon vurgular', 'Büyük yazı tipleri'],
    preview: '/templates/dark-preview.jpg' // Placeholder
  },
  {
    id: 'classic',
    name: 'Klasik',
    description: 'Geleneksel ve zarif. Aile toplantıları ve resmi törenler için uygun.',
    color: 'bg-stone-100',
    features: ['Serif yazı tipleri', 'Kağıt dokusu arka plan', 'Çerçeveli fotoğraflar'],
    preview: '/templates/classic-preview.jpg' // Placeholder
  },
  {
    id: 'vibrant',
    name: 'Canlı',
    description: 'Enerjik ve renkli. Doğum günleri ve festivaller için mükemmel.',
    color: 'bg-pink-500',
    features: ['Renkli gradyanlar', 'Yuvarlak butonlar', 'Eğlenceli animasyonlar'],
    preview: '/templates/vibrant-preview.jpg' // Placeholder
  }
];

export default function TemplatesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <LayoutTemplate className="text-gray-400" size={32} />
            Şablon Yöneticisi
        </h1>
        <p className="text-gray-500 mt-1 ml-11">Etkinlikleriniz için hazır tasarımları keşfedin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                {/* Preview Area (Placeholder) */}
                <div className={`h-48 ${template.color} relative flex items-center justify-center`}>
                    <span className="text-white/50 text-4xl font-bold tracking-widest uppercase opacity-30">{template.name}</span>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-gray-500 text-sm mb-4">{template.description}</p>
                    
                    <div className="space-y-2 mb-6 flex-1">
                        {template.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                <Check size={14} className="text-green-500" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>

                    <Link 
                        href={`/events/create?template=${template.id}`}
                        className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                        <span>Bu Şablonu Kullan</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
