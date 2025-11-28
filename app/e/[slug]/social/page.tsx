import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Camera } from 'lucide-react';
import SocialFeedItem from '@/app/components/social/SocialFeedItem';

async function getEvent(slug: string) {
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      photos: {
        where: { status: 'approved' },
        orderBy: { createdAt: 'desc' },
        include: {
          comments: {
            orderBy: { createdAt: 'asc' },
            take: 5 // Initial load only a few
          },
          _count: {
            select: {
              comments: true,
              reactions: true,
            }
          }
        }
      }
    }
  });
  return event;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: 'Etkinlik Bulunamadı' };
  return {
    title: `${event.name} - Sosyal Duvar`,
    description: 'Etkinlik fotoğrafları ve paylaşımlar',
  };
}

export default async function SocialWallPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) notFound();

  const settings = event.socialSettings as any;
  if (!settings?.enabled) {
    redirect(`/e/${slug}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 safe-area-top">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href={`/e/${slug}`} className="p-2 -ml-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-semibold text-lg truncate px-4">{event.name}</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Feed */}
      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-2">Sosyal Duvar'a Hoş Geldiniz! 👋</h2>
          <p className="opacity-90 mb-4">
            Fotoğrafları beğenin, yorum yapın ve anın tadını çıkarın.
          </p>
          <Link 
            href={`/e/${slug}/upload`}
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            <Camera size={20} />
            Fotoğraf Paylaş
          </Link>
        </div>

        {/* Photos */}
        {event.photos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={32} className="text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900">Henüz fotoğraf yok</p>
            <p className="text-sm">İlk fotoğrafı sen paylaş!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {event.photos.map((photo) => (
              <SocialFeedItem 
                key={photo.id} 
                photo={photo} 
                settings={settings} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
