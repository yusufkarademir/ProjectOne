import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Metadata } from 'next';
import SocialLiveDisplay from '@/app/components/social/SocialLiveDisplay';

async function getEvent(slug: string) {
  const event = await prisma.event.findUnique({
    where: { slug },
  });
  return event;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: 'Etkinlik Bulunamadı' };
  return {
    title: `${event.name} - Sosyal Canlı Vitrin`,
    description: 'Canlı sosyal duvar akışı',
  };
}

export default async function SocialLivePage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug } = await params;
  const { mode } = await searchParams;
  const event = await getEvent(slug);

  if (!event) notFound();

  // Initial fetch of photos
  const photos = await prisma.photo.findMany({
    where: {
      eventId: event.id,
      status: 'approved',
      type: 'image',
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      url: true,
      createdAt: true,
      mission: {
        select: {
          text: true
        }
      }
    }
  });

  // Check if current user is the organizer
  const { auth } = await import('@/auth');
  const session = await auth();
  let isOrganizer = false;
  
  // Only check organizer status if NOT in projector mode
  if (session?.user?.email && mode !== 'projector') {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user && user.id === event.organizerId) {
      isOrganizer = true;
    }
  }

  return (
    <SocialLiveDisplay 
        initialPhotos={photos} 
        slug={event.slug} 
        eventName={event.name}
        qrCodeUrl={event.qrCodeUrl || ''}
        isOrganizer={isOrganizer}
        eventId={event.id}
    />
  );
}
