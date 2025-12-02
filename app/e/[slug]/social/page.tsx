import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Camera, Plus } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 safe-area-top">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href={`/e/${slug}`} 
            className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-bold text-lg truncate px-2 text-gray-900">{event.name}</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      {/* Feed */}
      <main className="max-w-md mx-auto px-4 pt-20 space-y-6">
        {/* Welcome Banner (Subtle) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-gray-900">Sosyal Duvar 📸</h2>
            <p className="text-xs text-gray-500 mt-1">Anılarını paylaş, yorum yap ve eğlen!</p>
          </div>
          <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <Camera size={20} />
          </div>
        </div>

        {/* Photos */}
        {event.photos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Camera size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Henüz fotoğraf yok</h3>
            <p className="text-gray-500 max-w-[200px] mx-auto">
              İlk fotoğrafı paylaşarak partiyi başlat!
            </p>
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

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 md:right-[calc(50%-20px)] md:translate-x-[200px]">
        <Link 
          href={`/e/${slug}/upload?from=social`}
          className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={28} />
        </Link>
      </div>
    </div>
  );
}
