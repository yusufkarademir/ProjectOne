import { prisma } from '../../../../../lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import GalleryGrid from '../../../../components/GalleryGrid';
import { Home, ChevronRight, Upload, ArrowLeft } from 'lucide-react';

export default async function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      photos: {
        where: { status: 'approved' },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          url: true,
          type: true,
          mimeType: true,
          createdAt: true,
        },
      },
    },
  });

  if (!event) notFound();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href={`/e/${event.slug}`} className="hover:text-gray-900 flex items-center gap-1">
            <Home size={16} />
            <span>Etkinlik</span>
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">Galeri</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
            <p className="text-gray-500 mt-1">Galeri - {event.photos.length} içerik</p>
          </div>
          <div className="flex gap-3">
            <Link 
              href={`/e/${event.slug}`}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <ArrowLeft size={18} />
              Geri Dön
            </Link>
            <Link 
              href={`/e/${event.slug}/upload`}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Upload size={18} />
              Fotoğraf Yükle
            </Link>
          </div>
        </div>

        {event.photos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-900 text-lg font-semibold mb-2">Henüz içerik yüklenmemiş</p>
            <p className="text-gray-500 mb-6">İlk fotoğrafı veya videoyu siz yükleyin!</p>
            <Link 
              href={`/e/${event.slug}/upload`}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              <Upload size={18} />
              Hemen Yükle
            </Link>
          </div>
        ) : (
          <GalleryGrid photos={event.photos} eventSlug={event.slug} canDelete={false} />
        )}
      </div>
    </div>
  );
}
