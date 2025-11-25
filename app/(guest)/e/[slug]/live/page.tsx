import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import LiveSlideshow from './live-slideshow';

export default async function LivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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
    take: 20,
    select: {
      id: true,
      url: true,
      createdAt: true,
    }
  });

  const themeConfig = (event.themeConfig as any) || {};
  const theme = themeConfig.theme || 'modern';

  return (
    <LiveSlideshow 
        initialPhotos={photos} 
        slug={event.slug} 
        eventName={event.name}
        qrCodeUrl={event.qrCodeUrl || ''}
        theme={theme}
    />
  );
}
