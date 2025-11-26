'use client';

'use client';

import { useState } from 'react';
import GeneralSettings from './event-settings/GeneralSettings';
import ScheduleSettings from './event-settings/ScheduleSettings';
import AnnouncementSettings from './event-settings/AnnouncementSettings';
import ThemeSettings from './event-settings/ThemeSettings';
import QRCustomizer from './QRCustomizer';
import PrivacySettings from './event-settings/PrivacySettings';
import PhotoHuntSettings from './event-settings/PhotoHuntSettings';
import AnalyticsTab from './event-settings/AnalyticsTab';
import { Calendar, Layout, Megaphone, Palette, QrCode, Image as ImageIcon, Tv, Shield, Trophy, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const TABS = [
  { id: 'general', label: 'Genel Bilgiler', icon: Calendar },
  { id: 'schedule', label: 'Program', icon: Layout },
  { id: 'announcements', label: 'Duyurular', icon: Megaphone },
  { id: 'theme', label: 'Görünüm & Tema', icon: Palette },
  { id: 'qr', label: 'QR Kod', icon: QrCode },
  { id: 'privacy', label: 'Güvenlik & Gizlilik', icon: Shield },
  { id: 'photo-hunt', label: 'Fotoğraf Avı', icon: Trophy },
  { id: 'analytics', label: 'Analitik', icon: BarChart3 },
];

export default function EventManager({ event }: { event: any }) {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-900">Etkinlik Ayarları</h2>
          </div>
          <nav className="p-2 space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
            
            <div className="my-2 border-t mx-2"></div>

            <Link
                href={`/events/${event.id}/gallery`}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
                <ImageIcon size={18} />
                Galeri Yönetimi
            </Link>

            <Link
                href={`/e/${event.slug}/live`}
                target="_blank"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
            >
                <Tv size={18} />
                Canlı Vitrin (Live)
            </Link>
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
          <div className="mb-6 pb-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">
              {TABS.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-gray-500 mt-1">
                {activeTab === 'general' && 'Etkinliğinizin temel bilgilerini buradan düzenleyebilirsiniz.'}
                {activeTab === 'schedule' && 'Etkinlik akışını ve saatlerini buradan planlayabilirsiniz.'}
                {activeTab === 'announcements' && 'Misafirlerinize iletmek istediğiniz duyuruları buradan ekleyebilirsiniz.'}
                {activeTab === 'theme' && 'Karşılama sayfasının (Vitrin) görünümünü buradan özelleştirebilirsiniz.'}
                {activeTab === 'qr' && 'Etkinliğinize özel QR kodunu buradan tasarlayabilir ve indirebilirsiniz.'}
                {activeTab === 'privacy' && 'Etkinliğinizin gizlilik ve güvenlik ayarlarını buradan yönetebilirsiniz.'}
                {activeTab === 'photo-hunt' && 'Misafirleriniz için eğlenceli fotoğraf görevleri oluşturun.'}
                {activeTab === 'analytics' && 'Etkinliğinizin performansını ve istatistiklerini buradan takip edebilirsiniz.'}
            </p>
          </div>

          <div className="animate-in fade-in duration-300">
            {activeTab === 'general' && <GeneralSettings event={event} />}
            {activeTab === 'schedule' && <ScheduleSettings event={event} />}
            {activeTab === 'announcements' && <AnnouncementSettings event={event} />}
            {activeTab === 'theme' && <ThemeSettings event={event} />}
            {activeTab === 'qr' && (
                <div className="max-w-xl">
                    <QRCustomizer 
                        eventId={event.id} 
                        qrCodeUrl={event.qrCodeUrl || ''} 
                        initialSettings={(event.themeConfig as any)?.qr} 
                    />
                </div>
            )}
            {activeTab === 'privacy' && <PrivacySettings event={event} />}
            {activeTab === 'photo-hunt' && <PhotoHuntSettings event={event} />}
            {activeTab === 'analytics' && <AnalyticsTab event={event} />}
          </div>
        </div>
      </div>
    </div>
  );
}
