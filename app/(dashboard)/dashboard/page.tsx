import { auth } from '../../../auth';
import { prisma } from '../../../lib/db';
import Link from 'next/link';
import { Calendar, Image as ImageIcon, QrCode, Plus, Home, ChevronRight } from 'lucide-react';
import DashboardFilters from './dashboard-filters';
import EventCard from './event-card';
import DashboardTourWrapper from './dashboard-tour-wrapper';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    sort?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user?.email) return null;

  const params = await searchParams;
  const query = params?.query || '';
  const sort = params?.sort === 'asc' ? 'asc' : 'desc';

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { 
        events: {
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            include: { 
                _count: {
                    select: { photos: true }
                }
            },
            orderBy: { createdAt: sort }
        } 
    },
  });

  if (!user) {
    // Session exists but user not in DB (likely DB reset)
    return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Kullanıcı Bulunamadı</h2>
            <p className="text-gray-600 mb-4">Veritabanı sıfırlanmış olabilir. Lütfen tekrar giriş yapın veya kayıt olun.</p>
            <Link href="/api/auth/signout" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Çıkış Yap ve Tekrar Dene
            </Link>
        </div>
    );
  }

  const statsUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
          events: {
              include: { photos: true }
          }
      }
  });

  const totalEvents = statsUser?.events.length || 0;
  const totalPhotos = statsUser?.events.reduce((acc: number, event: any) => acc + event.photos.length, 0) || 0;
  const activeEvents = statsUser?.events.filter((e: any) => new Date(e.date) >= new Date()).length || 0;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Home size={16} />
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">Dashboard</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <QrCode className="text-gray-400" size={32} />
            Genel Bakış
        </h1>
        <p className="text-gray-500 mt-1 ml-11">Etkinliklerinizi buradan yönetebilirsiniz.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 dashboard-stats">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-105">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Toplam Etkinlik</p>
            <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-105">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <ImageIcon size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Toplam Fotoğraf</p>
            <p className="text-2xl font-bold text-gray-900">{totalPhotos}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-105">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
            <QrCode size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Aktif Etkinlikler</p>
            <p className="text-2xl font-bold text-gray-900">{activeEvents}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-105">
           <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
             <Plus size={24} />
           </div>
           <div>
             <p className="text-sm text-gray-500 font-medium">Kalan Hakkınız</p>
             <p className="text-2xl font-bold text-gray-900">Sınırsız</p>
           </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <DashboardFilters />

      {/* Events Grid */}
      <div className="animate-in fade-in duration-500">
        {(user as any).events.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Calendar size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {query ? 'Sonuç Bulunamadı' : 'Henüz Etkinlik Yok'}
                </h3>
                <p className="text-gray-500 mb-6">
                    {query ? 'Arama kriterlerinize uygun etkinlik bulunamadı.' : 'İlk etkinliğinizi oluşturarak anıları toplamaya başlayın.'}
                </p>
                {!query && (
                    <Link href="/events/create" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                        Hemen Oluştur
                    </Link>
                )}
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(user as any).events.map((event: any) => (
                <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
      
      <DashboardTourWrapper />
    </div>
  );
}
