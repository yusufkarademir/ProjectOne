import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import LiveSlideshow from './live-slideshow';

export default async function LivePage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug } = await params;
  const { mode } = await searchParams;
  const event = await prisma.event.findUnique({
    where: { slug },
  });

  if (!event) notFound();

  // Initial fetch of photos
  const photos = await prisma.photo.findMany({
    where: {
      eventId: event.id,
      status: 'approved',
      type: 'image',
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
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

  const themeConfig = (event.themeConfig as any) || {};
  const theme = themeConfig.theme || 'modern';
  const frameStyle = themeConfig.frame || 'none';

  const { auth } = await import('@/auth');
  const session = await auth();
  
  let isOrganizer = false;
  // Only check organizer status if NOT in projector mode
  if (session?.user?.email && mode !== 'projector') {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });
    if (user && user.id === event.organizerId) {
      isOrganizer = true;
    }
  }

  return (
    <LiveSlideshow 
        initialPhotos={photos} 
        slug={event.slug} 
        eventName={event.name}
        qrCodeUrl={event.qrCodeUrl || ''}
        theme={theme}
        frameStyle={frameStyle}
        isOrganizer={isOrganizer}
        eventId={event.id}
    />
  );
}
