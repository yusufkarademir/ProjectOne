'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { HelpCircle } from 'lucide-react';
import { Step } from 'react-joyride';

// Dynamically import TourGuide to avoid SSR issues with react-joyride
const TourGuide = dynamic(() => import('../../components/guide/TourGuide'), { ssr: false });

export default function DashboardTourWrapper() {
  const [runTour, setRunTour] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const tourCompleted = localStorage.getItem('tour_completed');
    if (!tourCompleted) {
      setRunTour(true);
    }
  }, []);

  const handleRestartTour = () => {
    setRunTour(true);
  };

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div>
          <h3 className="font-bold text-lg mb-2">Hoş Geldiniz! 👋</h3>
          <p>Etkinlik yönetim panelinize kısa bir tur ile göz atalım mı?</p>
        </div>
      ),
      placement: 'center',
    },
    {
      target: '.dashboard-stats',
      content: (
        <div>
          <h3 className="font-bold text-lg mb-2">İstatistikler</h3>
          <p>Buradan toplam etkinlik, fotoğraf sayısı ve aktif etkinliklerinizi bir bakışta görebilirsiniz.</p>
        </div>
      ),
    },
    {
      target: '.dashboard-filters',
      content: (
        <div>
          <h3 className="font-bold text-lg mb-2">Yönetim Araçları</h3>
          <p>Etkinliklerinizi arayabilir, sıralayabilir ve <strong>Yeni Etkinlik</strong> oluşturabilirsiniz.</p>
        </div>
      ),
    },
    {
      target: '.event-card',
      content: (
        <div>
          <h3 className="font-bold text-lg mb-2">Etkinlik Kartları</h3>
          <p>Etkinliklerinizi buradan yönetin. Düzenleyin, galeriye gidin veya canlı ekranları (Slayt/Sosyal Duvar) açın.</p>
        </div>
      ),
    },
  ];

  if (!isMounted) return null;

  return (
    <>
      <TourGuide steps={steps} run={runTour} />
      
      <button
        onClick={handleRestartTour}
        className="fixed bottom-6 right-6 bg-white p-3 rounded-full shadow-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all z-40 group"
        title="Turu Başlat / Yardım"
      >
        <HelpCircle size={24} />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Yardım / Tur
        </span>
      </button>
    </>
  );
}
