import { notFound } from 'next/navigation';
import { prisma } from '../../../../lib/db';
import ModernTemplate from '@/app/components/templates/ModernTemplate';
import WeddingTemplate from '@/app/components/templates/WeddingTemplate';
import CorporateTemplate from '@/app/components/templates/CorporateTemplate';
import PartyTemplate from '@/app/components/templates/PartyTemplate';


import { incrementViewCount } from '@/app/lib/analytics-actions';

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
  });

  if (!event) {
    notFound();
  }

  // Track view
  await incrementViewCount(slug);

  const themeConfig = (event.themeConfig as any) || {};
  const theme = themeConfig.theme || 'modern';
  const frameStyle = themeConfig.frame || 'none';
  const watermarkText = (event as any).isWatermarkEnabled ? event.name : null;

  // Render the appropriate template based on the theme selection
  switch (theme) {
    case 'wedding':
      return (
        <>
          <WeddingTemplate event={event} />
        </>
      );
    case 'corporate':
      return (
        <>
          <CorporateTemplate event={event} />
        </>
      );
    case 'party':
      return (
        <>
          <PartyTemplate event={event} />
        </>
      );
    case 'modern':
    default:
      return (
        <>
          <ModernTemplate event={event} />
        </>
      );
  }
}
