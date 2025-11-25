import { prisma } from '../../../../../lib/db';
import { notFound } from 'next/navigation';
import UploadForm from './upload-form';
import Link from 'next/link';
import { Home, ChevronRight, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default async function UploadPageWrapper({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
  });

  if (!event) notFound();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href={`/e/${event.slug}`} className="hover:text-gray-900 flex items-center gap-1">
            <Home size={16} />
            <span>Etkinlik</span>
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">Fotoğraf Yükle</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="text-blue-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Fotoğraf & Video Yükle</h1>
            <p className="text-gray-500">{event.name} - En güzel anılarınızı paylaşın</p>
          </div>
          
          <UploadForm eventId={event.id} slug={event.slug} />

          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-center gap-3">
            <Link 
              href={`/e/${event.slug}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={18} />
              Geri Dön
            </Link>
            <Link 
              href={`/e/${event.slug}/gallery`}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <ImageIcon size={18} />
              Galeriye Git
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
