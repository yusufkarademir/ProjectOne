import { auth } from '../../../../../auth';
import { prisma } from '../../../../../lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import GalleryGrid from '../../../../components/GalleryGrid';
import { Home, ChevronRight, ArrowLeft } from 'lucide-react';

export default async function OrganizerGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) return null;

  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      photos: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!event) notFound();

  // Verify ownership
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (event.organizerId !== user?.id) return <div>Unauthorized</div>;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard" className="hover:text-gray-900 flex items-center gap-1">
          <Home size={16} />
          <span>Dashboard</span>
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-700">{event.name}</span>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">Galeri</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
           <p className="text-gray-500 mt-1">Galeri Yönetimi - {event.photos.length} içerik</p>
        </div>
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          Dashboard'a Dön
        </Link>
      </div>

      {event.photos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500">Henüz fotoğraf yüklenmemiş.</p>
        </div>
      ) : (
        <GalleryGrid photos={event.photos} eventSlug={event.slug} canDelete={true} />
      )}
    </div>
  );
}
